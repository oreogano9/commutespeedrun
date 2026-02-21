import * as youtubei from "./youtubei.js";
import "../shared/rarity-skins.js";

const DEFAULT_ALLOW_LONG_MESSAGES = false;
const DEFAULT_MAX_MESSAGE_CHARS = 300;
const DEFAULT_HIDE_TIMESTAMP_ONLY_MESSAGES = true;
const DEFAULT_EXPERIMENTAL_GAME_SKIN_AUTO_ENABLED = true;
const DEFAULT_COMMENT_FETCH_STARTUP_PAGES = 1;
const DEFAULT_COMMENT_FETCH_MAX_PAGES = 8;
const DEFAULT_COMMENT_FETCH_AGGRESSIVE = false;
const DEFAULT_COMMENT_FETCH_ADAPTIVE = true;
const DEFAULT_LIVE_PAGE_MARKER_UPDATES = true;
const MIN_MAX_MESSAGE_CHARS = 1;
const MAX_MAX_MESSAGE_CHARS = 5000;
const COMMENTS_CACHE_TTL_MS = 5 * 60 * 1000;
const MAX_RUNTIME_COMMENTS = 6000;
const MAX_RUNTIME_COMMENTS_PER_SECOND = 3;
const MIN_COMMENT_FETCH_STARTUP_PAGES = 1;
const MAX_COMMENT_FETCH_STARTUP_PAGES = 5;
const MIN_COMMENT_FETCH_MAX_PAGES = 1;
const MAX_COMMENT_FETCH_MAX_PAGES = 200;
const COMMENT_FETCH_HARD_MAX_PAGES = 300;
const COMMENT_FETCH_LAZY_DELAY_MS = 7000;

const commentsCache = new Map();
const lazyFetchPromises = new Map();
let lastAllowLongMessages = DEFAULT_ALLOW_LONG_MESSAGES;
let lastMaxMessageChars = DEFAULT_MAX_MESSAGE_CHARS;
let lastHideTimestampOnlyMessages = DEFAULT_HIDE_TIMESTAMP_ONLY_MESSAGES;
let lastExperimentalGameSkinAutoEnabled = DEFAULT_EXPERIMENTAL_GAME_SKIN_AUTO_ENABLED;
let lastCommentFetchStartupPages = DEFAULT_COMMENT_FETCH_STARTUP_PAGES;
let lastCommentFetchMaxPages = DEFAULT_COMMENT_FETCH_MAX_PAGES;
let lastCommentFetchAggressive = DEFAULT_COMMENT_FETCH_AGGRESSIVE;
let lastCommentFetchAdaptive = DEFAULT_COMMENT_FETCH_ADAPTIVE;
let lastLivePageMarkerUpdates = DEFAULT_LIVE_PAGE_MARKER_UPDATES;

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

(async () => {
  const settings = await chrome.storage.sync.get([
    "allowLongMessages",
    "maxMessageChars",
    "hideTimestampOnlyMessages",
    "experimentalGameSkinAutoEnabled",
    "commentFetchStartupPages",
    "commentFetchMaxPages",
    "commentFetchAggressive",
    "commentFetchAdaptive",
    "livePageMarkerUpdates"
  ]);
  lastAllowLongMessages =
    settings?.allowLongMessages === undefined
      ? DEFAULT_ALLOW_LONG_MESSAGES
      : Boolean(settings.allowLongMessages);
  lastMaxMessageChars = clamp(
    Number(settings?.maxMessageChars ?? DEFAULT_MAX_MESSAGE_CHARS),
    MIN_MAX_MESSAGE_CHARS,
    MAX_MAX_MESSAGE_CHARS
  );
  lastHideTimestampOnlyMessages = Boolean(
    settings?.hideTimestampOnlyMessages ?? DEFAULT_HIDE_TIMESTAMP_ONLY_MESSAGES
  );
  lastExperimentalGameSkinAutoEnabled = Boolean(
    settings?.experimentalGameSkinAutoEnabled ??
      DEFAULT_EXPERIMENTAL_GAME_SKIN_AUTO_ENABLED
  );
  lastCommentFetchStartupPages = clamp(
    Number(settings?.commentFetchStartupPages ?? DEFAULT_COMMENT_FETCH_STARTUP_PAGES),
    MIN_COMMENT_FETCH_STARTUP_PAGES,
    MAX_COMMENT_FETCH_STARTUP_PAGES
  );
  lastCommentFetchMaxPages = clamp(
    Number(settings?.commentFetchMaxPages ?? DEFAULT_COMMENT_FETCH_MAX_PAGES),
    MIN_COMMENT_FETCH_MAX_PAGES,
    MAX_COMMENT_FETCH_MAX_PAGES
  );
  lastCommentFetchAggressive = Boolean(
    settings?.commentFetchAggressive ?? DEFAULT_COMMENT_FETCH_AGGRESSIVE
  );
  lastCommentFetchAdaptive = Boolean(
    settings?.commentFetchAdaptive ?? DEFAULT_COMMENT_FETCH_ADAPTIVE
  );
  lastLivePageMarkerUpdates = Boolean(
    settings?.livePageMarkerUpdates ?? DEFAULT_LIVE_PAGE_MARKER_UPDATES
  );
})();

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

function isTimestampOnlyMessageText(text) {
  const raw = String(text || "");
  if (!raw.trim()) {
    return true;
  }
  const withoutTimestamps = raw.replace(/\b\d{1,}:[0-5]\d(?::[0-5]\d)?\b/g, " ");
  const normalized = withoutTimestamps
    .replace(/[\s\-\u2013\u2014_,.;:|()[\]{}<>/\\]+/g, " ")
    .trim();
  return normalized.length === 0;
}

function applyCommentFilters(comments, allowLongMessages, maxMessageChars, hideTimestampOnlyMessages) {
  return (comments || []).filter((comment) => {
    if (!allowLongMessages && String(comment?.text || "").length > maxMessageChars) {
      return false;
    }
    if (hideTimestampOnlyMessages && isTimestampOnlyMessageText(comment?.text || "")) {
      return false;
    }
    return true;
  });
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

function getCommentFetchConfig() {
  const startupPages = clamp(
    Number(lastCommentFetchStartupPages ?? DEFAULT_COMMENT_FETCH_STARTUP_PAGES),
    MIN_COMMENT_FETCH_STARTUP_PAGES,
    MAX_COMMENT_FETCH_STARTUP_PAGES
  );
  const maxPages = Math.max(
    startupPages,
    clamp(
      Number(lastCommentFetchMaxPages ?? DEFAULT_COMMENT_FETCH_MAX_PAGES),
      MIN_COMMENT_FETCH_MAX_PAGES,
      MAX_COMMENT_FETCH_MAX_PAGES
    )
  );
  return {
    startupPages,
    maxPages,
    aggressive: Boolean(lastCommentFetchAggressive),
    adaptive: Boolean(lastCommentFetchAdaptive)
  };
}

function countUniqueTimestampSeconds(comments) {
  const seconds = new Set();
  for (const comment of comments || []) {
    const second = Math.max(0, Math.floor(Number(comment?.time || 0)));
    seconds.add(second);
  }
  return seconds.size;
}

function getAdaptiveExtraPages(comments) {
  const total = Array.isArray(comments) ? comments.length : 0;
  const uniqueSeconds = countUniqueTimestampSeconds(comments);
  if (total < 40 || uniqueSeconds < 20) {
    return 4;
  }
  if (total < 90 || uniqueSeconds < 40) {
    return 2;
  }
  return 0;
}

async function fetchCommentsPages(
  videoId,
  startToken = null,
  pageLimit = DEFAULT_COMMENT_FETCH_MAX_PAGES,
  seedComments = [],
  options = {}
) {
  const onPage = typeof options?.onPage === "function" ? options.onPage : null;
  let continuationToken = startToken;
  let pagesFetched = 0;
  let allRawComments = Array.isArray(seedComments) ? [...seedComments] : [];
  const knownIds = new Set(allRawComments.map((comment) => comment?.id));

  while (pagesFetched < pageLimit) {
    const { comments, nextToken } = await youtubei.fetchCommentsPage(videoId, continuationToken);
    const freshPageComments = [];
    for (const comment of comments || []) {
      const id = comment?.id;
      if (!id || knownIds.has(id)) {
        continue;
      }
      knownIds.add(id);
      freshPageComments.push(comment);
    }
    if (freshPageComments.length > 0) {
      allRawComments.push(...freshPageComments);
    }
    pagesFetched += 1;
    if (onPage) {
      try {
        await onPage({
          pageIndex: pagesFetched,
          freshPageComments,
          nextToken
        });
      } catch (error) {
        // Ignore page callback failures.
      }
    }
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
  const fetchConfig = getCommentFetchConfig();
  const inFlightLazy = lazyFetchPromises.get(videoId);
  if (inFlightLazy) {
    await inFlightLazy;
    const entryAfterLazy = commentsCache.get(videoId);
    if (entryAfterLazy?.complete && Array.isArray(entryAfterLazy.comments)) {
      return entryAfterLazy.comments;
    }
  }

  const directLimit = fetchConfig.aggressive
    ? COMMENT_FETCH_HARD_MAX_PAGES
    : fetchConfig.maxPages;
  const result = await fetchCommentsPages(videoId, null, directLimit, []);
  updateCacheEntry(videoId, result.comments, result.nextToken);
  return result.comments;
}

function commentsForSettings(comments, allowLongMessages, maxMessageChars, hideTimestampOnlyMessages) {
  const filtered = applyCommentFilters(
    comments,
    allowLongMessages,
    maxMessageChars,
    hideTimestampOnlyMessages
  );
  return reduceCommentsForRuntime(filtered);
}

async function sendCommentsToVideoTabs(
  videoId,
  comments,
  allowLongMessages,
  maxMessageChars,
  hideTimestampOnlyMessages,
  complete = true
) {
  const tabs = await youtubeWatchTabs();
  const reduced = commentsForSettings(
    comments,
    allowLongMessages,
    maxMessageChars,
    hideTimestampOnlyMessages
  );
  for (const tab of tabs) {
    if (extractVideoIdFromUrl(tab.url) !== videoId) {
      continue;
    }
    await sendMessage(tab.id, { type: "comments_replace", comments: reduced, complete });
  }
}

async function sendCommentsPageUpdateToVideoTabs(
  videoId,
  comments,
  allowLongMessages,
  maxMessageChars,
  hideTimestampOnlyMessages,
  complete = false
) {
  const tabs = await youtubeWatchTabs();
  const filtered = applyCommentFilters(
    comments || [],
    allowLongMessages,
    maxMessageChars,
    hideTimestampOnlyMessages
  );
  if (filtered.length === 0 && !complete) {
    return;
  }
  for (const tab of tabs) {
    if (extractVideoIdFromUrl(tab.url) !== videoId) {
      continue;
    }
    await sendMessage(tab.id, { type: "comments_update", comments: filtered, complete });
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

    const fetchConfig = getCommentFetchConfig();
    const alreadyFetchedPages = Math.max(
      1,
      Number(cacheEntry.pagesFetched || fetchConfig.startupPages || 1)
    );
    const adaptiveExtraPages =
      fetchConfig.adaptive && !fetchConfig.aggressive
        ? getAdaptiveExtraPages(cacheEntry.comments)
        : 0;
    const desiredMaxPages = fetchConfig.aggressive
      ? COMMENT_FETCH_HARD_MAX_PAGES
      : Math.min(
          COMMENT_FETCH_HARD_MAX_PAGES,
          Math.max(fetchConfig.maxPages, alreadyFetchedPages + adaptiveExtraPages)
        );
    const remainingPageLimit = Math.max(1, desiredMaxPages - alreadyFetchedPages);

    const result = await fetchCommentsPages(
      videoId,
      cacheEntry.nextToken,
      remainingPageLimit,
      cacheEntry.comments,
      {
        onPage: async ({ freshPageComments }) => {
          if (!lastLivePageMarkerUpdates || freshPageComments.length === 0) {
            return;
          }
          const { allowLongMessages, maxMessageChars, hideTimestampOnlyMessages } =
            await getFilterSettings();
          await sendCommentsPageUpdateToVideoTabs(
            videoId,
            freshPageComments,
            allowLongMessages,
            maxMessageChars,
            hideTimestampOnlyMessages,
            false
          );
        }
      }
    );
    const reachedTargetLimit =
      !fetchConfig.aggressive && (alreadyFetchedPages + remainingPageLimit) >= desiredMaxPages;
    const shouldMarkComplete = !result.nextToken || reachedTargetLimit;
    updateCacheEntry(videoId, result.comments, result.nextToken, shouldMarkComplete);
    const updatedEntry = commentsCache.get(videoId);
    if (updatedEntry) {
      updatedEntry.pagesFetched = alreadyFetchedPages + remainingPageLimit;
    }

    const { allowLongMessages, maxMessageChars, hideTimestampOnlyMessages } = await getFilterSettings();
    await sendCommentsToVideoTabs(
      videoId,
      result.comments,
      allowLongMessages,
      maxMessageChars,
      hideTimestampOnlyMessages,
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
  const settings = await chrome.storage.sync.get([
    "allowLongMessages",
    "maxMessageChars",
    "hideTimestampOnlyMessages"
  ]);
  return {
    allowLongMessages:
      settings?.allowLongMessages === undefined
        ? DEFAULT_ALLOW_LONG_MESSAGES
        : Boolean(settings.allowLongMessages),
    maxMessageChars: clamp(
      Number(settings?.maxMessageChars ?? DEFAULT_MAX_MESSAGE_CHARS),
      MIN_MAX_MESSAGE_CHARS,
      MAX_MAX_MESSAGE_CHARS
    ),
    hideTimestampOnlyMessages: Boolean(
      settings?.hideTimestampOnlyMessages ?? DEFAULT_HIDE_TIMESTAMP_ONLY_MESSAGES
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

async function isTabStillOnVideo(tabId, videoId) {
  if (!tabId || !videoId) {
    return false;
  }
  try {
    const tab = await chrome.tabs.get(tabId);
    return extractVideoIdFromUrl(tab?.url) === videoId;
  } catch (error) {
    return false;
  }
}

async function requestMessage(tabId, payload) {
  try {
    return await chrome.tabs.sendMessage(tabId, payload);
  } catch (error) {
    return null;
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
  overlayRadiusBySkin,
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
  hideTimestampOnlyMessages,
  hiddenRarityTiersBySkin,
  commentScanStartDelaySec,
  experimentalGameSkinAutoEnabled,
  showRarityLabelInNotifications,
  raritySkin,
  rarityLogicMode,
  presetProfile,
  activeRaritySkinId,
  activeRaritySkinConfig,
  raritySkinCatalogRevision,
  hiddenRarityTiersBySkinId
) {
  const tabs = await youtubeWatchTabs();
  const payload = {
    type: "overlaySettings",
    overlayScale,
    displayDuration,
    overlayRadius,
    overlayRadiusBySkin,
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
    hideTimestampOnlyMessages,
    hiddenRarityTiersBySkin,
    hiddenRarityTiersBySkinId,
    commentScanStartDelaySec,
    experimentalGameSkinAutoEnabled,
    showRarityLabelInNotifications,
    raritySkin,
    activeRaritySkinId,
    activeRaritySkinConfig,
    raritySkinCatalogRevision,
    rarityLogicMode,
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
      const reduced = commentsForSettings(
        cacheEntry.comments,
        allowLongMessages,
        maxMessageChars,
        lastHideTimestampOnlyMessages
      );
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
  const { allowLongMessages, maxMessageChars, hideTimestampOnlyMessages } = await getFilterSettings();
  const fetchConfig = getCommentFetchConfig();
  if (!videoId || !tabId) {
    return;
  }
  if (!(await isTabStillOnVideo(tabId, videoId))) {
    return;
  }
  applyExperimentalGameSkin(tabId, videoId);

  if (forceRefresh) {
    commentsCache.delete(videoId);
  }

  const cacheEntry = commentsCache.get(videoId);
  if (!forceRefresh && isCacheFresh(cacheEntry)) {
    const reducedFromCache = commentsForSettings(
      cacheEntry.comments,
      allowLongMessages,
      maxMessageChars,
      hideTimestampOnlyMessages
    );
    if (await isTabStillOnVideo(tabId, videoId)) {
      await sendMessage(tabId, {
        type: "comments_replace",
        comments: reducedFromCache,
        complete: Boolean(cacheEntry?.complete)
      });
    }
    if (cacheEntry?.nextToken && !cacheEntry?.complete) {
      scheduleLazyCommentsFetch(videoId);
    }
    return;
  }

  try {
    const initialResult = await fetchCommentsPages(
      videoId,
      null,
      fetchConfig.startupPages,
      [],
      {
        onPage: async ({ freshPageComments }) => {
          if (!lastLivePageMarkerUpdates || freshPageComments.length === 0) {
            return;
          }
          await sendCommentsPageUpdateToVideoTabs(
            videoId,
            freshPageComments,
            allowLongMessages,
            maxMessageChars,
            hideTimestampOnlyMessages,
            false
          );
        }
      }
    );
    updateCacheEntry(videoId, initialResult.comments, initialResult.nextToken);
    const initialEntry = commentsCache.get(videoId);
    if (initialEntry) {
      initialEntry.pagesFetched = fetchConfig.startupPages;
    }

    const reduced = commentsForSettings(
      initialResult.comments,
      allowLongMessages,
      maxMessageChars,
      hideTimestampOnlyMessages
    );
    if (await isTabStillOnVideo(tabId, videoId)) {
      await sendMessage(tabId, {
        type: "comments_replace",
        comments: reduced,
        complete: !initialResult.nextToken
      });
    }

    if (initialResult.nextToken) {
      scheduleLazyCommentsFetch(videoId);
    }
  } catch (error) {
    // Ignore failed fetches.
  }
}

function detectRaritySkinFromText(text) {
  const value = String(text || "").toLowerCase();
  if (!value) {
    return null;
  }
  const normalized = value
    .normalize("NFKD")
    .replace(/[^\w\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  const compact = normalized.replace(/\s+/g, "");

  const rules = [
    {
      skin: "borderlands2",
      keywords: [
        "borderlands 2",
        "borderlands2",
        "bl2",
        "handsome collection"
      ]
    },
    {
      skin: "animalcrossing",
      keywords: [
        "animal crossing",
        "animalcrossing",
        "new horizons",
        "acnh",
        "acnl"
      ]
    },
    { skin: "minecraft", keywords: ["minecraft", "hypixel", "skyblock"] },
    { skin: "borderlands", keywords: ["borderlands", "tiny tina", "pandora"] }
  ];

  for (const rule of rules) {
    if (
      rule.keywords.some((keyword) => {
        const key = keyword.toLowerCase();
        const keyCompact = key.replace(/\s+/g, "");
        return normalized.includes(key) || compact.includes(keyCompact);
      })
    ) {
      return rule.skin;
    }
  }
  return null;
}

async function applyExperimentalGameSkin(tabId, videoId) {
  if (!lastExperimentalGameSkinAutoEnabled) {
    return;
  }
  try {
    const tab = await chrome.tabs.get(tabId);
    const metadataResponse = await requestMessage(tabId, {
      type: "detectGameMetadata"
    });
    const metadataText = String(metadataResponse?.gameText || "");
    let detectedSkin = detectRaritySkinFromText(metadataText);
    if (!detectedSkin) {
      const candidates = [tab?.title || "", tab?.url || "", videoId || ""];
      const joined = candidates.join(" ");
      detectedSkin = detectRaritySkinFromText(joined);
    }
    if (!detectedSkin) {
      return;
    }
    try {
      await chrome.storage.sync.set({
        raritySkin: detectedSkin,
        activeRaritySkinId: detectedSkin
      });
    } catch (error) {
      // Ignore storage write failures.
    }
    await sendMessage(tabId, { type: "autoRaritySkin", raritySkin: detectedSkin });
  } catch (error) {
    // Ignore tab lookup failures.
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

  if (message.type === "rescan_now") {
    (async () => {
      try {
        const videoId = message.videoId;
        if (!videoId) {
          return;
        }
        const tabs = await youtubeWatchTabs();
        for (const tab of tabs) {
          if (extractVideoIdFromUrl(tab.url) !== videoId) {
            continue;
          }
          await handleIncrementalComments(videoId, tab.id, true);
        }
      } catch (error) {
        // Ignore transient tab/navigation failures.
      }
    })();
    return true;
  }

  if (message.type === "auto_detect_skin") {
    if (sender?.tab?.id) {
      applyExperimentalGameSkin(sender.tab.id, message.video_id);
    }
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
    const hideTimestampOnlyMessages = Boolean(
      message.hideTimestampOnlyMessages ?? lastHideTimestampOnlyMessages
    );

    const filterSettingsChanged =
      allowLongMessages !== lastAllowLongMessages ||
      maxMessageChars !== lastMaxMessageChars ||
      hideTimestampOnlyMessages !== lastHideTimestampOnlyMessages;
    lastExperimentalGameSkinAutoEnabled = Boolean(
      message.experimentalGameSkinAutoEnabled ??
        lastExperimentalGameSkinAutoEnabled
    );
    lastCommentFetchStartupPages = clamp(
      Number(message.commentFetchStartupPages ?? lastCommentFetchStartupPages),
      MIN_COMMENT_FETCH_STARTUP_PAGES,
      MAX_COMMENT_FETCH_STARTUP_PAGES
    );
    lastCommentFetchMaxPages = clamp(
      Number(message.commentFetchMaxPages ?? lastCommentFetchMaxPages),
      MIN_COMMENT_FETCH_MAX_PAGES,
      MAX_COMMENT_FETCH_MAX_PAGES
    );
    lastCommentFetchAggressive = Boolean(
      message.commentFetchAggressive ?? lastCommentFetchAggressive
    );
    lastCommentFetchAdaptive = Boolean(
      message.commentFetchAdaptive ?? lastCommentFetchAdaptive
    );
    lastLivePageMarkerUpdates = Boolean(
      message.livePageMarkerUpdates ?? lastLivePageMarkerUpdates
    );

    lastAllowLongMessages = allowLongMessages;
    lastMaxMessageChars = maxMessageChars;
    lastHideTimestampOnlyMessages = hideTimestampOnlyMessages;

    sendOverlaySettings(
      message.overlayScale,
      message.displayDuration,
      message.overlayRadius,
      message.overlayRadiusBySkin,
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
      hideTimestampOnlyMessages,
      message.hiddenRarityTiersBySkin,
      message.commentScanStartDelaySec,
      lastExperimentalGameSkinAutoEnabled,
      message.showRarityLabelInNotifications,
      message.raritySkin,
      message.rarityLogicMode,
      message.presetProfile,
      message.activeRaritySkinId,
      message.activeRaritySkinConfig,
      message.raritySkinCatalogRevision,
      message.hiddenRarityTiersBySkinId
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
