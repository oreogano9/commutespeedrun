let overlayElement = null;
let markerBarElement = null;
let markerPreviewElement = null;
let position = "bottom-left";
let videoContainer = null;
let isActive = true;
let monitoringInitialized = false;
let comments = [];
let activeCards = [];
let activeCardByCommentId = new Map();
let currentVideoId = null;
let laneElements = new Map();
let topLikedThreshold = 0;
let platinumLikedThreshold = Number.POSITIVE_INFINITY;
let diamondLikedThreshold = Number.POSITIVE_INFINITY;
let purpleLikedThreshold = Number.POSITIVE_INFINITY;
let rubyLikedThreshold = Number.POSITIVE_INFINITY;
let eyeToggleElement = null;
let notificationsMutedByEye = false;
let isVideoHovering = false;
let reconcileRafId = null;
let pendingReconcileTime = null;
let renderMarkersRafId = null;
let eyeMountRetryIntervalId = null;
let eyeMountHeartbeatIntervalId = null;
let contextualVisibilityLocks = new Map();
let commentsLoadComplete = false;
let cardDragState = null;
let suppressCardClickUntil = 0;
let suppressGlobalClickUntil = 0;
let freePositionEnabled = false;
let freePositionX = 0;
let freePositionY = 0;

const DEFAULT_OVERLAY_SCALE = 1.05;
const DEFAULT_DISPLAY_DURATION = 10;
const DEFAULT_OVERLAY_RADIUS = 25;
const DEFAULT_OVERLAY_AVATAR_SIZE = 40;
const DEFAULT_OVERLAY_GLASSINESS = 20;
const DEFAULT_OVERLAY_DARKNESS = 90;
const DEFAULT_DEBUG_MODE = false;
const DEFAULT_EARLY_MODE_ENABLED = false;
const DEFAULT_FOLLOW_PLAYBACK_SPEED = true;
const DEFAULT_EARLY_SECONDS = 5;
const DEFAULT_TIMESTAMP_ACCENT_EFFECT = "rubberband";
const DEFAULT_REVERSE_STACK_ORDER = false;
const DEFAULT_PRIORITY_SCORING_ENABLED = true;
const DEFAULT_PRIORITY_LIKES_WEIGHT = 1;
const DEFAULT_TOP_LIKED_THRESHOLD_PERCENT = 12;
const DEFAULT_POPULARITY_MODE_ENABLED = false;
const DEFAULT_HEATMAP_ENABLED = true;
const DEFAULT_HEATMAP_INTENSITY = 500;
const DEFAULT_ROUTING_ENABLED = false;
const DEFAULT_ROUTING_THRESHOLD = 80;
const DEFAULT_ROUTING_SHORT_CORNER = "bottom-left";
const DEFAULT_ROUTING_LONG_CORNER = "top-right";
const DEFAULT_SHOW_LIKES_IN_NOTIFICATIONS = true;
const DEFAULT_SHOW_UPCOMING_DOT = true;
const DEFAULT_PRESET_PROFILE = "balanced";
const DEFAULT_FREE_POSITION_ENABLED = false;
const DEFAULT_FREE_POSITION_X = 0;
const DEFAULT_FREE_POSITION_Y = 0;

let overlayScale = DEFAULT_OVERLAY_SCALE;
let displayDuration = DEFAULT_DISPLAY_DURATION;
let overlayRadius = DEFAULT_OVERLAY_RADIUS;
let overlayAvatarSize = DEFAULT_OVERLAY_AVATAR_SIZE;
let overlayGlassiness = DEFAULT_OVERLAY_GLASSINESS;
let overlayDarkness = DEFAULT_OVERLAY_DARKNESS;
let debugMode = DEFAULT_DEBUG_MODE;
let earlyModeEnabled = DEFAULT_EARLY_MODE_ENABLED;
let followPlaybackSpeed = DEFAULT_FOLLOW_PLAYBACK_SPEED;
let earlySeconds = DEFAULT_EARLY_SECONDS;
let timestampAccentEffect = DEFAULT_TIMESTAMP_ACCENT_EFFECT;
let reverseStackOrder = DEFAULT_REVERSE_STACK_ORDER;
let priorityScoringEnabled = DEFAULT_PRIORITY_SCORING_ENABLED;
let priorityLikesWeight = DEFAULT_PRIORITY_LIKES_WEIGHT;
let topLikedThresholdPercent = DEFAULT_TOP_LIKED_THRESHOLD_PERCENT;
let popularityModeEnabled = DEFAULT_POPULARITY_MODE_ENABLED;
let heatmapEnabled = DEFAULT_HEATMAP_ENABLED;
let heatmapIntensity = DEFAULT_HEATMAP_INTENSITY;
let routingEnabled = DEFAULT_ROUTING_ENABLED;
let routingThreshold = DEFAULT_ROUTING_THRESHOLD;
let routingShortCorner = DEFAULT_ROUTING_SHORT_CORNER;
let routingLongCorner = DEFAULT_ROUTING_LONG_CORNER;
let showLikesInNotifications = DEFAULT_SHOW_LIKES_IN_NOTIFICATIONS;
let showUpcomingDot = DEFAULT_SHOW_UPCOMING_DOT;

const MIN_OVERLAY_SCALE = 0.5;
const MAX_OVERLAY_SCALE = 3.5;
const MIN_DISPLAY_DURATION = 1;
const MAX_DISPLAY_DURATION = 60;
const MIN_OVERLAY_RADIUS = 0;
const MAX_OVERLAY_RADIUS = 120;
const MIN_OVERLAY_AVATAR_SIZE = 20;
const MAX_OVERLAY_AVATAR_SIZE = 84;
const MIN_OVERLAY_GLASSINESS = 0;
const MAX_OVERLAY_GLASSINESS = 100;
const MIN_OVERLAY_DARKNESS = 0;
const MAX_OVERLAY_DARKNESS = 100;
const MIN_EARLY_SECONDS = 0;
const MAX_EARLY_SECONDS = 60;
const MIN_PRIORITY_LIKES_WEIGHT = 0;
const MAX_PRIORITY_LIKES_WEIGHT = 5;
const MIN_TOP_LIKED_THRESHOLD_PERCENT = 1;
const MAX_TOP_LIKED_THRESHOLD_PERCENT = 50;
const MIN_HEATMAP_INTENSITY = 10;
const MAX_HEATMAP_INTENSITY = 2000;
const MIN_ROUTING_THRESHOLD = 1;
const MAX_ROUTING_THRESHOLD = 5000;
const MIN_GOLD_TIER_LIKES = 15;
const MIN_PLATINUM_TIER_LIKES = 28;
const MIN_DIAMOND_TIER_LIKES = 40;
const MIN_PURPLE_TIER_LIKES = 65;
const MIN_RUBY_TIER_LIKES = 95;
const MIN_PLATINUM_TIER_GAP_FROM_GOLD = 8;
const MIN_DIAMOND_TIER_GAP_FROM_GOLD = 10;
const MIN_DIAMOND_TIER_GAP_FROM_PLATINUM = 8;
const MIN_PURPLE_TIER_GAP_FROM_DIAMOND = 14;
const MIN_RUBY_TIER_GAP_FROM_PURPLE = 20;
const HEATMAP_TIER_WEIGHTS = {
  silver: 1,
  gold: 2,
  platinum: 2.55,
  diamond: 3.25,
  purple: 3.95,
  ruby: 4.75
};
const CLICK_CONTEXT_SECONDS = 2;
const CLICK_LOCK_FUZZ_SECONDS = 0.35;
const CARD_DRAG_ENABLED = false;
const CARD_DRAG_MOVE_THRESHOLD_PX = 10;
const CARD_DRAG_CLICK_SUPPRESS_MS = 320;
const FREE_POSITION_MARGIN_PX = 8;
const CORNERS = ["bottom-left", "bottom-right", "top-left", "top-right"];
const POPULARITY_TIERS = ["silver", "gold", "platinum", "diamond", "purple", "ruby"];

const timestampRegex = /(\d{1,}):([0-5]\d)(?::([0-5]\d))?/;
let upcomingDotElement = null;
const EYE_ICON_OPEN_PNG_URL = chrome.runtime.getURL("images/eye-open.png");
const EYE_ICON_CLOSED_PNG_URL = chrome.runtime.getURL("images/eye-closed.png");
const EYE_ICON_OPEN_SVG_URL = chrome.runtime.getURL("images/eye-open.svg");
const EYE_ICON_CLOSED_SVG_URL = chrome.runtime.getURL("images/eye-closed.svg");
let eyeIconOpenDataUrl = "";
let eyeIconClosedDataUrl = "";

function blobToDataUrl(blob) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(typeof reader.result === "string" ? reader.result : "");
    reader.onerror = () => reject(reader.error || new Error("Failed to convert blob to data URL"));
    reader.readAsDataURL(blob);
  });
}

async function preloadEyeIconDataUrls() {
  const fetchAsDataUrl = async (urls) => {
    for (const url of urls) {
      try {
        const response = await fetch(url);
        if (!response.ok) {
          continue;
        }
        const blob = await response.blob();
        const dataUrl = await blobToDataUrl(blob);
        if (dataUrl) {
          return dataUrl;
        }
      } catch (error) {
        debugLog("Eye icon candidate failed", url, error);
      }
    }
    return "";
  };

  try {
    [eyeIconOpenDataUrl, eyeIconClosedDataUrl] = await Promise.all([
      fetchAsDataUrl([EYE_ICON_OPEN_PNG_URL, EYE_ICON_OPEN_SVG_URL]),
      fetchAsDataUrl([EYE_ICON_CLOSED_PNG_URL, EYE_ICON_CLOSED_SVG_URL])
    ]);
    updateEyeToggleVisibility();
  } catch (error) {
    debugLog("Eye icon preload fallback", error);
  }
}

function getEyeIconUrl(closed) {
  if (closed) {
    return eyeIconClosedDataUrl || EYE_ICON_CLOSED_SVG_URL;
  }
  return eyeIconOpenDataUrl || EYE_ICON_OPEN_SVG_URL;
}
preloadEyeIconDataUrls();

function getEyeIconFallbackDataUrl(closed) {
  const svg = closed
    ? `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"><path d="M2.2 12c1.9-3.6 5.4-6 9.8-6s7.9 2.4 9.8 6c-1.9 3.6-5.4 6-9.8 6s-7.9-2.4-9.8-6Z" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M9.5 12a2.5 2.5 0 1 0 5 0a2.5 2.5 0 0 0-5 0Z" fill="white"/><path d="m3 3 18 18" stroke="white" stroke-width="2" stroke-linecap="round"/></svg>`
    : `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"><path d="M2.2 12c1.9-3.6 5.4-6 9.8-6s7.9 2.4 9.8 6c-1.9 3.6-5.4 6-9.8 6s-7.9-2.4-9.8-6Z" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><circle cx="12" cy="12" r="2.6" fill="white"/></svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

function updateEyeIconElement() {
  if (!eyeToggleElement) {
    return;
  }
  let icon = eyeToggleElement.querySelector(".overlay-eye-icon");
  const installInlineSvgFallback = () => {
    const replacement = document.createElement("span");
    replacement.className = "overlay-eye-icon";
    replacement.setAttribute("aria-hidden", "true");
    if (icon) {
      icon.replaceWith(replacement);
    } else {
      eyeToggleElement.appendChild(replacement);
    }
    icon = replacement;
    icon.replaceChildren(createEyeIconSvg(notificationsMutedByEye));
  };

  if (icon && icon.tagName !== "IMG") {
    const replacement = document.createElement("img");
    replacement.className = "overlay-eye-icon";
    replacement.alt = "";
    replacement.decoding = "sync";
    replacement.loading = "eager";
    icon.replaceWith(replacement);
    icon = replacement;
  }
  if (!icon) {
    icon = document.createElement("img");
    icon.className = "overlay-eye-icon";
    icon.alt = "";
    icon.decoding = "sync";
    icon.loading = "eager";
    eyeToggleElement.appendChild(icon);
  }
  if (icon.tagName !== "IMG") {
    installInlineSvgFallback();
    return;
  }

  const primaryUrl = notificationsMutedByEye ? EYE_ICON_CLOSED_SVG_URL : EYE_ICON_OPEN_SVG_URL;
  const secondaryUrl = notificationsMutedByEye ? EYE_ICON_CLOSED_PNG_URL : EYE_ICON_OPEN_PNG_URL;

  icon.onerror = () => {
    const stage = icon.dataset.eyeLoadStage || "0";
    if (stage === "0") {
      icon.dataset.eyeLoadStage = "1";
      icon.src = secondaryUrl;
      return;
    }
    icon.onerror = null;
    installInlineSvgFallback();
  };
  icon.dataset.eyeLoadStage = "0";
  icon.src = primaryUrl;
}

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function debugLog(...args) {
  if (debugMode) {
    console.log("[KonsYTimestamps]", ...args);
  }
}

function scheduleReconcile(currentTime) {
  pendingReconcileTime = Number(currentTime);
  if (reconcileRafId !== null) {
    return;
  }
  reconcileRafId = requestAnimationFrame(() => {
    reconcileRafId = null;
    const nextTime = pendingReconcileTime;
    pendingReconcileTime = null;
    if (!Number.isFinite(nextTime)) {
      return;
    }
    reconcileVisibleComments(nextTime);
  });
}

function scheduleRenderTimeMarkers() {
  if (renderMarkersRafId !== null) {
    return;
  }
  renderMarkersRafId = requestAnimationFrame(() => {
    renderMarkersRafId = null;
    renderTimeMarkers();
  });
}

function getActivePlaybackRate() {
  const playbackRate = Number(getVideo()?.playbackRate || 1);
  return Number.isFinite(playbackRate) && playbackRate > 0 ? playbackRate : 1;
}

function getBaseDisplayDurationSeconds() {
  return Math.max(MIN_DISPLAY_DURATION, displayDuration - 1);
}

function getTierName(tierRank) {
  const safeRank = clamp(Number(tierRank) || 0, 0, POPULARITY_TIERS.length - 1);
  if (!popularityModeEnabled) {
    if (safeRank >= 2) {
      return "diamond";
    }
    if (safeRank >= 1) {
      return "gold";
    }
    return "silver";
  }
  return POPULARITY_TIERS[safeRank] || "silver";
}

function getTierDurationMultiplier(tierRank) {
  if (!popularityModeEnabled) {
    if (tierRank >= 2) {
      return 1.3;
    }
    if (tierRank >= 1) {
      return 1.2;
    }
    return 1;
  }

  const tierName = getTierName(tierRank);
  switch (tierName) {
    case "ruby":
      return 1.33;
    case "purple":
      return 1.28;
    case "diamond":
      return 1.24;
    case "platinum":
      return 1.18;
    case "gold":
      return 1.12;
    default:
      return 1;
  }
}

function getCommentDisplayDurationSeconds(comment, playbackRate = 1) {
  const baseSeconds = getBaseDisplayDurationSeconds();
  const likesCount = Number(comment?.likes || 0);
  const tierRank = getTierRank(likesCount);
  const tierDurationSeconds = baseSeconds * getTierDurationMultiplier(tierRank);
  if (followPlaybackSpeed) {
    return tierDurationSeconds;
  }
  return tierDurationSeconds * playbackRate;
}

function getDisplayDurationMs(comment = null, playbackRate = 1) {
  return Math.round(getCommentDisplayDurationSeconds(comment, playbackRate) * 1000);
}

function createSvgElement(tag, attributes = {}) {
  const element = document.createElementNS("http://www.w3.org/2000/svg", tag);
  Object.entries(attributes).forEach(([key, value]) => {
    element.setAttribute(key, String(value));
  });
  return element;
}

function createEyeIconSvg(closed) {
  const svg = createSvgElement("svg", {
    viewBox: "0 0 24 24",
    role: "img",
    "aria-hidden": "true"
  });

  const outline = createSvgElement("path", {
    d: "M2.2 12c1.9-3.6 5.4-6 9.8-6s7.9 2.4 9.8 6c-1.9 3.6-5.4 6-9.8 6s-7.9-2.4-9.8-6Z",
    fill: "none",
    stroke: "#fff",
    "stroke-width": "2",
    "stroke-linecap": "round",
    "stroke-linejoin": "round"
  });
  svg.appendChild(outline);

  if (closed) {
    const pupil = createSvgElement("path", {
      d: "M9.5 12a2.5 2.5 0 1 0 5 0a2.5 2.5 0 0 0-5 0Z",
      fill: "#fff"
    });
    const slash = createSvgElement("path", {
      d: "m3 3 18 18",
      fill: "none",
      stroke: "#fff",
      "stroke-width": "2",
      "stroke-linecap": "round"
    });
    svg.appendChild(pupil);
    svg.appendChild(slash);
  } else {
    const pupil = createSvgElement("circle", {
      cx: "12",
      cy: "12",
      r: "2.6",
      fill: "#fff"
    });
    svg.appendChild(pupil);
  }

  return svg;
}

function isPlayerHoverActive() {
  const host = getOverlayHost() || videoContainer;
  if (!host) {
    return isVideoHovering;
  }
  if (host.classList.contains("ytp-autohide")) {
    return false;
  }
  return isVideoHovering;
}

function shouldShowEyeToggle() {
  return true;
}

function isInInlinePreviewPlayer(element) {
  return Boolean(element?.closest?.("#inline-preview-player"));
}

function isVisibleControlContainer(element) {
  return Boolean(element && element.offsetWidth > 0 && element.offsetHeight > 0);
}

function getPlayerRightControls() {
  const host = getOverlayHost();
  if (host) {
    const hostControls =
      host.querySelector(".ytp-left-controls") ||
      host.querySelector(".ytp-right-controls");
    if (hostControls) {
      return hostControls;
    }
  }
  const selectors = [
    ".ytp-left-controls",
    ".ytp-right-controls",
    ".player-controls-top",
    ".vjs-control-bar",
    ".shaka-bottom-controls",
    ".html5-player-chrome",
    ".ypcs-control-buttons-right"
  ];
  for (const selector of selectors) {
    const candidates = Array.from(document.querySelectorAll(selector)).filter(
      (element) => !isInInlinePreviewPlayer(element)
    );
    if (candidates.length === 0) {
      continue;
    }
    const hostScoped = host
      ? candidates.filter((element) => host.contains(element))
      : [];
    const visible = (hostScoped.length > 0 ? hostScoped : candidates).filter(
      isVisibleControlContainer
    );
    const pool = visible.length > 0 ? visible : (hostScoped.length > 0 ? hostScoped : candidates);
    return pool[pool.length - 1] || null;
  }
  return null;
}

function resolveEyeMountTarget(controls) {
  if (!controls) {
    return null;
  }
  const nativeButton =
    controls.querySelector(".ytp-play-button") ||
    controls.querySelector(".ytp-mute-button") ||
    controls.querySelector(".ytp-subtitles-button");
  if (nativeButton?.parentElement && controls.contains(nativeButton.parentElement)) {
    return nativeButton.parentElement;
  }
  const scopedCandidates = Array.from(
    controls.querySelectorAll(":scope > div, :scope > span")
  );
  let best = null;
  let bestScore = -1;

  for (const candidate of scopedCandidates) {
    const buttonCount = candidate.querySelectorAll(".ytp-button").length;
    if (buttonCount <= 0) {
      continue;
    }
    const computed = window.getComputedStyle(candidate);
    const flexBonus = computed.display.includes("flex") ? 3 : 0;
    const score = buttonCount + flexBonus;
    if (score > bestScore) {
      best = candidate;
      bestScore = score;
    }
  }

  return best || controls;
}

function resolveEyeInsertAnchor(controls, mountTarget) {
  if (!controls || !mountTarget) {
    return null;
  }
  const preferred =
    controls.querySelector(".ytp-mute-button") ||
    controls.querySelector(".ytp-play-button");
  if (preferred?.parentElement === mountTarget) {
    return preferred.nextSibling;
  }
  return null;
}

function ensureEyeToggle() {
  const controls = getPlayerRightControls();
  const fallbackContainer = overlayElement || getOverlayHost() || document.body;
  const mountTarget = resolveEyeMountTarget(controls) || controls || fallbackContainer;
  if (!mountTarget) {
    return null;
  }
  if (eyeToggleElement && eyeToggleElement.isConnected) {
    if (eyeToggleElement.parentElement !== mountTarget) {
      const anchor = resolveEyeInsertAnchor(controls, mountTarget);
      mountTarget.insertBefore(eyeToggleElement, anchor || null);
    }
    eyeToggleElement.classList.toggle("ytp-button", Boolean(controls));
    eyeToggleElement.classList.toggle("floating", !controls);
    eyeToggleElement.classList.toggle("in-controls-strip", Boolean(controls));
    return eyeToggleElement;
  }
  const existing =
    mountTarget.querySelector(".overlay-eye-toggle") ||
    document.querySelector(".overlay-eye-toggle");
  if (existing) {
    eyeToggleElement = existing;
    eyeToggleElement.classList.add("overlay-eye-toggle");
    eyeToggleElement.classList.toggle("ytp-button", Boolean(controls));
    eyeToggleElement.classList.toggle("floating", !controls);
    eyeToggleElement.classList.toggle("in-controls-strip", Boolean(controls));
    if (eyeToggleElement.parentElement !== mountTarget) {
      const anchor = resolveEyeInsertAnchor(controls, mountTarget);
      mountTarget.insertBefore(eyeToggleElement, anchor || null);
    }
    return eyeToggleElement;
  }

  eyeToggleElement = document.createElement("button");
  eyeToggleElement.className = "overlay-eye-toggle";
  eyeToggleElement.classList.toggle("ytp-button", Boolean(controls));
  eyeToggleElement.classList.toggle("floating", !controls);
  eyeToggleElement.classList.toggle("in-controls-strip", Boolean(controls));
  eyeToggleElement.type = "button";
  eyeToggleElement.setAttribute("aria-label", "Disable timestamp notifications");
  eyeToggleElement.title = "Disable timestamp notifications";
  eyeToggleElement.classList.toggle("muted", notificationsMutedByEye);
  updateEyeIconElement();
  eyeToggleElement.addEventListener("click", (event) => {
    event.preventDefault();
    event.stopPropagation();
    notificationsMutedByEye = !notificationsMutedByEye;
    eyeToggleElement.classList.toggle("muted", notificationsMutedByEye);
    updateEyeIconElement();
    eyeToggleElement.setAttribute(
      "aria-label",
      notificationsMutedByEye ? "Enable timestamp notifications" : "Disable timestamp notifications"
    );
    eyeToggleElement.title = notificationsMutedByEye
      ? "Enable timestamp notifications"
      : "Disable timestamp notifications";
    if (notificationsMutedByEye) {
      hideOverlay();
      setUpcomingDotVisible(false);
      scheduleRenderTimeMarkers();
      updateEyeToggleVisibility();
      return;
    }
    scheduleRenderTimeMarkers();
    const video = getVideo();
    if (video) {
      scheduleReconcile(video.currentTime);
    }
  });
  const anchor = resolveEyeInsertAnchor(controls, mountTarget);
  mountTarget.insertBefore(eyeToggleElement, anchor || null);
  return eyeToggleElement;
}

function updateEyeToggleVisibility() {
  if (!shouldShowEyeToggle()) {
    if (eyeToggleElement) {
      eyeToggleElement.classList.remove("visible");
    }
    return;
  }
  const eye = ensureEyeToggle();
  if (eye) {
    eye.classList.add("visible");
    eye.classList.toggle("muted", notificationsMutedByEye);
    updateEyeIconElement();
  }
}

function scheduleEyeToggleBootstrap() {
  if (eyeMountRetryIntervalId !== null) {
    clearInterval(eyeMountRetryIntervalId);
    eyeMountRetryIntervalId = null;
  }
  let attempts = 0;
  eyeMountRetryIntervalId = setInterval(() => {
    attempts += 1;
    updateEyeToggleVisibility();
    if ((eyeToggleElement && eyeToggleElement.isConnected) || attempts >= 300) {
      clearInterval(eyeMountRetryIntervalId);
      eyeMountRetryIntervalId = null;
    }
  }, 120);
}

function scheduleEyeToggleHeartbeat() {
  if (eyeMountHeartbeatIntervalId !== null) {
    return;
  }
  eyeMountHeartbeatIntervalId = setInterval(() => {
    updateEyeToggleVisibility();
  }, 1000);
}

function attachHoverTracking(host) {
  if (!host || host.dataset.konsHoverBound === "1") {
    return;
  }
  host.dataset.konsHoverBound = "1";
  host.addEventListener("mouseenter", () => {
    isVideoHovering = true;
    updateEyeToggleVisibility();
    setUpcomingDotVisible(false);
  });
  host.addEventListener("mouseleave", () => {
    isVideoHovering = false;
    updateEyeToggleVisibility();
  });
}

function getCommentKey(comment) {
  if (comment?.id !== undefined && comment?.id !== null) {
    return String(comment.id);
  }
  return `${comment.time}:${comment.name}:${comment.text}`;
}

function normalizeCorner(value, fallback) {
  return CORNERS.includes(value) ? value : fallback;
}

function getPriorityScore(comment) {
  if (!priorityScoringEnabled) {
    return 0;
  }
  const likes = Number(comment?.likes || 0);
  return likes * priorityLikesWeight;
}

function collectUniqueSortedLikes(sourceComments) {
  const likeBySource = new Map();
  (sourceComments || []).forEach((comment) => {
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

  return [...likeBySource.values()].sort((a, b) => b - a);
}

function computePercentileThreshold(sortedLikes, thresholdPercent, fallback = 0) {
  const likes = Array.isArray(sortedLikes) ? sortedLikes : [];
  if (likes.length === 0) {
    return fallback;
  }
  const ratio = clamp(
    Number(thresholdPercent || DEFAULT_TOP_LIKED_THRESHOLD_PERCENT),
    MIN_TOP_LIKED_THRESHOLD_PERCENT,
    MAX_TOP_LIKED_THRESHOLD_PERCENT
  ) / 100;
  const poolSize = Math.max(1, Math.ceil(likes.length * ratio));
  return Number(likes[poolSize - 1] || fallback || 0);
}

function computeTopLikedThreshold(sourceComments) {
  const likes = collectUniqueSortedLikes(sourceComments);
  const percentileCutoff = computePercentileThreshold(likes, topLikedThresholdPercent, 0);
  return Math.max(MIN_GOLD_TIER_LIKES, percentileCutoff);
}

function derivePlatinumThresholdPercent() {
  return Math.max(1, Math.floor(topLikedThresholdPercent * 0.72));
}

function deriveDiamondThresholdPercent() {
  return Math.max(1, Math.floor(topLikedThresholdPercent * 0.35));
}

function derivePurpleThresholdPercent() {
  return Math.max(1, Math.floor(topLikedThresholdPercent * 0.25));
}

function deriveRubyThresholdPercent() {
  return Math.max(1, Math.floor(topLikedThresholdPercent * 0.12));
}

function computeTierThresholds(sourceComments) {
  const likes = collectUniqueSortedLikes(sourceComments);
  if (likes.length === 0) {
    return {
      gold: 0,
      platinum: Number.POSITIVE_INFINITY,
      diamond: Number.POSITIVE_INFINITY,
      purple: Number.POSITIVE_INFINITY,
      ruby: Number.POSITIVE_INFINITY
    };
  }

  const gold = Math.max(
    MIN_GOLD_TIER_LIKES,
    computePercentileThreshold(likes, topLikedThresholdPercent, 0)
  );
  const platinum = Math.max(
    MIN_PLATINUM_TIER_LIKES,
    computePercentileThreshold(likes, derivePlatinumThresholdPercent(), gold),
    gold + MIN_PLATINUM_TIER_GAP_FROM_GOLD
  );
  const diamond = Math.max(
    MIN_DIAMOND_TIER_LIKES,
    computePercentileThreshold(likes, deriveDiamondThresholdPercent(), platinum),
    gold + MIN_DIAMOND_TIER_GAP_FROM_GOLD,
    platinum + MIN_DIAMOND_TIER_GAP_FROM_PLATINUM
  );
  const purple = Math.max(
    MIN_PURPLE_TIER_LIKES,
    computePercentileThreshold(likes, derivePurpleThresholdPercent(), diamond),
    diamond + MIN_PURPLE_TIER_GAP_FROM_DIAMOND
  );
  const ruby = Math.max(
    MIN_RUBY_TIER_LIKES,
    computePercentileThreshold(likes, deriveRubyThresholdPercent(), purple),
    purple + MIN_RUBY_TIER_GAP_FROM_PURPLE
  );

  return { gold, platinum, diamond, purple, ruby };
}

function recomputeLikeTierThresholds() {
  const thresholds = computeTierThresholds(comments);
  topLikedThreshold = thresholds.gold;
  platinumLikedThreshold = thresholds.platinum;
  diamondLikedThreshold = thresholds.diamond;
  purpleLikedThreshold = thresholds.purple;
  rubyLikedThreshold = thresholds.ruby;
}

function compareByPriority(a, b) {
  const scoreDiff = getPriorityScore(b) - getPriorityScore(a);
  if (scoreDiff !== 0) {
    return scoreDiff;
  }
  return String(a.id || "").localeCompare(String(b.id || ""));
}

function resolveCommentCorner(comment) {
  if (!routingEnabled) {
    return position;
  }
  if ((comment?.text || "").length <= routingThreshold) {
    return routingShortCorner;
  }
  return routingLongCorner;
}

function getTierRank(likesCount) {
  if (!Number.isFinite(likesCount) || likesCount <= 0) {
    return 0;
  }

  if (popularityModeEnabled) {
    if (likesCount >= rubyLikedThreshold) {
      return 5;
    }
    if (likesCount >= purpleLikedThreshold) {
      return 4;
    }
    if (likesCount >= diamondLikedThreshold) {
      return 3;
    }
    if (likesCount >= platinumLikedThreshold) {
      return 2;
    }
    if (likesCount >= topLikedThreshold) {
      return 1;
    }
    return 0;
  }

  if (likesCount >= diamondLikedThreshold) {
    return 2;
  }
  if (likesCount >= topLikedThreshold) {
    return 1;
  }
  return 0;
}

function getHeatmapCommentWeight(comment) {
  const likesCount = Number(comment?.likes || 0);
  const tierName = getTierName(getTierRank(likesCount));
  return HEATMAP_TIER_WEIGHTS[tierName] ?? HEATMAP_TIER_WEIGHTS.silver;
}

function getTierOrderForCorner(corner, tierRank) {
  const isTopCorner = corner === "top-left" || corner === "top-right";
  return isTopCorner ? -tierRank : tierRank;
}

function formatLikesLabel(likesCount) {
  const value = Number(likesCount || 0);
  if (!Number.isFinite(value) || value <= 0) {
    return "0";
  }
  if (value >= 1_000_000_000) {
    const compact = (value / 1_000_000_000).toFixed(1).replace(/\.0$/, "");
    return `${compact}B`;
  }
  if (value >= 1_000_000) {
    const compact = (value / 1_000_000).toFixed(1).replace(/\.0$/, "");
    return `${compact}M`;
  }
  if (value >= 1_000) {
    const compact = (value / 1_000).toFixed(1).replace(/\.0$/, "");
    return `${compact}K`;
  }
  return String(Math.round(value));
}

function ensureLaneContainers() {
  if (!overlayElement) {
    return;
  }
  for (const corner of CORNERS) {
    if (laneElements.has(corner) && laneElements.get(corner).isConnected) {
      continue;
    }
    const existing = overlayElement.querySelector(`.overlay-lane.${corner}`);
    if (existing) {
      laneElements.set(corner, existing);
      continue;
    }
    const lane = document.createElement("div");
    lane.className = `overlay-lane ${corner}`;
    overlayElement.appendChild(lane);
    laneElements.set(corner, lane);
  }
}

function getLaneElement(corner) {
  ensureLaneContainers();
  return laneElements.get(corner) || null;
}

function detachCardDragListeners() {
  document.removeEventListener("pointermove", onCardDragMove, true);
  document.removeEventListener("pointerup", onCardDragEnd, true);
  document.removeEventListener("pointercancel", onCardDragEnd, true);
}

function suppressClickWhileDragging(event) {
  if (Date.now() >= suppressGlobalClickUntil) {
    return;
  }
  event.preventDefault();
  event.stopPropagation();
  if (typeof event.stopImmediatePropagation === "function") {
    event.stopImmediatePropagation();
  }
}

function clearFreeLaneInlineStyle(lane) {
  if (!lane) {
    return;
  }
  lane.classList.remove("custom-position");
  lane.style.left = "";
  lane.style.top = "";
  lane.style.right = "";
  lane.style.bottom = "";
}

function applyFreeLanePosition() {
  if (!overlayElement) {
    return;
  }
  ensureLaneContainers();
  for (const corner of CORNERS) {
    clearFreeLaneInlineStyle(laneElements.get(corner));
  }
  if (!CARD_DRAG_ENABLED) {
    return;
  }
  if (routingEnabled || !freePositionEnabled) {
    return;
  }
  const lane = getLaneElement(position);
  const host = getOverlayHost() || videoContainer;
  if (!lane || !host) {
    return;
  }
  const hostRect = host.getBoundingClientRect();
  if (!hostRect.width || !hostRect.height) {
    return;
  }
  const laneRect = lane.getBoundingClientRect();
  const laneWidth = laneRect.width || 0;
  const laneHeight = laneRect.height || 0;
  const visualScale = Math.max(0.01, Number(overlayScale) || 1);
  const maxLeft = Math.max(FREE_POSITION_MARGIN_PX, hostRect.width - laneWidth - FREE_POSITION_MARGIN_PX);
  const maxTop = Math.max(FREE_POSITION_MARGIN_PX, hostRect.height - laneHeight - FREE_POSITION_MARGIN_PX);

  const clampedLeftPx = clamp(
    Number(freePositionX) * hostRect.width,
    FREE_POSITION_MARGIN_PX,
    maxLeft
  );
  const clampedTopPx = clamp(
    Number(freePositionY) * hostRect.height,
    FREE_POSITION_MARGIN_PX,
    maxTop
  );
  freePositionX = clampedLeftPx / hostRect.width;
  freePositionY = clampedTopPx / hostRect.height;

  lane.classList.add("custom-position");
  lane.style.left = `${clampedLeftPx / visualScale}px`;
  lane.style.top = `${clampedTopPx / visualScale}px`;
  lane.style.right = "auto";
  lane.style.bottom = "auto";
}

function cancelCardDrag() {
  const dragState = cardDragState;
  if (dragState?.card) {
    dragState.card.classList.remove("dragging-position");
    if (typeof dragState.card.hasPointerCapture === "function" && dragState.card.hasPointerCapture(dragState.pointerId)) {
      try {
        dragState.card.releasePointerCapture(dragState.pointerId);
      } catch (error) {
        // Ignore capture release races.
      }
    }
  }
  if (overlayElement) {
    overlayElement.classList.remove("drag-position-active");
  }
  cardDragState = null;
  detachCardDragListeners();
}

function onCardDragMove(event) {
  if (!cardDragState || event.pointerId !== cardDragState.pointerId) {
    return;
  }
  const dx = event.clientX - cardDragState.startX;
  const dy = event.clientY - cardDragState.startY;
  const movedEnough = Math.hypot(dx, dy) >= CARD_DRAG_MOVE_THRESHOLD_PX;
  if (!cardDragState.dragging && !movedEnough) {
    return;
  }
  if (!cardDragState.dragging) {
    cardDragState.dragging = true;
    if (cardDragState.card) {
      cardDragState.card.classList.add("dragging-position");
    }
    if (overlayElement) {
      overlayElement.classList.add("drag-position-active");
    }
  }
  event.preventDefault();
  event.stopPropagation();
  const host = cardDragState.host;
  const lane = cardDragState.lane;
  if (!host || !lane) {
    return;
  }

  const hostRect = host.getBoundingClientRect();
  if (!hostRect.width || !hostRect.height) {
    return;
  }

  const laneRect = lane.getBoundingClientRect();
  const laneWidth = laneRect.width || cardDragState.laneWidth || 0;
  const laneHeight = laneRect.height || cardDragState.laneHeight || 0;
  const maxLeft = Math.max(FREE_POSITION_MARGIN_PX, hostRect.width - laneWidth - FREE_POSITION_MARGIN_PX);
  const maxTop = Math.max(FREE_POSITION_MARGIN_PX, hostRect.height - laneHeight - FREE_POSITION_MARGIN_PX);

  const leftPx = clamp(
    event.clientX - hostRect.left - cardDragState.pointerOffsetX,
    FREE_POSITION_MARGIN_PX,
    maxLeft
  );
  const topPx = clamp(
    event.clientY - hostRect.top - cardDragState.pointerOffsetY,
    FREE_POSITION_MARGIN_PX,
    maxTop
  );
  freePositionEnabled = true;
  freePositionX = leftPx / hostRect.width;
  freePositionY = topPx / hostRect.height;
  applyFreeLanePosition();
}

function onCardDragEnd(event) {
  if (!cardDragState || event.pointerId !== cardDragState.pointerId) {
    return;
  }

  const dragState = cardDragState;
  if (dragState.dragging) {
    event.preventDefault();
    event.stopPropagation();
    if (typeof event.stopImmediatePropagation === "function") {
      event.stopImmediatePropagation();
    }
  }
  cancelCardDrag();

  if (dragState.card) {
    dragState.card.classList.remove("dragging-position");
  }

  if (!dragState.dragging) {
    return;
  }

  const suppressUntil = Date.now() + CARD_DRAG_CLICK_SUPPRESS_MS;
  suppressCardClickUntil = suppressUntil;
  suppressGlobalClickUntil = suppressUntil;
  try {
    const maybePromise = chrome.storage.sync.set({
      freePositionEnabled,
      freePositionX,
      freePositionY
    });
    if (maybePromise && typeof maybePromise.catch === "function") {
      maybePromise.catch(() => {});
    }
  } catch (error) {
    // Ignore transient context errors while navigating.
  }
}

function startCardDrag(event, card, initialCorner) {
  if (!CARD_DRAG_ENABLED) {
    return;
  }
  if (!card || routingEnabled) {
    return;
  }
  if (event.pointerType === "mouse" && event.button !== 0) {
    return;
  }
  if (!Number.isFinite(event.clientX) || !Number.isFinite(event.clientY)) {
    return;
  }
  if (cardDragState) {
    return;
  }
  event.preventDefault();
  event.stopPropagation();
  const lane = getLaneElement(initialCorner);
  const host = getOverlayHost() || videoContainer;
  if (!lane || !host) {
    return;
  }
  const hostRect = host.getBoundingClientRect();
  const laneRect = lane.getBoundingClientRect();
  if (!hostRect.width || !hostRect.height || !laneRect.width || !laneRect.height) {
    return;
  }

  cardDragState = {
    pointerId: event.pointerId,
    startX: event.clientX,
    startY: event.clientY,
    dragging: false,
    card,
    lane,
    host,
    laneWidth: laneRect.width,
    laneHeight: laneRect.height,
    pointerOffsetX: event.clientX - laneRect.left,
    pointerOffsetY: event.clientY - laneRect.top
  };
  if (typeof card.setPointerCapture === "function") {
    try {
      card.setPointerCapture(event.pointerId);
    } catch (error) {
      // Ignore pointer-capture unsupported states.
    }
  }
  detachCardDragListeners();
  document.addEventListener("pointermove", onCardDragMove, true);
  document.addEventListener("pointerup", onCardDragEnd, true);
  document.addEventListener("pointercancel", onCardDragEnd, true);
}

function updateLaneVisibility() {
  if (!overlayElement) {
    return;
  }
  ensureLaneContainers();
  for (const corner of CORNERS) {
    const lane = laneElements.get(corner);
    if (!lane) {
      continue;
    }
    const visible = routingEnabled || corner === position;
    lane.classList.toggle("hidden", !visible);
  }
  applyFreeLanePosition();
  updateEyeToggleVisibility();
}

function seekToCommentContext(comment, contextSeconds = 2) {
  const video = getVideo();
  const currentTime = Number(video?.currentTime || 0);
  const candidates =
    Array.isArray(comment?.timestamps) && comment.timestamps.length > 0
      ? comment.timestamps.map((value) => Number(value)).filter((value) => Number.isFinite(value))
      : [Number(comment?.time || 0)];
  const closestTimestamp = candidates.reduce((closest, candidate) => {
    return Math.abs(candidate - currentTime) < Math.abs(closest - currentTime)
      ? candidate
      : closest;
  }, candidates[0] || 0);
  const targetTime = Math.max(0, Number(closestTimestamp || 0) - contextSeconds);

  if (video) {
    video.currentTime = targetTime;
    return { targetTime, anchorTime: Number(closestTimestamp || 0) };
  }

  const videoId = currentVideoId || getVideoId();
  if (!videoId) {
    return;
  }
  const time = Math.floor(targetTime);
  const lcKey = comment?.sourceId || comment?.id;
  const lcPart = lcKey ? `&lc=${encodeURIComponent(lcKey)}` : "";
  const url = `https://www.youtube.com/watch?v=${videoId}${lcPart}&t=${time}s`;
  window.location.href = url;
  return { targetTime, anchorTime: Number(closestTimestamp || 0) };
}

function setContextualVisibilityLock(comment, anchorTime, contextSeconds = CLICK_CONTEXT_SECONDS) {
  const commentKey = getCommentKey(comment);
  const anchor = Number(anchorTime);
  const context = Math.max(0, Number(contextSeconds || 0));
  if (!commentKey || !Number.isFinite(anchor)) {
    return;
  }
  contextualVisibilityLocks.set(commentKey, {
    from: Math.max(0, anchor - context),
    until: anchor
  });
}

function isContextuallyVisible(commentKey, currentTime) {
  const lock = contextualVisibilityLocks.get(commentKey);
  if (!lock) {
    return false;
  }
  const from = Number(lock.from);
  const until = Number(lock.until);
  if (
    !Number.isFinite(from) ||
    !Number.isFinite(until) ||
    currentTime < from - CLICK_LOCK_FUZZ_SECONDS ||
    currentTime >= until
  ) {
    contextualVisibilityLocks.delete(commentKey);
    return false;
  }
  return true;
}

function ensureUpcomingDot() {
  if (!overlayElement) {
    return null;
  }
  const lane = getLaneElement("bottom-left");
  if (!lane) {
    return null;
  }
  if (upcomingDotElement && upcomingDotElement.isConnected) {
    return upcomingDotElement;
  }
  const existing = lane.querySelector(".overlay-upcoming-dot");
  if (existing) {
    upcomingDotElement = existing;
    return upcomingDotElement;
  }
  upcomingDotElement = document.createElement("div");
  upcomingDotElement.className = "overlay-upcoming-dot";
  lane.appendChild(upcomingDotElement);
  return upcomingDotElement;
}

function setUpcomingDotVisible(visible) {
  if (!overlayElement) {
    return;
  }
  if (
    !visible ||
    !isActive ||
    notificationsMutedByEye ||
    !showUpcomingDot ||
    position !== "bottom-left" ||
    routingEnabled
  ) {
    if (upcomingDotElement) {
      upcomingDotElement.classList.remove("visible");
    }
    return;
  }
  if (!ensureOverlayAttached()) {
    return;
  }
  const dot = ensureUpcomingDot();
  if (dot) {
    dot.classList.add("visible");
  }
}

function formatTime(seconds) {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);
  if (h > 0) {
    return `${h}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  }
  return `${m}:${String(s).padStart(2, "0")}`;
}

function appendCommentTextWithTimestampHighlights(targetElement, text) {
  if (!targetElement) {
    return;
  }
  const input = typeof text === "string" ? text : "";
  targetElement.textContent = "";
  if (!input) {
    return;
  }

  const highlightRegex = /(\d{1,}:[0-5]\d(?::[0-5]\d)?)/g;
  let cursor = 0;
  let match = null;
  while ((match = highlightRegex.exec(input)) !== null) {
    const matchedText = match[0];
    const startIndex = match.index;
    if (startIndex > cursor) {
      targetElement.appendChild(document.createTextNode(input.slice(cursor, startIndex)));
    }
    const strong = document.createElement("strong");
    strong.textContent = matchedText;
    targetElement.appendChild(strong);
    cursor = startIndex + matchedText.length;
  }

  if (cursor < input.length) {
    targetElement.appendChild(document.createTextNode(input.slice(cursor)));
  }
}

function locationChange(callback) {
  let currentUrl = location.href;
  const observer = new MutationObserver(() => {
    if (currentUrl !== document.location.href) {
      currentUrl = document.location.href;
      callback();
    }
  });
  const target = document.documentElement || document.body;
  if (target) {
    observer.observe(target, { childList: true, subtree: true });
  }
}

function applyOverlayStyles() {
  if (!overlayElement) {
    return;
  }

  const glassNormalized =
    clamp(overlayGlassiness, MIN_OVERLAY_GLASSINESS, MAX_OVERLAY_GLASSINESS) / 100;
  const darknessNormalized =
    clamp(overlayDarkness, MIN_OVERLAY_DARKNESS, MAX_OVERLAY_DARKNESS) / 100;

  const blurPx = (2 + glassNormalized * 22).toFixed(1);
  const glassTintAlpha = (0.04 + glassNormalized * 0.24).toFixed(3);
  const glassRimAlpha = (0.12 + glassNormalized * 0.5).toFixed(3);
  const glassSheenAlpha = (0.06 + glassNormalized * 0.34).toFixed(3);
  const bgAlpha = (0.18 + darknessNormalized * 0.72).toFixed(3);
  const borderAlpha = (0.1 + darknessNormalized * 0.36).toFixed(3);
  const shadowAlpha = (0.18 + darknessNormalized * 0.47).toFixed(3);
  const warningAlpha = (0.52 + darknessNormalized * 0.42).toFixed(3);
  const warningBorderAlpha = (0.34 + darknessNormalized * 0.44).toFixed(3);
  const warningGlowAlpha = (0.55 + darknessNormalized * 0.4).toFixed(3);
  const heatmapIntensityRatio =
    clamp(heatmapIntensity, MIN_HEATMAP_INTENSITY, MAX_HEATMAP_INTENSITY) /
    MAX_HEATMAP_INTENSITY;
  const heatmapAlpha = clamp(
    0.2 + Math.pow(heatmapIntensityRatio, 0.65) * 0.75,
    0.2,
    0.95
  ).toFixed(3);

  overlayElement.style.setProperty("--overlay-scale", String(overlayScale));
  overlayElement.style.setProperty("--overlay-radius", `${overlayRadius}px`);
  overlayElement.style.setProperty("--overlay-avatar-size", `${overlayAvatarSize}px`);
  overlayElement.style.setProperty("--overlay-bg-alpha", bgAlpha);
  overlayElement.style.setProperty("--overlay-blur", `${blurPx}px`);
  overlayElement.style.setProperty("--overlay-glass-tint-alpha", glassTintAlpha);
  overlayElement.style.setProperty("--overlay-glass-rim-alpha", glassRimAlpha);
  overlayElement.style.setProperty("--overlay-glass-sheen-alpha", glassSheenAlpha);
  overlayElement.style.setProperty("--overlay-border-alpha", borderAlpha);
  overlayElement.style.setProperty("--overlay-shadow-alpha", shadowAlpha);
  overlayElement.style.setProperty("--overlay-warning-alpha", warningAlpha);
  overlayElement.style.setProperty("--overlay-warning-border-alpha", warningBorderAlpha);
  overlayElement.style.setProperty("--overlay-warning-glow-alpha", warningGlowAlpha);
  overlayElement.style.setProperty("--overlay-heatmap-alpha", heatmapAlpha);
  overlayElement.classList.toggle("debug-mode", debugMode);
  updateLaneVisibility();
}

async function getOverlaySettings() {
  const values = await chrome.storage.sync.get([
    "overlayScale",
    "displayDuration",
    "overlayRadius",
    "overlayAvatarSize",
    "overlayGlassiness",
    "overlayDarkness",
    "debugMode",
    "earlyModeEnabled",
    "followPlaybackSpeed",
    "earlySeconds",
    "timestampAccentEffect",
    "reverseStackOrder",
    "priorityScoringEnabled",
    "priorityLikesWeight",
    "topLikedThresholdPercent",
    "popularityModeEnabled",
    "heatmapEnabled",
    "heatmapIntensity",
    "routingEnabled",
    "routingThreshold",
    "routingShortCorner",
    "routingLongCorner",
    "showLikesInNotifications",
    "showUpcomingDot",
    "presetProfile",
    "freePositionEnabled",
    "freePositionX",
    "freePositionY"
  ]);

  overlayScale = clamp(Number(values?.overlayScale ?? DEFAULT_OVERLAY_SCALE), MIN_OVERLAY_SCALE, MAX_OVERLAY_SCALE);
  displayDuration = clamp(
    Number(values?.displayDuration ?? DEFAULT_DISPLAY_DURATION),
    MIN_DISPLAY_DURATION,
    MAX_DISPLAY_DURATION
  );
  overlayRadius = clamp(
    Number(values?.overlayRadius ?? DEFAULT_OVERLAY_RADIUS),
    MIN_OVERLAY_RADIUS,
    MAX_OVERLAY_RADIUS
  );
  overlayAvatarSize = clamp(
    Number(values?.overlayAvatarSize ?? DEFAULT_OVERLAY_AVATAR_SIZE),
    MIN_OVERLAY_AVATAR_SIZE,
    MAX_OVERLAY_AVATAR_SIZE
  );
  overlayGlassiness = clamp(
    Number(values?.overlayGlassiness ?? DEFAULT_OVERLAY_GLASSINESS),
    MIN_OVERLAY_GLASSINESS,
    MAX_OVERLAY_GLASSINESS
  );
  overlayDarkness = clamp(
    Number(values?.overlayDarkness ?? DEFAULT_OVERLAY_DARKNESS),
    MIN_OVERLAY_DARKNESS,
    MAX_OVERLAY_DARKNESS
  );
  debugMode = Boolean(values?.debugMode ?? DEFAULT_DEBUG_MODE);
  earlyModeEnabled = Boolean(values?.earlyModeEnabled ?? DEFAULT_EARLY_MODE_ENABLED);
  followPlaybackSpeed = Boolean(values?.followPlaybackSpeed ?? DEFAULT_FOLLOW_PLAYBACK_SPEED);
  earlySeconds = clamp(
    Number(values?.earlySeconds ?? DEFAULT_EARLY_SECONDS),
    MIN_EARLY_SECONDS,
    MAX_EARLY_SECONDS
  );
  timestampAccentEffect = String(
    values?.timestampAccentEffect ?? DEFAULT_TIMESTAMP_ACCENT_EFFECT
  );
  reverseStackOrder = Boolean(values?.reverseStackOrder ?? DEFAULT_REVERSE_STACK_ORDER);
  priorityScoringEnabled = Boolean(
    values?.priorityScoringEnabled ?? DEFAULT_PRIORITY_SCORING_ENABLED
  );
  priorityLikesWeight = clamp(
    Number(values?.priorityLikesWeight ?? DEFAULT_PRIORITY_LIKES_WEIGHT),
    MIN_PRIORITY_LIKES_WEIGHT,
    MAX_PRIORITY_LIKES_WEIGHT
  );
  topLikedThresholdPercent = clamp(
    Number(values?.topLikedThresholdPercent ?? DEFAULT_TOP_LIKED_THRESHOLD_PERCENT),
    MIN_TOP_LIKED_THRESHOLD_PERCENT,
    MAX_TOP_LIKED_THRESHOLD_PERCENT
  );
  popularityModeEnabled = Boolean(
    values?.popularityModeEnabled ?? DEFAULT_POPULARITY_MODE_ENABLED
  );
  heatmapEnabled = Boolean(values?.heatmapEnabled ?? DEFAULT_HEATMAP_ENABLED);
  heatmapIntensity = clamp(
    Number(values?.heatmapIntensity ?? DEFAULT_HEATMAP_INTENSITY),
    MIN_HEATMAP_INTENSITY,
    MAX_HEATMAP_INTENSITY
  );
  routingEnabled = Boolean(values?.routingEnabled ?? DEFAULT_ROUTING_ENABLED);
  routingThreshold = clamp(
    Number(values?.routingThreshold ?? DEFAULT_ROUTING_THRESHOLD),
    MIN_ROUTING_THRESHOLD,
    MAX_ROUTING_THRESHOLD
  );
  routingShortCorner = normalizeCorner(
    String(values?.routingShortCorner ?? DEFAULT_ROUTING_SHORT_CORNER),
    DEFAULT_ROUTING_SHORT_CORNER
  );
  routingLongCorner = normalizeCorner(
    String(values?.routingLongCorner ?? DEFAULT_ROUTING_LONG_CORNER),
    DEFAULT_ROUTING_LONG_CORNER
  );
  const presetProfile = String(values?.presetProfile ?? DEFAULT_PRESET_PROFILE);
  showLikesInNotifications =
    presetProfile === "minimal"
      ? false
      : Boolean(
          values?.showLikesInNotifications ?? DEFAULT_SHOW_LIKES_IN_NOTIFICATIONS
        );
  showUpcomingDot = Boolean(
    values?.showUpcomingDot ?? DEFAULT_SHOW_UPCOMING_DOT
  );
  freePositionEnabled = Boolean(
    values?.freePositionEnabled ?? DEFAULT_FREE_POSITION_ENABLED
  );
  freePositionX = clamp(
    Number(values?.freePositionX ?? DEFAULT_FREE_POSITION_X),
    0,
    1
  );
  freePositionY = clamp(
    Number(values?.freePositionY ?? DEFAULT_FREE_POSITION_Y),
    0,
    1
  );
  if (!CARD_DRAG_ENABLED) {
    freePositionEnabled = false;
    freePositionX = DEFAULT_FREE_POSITION_X;
    freePositionY = DEFAULT_FREE_POSITION_Y;
  }
}

async function main() {
  resetVariables();
  document.removeEventListener("click", suppressClickWhileDragging, true);
  isActive = await isActiveFunc();
  position = await getCommentPosition();
  await getOverlaySettings();

  const videoId = getVideoId();
  currentVideoId = videoId;
  if (videoId) {
    await chrome.runtime.sendMessage({ type: "comments", video_id: videoId });
    createInterface();
    scheduleRenderTimeMarkers();
  }
}

function getVideoId() {
  if (window.location.pathname === "/watch") {
    return new URL(location.href).searchParams.get("v");
  }
  if (window.location.pathname.startsWith("/embed/")) {
    return window.location.pathname.substring("/embed/".length);
  }
  return null;
}

function getVideo() {
  return document.querySelector("#movie_player video") || document.querySelector("video");
}

function getOverlayHost() {
  const moviePlayer = document.querySelector("#movie_player");
  if (moviePlayer) {
    return moviePlayer;
  }

  const html5Player =
    document.querySelector("#container .html5-video-player") ||
    document.querySelector(".html5-video-player");
  if (html5Player) {
    return html5Player;
  }

  const video = document.querySelector("video");
  if (video) {
    return (
      video.closest("#movie_player") ||
      video.closest(".html5-video-player") ||
      video.parentElement
    );
  }

  return null;
}

function ensureOverlayAttached() {
  if (!overlayElement) {
    return false;
  }

  const host = getOverlayHost();
  if (!host) {
    debugLog("No overlay host found");
    return false;
  }

  if (window.getComputedStyle(host).position === "static") {
    host.style.position = "relative";
  }

  if (overlayElement.parentElement !== host) {
    host.appendChild(overlayElement);
    debugLog("Reattached overlay to host", host.className || host.id || host.tagName);
  }

  return true;
}

function createInterface() {
  const host = getOverlayHost() || document.body;
  attachHoverTracking(host);
  if (host !== document.body && window.getComputedStyle(host).position === "static") {
    host.style.position = "relative";
  }

  if (document.getElementById("overlay-element")) {
    overlayElement = document.getElementById("overlay-element");
    ensureOverlayAttached();
    ensureLaneContainers();
    applyOverlayStyles();
    updateLaneVisibility();
    updateEyeToggleVisibility();
    scheduleEyeToggleBootstrap();
    scheduleEyeToggleHeartbeat();
    return;
  }

  overlayElement = document.createElement("div");
  overlayElement.id = "overlay-element";
  overlayElement.classList.add("overlay-root");
  ensureLaneContainers();
  applyOverlayStyles();
  updateLaneVisibility();

  host.appendChild(overlayElement);
  ensureOverlayAttached();
  updateEyeToggleVisibility();
  scheduleEyeToggleBootstrap();
  scheduleEyeToggleHeartbeat();
}

function getMarkerContainer() {
  return (
    document.querySelector("#movie_player .ytp-timed-markers-container") ||
    document.querySelector("#movie_player .ytp-progress-list")
  );
}

function getOrCreateMarkerBar() {
  if (markerBarElement && markerBarElement.parentElement) {
    return markerBarElement;
  }

  const container = getMarkerContainer();
  if (!container) {
    return null;
  }

  markerBarElement = container.querySelector(".__kons-ts-marker-bar");
  if (!markerBarElement) {
    markerBarElement = document.createElement("div");
    markerBarElement.className = "__kons-ts-marker-bar";
    container.appendChild(markerBarElement);
  }

  return markerBarElement;
}

function clearMarkers() {
  if (markerBarElement) {
    markerBarElement.innerHTML = "";
  }
  hideMarkerPreview();
}

function getOrCreateMarkerPreview() {
  if (markerPreviewElement && markerPreviewElement.parentElement) {
    return markerPreviewElement;
  }

  const host = getOverlayHost();
  if (!host) {
    return null;
  }

  markerPreviewElement = host.querySelector(".__kons-ts-marker-preview");
  if (!markerPreviewElement) {
    markerPreviewElement = document.createElement("div");
    markerPreviewElement.className = "__kons-ts-marker-preview";
    markerPreviewElement.style.display = "none";
    host.appendChild(markerPreviewElement);
  }
  return markerPreviewElement;
}

function showMarkerPreview(markerRect, markerData) {
  const preview = getOrCreateMarkerPreview();
  const host = getOverlayHost();
  if (!preview || !host) {
    return;
  }

  const sample = markerData.comments[0];
  preview.textContent = sample?.text || "";
  preview.style.display = "block";

  const hostRect = host.getBoundingClientRect();
  const centerX = markerRect.left + markerRect.width / 2;
  const previewWidth = Math.min(420, hostRect.width - 16);
  preview.style.width = `${previewWidth}px`;

  const desiredLeft = centerX - hostRect.left - previewWidth / 2;
  const clampedLeft = Math.max(8, Math.min(hostRect.width - previewWidth - 8, desiredLeft));
  preview.style.left = `${clampedLeft}px`;
}

function hideMarkerPreview() {
  if (markerPreviewElement) {
    markerPreviewElement.style.display = "none";
  }
}

function renderHeatmapWave(bar, videoDuration) {
  if (!bar) {
    return;
  }
  let wave = bar.querySelector(".__kons-ts-heatmap-wave");
  let waveCreated = false;

  if (
    notificationsMutedByEye ||
    !commentsLoadComplete ||
    !heatmapEnabled ||
    !Number.isFinite(videoDuration) ||
    videoDuration <= 0 ||
    comments.length === 0
  ) {
    if (wave) {
      wave.remove();
    }
    return;
  }
  if (!wave) {
    wave = document.createElement("div");
    wave.className = "__kons-ts-heatmap-wave";
    bar.appendChild(wave);
    waveCreated = true;
  } else {
    wave.innerHTML = "";
  }

  const bins = 420;
  const counts = new Array(bins).fill(0);
  for (const comment of comments) {
    if (comment.time < 0 || comment.time > videoDuration) {
      continue;
    }
    const ratio = comment.time / videoDuration;
    const idx = Math.min(bins - 1, Math.max(0, Math.floor(ratio * bins)));
    counts[idx] += getHeatmapCommentWeight(comment);
  }
  const weights = [1, 2, 3, 4, 5, 6, 7, 8, 9, 8, 7, 6, 5, 4, 3, 2, 1];
  const radius = Math.floor(weights.length / 2);
  const applyKernelSmoothing = (source) =>
    source.map((_, idx) => {
      let total = 0;
      let weightSum = 0;
      for (let offset = -radius; offset <= radius; offset += 1) {
        const current = idx + offset;
        if (current < 0 || current >= bins) {
          continue;
        }
        const weight = weights[offset + radius];
        total += source[current] * weight;
        weightSum += weight;
      }
      return weightSum ? total / weightSum : 0;
    });

  const smoothed = applyKernelSmoothing(counts);
  const smoothedTwice = applyKernelSmoothing(smoothed);
  const smoothedThrice = applyKernelSmoothing(smoothedTwice);
  const smoothedValues = smoothedThrice;

  const maxCount = Math.max(...smoothedValues);
  if (!maxCount) {
    wave.remove();
    return;
  }

  const globalIntensity =
    clamp(heatmapIntensity, MIN_HEATMAP_INTENSITY, MAX_HEATMAP_INTENSITY) / 100;
  const intensityScale = Math.pow(globalIntensity, 0.82);
  const maxHeightPx = 18;
  const minHeightPx = 2;
  const fragment = document.createDocumentFragment();
  for (let i = 0; i < bins; i += 1) {
    const ratio = smoothedValues[i] / maxCount;
    const eased = Math.pow(ratio, 0.72);
    const height = minHeightPx + eased * maxHeightPx * intensityScale;
    const alpha = clamp(
      0.18 + eased * (0.28 + 0.55 * Math.min(1, intensityScale / 3)),
      0.08,
      0.98
    );

    const bin = document.createElement("span");
    bin.className = "__kons-ts-heatmap-bin";
    bin.style.height = `${height.toFixed(2)}px`;
    bin.style.opacity = alpha.toFixed(3);
    fragment.appendChild(bin);
  }
  wave.appendChild(fragment);
  if (waveCreated) {
    requestAnimationFrame(() => {
      if (wave && wave.isConnected) {
        wave.classList.add("is-visible");
      }
    });
  }
}

function renderTimeMarkers() {
  const video = getVideo();
  if (!video || !Number.isFinite(video.duration) || video.duration <= 0) {
    if (video) {
      video.addEventListener(
        "loadedmetadata",
        () => {
          renderTimeMarkers();
        },
        { once: true }
      );
    }
    return;
  }

  const bar = getOrCreateMarkerBar();
  if (!bar) {
    return;
  }
  bar.innerHTML = "";
  if (notificationsMutedByEye) {
    hideMarkerPreview();
    return;
  }
  renderHeatmapWave(bar, video.duration);

  const groupedByTime = new Map();
  for (const comment of comments) {
    if (!groupedByTime.has(comment.time)) {
      groupedByTime.set(comment.time, []);
    }
    groupedByTime.get(comment.time).push(comment);
  }

  const entries = [...groupedByTime.entries()].sort((a, b) => a[0] - b[0]);
  entries.forEach(([time, groupedComments]) => {
    if (time > video.duration) {
      return;
    }
    groupedComments.sort(compareByPriority);

    const marker = document.createElement("div");
    marker.className = "__kons-ts-marker";
    const highestTierRank = groupedComments.reduce((currentMax, comment) => {
      const likesCount = Number(comment?.likes || 0);
      return Math.max(currentMax, getTierRank(likesCount));
    }, 0);
    const highestTierName = getTierName(highestTierRank);
    if (highestTierRank > 0) {
      marker.classList.add(`tier-${highestTierName}`);
      if (highestTierName === "gold") {
        marker.classList.add("gold-tier");
      } else if (highestTierName === "diamond") {
        marker.classList.add("diamond-tier");
      }
    }
    const offset = (time / video.duration) * 100;
    marker.style.left = `${offset}%`;

    const markerData = { time, comments: groupedComments };
    marker.title = `${formatTime(time)} • ${groupedComments.length} comment(s)`;

    marker.addEventListener("mouseenter", () => {
      showMarkerPreview(marker.getBoundingClientRect(), markerData);
    });
    marker.addEventListener("mouseleave", () => {
      hideMarkerPreview();
    });
    marker.addEventListener("click", (event) => {
      event.preventDefault();
      event.stopPropagation();
      const currentVideo = getVideo();
      if (currentVideo) {
        currentVideo.currentTime = time;
      }
    });

    bar.appendChild(marker);
  });
}

function startMonitoring() {
  monitoringInitialized = true;
  const video = document.querySelector("video");
  videoContainer = getOverlayHost() || document.querySelector("#container .html5-video-player");

  if (!video) {
    return;
  }

  video.ontimeupdate = () => {
    if (isAdPlaying()) {
      return;
    }
    scheduleReconcile(video.currentTime);
  };

  video.onseeking = () => {
    if (isAdPlaying()) {
      return;
    }
    scheduleReconcile(video.currentTime);
    debugLog("Seek reconcile", video.currentTime);
  };

  video.onseeked = () => {
    if (isAdPlaying()) {
      return;
    }
    scheduleReconcile(video.currentTime);
  };

  video.onplay = () => {
    if (isAdPlaying()) {
      return;
    }
    scheduleReconcile(video.currentTime);
  };
}

function removeCardState(cardState) {
  const index = activeCards.indexOf(cardState);
  if (index >= 0) {
    activeCards.splice(index, 1);
  }
  if (cardState?.commentId) {
    activeCardByCommentId.delete(cardState.commentId);
  }
}

function beginCardHide(cardState) {
  if (!cardState || cardState.phase !== "visible") {
    removeCardState(cardState);
    return;
  }
  if (!cardState.card.isConnected) {
    removeCardState(cardState);
    return;
  }

  cardState.phase = "hiding";
  cardState.card.classList.remove("visible");
  cardState.card.classList.add("hiding");

  setTimeout(() => {
    if (cardState.card.parentElement) {
      cardState.card.remove();
    }
    removeCardState(cardState);
  }, 320);
}

function isAdPlaying() {
  const adPlaying = Boolean(
    videoContainer &&
      (videoContainer.classList.contains("ad-showing") ||
        videoContainer.classList.contains("ad-interrupting"))
  );
  if (adPlaying) {
    hideOverlay();
  }
  return adPlaying;
}

function reconcileVisibleComments(currentTime) {
  if (!isActive || notificationsMutedByEye || !overlayElement) {
    setUpcomingDotVisible(false);
    return;
  }
  if (!ensureOverlayAttached()) {
    setUpcomingDotVisible(false);
    return;
  }

  const visibleKeys = new Set();
  let hasUpcomingWarning = false;
  const pendingToShow = [];
  const playbackRate = getActivePlaybackRate();

  for (const comment of comments) {
    const commentKey = getCommentKey(comment);
    const triggerTime = earlyModeEnabled
      ? Math.max(0, comment.time - earlySeconds)
      : comment.time;
    const warningTime = Math.max(0, triggerTime - 3);

    if (currentTime >= warningTime && currentTime < triggerTime) {
      hasUpcomingWarning = true;
    }

    const commentVisibleDuration = getCommentDisplayDurationSeconds(comment, playbackRate);
    const shouldForceVisible = isContextuallyVisible(commentKey, currentTime);
    if (
      shouldForceVisible ||
      (currentTime >= triggerTime && currentTime < comment.time + commentVisibleDuration)
    ) {
      visibleKeys.add(commentKey);

      if (!activeCardByCommentId.has(commentKey)) {
        pendingToShow.push(comment);
      }
    }
  }

  pendingToShow.sort((a, b) => {
    const triggerA = earlyModeEnabled ? Math.max(0, a.time - earlySeconds) : a.time;
    const triggerB = earlyModeEnabled ? Math.max(0, b.time - earlySeconds) : b.time;
    if (triggerA !== triggerB) {
      return triggerA - triggerB;
    }
    return compareByPriority(a, b);
  });

  for (const comment of pendingToShow) {
    const accentDelayMs = Math.max(0, (comment.time - currentTime) * 1000);
    showOverlay(comment, accentDelayMs);
  }

  for (const cardState of [...activeCards]) {
    if (!visibleKeys.has(cardState.commentId)) {
      beginCardHide(cardState);
    }
  }

  const shouldShowWarningDot = hasUpcomingWarning && activeCards.length === 0;
  setUpcomingDotVisible(shouldShowWarningDot);
}

function showOverlay(comment, accentDelayMs = 0) {
  if (!overlayElement || !isActive) {
    return;
  }
  if (!ensureOverlayAttached()) {
    return;
  }
  const commentId = getCommentKey(comment);
  if (activeCardByCommentId.has(commentId)) {
    return;
  }
  const targetCorner = resolveCommentCorner(comment);
  const lane = getLaneElement(targetCorner);
  if (!lane) {
    return;
  }

  const card = document.createElement("div");
  card.className = "overlay-comment";
  if (CARD_DRAG_ENABLED && !routingEnabled) {
    card.classList.add("draggable-position");
  }
  const likesCount = Number(comment?.likes || 0);
  const tierRank = getTierRank(likesCount);
  const tierName = getTierName(tierRank);
  if (tierRank > 0) {
    card.classList.add(`${tierName}-liked`);
    if (tierName === "gold") {
      card.classList.add("top-liked");
    } else if (tierName === "diamond") {
      card.classList.add("diamond-liked");
    }
  }
  card.style.order = String(getTierOrderForCorner(targetCorner, tierRank));
  if (CARD_DRAG_ENABLED) {
    card.addEventListener("pointerdown", (event) => {
      startCardDrag(event, card, targetCorner);
    });
  }
  card.addEventListener("click", (event) => {
    if (Date.now() < suppressCardClickUntil) {
      event.preventDefault();
      event.stopPropagation();
      return;
    }
    event.preventDefault();
    event.stopPropagation();
    const seekResult = seekToCommentContext(comment, CLICK_CONTEXT_SECONDS);
    if (seekResult) {
      setContextualVisibilityLock(comment, seekResult.anchorTime, CLICK_CONTEXT_SECONDS);
      scheduleReconcile(seekResult.targetTime);
    }
  });

  const avatar = document.createElement("img");
  avatar.className = "comment-avatar";
  avatar.src = comment.avatar;

  const content = document.createElement("div");
  content.className = "comment-content";

  const textElement = document.createElement("span");
  textElement.className = "comment-text";
  appendCommentTextWithTimestampHighlights(textElement, comment.text);
  content.appendChild(textElement);
  if (showLikesInNotifications) {
    const likesCount = Number(comment?.likes || 0);
    if (likesCount > 0) {
      const likesElement = document.createElement("span");
      likesElement.className = "comment-likes";
      likesElement.textContent = `Likes ${formatLikesLabel(likesCount)}`;
      content.appendChild(likesElement);
    }
  }
  card.append(avatar, content);
  const isTopCorner = targetCorner === "top-left" || targetCorner === "top-right";
  const shouldPrepend = isTopCorner !== reverseStackOrder;
  if (shouldPrepend) {
    lane.prepend(card);
  } else {
    lane.appendChild(card);
  }

  requestAnimationFrame(() => {
    card.classList.add("visible");
  });
  const playbackRate = getActivePlaybackRate();

  if (earlyModeEnabled && timestampAccentEffect !== "none") {
    const effectClass = `accent-${timestampAccentEffect}`;
    const delay = Math.max(0, Math.min(getDisplayDurationMs(comment, playbackRate), accentDelayMs));
    setTimeout(() => {
      card.classList.add(effectClass);
      setTimeout(() => {
        card.classList.remove(effectClass);
      }, 1300);
    }, delay);
  }
  const cardState = {
    commentId,
    card,
    phase: "visible",
    remainingMs: getDisplayDurationMs(comment, playbackRate),
    hideTimeoutId: null,
    hideStartedAt: Date.now()
  };
  activeCards.push(cardState);
  activeCardByCommentId.set(commentId, cardState);
}

function hideOverlay() {
  if (!overlayElement) {
    cancelCardDrag();
    return;
  }
  cancelCardDrag();
  for (const cardState of activeCards) {
    if (cardState.hideTimeoutId) {
      clearTimeout(cardState.hideTimeoutId);
      cardState.hideTimeoutId = null;
    }
  }
  activeCards = [];
  activeCardByCommentId.clear();
  contextualVisibilityLocks.clear();
  if (upcomingDotElement && upcomingDotElement.parentElement) {
    upcomingDotElement.remove();
  }
  upcomingDotElement = null;
  overlayElement.querySelectorAll(".overlay-comment").forEach((card) => {
    card.remove();
  });
}

function changePosition(newPosition) {
  if (!overlayElement) {
    return;
  }
  position = newPosition;
  freePositionEnabled = false;
  freePositionX = DEFAULT_FREE_POSITION_X;
  freePositionY = DEFAULT_FREE_POSITION_Y;
  try {
    const maybePromise = chrome.storage.sync.set({
      freePositionEnabled: false,
      freePositionX: DEFAULT_FREE_POSITION_X,
      freePositionY: DEFAULT_FREE_POSITION_Y
    });
    if (maybePromise && typeof maybePromise.catch === "function") {
      maybePromise.catch(() => {});
    }
  } catch (error) {
    // Ignore transient context errors while navigating.
  }
  updateLaneVisibility();
  updateEyeToggleVisibility();
  setUpcomingDotVisible(false);
}

async function getCommentPosition() {
  const value = await chrome.storage.sync.get("position");
  return value?.position ? value.position : "bottom-left";
}

function getTimeInSeconds(timestampText) {
  let total = 0;
  try {
    const parts = timestampRegex.exec(timestampText)[0].split(":").reverse();
    if (parts[0]) {
      total += parseInt(parts[0], 10);
    }
    if (parts[1]) {
      total += parseInt(parts[1], 10) * 60;
    }
    if (parts[2]) {
      total += parseInt(parts[2], 10) * 3600;
    }
  } catch (error) {
    return null;
  }
  return total;
}

async function isActiveFunc() {
  const value = await chrome.storage.sync.get("active");
  return value?.active === undefined || value?.active === null || value.active;
}

function resetVariables() {
  monitoringInitialized = false;
  comments = [];
  commentsLoadComplete = false;
  cancelCardDrag();
  suppressCardClickUntil = 0;
  suppressGlobalClickUntil = 0;
  freePositionEnabled = DEFAULT_FREE_POSITION_ENABLED;
  freePositionX = DEFAULT_FREE_POSITION_X;
  freePositionY = DEFAULT_FREE_POSITION_Y;
  activeCards = [];
  activeCardByCommentId = new Map();
  contextualVisibilityLocks = new Map();
  if (eyeToggleElement && eyeToggleElement.parentElement) {
    eyeToggleElement.remove();
  }
  upcomingDotElement = null;
  eyeToggleElement = null;
  if (eyeMountRetryIntervalId !== null) {
    clearInterval(eyeMountRetryIntervalId);
    eyeMountRetryIntervalId = null;
  }
  if (eyeMountHeartbeatIntervalId !== null) {
    clearInterval(eyeMountHeartbeatIntervalId);
    eyeMountHeartbeatIntervalId = null;
  }
  isVideoHovering = false;
  reconcileRafId = null;
  pendingReconcileTime = null;
  renderMarkersRafId = null;
  laneElements = new Map();
  topLikedThreshold = 0;
  platinumLikedThreshold = Number.POSITIVE_INFINITY;
  diamondLikedThreshold = Number.POSITIVE_INFINITY;
  purpleLikedThreshold = Number.POSITIVE_INFINITY;
  rubyLikedThreshold = Number.POSITIVE_INFINITY;
  clearMarkers();
  hideOverlay();
}

window.addEventListener("load", async () => {
  await main();
});

locationChange(() => {
  main();
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  sendResponse(true);

  if (message.type === "position") {
    changePosition(message.newPosition);
    const video = getVideo();
    if (video && !isAdPlaying()) {
      scheduleReconcile(video.currentTime);
    }
    return;
  }

  if (message.type === "isActive") {
    isActive = message.status;
    if (!isActive) {
      hideOverlay();
    } else {
      const video = getVideo();
      if (video) {
        scheduleReconcile(video.currentTime);
      }
    }
    updateEyeToggleVisibility();
    return;
  }

  if (message.type === "overlaySettings") {
    const previousDisplayDuration = displayDuration;
    const previousEarlyModeEnabled = earlyModeEnabled;
    const previousEarlySeconds = earlySeconds;
    const previousFollowPlaybackSpeed = followPlaybackSpeed;
    overlayScale = clamp(
      Number(message.overlayScale ?? overlayScale),
      MIN_OVERLAY_SCALE,
      MAX_OVERLAY_SCALE
    );
    displayDuration = clamp(
      Number(message.displayDuration ?? displayDuration),
      MIN_DISPLAY_DURATION,
      MAX_DISPLAY_DURATION
    );
    overlayRadius = clamp(
      Number(message.overlayRadius ?? overlayRadius),
      MIN_OVERLAY_RADIUS,
      MAX_OVERLAY_RADIUS
    );
    overlayAvatarSize = clamp(
      Number(message.overlayAvatarSize ?? overlayAvatarSize),
      MIN_OVERLAY_AVATAR_SIZE,
      MAX_OVERLAY_AVATAR_SIZE
    );
    overlayGlassiness = clamp(
      Number(message.overlayGlassiness ?? overlayGlassiness),
      MIN_OVERLAY_GLASSINESS,
      MAX_OVERLAY_GLASSINESS
    );
    overlayDarkness = clamp(
      Number(message.overlayDarkness ?? overlayDarkness),
      MIN_OVERLAY_DARKNESS,
      MAX_OVERLAY_DARKNESS
    );
    debugMode = Boolean(message.debugMode ?? debugMode);
    earlyModeEnabled = Boolean(message.earlyModeEnabled ?? earlyModeEnabled);
    followPlaybackSpeed = Boolean(message.followPlaybackSpeed ?? followPlaybackSpeed);
    earlySeconds = clamp(
      Number(message.earlySeconds ?? earlySeconds),
      MIN_EARLY_SECONDS,
      MAX_EARLY_SECONDS
    );
    timestampAccentEffect = String(message.timestampAccentEffect ?? timestampAccentEffect);
    reverseStackOrder = Boolean(message.reverseStackOrder ?? reverseStackOrder);
    priorityScoringEnabled = Boolean(
      message.priorityScoringEnabled ?? priorityScoringEnabled
    );
    priorityLikesWeight = clamp(
      Number(message.priorityLikesWeight ?? priorityLikesWeight),
      MIN_PRIORITY_LIKES_WEIGHT,
      MAX_PRIORITY_LIKES_WEIGHT
    );
    topLikedThresholdPercent = clamp(
      Number(message.topLikedThresholdPercent ?? topLikedThresholdPercent),
      MIN_TOP_LIKED_THRESHOLD_PERCENT,
      MAX_TOP_LIKED_THRESHOLD_PERCENT
    );
    popularityModeEnabled = Boolean(
      message.popularityModeEnabled ?? popularityModeEnabled
    );
    heatmapEnabled = Boolean(message.heatmapEnabled ?? heatmapEnabled);
    heatmapIntensity = clamp(
      Number(message.heatmapIntensity ?? heatmapIntensity),
      MIN_HEATMAP_INTENSITY,
      MAX_HEATMAP_INTENSITY
    );
    routingEnabled = Boolean(message.routingEnabled ?? routingEnabled);
    routingThreshold = clamp(
      Number(message.routingThreshold ?? routingThreshold),
      MIN_ROUTING_THRESHOLD,
      MAX_ROUTING_THRESHOLD
    );
    routingShortCorner = normalizeCorner(
      String(message.routingShortCorner ?? routingShortCorner),
      routingShortCorner
    );
    routingLongCorner = normalizeCorner(
      String(message.routingLongCorner ?? routingLongCorner),
      routingLongCorner
    );
    const messagePresetProfile = String(message.presetProfile ?? "");
    showLikesInNotifications =
      messagePresetProfile === "minimal"
        ? false
        : Boolean(message.showLikesInNotifications ?? showLikesInNotifications);
    showUpcomingDot = Boolean(
      message.showUpcomingDot ?? showUpcomingDot
    );
    recomputeLikeTierThresholds();
    applyOverlayStyles();
    scheduleRenderTimeMarkers();
    const timingBehaviorChanged =
      previousDisplayDuration !== displayDuration ||
      previousEarlyModeEnabled !== earlyModeEnabled ||
      previousEarlySeconds !== earlySeconds ||
      previousFollowPlaybackSpeed !== followPlaybackSpeed;
    const video = getVideo();
    if (video && !isAdPlaying() && timingBehaviorChanged) {
      scheduleReconcile(video.currentTime);
    }
    updateEyeToggleVisibility();
    return;
  }

  if (message.type === "comments_filter_settings_changed") {
    debugLog("Comment filter changed, force refreshing comments");
    const videoId = getVideoId();
    if (videoId) {
      chrome.runtime.sendMessage({ type: "comments", video_id: videoId, forceRefresh: true });
    }
    return;
  }

  if (message.type === "comments_replace") {
    comments = message.comments || [];
    commentsLoadComplete = message.complete === undefined ? true : Boolean(message.complete);
    comments.sort((a, b) => {
      if (a.time !== b.time) {
        return a.time - b.time;
      }
      return compareByPriority(a, b);
    });
    recomputeLikeTierThresholds();
    hideOverlay();
    scheduleRenderTimeMarkers();
    if (monitoringInitialized === false) {
      startMonitoring();
    }
    const video = getVideo();
    if (video && !isAdPlaying()) {
      scheduleReconcile(video.currentTime);
    }
    return;
  }

  if (message.type === "comments_update") {
    comments.push(...(message.comments || []));
    if (message.complete !== undefined) {
      commentsLoadComplete = Boolean(message.complete);
    }
    comments.sort((a, b) => {
      if (a.time !== b.time) {
        return a.time - b.time;
      }
      return compareByPriority(a, b);
    });
    recomputeLikeTierThresholds();
    scheduleRenderTimeMarkers();
    if (monitoringInitialized === false) {
      startMonitoring();
    }
    const video = getVideo();
    if (video && !isAdPlaying()) {
      scheduleReconcile(video.currentTime);
    }
  }
});
