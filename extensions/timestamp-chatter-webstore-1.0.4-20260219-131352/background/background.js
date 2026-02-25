import * as youtubei from "./youtubei.js";
import "../shared/rarity-skins.js";
import "../shared/settings-schema.js";
import "../shared/theme-catalog-v2.js";

const settingsSchema = globalThis.TimestampChatterSettingsSchema || null;
const rarityShared = globalThis.RaritySkinsShared || null;
const themeCatalogV2Shared = globalThis.TimestampChatterThemeCatalogV2 || null;

const DEFAULT_ALLOW_LONG_MESSAGES =
  settingsSchema?.defaults?.allowLongMessages ?? false;
const DEFAULT_MAX_MESSAGE_CHARS =
  settingsSchema?.defaults?.maxMessageChars ?? 300;
const DEFAULT_HIDE_TIMESTAMP_ONLY_MESSAGES =
  settingsSchema?.defaults?.hideTimestampOnlyMessages ?? true;
const DEFAULT_HIDE_MULTI_TIMESTAMP_MESSAGES =
  settingsSchema?.defaults?.hideMultiTimestampMessages ?? true;
const DEFAULT_EXPERIMENTAL_GAME_SKIN_AUTO_ENABLED =
  settingsSchema?.defaults?.experimentalGameSkinAutoEnabled ?? true;
const DEFAULT_COMMENT_FETCH_STARTUP_PAGES =
  settingsSchema?.defaults?.commentFetchStartupPages ?? 1;
const DEFAULT_COMMENT_FETCH_MAX_PAGES =
  settingsSchema?.defaults?.commentFetchMaxPages ?? 8;
const DEFAULT_COMMENT_FETCH_AGGRESSIVE =
  settingsSchema?.defaults?.commentFetchAggressive ?? false;
const DEFAULT_COMMENT_FETCH_ADAPTIVE =
  settingsSchema?.defaults?.commentFetchAdaptive ?? true;
const DEFAULT_LIVE_PAGE_MARKER_UPDATES =
  settingsSchema?.defaults?.livePageMarkerUpdates ?? true;
const MIN_MAX_MESSAGE_CHARS =
  settingsSchema?.limits?.maxMessageChars?.min ?? 1;
const MAX_MAX_MESSAGE_CHARS =
  settingsSchema?.limits?.maxMessageChars?.max ?? 5000;
const COMMENTS_CACHE_TTL_MS = 5 * 60 * 1000;
const MAX_RUNTIME_COMMENTS = 6000;
const MAX_RUNTIME_COMMENTS_PER_SECOND = 3;
const MIN_COMMENT_FETCH_STARTUP_PAGES =
  settingsSchema?.limits?.commentFetchStartupPages?.min ?? 1;
const MAX_COMMENT_FETCH_STARTUP_PAGES =
  settingsSchema?.limits?.commentFetchStartupPages?.max ?? 5;
const MIN_COMMENT_FETCH_MAX_PAGES =
  settingsSchema?.limits?.commentFetchMaxPages?.min ?? 1;
const MAX_COMMENT_FETCH_MAX_PAGES =
  settingsSchema?.limits?.commentFetchMaxPages?.max ?? 200;
const COMMENT_FETCH_HARD_MAX_PAGES = 300;
const COMMENT_FETCH_PAGE_TIMEOUT_MS = 12000;
const COMMENT_FETCH_LAZY_DELAY_MS = 7000;
const CACHE_KEEPALIVE_REFRESH_INTERVAL_MS = 60 * 1000;

const commentsCache = new Map();
const lazyFetchPromises = new Map();
let skinEditorWindowId = null;
let lastAllowLongMessages = DEFAULT_ALLOW_LONG_MESSAGES;
let lastMaxMessageChars = DEFAULT_MAX_MESSAGE_CHARS;
let lastHideTimestampOnlyMessages = DEFAULT_HIDE_TIMESTAMP_ONLY_MESSAGES;
let lastHideMultiTimestampMessages = DEFAULT_HIDE_MULTI_TIMESTAMP_MESSAGES;
let lastExperimentalGameSkinAutoEnabled = DEFAULT_EXPERIMENTAL_GAME_SKIN_AUTO_ENABLED;
let lastCommentFetchStartupPages = DEFAULT_COMMENT_FETCH_STARTUP_PAGES;
let lastCommentFetchMaxPages = DEFAULT_COMMENT_FETCH_MAX_PAGES;
let lastCommentFetchAggressive = DEFAULT_COMMENT_FETCH_AGGRESSIVE;
let lastCommentFetchAdaptive = DEFAULT_COMMENT_FETCH_ADAPTIVE;
let lastLivePageMarkerUpdates = DEFAULT_LIVE_PAGE_MARKER_UPDATES;

const LOCAL_RARITY_CATALOG_KEY =
  rarityShared?.LOCAL_CATALOG_KEY || "raritySkinCatalogV2";
const LOCAL_RARITY_CATALOG_REVISION_KEY =
  rarityShared?.LOCAL_CATALOG_REVISION_KEY || "raritySkinCatalogRevision";
const LEGACY_RARITY_CATALOG_BACKUP_KEY = "legacyRaritySkinCatalogBackup";

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

async function syncLegacyRuntimeCatalogFromThemeCatalogV2(themeCatalog, revision, activeThemeId, options = {}) {
  if (!themeCatalogV2Shared || !chrome?.storage?.local) {
    return null;
  }
  const runtimeCatalog = themeCatalogV2Shared.buildRuntimeRarityCatalogFromThemeCatalog(themeCatalog);
  const localWrite = {
    [LOCAL_RARITY_CATALOG_KEY]: runtimeCatalog,
    [LOCAL_RARITY_CATALOG_REVISION_KEY]: Number(revision || Date.now())
  };

  if (options.backupLegacy === true) {
    try {
      const existing = await chrome.storage.local.get([LEGACY_RARITY_CATALOG_BACKUP_KEY, LOCAL_RARITY_CATALOG_KEY]);
      if (!existing?.[LEGACY_RARITY_CATALOG_BACKUP_KEY] && existing?.[LOCAL_RARITY_CATALOG_KEY]) {
        localWrite[LEGACY_RARITY_CATALOG_BACKUP_KEY] = existing[LOCAL_RARITY_CATALOG_KEY];
      }
    } catch (error) {
      // Ignore backup read failures.
    }
  }

  await chrome.storage.local.set(localWrite);

  const nextActiveSkinId = String(activeThemeId || runtimeCatalog?.skins?.[0]?.id || "default");
  try {
    await chrome.storage.sync.set({
      raritySkin: nextActiveSkinId,
      activeRaritySkinId: nextActiveSkinId
    });
  } catch (error) {
    // Ignore sync failures; local runtime catalog is still updated.
  }

  return { runtimeCatalog, activeSkinId: nextActiveSkinId };
}

(async () => {
  try {
    const settings = await chrome.storage.sync.get([
      "allowLongMessages",
      "maxMessageChars",
      "hideTimestampOnlyMessages",
      "hideMultiTimestampMessages",
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
    lastHideMultiTimestampMessages = Boolean(
      settings?.hideMultiTimestampMessages ?? DEFAULT_HIDE_MULTI_TIMESTAMP_MESSAGES
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

    if (themeCatalogV2Shared?.ensureThemeCatalogV2Storage) {
      try {
        const seeded = await themeCatalogV2Shared.ensureThemeCatalogV2Storage();
        if (seeded?.catalog) {
          await syncLegacyRuntimeCatalogFromThemeCatalogV2(
            seeded.catalog,
            seeded.revision,
            seeded.catalog?.themes?.[0]?.id || "default",
            { backupLegacy: true }
          );
        }
      } catch (error) {
        // Ignore theme migration failures during worker boot.
      }
    }
  } catch (error) {
    // Ignore background boot settings read failures (e.g. transient sync backend/service worker issues).
  }
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

function applyCommentFilters(
  comments,
  allowLongMessages,
  maxMessageChars,
  hideTimestampOnlyMessages,
  hideMultiTimestampMessages
) {
  return (comments || []).filter((comment) => {
    if (!allowLongMessages && String(comment?.text || "").length > maxMessageChars) {
      return false;
    }
    if (hideTimestampOnlyMessages && isTimestampOnlyMessageText(comment?.text || "")) {
      return false;
    }
    if (
      hideMultiTimestampMessages &&
      Array.isArray(comment?.timestamps) &&
      comment.timestamps.length > 1
    ) {
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
    let pageResult;
    try {
      pageResult = await Promise.race([
        youtubei.fetchCommentsPage(videoId, continuationToken),
        new Promise((_, reject) =>
          setTimeout(() => reject(new Error("comment_page_timeout")), COMMENT_FETCH_PAGE_TIMEOUT_MS)
        )
      ]);
    } catch (error) {
      if (error?.message === "comment_page_timeout") {
        // Failsafe: stop the scan cleanly if a page stalls too long.
        continuationToken = null;
      }
      break;
    }
    const { comments, nextToken } = pageResult || {};
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
    nextToken: continuationToken,
    pagesFetched
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
  const entry = commentsCache.get(videoId);
  if (entry) {
    entry.pagesFetched = Number(result.pagesFetched || 0) || 0;
  }
  return result.comments;
}

function commentsForSettings(
  comments,
  allowLongMessages,
  maxMessageChars,
  hideTimestampOnlyMessages,
  hideMultiTimestampMessages
) {
  const filtered = applyCommentFilters(
    comments,
    allowLongMessages,
    maxMessageChars,
    hideTimestampOnlyMessages,
    hideMultiTimestampMessages
  );
  return reduceCommentsForRuntime(filtered);
}

async function sendCommentsToVideoTabs(
  videoId,
  comments,
  allowLongMessages,
  maxMessageChars,
  hideTimestampOnlyMessages,
  hideMultiTimestampMessages,
  complete = true,
  progress = null
) {
  const tabs = await youtubeWatchTabs();
  const reduced = commentsForSettings(
    comments,
    allowLongMessages,
    maxMessageChars,
    hideTimestampOnlyMessages,
    hideMultiTimestampMessages
  );
  for (const tab of tabs) {
    if (extractVideoIdFromUrl(tab.url) !== videoId) {
      continue;
    }
    await sendMessage(tab.id, {
      type: "comments_replace",
      comments: reduced,
      complete,
      progress: progress || null
    });
  }
}

async function sendCommentsPageUpdateToVideoTabs(
  videoId,
  comments,
  allowLongMessages,
  maxMessageChars,
  hideTimestampOnlyMessages,
  hideMultiTimestampMessages,
  complete = false,
  progress = null
) {
  const tabs = await youtubeWatchTabs();
  const filtered = applyCommentFilters(
    comments || [],
    allowLongMessages,
    maxMessageChars,
    hideTimestampOnlyMessages,
    hideMultiTimestampMessages
  );
  if (filtered.length === 0 && !complete) {
    return;
  }
  for (const tab of tabs) {
    if (extractVideoIdFromUrl(tab.url) !== videoId) {
      continue;
    }
    await sendMessage(tab.id, {
      type: "comments_update",
      comments: filtered,
      complete,
      progress: progress || null
    });
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
        onPage: async ({ freshPageComments, pageIndex }) => {
          if (freshPageComments.length === 0) {
            return;
          }
          if (!lastLivePageMarkerUpdates) {
            return;
          }
          const {
            allowLongMessages,
            maxMessageChars,
            hideTimestampOnlyMessages,
            hideMultiTimestampMessages
          } =
            await getFilterSettings();
          await sendCommentsPageUpdateToVideoTabs(
            videoId,
            freshPageComments,
            allowLongMessages,
            maxMessageChars,
            hideTimestampOnlyMessages,
            hideMultiTimestampMessages,
            false,
            {
              pagesFetched: alreadyFetchedPages + Number(pageIndex || 0),
              pagesTarget: Number.isFinite(desiredMaxPages) ? desiredMaxPages : null,
              timestampsCount: null
            }
          );
        }
      }
    );
    const actualTotalPagesFetched = alreadyFetchedPages + Number(result.pagesFetched || 0);
    const reachedTargetLimit =
      !fetchConfig.aggressive && actualTotalPagesFetched >= desiredMaxPages;
    const shouldMarkComplete = !result.nextToken || reachedTargetLimit;
    updateCacheEntry(videoId, result.comments, result.nextToken, shouldMarkComplete);
    const updatedEntry = commentsCache.get(videoId);
    if (updatedEntry) {
      updatedEntry.pagesFetched = actualTotalPagesFetched;
    }

    const {
      allowLongMessages,
      maxMessageChars,
      hideTimestampOnlyMessages,
      hideMultiTimestampMessages
    } = await getFilterSettings();
    await sendCommentsToVideoTabs(
      videoId,
      result.comments,
      allowLongMessages,
      maxMessageChars,
      hideTimestampOnlyMessages,
      hideMultiTimestampMessages,
      true,
      {
        pagesFetched: Number(updatedEntry?.pagesFetched || actualTotalPagesFetched) || null,
        pagesTarget: shouldMarkComplete
          ? Number(updatedEntry?.pagesFetched || actualTotalPagesFetched) || null
          : Number.isFinite(desiredMaxPages)
            ? desiredMaxPages
            : null,
        timestampsCount: commentsForSettings(
          result.comments,
          allowLongMessages,
          maxMessageChars,
          hideTimestampOnlyMessages,
          hideMultiTimestampMessages
        ).length
      }
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
    "hideTimestampOnlyMessages",
    "hideMultiTimestampMessages"
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
    ),
    hideMultiTimestampMessages: Boolean(
      settings?.hideMultiTimestampMessages ?? DEFAULT_HIDE_MULTI_TIMESTAMP_MESSAGES
    )
  };
}

async function sendMessage(tabId, payload) {
  try {
    await chrome.tabs.sendMessage(tabId, payload);
    return true;
  } catch (error) {
    // Ignore tabs that no longer have the content script attached.
    return false;
  }
}

async function sendMessageWithRetry(tabId, payload, retryDelaysMs = [120, 300, 700, 1200]) {
  const firstTry = await sendMessage(tabId, payload);
  if (firstTry) {
    return true;
  }
  for (const delayMs of retryDelaysMs) {
    await new Promise((resolve) => setTimeout(resolve, Math.max(0, Number(delayMs || 0))));
    const ok = await sendMessage(tabId, payload);
    if (ok) {
      return true;
    }
  }
  return false;
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

async function getPreferredYouTubeWatchTab() {
  try {
    const activeTabs = await chrome.tabs.query({ active: true, lastFocusedWindow: true });
    const active = activeTabs?.[0];
    if (active?.url && active.url.startsWith("https://www.youtube.com/watch?v=")) {
      return active;
    }
  } catch (error) {
    // Ignore and fall back to any watch tab.
  }
  const tabs = await youtubeWatchTabs();
  return tabs[0] || null;
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
  clickBackContextSeconds,
  earlySeconds,
  timestampAccentEffect,
  reverseStackOrder,
  priorityScoringEnabled,
  priorityLikesWeight,
  topLikedThresholdPercent,
  heatmapEnabled,
  heatmapIntensity,
  routingEnabled,
  routingThreshold,
  routingShortCorner,
  routingLongCorner,
  showAuthorInNotifications,
  showLikesInNotifications,
  showUpcomingDot,
  stackOpacityFadeEnabled,
  stackOpacityFadeStart,
  stackOpacityFadeStepPercent,
  hideTimestampOnlyMessages,
  hideMultiTimestampMessages,
  hiddenRarityTiersBySkin,
  commentScanStartDelaySec,
  experimentalGameSkinAutoEnabled,
  clearTimestampCacheOnRefresh,
  showRarityLabelInNotifications,
  raritySkin,
  rarityLogicMode,
  rarityGeometricRatio,
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
    clickBackContextSeconds,
    earlySeconds,
    timestampAccentEffect,
    reverseStackOrder,
    priorityScoringEnabled,
    priorityLikesWeight,
    topLikedThresholdPercent,
    heatmapEnabled,
    heatmapIntensity,
    routingEnabled,
    routingThreshold,
    routingShortCorner,
    routingLongCorner,
    showAuthorInNotifications,
    showLikesInNotifications,
    showUpcomingDot,
    stackOpacityFadeEnabled,
    stackOpacityFadeStart,
    stackOpacityFadeStepPercent,
    hideTimestampOnlyMessages,
    hideMultiTimestampMessages,
    hiddenRarityTiersBySkin,
    hiddenRarityTiersBySkinId,
    commentScanStartDelaySec,
    experimentalGameSkinAutoEnabled,
    clearTimestampCacheOnRefresh,
    showRarityLabelInNotifications,
    raritySkin,
    activeRaritySkinId,
    activeRaritySkinConfig,
    raritySkinCatalogRevision,
    rarityLogicMode,
    rarityGeometricRatio,
    presetProfile
  };
  tabs.forEach(async (tab) => {
    await sendMessage(tab.id, payload);
  });
}

async function sendRefilteredCommentsToTabs(
  allowLongMessages,
  maxMessageChars,
  hideTimestampOnlyMessages,
  hideMultiTimestampMessages
) {
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
        hideTimestampOnlyMessages,
        hideMultiTimestampMessages
      );
      await sendMessage(tab.id, {
        type: "comments_replace",
        comments: reduced,
        complete: Boolean(cacheEntry?.complete),
        progress: {
          pagesFetched: Number(cacheEntry?.pagesFetched || 0) || null,
          pagesTarget: cacheEntry?.complete ? Number(cacheEntry?.pagesFetched || 0) || null : null,
          timestampsCount: reduced.length
        }
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
  const {
    allowLongMessages,
    maxMessageChars,
    hideTimestampOnlyMessages,
    hideMultiTimestampMessages
  } = await getFilterSettings();
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
      hideTimestampOnlyMessages,
      hideMultiTimestampMessages
    );
    if (await isTabStillOnVideo(tabId, videoId)) {
      await sendMessageWithRetry(tabId, {
        type: "comments_replace",
        comments: reducedFromCache,
        complete: Boolean(cacheEntry?.complete),
        progress: {
          pagesFetched: Number(cacheEntry?.pagesFetched || 0) || null,
          pagesTarget: cacheEntry?.complete ? Number(cacheEntry?.pagesFetched || 0) || null : null,
          timestampsCount: reducedFromCache.length
        }
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
        onPage: async ({ freshPageComments, pageIndex }) => {
          if (freshPageComments.length === 0) {
            return;
          }
          if (!lastLivePageMarkerUpdates) {
            return;
          }
          await sendCommentsPageUpdateToVideoTabs(
            videoId,
            freshPageComments,
            allowLongMessages,
            maxMessageChars,
            hideTimestampOnlyMessages,
            hideMultiTimestampMessages,
            false,
            {
              pagesFetched: pageIndex,
              pagesTarget: fetchConfig.startupPages || null,
              timestampsCount: null
            }
          );
        }
      }
    );
    updateCacheEntry(videoId, initialResult.comments, initialResult.nextToken);
    const initialEntry = commentsCache.get(videoId);
    if (initialEntry) {
      initialEntry.pagesFetched = Number(initialResult.pagesFetched || 0);
    }

    const reduced = commentsForSettings(
        initialResult.comments,
        allowLongMessages,
        maxMessageChars,
        hideTimestampOnlyMessages,
        hideMultiTimestampMessages
      );
    if (await isTabStillOnVideo(tabId, videoId)) {
      await sendMessageWithRetry(tabId, {
        type: "comments_replace",
        comments: reduced,
        complete: !initialResult.nextToken,
        progress: {
          pagesFetched: Number(initialResult.pagesFetched || 0) || null,
          pagesTarget: !initialResult.nextToken
            ? Number(initialResult.pagesFetched || 0) || null
            : null,
          timestampsCount: reduced.length
        }
      });
    }

    if (initialResult.nextToken) {
      scheduleLazyCommentsFetch(videoId);
    }
  } catch (error) {
    // Ignore failed fetches.
  }
}

async function refreshOpenVideoCacheKeepalive() {
  try {
    const tabs = await youtubeWatchTabs();
    if (!tabs.length) {
      return;
    }
    const now = Date.now();
    const openVideoIds = new Set();
    for (const tab of tabs) {
      const videoId = extractVideoIdFromUrl(tab?.url || "");
      if (!videoId) {
        continue;
      }
      openVideoIds.add(videoId);
    }

    for (const videoId of openVideoIds) {
      const cacheEntry = commentsCache.get(videoId);
      if (!cacheEntry?.fetchedAt) {
        continue;
      }
      if (lazyFetchPromises.has(videoId)) {
        continue;
      }
      if (now - Number(cacheEntry.fetchedAt || 0) < CACHE_KEEPALIVE_REFRESH_INTERVAL_MS) {
        continue;
      }
      cacheEntry.fetchedAt = now;
    }
  } catch (error) {
    // Ignore periodic keepalive failures.
  }
}

setInterval(() => {
  refreshOpenVideoCacheKeepalive();
}, CACHE_KEEPALIVE_REFRESH_INTERVAL_MS);

function normalizeDetectionTextParts(text) {
  const value = String(text || "");
  const normalized = value
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[^\w\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  const compact = normalized.replace(/\s+/g, "");
  const tokens = normalized ? normalized.split(" ").filter(Boolean) : [];
  return { normalized, compact, tokens };
}

async function getThemeCatalogForDetection() {
  try {
    if (themeCatalogV2Shared?.ensureThemeCatalogV2Storage) {
      const seeded = await themeCatalogV2Shared.ensureThemeCatalogV2Storage();
      if (seeded?.catalog?.themes?.length) {
        return seeded.catalog;
      }
    }
  } catch (error) {
    // Ignore storage/service worker transient failures and fall back to seeded themes.
  }
  if (themeCatalogV2Shared?.normalizeThemeCatalog) {
    return themeCatalogV2Shared.normalizeThemeCatalog({
      themes: Array.isArray(themeCatalogV2Shared?.seedThemes)
        ? themeCatalogV2Shared.seedThemes
        : []
    });
  }
  return { themes: [] };
}

function buildThemeDetectionCandidates(theme) {
  const id = String(theme?.id || "").trim();
  const name = String(theme?.name || "").trim();
  const rawPhrases = [id, name]
    .filter(Boolean)
    .flatMap((value) => [
      value,
      value.replace(/[-_]+/g, " "),
      value.replace(/[-_\s]+/g, "")
    ]);
  const uniquePhrases = Array.from(
    new Set(
      rawPhrases
        .map((value) => normalizeDetectionTextParts(value).normalized)
        .filter(Boolean)
    )
  );
  const tokenSet = new Set();
  for (const phrase of uniquePhrases) {
    for (const token of phrase.split(" ")) {
      if (token && token.length >= 3) {
        tokenSet.add(token);
      }
    }
  }
  return {
    id,
    phrases: uniquePhrases,
    compactPhrases: uniquePhrases.map((phrase) => phrase.replace(/\s+/g, "")),
    tokens: Array.from(tokenSet)
  };
}

function scoreThemeAgainstText(textParts, theme) {
  const candidates = buildThemeDetectionCandidates(theme);
  let score = 0;

  for (let index = 0; index < candidates.phrases.length; index += 1) {
    const phrase = candidates.phrases[index];
    const compactPhrase = candidates.compactPhrases[index];
    if (phrase && textParts.normalized.includes(phrase)) {
      score = Math.max(score, 100 + phrase.length);
    }
    if (compactPhrase && compactPhrase.length >= 4 && textParts.compact.includes(compactPhrase)) {
      score = Math.max(score, 90 + compactPhrase.length);
    }
  }

  let tokenMatches = 0;
  for (const token of candidates.tokens) {
    if (textParts.tokens.includes(token)) {
      tokenMatches += 1;
    }
  }
  if (tokenMatches > 0) {
    score = Math.max(score, tokenMatches * 10);
    if (tokenMatches >= 2) {
      score += 15;
    }
  }

  return score;
}

function detectRaritySkinFromText(text, themeCatalog) {
  const textParts = normalizeDetectionTextParts(text);
  if (!textParts.normalized) {
    return null;
  }
  const themes = Array.isArray(themeCatalog?.themes) ? themeCatalog.themes : [];
  let bestMatch = null;
  for (const theme of themes) {
    const themeId = String(theme?.id || "").trim();
    if (!themeId) {
      continue;
    }
    const score = scoreThemeAgainstText(textParts, theme);
    if (score <= 0) {
      continue;
    }
    if (!bestMatch || score > bestMatch.score) {
      bestMatch = { id: themeId, score };
    }
  }
  return bestMatch?.id || null;
}

async function applyExperimentalGameSkin(tabId, videoId) {
  if (!lastExperimentalGameSkinAutoEnabled) {
    return;
  }
  try {
    const tab = await chrome.tabs.get(tabId);
    const themeCatalog = await getThemeCatalogForDetection();
    const metadataResponse = await requestMessage(tabId, {
      type: "detectGameMetadata"
    });
    const metadataText = String(metadataResponse?.gameText || "");
    let detectedSkin = detectRaritySkinFromText(metadataText, themeCatalog);
    if (!detectedSkin) {
      const candidates = [tab?.title || "", tab?.url || "", videoId || ""];
      const joined = candidates.join(" ");
      detectedSkin = detectRaritySkinFromText(joined, themeCatalog);
    }
    if (!detectedSkin) {
      return;
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

  if (message.type === "open_skin_editor_window") {
    (async () => {
      try {
        if (themeCatalogV2Shared?.ensureThemeCatalogV2Storage) {
          const seeded = await themeCatalogV2Shared.ensureThemeCatalogV2Storage();
          if (seeded?.catalog) {
            await syncLegacyRuntimeCatalogFromThemeCatalogV2(
              seeded.catalog,
              seeded.revision,
              seeded.catalog?.themes?.[0]?.id || "default"
            );
          }
        }
        const editorUrl = chrome.runtime.getURL("ui-dist/editor/editor.html");
        if (Number.isInteger(skinEditorWindowId)) {
          try {
            const existing = await chrome.windows.get(skinEditorWindowId, { populate: true });
            if (existing?.id) {
              await chrome.windows.update(existing.id, { focused: true });
              if (existing.tabs?.[0]?.id) {
                await chrome.tabs.update(existing.tabs[0].id, { active: true, url: editorUrl });
              }
              return;
            }
          } catch (error) {
            skinEditorWindowId = null;
          }
        }
        const created = await chrome.windows.create({
          url: editorUrl,
          type: "popup",
          width: 1280,
          height: 900,
          focused: true
        });
        skinEditorWindowId = created?.id ?? null;
      } catch (error) {
        // Ignore launcher failures to avoid popup crashes.
      }
    })();
    return true;
  }

  if (message.type === "theme_catalog_updated") {
    (async () => {
      try {
        const nextRevision = Number(message.themeCatalogV2Revision || Date.now());
        const tabs = await youtubeWatchTabs();
        const activeThemeId = String(message.activeThemeId || "default");
        if (message.themeCatalogV2) {
          await chrome.storage.local.set({
            [themeCatalogV2Shared?.THEME_CATALOG_V2_KEY || "themeCatalogV2"]: message.themeCatalogV2,
            [themeCatalogV2Shared?.THEME_CATALOG_V2_REVISION_KEY || "themeCatalogV2Revision"]: nextRevision,
            [themeCatalogV2Shared?.THEME_CATALOG_V2_SCHEMA_VERSION_KEY || "themeCatalogV2SchemaVersion"]:
              Number(themeCatalogV2Shared?.THEME_CATALOG_V2_SCHEMA_VERSION || 1)
          });
          await syncLegacyRuntimeCatalogFromThemeCatalogV2(
            message.themeCatalogV2,
            nextRevision,
            activeThemeId
          );
        }
        for (const tab of tabs) {
          if (!tab?.id) continue;
          try {
            await sendMessage(tab.id, {
              type: "theme_catalog_updated",
              themeCatalogV2: message.themeCatalogV2 || null,
              themeCatalogV2Revision: nextRevision,
              activeThemeId
            });
          } catch (error) {
            // Ignore transient tab navigation errors.
          }
        }
      } catch (error) {
        // Ignore broadcast failures.
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
    const hideMultiTimestampMessages = Boolean(
      message.hideMultiTimestampMessages ?? lastHideMultiTimestampMessages
    );

    const inferredFilterSettingsChanged =
      allowLongMessages !== lastAllowLongMessages ||
      maxMessageChars !== lastMaxMessageChars ||
      hideTimestampOnlyMessages !== lastHideTimestampOnlyMessages ||
      hideMultiTimestampMessages !== lastHideMultiTimestampMessages;
    const filterSettingsChanged =
      typeof message.filterSettingsChanged === "boolean"
        ? Boolean(message.filterSettingsChanged)
        : inferredFilterSettingsChanged;
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
    lastHideMultiTimestampMessages = hideMultiTimestampMessages;

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
      message.clickBackContextSeconds,
      message.earlySeconds,
      message.timestampAccentEffect,
      message.reverseStackOrder,
      message.priorityScoringEnabled,
      message.priorityLikesWeight,
      message.topLikedThresholdPercent,
      message.heatmapEnabled,
      message.heatmapIntensity,
      message.routingEnabled,
      message.routingThreshold,
      message.routingShortCorner,
      message.routingLongCorner,
      message.showAuthorInNotifications,
      message.showLikesInNotifications,
      message.showUpcomingDot,
      message.stackOpacityFadeEnabled,
      message.stackOpacityFadeStart,
      message.stackOpacityFadeStepPercent,
      hideTimestampOnlyMessages,
      hideMultiTimestampMessages,
      message.hiddenRarityTiersBySkin,
      message.commentScanStartDelaySec,
      lastExperimentalGameSkinAutoEnabled,
      message.clearTimestampCacheOnRefresh,
      message.showRarityLabelInNotifications,
      message.raritySkin,
      message.rarityLogicMode,
      message.rarityGeometricRatio,
      message.presetProfile,
      message.activeRaritySkinId,
      message.activeRaritySkinConfig,
      message.raritySkinCatalogRevision,
      message.hiddenRarityTiersBySkinId
    );

    if (filterSettingsChanged) {
      sendRefilteredCommentsToTabs(
        allowLongMessages,
        maxMessageChars,
        hideTimestampOnlyMessages,
        hideMultiTimestampMessages
      );
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

chrome.windows.onRemoved.addListener((windowId) => {
  if (windowId === skinEditorWindowId) {
    skinEditorWindowId = null;
  }
});
