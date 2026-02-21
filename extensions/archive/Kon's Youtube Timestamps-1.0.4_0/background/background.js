import * as youtubei from "./youtubei.js";

const DEFAULT_ALLOW_LONG_MESSAGES = false;
const DEFAULT_MAX_MESSAGE_CHARS = 300;
const MIN_MAX_MESSAGE_CHARS = 1;
const MAX_MAX_MESSAGE_CHARS = 5000;
const COMMENTS_CACHE_TTL_MS = 5 * 60 * 1000;
const MAX_RUNTIME_COMMENTS = 6000;
const MAX_RUNTIME_COMMENTS_PER_SECOND = 3;
const COMMENT_FETCH_PAGE_LIMIT = 10;
const COMMENT_FETCH_INITIAL_PAGE_LIMIT = 2;
const COMMENT_FETCH_LAZY_DELAY_MS = 4000;

const commentsCache = new Map();
const lazyFetchPromises = new Map();
let lastAllowLongMessages = DEFAULT_ALLOW_LONG_MESSAGES;
let lastMaxMessageChars = DEFAULT_MAX_MESSAGE_CHARS;

(async () => {
  const settings = await chrome.storage.sync.get(["allowLongMessages", "maxMessageChars"]);
  lastAllowLongMessages =
    settings?.allowLongMessages === undefined
      ? DEFAULT_ALLOW_LONG_MESSAGES
      : Boolean(settings.allowLongMessages);
  lastMaxMessageChars = clamp(
    Number(settings?.maxMessageChars ?? DEFAULT_MAX_MESSAGE_CHARS),
    MIN_MAX_MESSAGE_CHARS,
    MAX_MAX_MESSAGE_CHARS
  );
})();

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function extractVideoIdFromUrl(url) {
  if (!url) {
    return null;
  }
  try {
    const parsed = new URL(url);
    if (parsed.pathname === "/watch") {
      return parsed.searchParams.get("v");
    }
    if (parsed.pathname.startsWith("/embed/")) {
      return parsed.pathname.substring("/embed/".length);
    }
  } catch (error) {
    return null;
  }
  return null;
}

function isCacheFresh(entry) {
  return Boolean(entry) && Date.now() - entry.fetchedAt < COMMENTS_CACHE_TTL_MS;
}

function mergeUniqueById(existing, incoming) {
  const all = [...existing];
  const known = new Set(all.map((comment) => comment.id));

  incoming.forEach((comment) => {
    if (!known.has(comment.id)) {
      known.add(comment.id);
      all.push(comment);
    }
  });

  return all;
}

function applyCommentFilters(comments, allowLongMessages, maxMessageChars) {
  if (allowLongMessages) {
    return comments;
  }
  return comments.filter((comment) => comment.text.length <= maxMessageChars);
}

function computeTopLikedCutoff(comments, thresholdPercent) {
  const likeBySource = new Map();
  (comments || []).forEach((comment) => {
    const sourceKey = comment?.sourceId || comment?.id;
    const likes = Number(comment?.likes || 0);
    if (!sourceKey || !Number.isFinite(likes) || likes <= 0) {
      return;
    }
    const previous = likeBySource.get(sourceKey) || 0;
    if (likes > previous) {
      likeBySource.set(sourceKey, likes);
    }
  });

  const likes = [...likeBySource.values()]
    .sort((a, b) => b - a);

  if (likes.length === 0) {
    return { cutoffLikes: 0, likesCount: 0 };
  }

  const ratio = clamp(Number(thresholdPercent || 12), 1, 50) / 100;
  const index = Math.max(0, Math.ceil(likes.length * ratio) - 1);
  return {
    cutoffLikes: likes[index] || 0,
    likesCount: likes.length
  };
}

function reduceCommentsForRuntime(comments) {
  if (!Array.isArray(comments) || comments.length <= MAX_RUNTIME_COMMENTS) {
    return comments || [];
  }

  const bySecond = new Map();
  for (const comment of comments) {
    const second = Math.max(0, Math.floor(Number(comment?.time || 0)));
    if (!bySecond.has(second)) {
      bySecond.set(second, []);
    }
    bySecond.get(second).push(comment);
  }

  const reduced = [];
  const seconds = [...bySecond.keys()].sort((a, b) => a - b);
  for (const second of seconds) {
    const bucket = bySecond.get(second);
    bucket.sort((a, b) => {
      const likesDiff = Number(b?.likes || 0) - Number(a?.likes || 0);
      if (likesDiff !== 0) {
        return likesDiff;
      }
      return String(a?.id || "").localeCompare(String(b?.id || ""));
    });
    reduced.push(...bucket.slice(0, MAX_RUNTIME_COMMENTS_PER_SECOND));
  }

  let finalComments = reduced;
  if (finalComments.length > MAX_RUNTIME_COMMENTS) {
    // Prefer earlier-in-video timestamps first when we must trim.
    finalComments = [...finalComments]
      .sort((a, b) => {
        const timeDiff = Number(a?.time || 0) - Number(b?.time || 0);
        if (timeDiff !== 0) {
          return timeDiff;
        }
        return Number(b?.likes || 0) - Number(a?.likes || 0);
      })
      .slice(0, MAX_RUNTIME_COMMENTS);
  }

  finalComments.sort((a, b) => {
    const timeDiff = Number(a?.time || 0) - Number(b?.time || 0);
    if (timeDiff !== 0) {
      return timeDiff;
    }
    return Number(b?.likes || 0) - Number(a?.likes || 0);
  });

  return finalComments;
}

function updateCacheEntry(videoId, comments, nextToken = null, completeOverride = null) {
  commentsCache.set(videoId, {
    fetchedAt: Date.now(),
    comments: comments || [],
    nextToken: nextToken || null,
    complete: completeOverride === null ? !nextToken : Boolean(completeOverride)
  });
}

async function fetchCommentsPages(videoId, startToken = null, pageLimit = COMMENT_FETCH_PAGE_LIMIT, seedComments = []) {
  let continuationToken = startToken;
  let pagesFetched = 0;
  let allRawComments = Array.isArray(seedComments) ? [...seedComments] : [];

  while (pagesFetched < pageLimit) {
    const { comments, nextToken } = await youtubei.fetchCommentsPage(videoId, continuationToken);
    allRawComments = mergeUniqueById(allRawComments, comments);
    pagesFetched += 1;
    if (!nextToken) {
      continuationToken = null;
      break;
    }
    continuationToken = nextToken;
  }

  return {
    comments: allRawComments,
    nextToken: continuationToken
  };
}

async function fetchAllComments(videoId) {
  const inFlightLazy = lazyFetchPromises.get(videoId);
  if (inFlightLazy) {
    await inFlightLazy;
    const entryAfterLazy = commentsCache.get(videoId);
    if (entryAfterLazy?.complete && Array.isArray(entryAfterLazy.comments)) {
      return entryAfterLazy.comments;
    }
  }

  const result = await fetchCommentsPages(videoId, null, COMMENT_FETCH_PAGE_LIMIT, []);
  updateCacheEntry(videoId, result.comments, result.nextToken);
  return result.comments;
}

function commentsForSettings(comments, allowLongMessages, maxMessageChars) {
  const filtered = applyCommentFilters(comments, allowLongMessages, maxMessageChars);
  return reduceCommentsForRuntime(filtered);
}

async function sendCommentsToVideoTabs(
  videoId,
  comments,
  allowLongMessages,
  maxMessageChars,
  complete = true
) {
  const tabs = await youtubeWatchTabs();
  const reduced = commentsForSettings(comments, allowLongMessages, maxMessageChars);
  for (const tab of tabs) {
    if (extractVideoIdFromUrl(tab.url) !== videoId) {
      continue;
    }
    await sendMessage(tab.id, { type: "comments_replace", comments: reduced, complete });
  }
}

function scheduleLazyCommentsFetch(videoId) {
  if (lazyFetchPromises.has(videoId)) {
    return lazyFetchPromises.get(videoId);
  }

  const lazyPromise = (async () => {
    await new Promise((resolve) => setTimeout(resolve, COMMENT_FETCH_LAZY_DELAY_MS));
    const cacheEntry = commentsCache.get(videoId);
    if (!cacheEntry?.nextToken || cacheEntry.complete) {
      return;
    }

    const remainingPageLimit = Math.max(
      1,
      COMMENT_FETCH_PAGE_LIMIT - COMMENT_FETCH_INITIAL_PAGE_LIMIT
    );
    const result = await fetchCommentsPages(
      videoId,
      cacheEntry.nextToken,
      remainingPageLimit,
      cacheEntry.comments
    );
    // This is the last planned fetch in the fast+lazy cycle, so mark load complete
    // even if YouTube still has continuation pages beyond our hard page cap.
    updateCacheEntry(videoId, result.comments, result.nextToken, true);

    const { allowLongMessages, maxMessageChars } = await getFilterSettings();
    await sendCommentsToVideoTabs(
      videoId,
      result.comments,
      allowLongMessages,
      maxMessageChars,
      true
    );
  })()
    .catch(() => {
      // Ignore failed lazy fetches.
    })
    .finally(() => {
      lazyFetchPromises.delete(videoId);
    });

  lazyFetchPromises.set(videoId, lazyPromise);
  return lazyPromise;
}

async function getFilterSettings() {
  const settings = await chrome.storage.sync.get(["allowLongMessages", "maxMessageChars"]);
  return {
    allowLongMessages:
      settings?.allowLongMessages === undefined
        ? DEFAULT_ALLOW_LONG_MESSAGES
        : Boolean(settings.allowLongMessages),
    maxMessageChars: clamp(
      Number(settings?.maxMessageChars ?? DEFAULT_MAX_MESSAGE_CHARS),
      MIN_MAX_MESSAGE_CHARS,
      MAX_MAX_MESSAGE_CHARS
    )
  };
}

async function sendMessage(tabId, payload) {
  try {
    await chrome.tabs.sendMessage(tabId, payload);
  } catch (error) {
    // Ignore tabs that no longer have the content script attached.
  }
}

async function youtubeWatchTabs() {
  const tabs = await chrome.tabs.query({});
  return tabs.filter((tab) => tab.url && tab.url.startsWith("https://www.youtube.com/watch?v="));
}

async function sendNewPositionToContent(position) {
  await chrome.storage.sync.set({ position });
  const tabs = await youtubeWatchTabs();
  const payload = { type: "position", newPosition: position };
  tabs.forEach(async (tab) => {
    await sendMessage(tab.id, payload);
  });
}

async function sendNewOverlayStatus(status) {
  const tabs = await youtubeWatchTabs();
  const payload = { type: "isActive", status };
  tabs.forEach(async (tab) => {
    await sendMessage(tab.id, payload);
  });
}

async function sendOverlaySettings(
  overlayScale,
  displayDuration,
  overlayRadius,
  overlayAvatarSize,
  overlayGlassiness,
  overlayDarkness,
  debugMode,
  allowLongMessages,
  maxMessageChars,
  earlyModeEnabled,
  followPlaybackSpeed,
  earlySeconds,
  timestampAccentEffect,
  reverseStackOrder,
  priorityScoringEnabled,
  priorityLikesWeight,
  topLikedThresholdPercent,
  popularityModeEnabled,
  heatmapEnabled,
  heatmapIntensity,
  routingEnabled,
  routingThreshold,
  routingShortCorner,
  routingLongCorner,
  showLikesInNotifications,
  showUpcomingDot,
  presetProfile
) {
  const tabs = await youtubeWatchTabs();
  const payload = {
    type: "overlaySettings",
    overlayScale,
    displayDuration,
    overlayRadius,
    overlayAvatarSize,
    overlayGlassiness,
    overlayDarkness,
    debugMode,
    allowLongMessages,
    maxMessageChars,
    earlyModeEnabled,
    followPlaybackSpeed,
    earlySeconds,
    timestampAccentEffect,
    reverseStackOrder,
    priorityScoringEnabled,
    priorityLikesWeight,
    topLikedThresholdPercent,
    popularityModeEnabled,
    heatmapEnabled,
    heatmapIntensity,
    routingEnabled,
    routingThreshold,
    routingShortCorner,
    routingLongCorner,
    showLikesInNotifications,
    showUpcomingDot,
    presetProfile
  };
  tabs.forEach(async (tab) => {
    await sendMessage(tab.id, payload);
  });
}

async function sendRefilteredCommentsToTabs(allowLongMessages, maxMessageChars) {
  const tabs = await youtubeWatchTabs();

  for (const tab of tabs) {
    const videoId = extractVideoIdFromUrl(tab.url);
    if (!videoId) {
      continue;
    }

    const cacheEntry = commentsCache.get(videoId);
    if (isCacheFresh(cacheEntry)) {
      const reduced = commentsForSettings(cacheEntry.comments, allowLongMessages, maxMessageChars);
      await sendMessage(tab.id, {
        type: "comments_replace",
        comments: reduced,
        complete: Boolean(cacheEntry?.complete)
      });
      if (cacheEntry?.nextToken && !cacheEntry?.complete) {
        scheduleLazyCommentsFetch(videoId);
      }
    } else {
      // Fallback: ask content to force a fresh fetch.
      await sendMessage(tab.id, { type: "comments_filter_settings_changed" });
    }
  }
}

async function handleIncrementalComments(videoId, tabId, forceRefresh = false) {
  const { allowLongMessages, maxMessageChars } = await getFilterSettings();
  if (!videoId || !tabId) {
    return;
  }

  if (forceRefresh) {
    commentsCache.delete(videoId);
  }

  const cacheEntry = commentsCache.get(videoId);
  if (!forceRefresh && isCacheFresh(cacheEntry)) {
    const reducedFromCache = commentsForSettings(
      cacheEntry.comments,
      allowLongMessages,
      maxMessageChars
    );
    await sendMessage(tabId, {
      type: "comments_replace",
      comments: reducedFromCache,
      complete: Boolean(cacheEntry?.complete)
    });
    if (cacheEntry?.nextToken && !cacheEntry?.complete) {
      scheduleLazyCommentsFetch(videoId);
    }
    return;
  }

  try {
    const initialResult = await fetchCommentsPages(
      videoId,
      null,
      COMMENT_FETCH_INITIAL_PAGE_LIMIT,
      []
    );
    updateCacheEntry(videoId, initialResult.comments, initialResult.nextToken);

    const reduced = commentsForSettings(
      initialResult.comments,
      allowLongMessages,
      maxMessageChars
    );
    await sendMessage(tabId, {
      type: "comments_replace",
      comments: reduced,
      complete: !initialResult.nextToken
    });

    if (initialResult.nextToken) {
      scheduleLazyCommentsFetch(videoId);
    }
  } catch (error) {
    // Ignore failed fetches.
  }
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type !== "top_liked_cutoff_preview") {
    sendResponse(true);
  }

  if (message.type === "comments") {
    handleIncrementalComments(message.video_id, sender.tab.id, Boolean(message.forceRefresh));
    return true;
  }

  if (message.type === "position") {
    sendNewPositionToContent(message?.position || "bottom-left");
    return true;
  }

  if (message.type === "isActive") {
    sendNewOverlayStatus(message.status);
    return true;
  }

  if (message.type === "overlaySettings") {
    const allowLongMessages =
      message.allowLongMessages === undefined
        ? lastAllowLongMessages
        : Boolean(message.allowLongMessages);
    const maxMessageChars = clamp(
      Number(message.maxMessageChars ?? lastMaxMessageChars),
      MIN_MAX_MESSAGE_CHARS,
      MAX_MAX_MESSAGE_CHARS
    );

    const filterSettingsChanged =
      allowLongMessages !== lastAllowLongMessages || maxMessageChars !== lastMaxMessageChars;

    lastAllowLongMessages = allowLongMessages;
    lastMaxMessageChars = maxMessageChars;

    sendOverlaySettings(
      message.overlayScale,
      message.displayDuration,
      message.overlayRadius,
      message.overlayAvatarSize,
      message.overlayGlassiness,
      message.overlayDarkness,
      message.debugMode,
      allowLongMessages,
      maxMessageChars,
      message.earlyModeEnabled,
      message.followPlaybackSpeed,
      message.earlySeconds,
      message.timestampAccentEffect,
      message.reverseStackOrder,
      message.priorityScoringEnabled,
      message.priorityLikesWeight,
      message.topLikedThresholdPercent,
      message.popularityModeEnabled,
      message.heatmapEnabled,
      message.heatmapIntensity,
      message.routingEnabled,
      message.routingThreshold,
      message.routingShortCorner,
      message.routingLongCorner,
      message.showLikesInNotifications,
      message.showUpcomingDot,
      message.presetProfile
    );

    if (filterSettingsChanged) {
      sendRefilteredCommentsToTabs(allowLongMessages, maxMessageChars);
    }
    return true;
  }

  if (message.type === "top_liked_cutoff_preview") {
    (async () => {
      try {
        const videoId = message.videoId;
        if (!videoId) {
          sendResponse({ ok: false, reason: "no_video" });
          return;
        }

        const cacheEntry = commentsCache.get(videoId);
        let sourceComments = cacheEntry?.comments || [];
        if (
          !isCacheFresh(cacheEntry) ||
          sourceComments.length === 0 ||
          cacheEntry?.complete === false
        ) {
          sourceComments = await fetchAllComments(videoId);
        }

        const result = computeTopLikedCutoff(sourceComments, message.thresholdPercent);
        sendResponse({ ok: true, ...result });
      } catch (error) {
        sendResponse({ ok: false, reason: "fetch_failed" });
      }
    })();
    return true;
  }

  return true;
});
