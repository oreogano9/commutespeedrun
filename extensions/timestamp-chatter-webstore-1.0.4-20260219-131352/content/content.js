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
let geometricTierRankByCommentSource = new Map();
let currentVideoId = null;
let laneElements = new Map();
let activeTierThresholds = Object.create(null);
let nonPopularityPrimaryThreshold = 0;
let nonPopularityEliteThreshold = Number.POSITIVE_INFINITY;
let eyeToggleElement = null;
let notificationsMutedByEye = false;
let isVideoHovering = false;
let reconcileRafId = null;
let pendingReconcileTime = null;
let renderMarkersRafId = null;
let eyeMountRetryIntervalId = null;
let eyeMountHeartbeatIntervalId = null;
let contextualVisibilityLocks = new Map();
let clickLandingRubberbandByCommentId = new Map();
let commentsLoadComplete = false;
let cardDragState = null;
let suppressCardClickUntil = 0;
let suppressGlobalClickUntil = 0;
let freePositionEnabled = false;
let freePositionX = 0;
let freePositionY = 0;
let commentsRequestRetryTimerId = null;
let autoSkinDetectTimerId = null;
let monitoredVideo = null;
let videoMonitorHandlers = null;

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
const DEFAULT_POPULARITY_MODE_ENABLED = true;
const DEFAULT_HEATMAP_ENABLED = true;
const DEFAULT_HEATMAP_INTENSITY = 500;
const DEFAULT_ROUTING_ENABLED = false;
const DEFAULT_ROUTING_THRESHOLD = 80;
const DEFAULT_ROUTING_SHORT_CORNER = "bottom-left";
const DEFAULT_ROUTING_LONG_CORNER = "top-right";
const DEFAULT_SHOW_LIKES_IN_NOTIFICATIONS = true;
const DEFAULT_SHOW_UPCOMING_DOT = true;
const DEFAULT_SHOW_RARITY_LABEL_IN_NOTIFICATIONS = true;
const DEFAULT_EXPERIMENTAL_GAME_SKIN_AUTO_ENABLED = true;
const DEFAULT_PRESET_PROFILE = "balanced";
const DEFAULT_RARITY_SKIN = "default";
const DEFAULT_RARITY_LOGIC_MODE = "thresholds";
const DEFAULT_RARITY_GEOMETRIC_RATIO = 2.23;
let DEFAULT_HIDDEN_RARITY_TIERS_BY_SKIN = Object.freeze({
  default: {},
  borderlands: {},
  borderlands2: {},
  minecraft: {},
  animalcrossing: {}
});
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
let showRarityLabelInNotifications = DEFAULT_SHOW_RARITY_LABEL_IN_NOTIFICATIONS;
let experimentalGameSkinAutoEnabled = DEFAULT_EXPERIMENTAL_GAME_SKIN_AUTO_ENABLED;
let raritySkin = DEFAULT_RARITY_SKIN;
let rarityLogicMode = DEFAULT_RARITY_LOGIC_MODE;
let rarityGeometricRatio = DEFAULT_RARITY_GEOMETRIC_RATIO;
let overlayRadiusBySkin = null;
let hiddenRarityTiersBySkin = DEFAULT_HIDDEN_RARITY_TIERS_BY_SKIN;
let commentScanStartDelaySec = 3;

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
const MIN_RARITY_GEOMETRIC_RATIO = 1.05;
const MAX_RARITY_GEOMETRIC_RATIO = 3.0;
const MIN_HEATMAP_INTENSITY = 10;
const MAX_HEATMAP_INTENSITY = 2000;
const MIN_ROUTING_THRESHOLD = 1;
const MAX_ROUTING_THRESHOLD = 5000;
const MIN_BORDERLANDS_UNCOMMON_TIER_LIKES = 5;
const MIN_BORDERLANDS_RARE_TIER_LIKES = 11;
const MIN_BORDERLANDS_EPIC_TIER_LIKES = 16;
const MIN_BORDERLANDS_LEGENDARY_YELLOW_TIER_LIKES = 50;
const MIN_BORDERLANDS_LEGENDARY_ORANGE_TIER_LIKES = 61;
const MIN_BORDERLANDS_LEGENDARY_DARK_ORANGE_TIER_LIKES = 66;
const MIN_BORDERLANDS_PEARLESCENT_TIER_LIKES = 101;
const MIN_BORDERLANDS2_UNCOMMON_TIER_LIKES = 5;
const MIN_BORDERLANDS2_RARE_TIER_LIKES = 11;
const MIN_BORDERLANDS2_CURSED_TIER_LIKES = 16;
const MIN_BORDERLANDS2_EPIC_TIER_LIKES = 24;
const MIN_BORDERLANDS2_ETECH_TIER_LIKES = 34;
const MIN_BORDERLANDS2_GEMSTONE_TIER_LIKES = 46;
const MIN_BORDERLANDS2_LEGENDARY_TIER_LIKES = 60;
const MIN_BORDERLANDS2_EFFERVESCENT_TIER_LIKES = 72;
const MIN_BORDERLANDS2_SERAPH_TIER_LIKES = 86;
const MIN_BORDERLANDS2_PEARLESCENT_TIER_LIKES = 101;
const MIN_MINECRAFT_UNCOMMON_TIER_LIKES = 5;
const MIN_MINECRAFT_RARE_TIER_LIKES = 11;
const MIN_MINECRAFT_EPIC_TIER_LIKES = 16;
const MIN_ANIMAL_LEAF_TIER_LIKES = 5;
const MIN_ANIMAL_BLOSSOM_TIER_LIKES = 11;
const MIN_ANIMAL_SKY_TIER_LIKES = 16;
const MIN_ANIMAL_SUNNY_TIER_LIKES = 24;
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
const CLICK_CONTEXT_SECONDS = 2;
const CLICK_LOCK_FUZZ_SECONDS = 0.35;
const LANDING_RUBBERBAND_FUZZ_SECONDS = 0.08;
const LANDING_RUBBERBAND_DURATION_MS = 1000;
const COMMENTS_REQUEST_INITIAL_DELAY_MS = 900;
const COMMENTS_REQUEST_RETRY_DELAYS_MS = [1800, 3500, 6000];
const AUTO_SKIN_DETECT_DELAY_MS = 1200;
const DEFAULT_COMMENT_SCAN_START_DELAY_SEC = 3;
const MIN_COMMENT_SCAN_START_DELAY_SEC = 0;
const MAX_COMMENT_SCAN_START_DELAY_SEC = 20;
const CARD_DRAG_ENABLED = false;
const CARD_DRAG_MOVE_THRESHOLD_PX = 10;
const CARD_DRAG_CLICK_SUPPRESS_MS = 320;
const FREE_POSITION_MARGIN_PX = 8;
const CORNERS = ["bottom-left", "bottom-right", "top-left", "top-right"];
let RARITY_SKIN_VALUES = ["default", "borderlands", "borderlands2", "minecraft", "animalcrossing"];
const RARITY_LOGIC_MODE_VALUES = ["thresholds", "percentile", "geometric"];
let RARITY_SKINS = {
  default: {
    tiers: [
      { key: "silver", heatmapWeight: 1, durationMultiplier: 1 },
      {
        key: "gold",
        percentileFactor: 1,
        minLikes: MIN_GOLD_TIER_LIKES,
        minGapFromPrevious: 1,
        heatmapWeight: 2,
        durationMultiplier: 1.12
      },
      {
        key: "platinum",
        percentileFactor: 0.72,
        minLikes: MIN_PLATINUM_TIER_LIKES,
        minGapFromPrevious: MIN_PLATINUM_TIER_GAP_FROM_GOLD,
        heatmapWeight: 2.55,
        durationMultiplier: 1.18
      }
    ],
    nonPopularityPrimaryTierKey: "gold",
    nonPopularityEliteTierKey: "platinum"
  },
  borderlands: {
    tiers: [
      { key: "common", heatmapWeight: 1, durationMultiplier: 1 },
      {
        key: "uncommon",
        percentileFactor: 2.2,
        minLikes: MIN_BORDERLANDS_UNCOMMON_TIER_LIKES,
        minGapFromPrevious: 2,
        heatmapWeight: 1.45,
        durationMultiplier: 1.06
      },
      {
        key: "rare",
        percentileFactor: 1.55,
        minLikes: MIN_BORDERLANDS_RARE_TIER_LIKES,
        minGapFromPrevious: 3,
        heatmapWeight: 1.9,
        durationMultiplier: 1.1
      },
      {
        key: "epic",
        percentileFactor: 1,
        minLikes: MIN_BORDERLANDS_EPIC_TIER_LIKES,
        minGapFromPrevious: 3,
        heatmapWeight: 2.45,
        durationMultiplier: 1.14
      },
      {
        key: "legendary-yellow",
        percentileFactor: 0.58,
        minLikes: MIN_BORDERLANDS_LEGENDARY_YELLOW_TIER_LIKES,
        minGapFromPrevious: 6,
        heatmapWeight: 3.35,
        durationMultiplier: 1.2
      },
      {
        key: "legendary-orange",
        percentileFactor: 0.42,
        minLikes: MIN_BORDERLANDS_LEGENDARY_ORANGE_TIER_LIKES,
        minGapFromPrevious: 6,
        heatmapWeight: 3.85,
        durationMultiplier: 1.24
      },
      {
        key: "legendary-dark-orange",
        percentileFactor: 0.3,
        minLikes: MIN_BORDERLANDS_LEGENDARY_DARK_ORANGE_TIER_LIKES,
        minGapFromPrevious: 4,
        heatmapWeight: 4.25,
        durationMultiplier: 1.29
      },
      {
        key: "pearlescent",
        percentileFactor: 0.18,
        minLikes: MIN_BORDERLANDS_PEARLESCENT_TIER_LIKES,
        minGapFromPrevious: 8,
        heatmapWeight: 4.85,
        durationMultiplier: 1.35
      }
    ],
    nonPopularityPrimaryTierKey: "epic",
    nonPopularityEliteTierKey: "legendary-dark-orange"
  },
  borderlands2: {
    tiers: [
      { key: "common", heatmapWeight: 1, durationMultiplier: 1 },
      {
        key: "uncommon",
        percentileFactor: 2.6,
        minLikes: MIN_BORDERLANDS2_UNCOMMON_TIER_LIKES,
        minGapFromPrevious: 2,
        heatmapWeight: 1.35,
        durationMultiplier: 1.05
      },
      {
        key: "rare",
        percentileFactor: 2.1,
        minLikes: MIN_BORDERLANDS2_RARE_TIER_LIKES,
        minGapFromPrevious: 2,
        heatmapWeight: 1.7,
        durationMultiplier: 1.08
      },
      {
        key: "cursed",
        percentileFactor: 1.8,
        minLikes: MIN_BORDERLANDS2_CURSED_TIER_LIKES,
        minGapFromPrevious: 3,
        heatmapWeight: 2.05,
        durationMultiplier: 1.11
      },
      {
        key: "epic",
        percentileFactor: 1.5,
        minLikes: MIN_BORDERLANDS2_EPIC_TIER_LIKES,
        minGapFromPrevious: 3,
        heatmapWeight: 2.45,
        durationMultiplier: 1.14
      },
      {
        key: "e-tech",
        percentileFactor: 1.2,
        minLikes: MIN_BORDERLANDS2_ETECH_TIER_LIKES,
        minGapFromPrevious: 4,
        heatmapWeight: 2.85,
        durationMultiplier: 1.18
      },
      {
        key: "gemstone",
        percentileFactor: 0.95,
        minLikes: MIN_BORDERLANDS2_GEMSTONE_TIER_LIKES,
        minGapFromPrevious: 4,
        heatmapWeight: 3.25,
        durationMultiplier: 1.21
      },
      {
        key: "legendary",
        percentileFactor: 0.7,
        minLikes: MIN_BORDERLANDS2_LEGENDARY_TIER_LIKES,
        minGapFromPrevious: 6,
        heatmapWeight: 3.65,
        durationMultiplier: 1.24
      },
      {
        key: "effervescent",
        percentileFactor: 0.52,
        minLikes: MIN_BORDERLANDS2_EFFERVESCENT_TIER_LIKES,
        minGapFromPrevious: 6,
        heatmapWeight: 4.05,
        durationMultiplier: 1.28
      },
      {
        key: "seraph",
        percentileFactor: 0.34,
        minLikes: MIN_BORDERLANDS2_SERAPH_TIER_LIKES,
        minGapFromPrevious: 7,
        heatmapWeight: 4.45,
        durationMultiplier: 1.32
      },
      {
        key: "pearlescent",
        percentileFactor: 0.18,
        minLikes: MIN_BORDERLANDS2_PEARLESCENT_TIER_LIKES,
        minGapFromPrevious: 9,
        heatmapWeight: 4.95,
        durationMultiplier: 1.36
      }
    ],
    nonPopularityPrimaryTierKey: "epic",
    nonPopularityEliteTierKey: "pearlescent"
  },
  minecraft: {
    tiers: [
      { key: "common", heatmapWeight: 1, durationMultiplier: 1 },
      {
        key: "uncommon",
        percentileFactor: 1.25,
        minLikes: MIN_MINECRAFT_UNCOMMON_TIER_LIKES,
        minGapFromPrevious: 2,
        heatmapWeight: 1.45,
        durationMultiplier: 1.06
      },
      {
        key: "rare",
        percentileFactor: 0.85,
        minLikes: MIN_MINECRAFT_RARE_TIER_LIKES,
        minGapFromPrevious: 3,
        heatmapWeight: 1.95,
        durationMultiplier: 1.12
      },
      {
        key: "epic",
        percentileFactor: 0.52,
        minLikes: MIN_MINECRAFT_EPIC_TIER_LIKES,
        minGapFromPrevious: 4,
        heatmapWeight: 2.55,
        durationMultiplier: 1.18
      }
    ],
    nonPopularityPrimaryTierKey: "rare",
    nonPopularityEliteTierKey: "epic"
  },
  animalcrossing: {
    tiers: [
      { key: "paper", heatmapWeight: 1, durationMultiplier: 1 },
      {
        key: "leaf",
        percentileFactor: 1.45,
        minLikes: MIN_ANIMAL_LEAF_TIER_LIKES,
        minGapFromPrevious: 2,
        heatmapWeight: 1.35,
        durationMultiplier: 1.05
      },
      {
        key: "blossom",
        percentileFactor: 1,
        minLikes: MIN_ANIMAL_BLOSSOM_TIER_LIKES,
        minGapFromPrevious: 3,
        heatmapWeight: 1.8,
        durationMultiplier: 1.1
      },
      {
        key: "sky",
        percentileFactor: 0.72,
        minLikes: MIN_ANIMAL_SKY_TIER_LIKES,
        minGapFromPrevious: 3,
        heatmapWeight: 2.2,
        durationMultiplier: 1.14
      },
      {
        key: "sunny",
        percentileFactor: 0.45,
        minLikes: MIN_ANIMAL_SUNNY_TIER_LIKES,
        minGapFromPrevious: 4,
        heatmapWeight: 2.75,
        durationMultiplier: 1.2
      }
    ],
    nonPopularityPrimaryTierKey: "blossom",
    nonPopularityEliteTierKey: "sunny"
  }
};

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

const rarityShared = globalThis.RaritySkinsShared || null;
const LOCAL_RARITY_CATALOG_KEY = rarityShared?.LOCAL_CATALOG_KEY || "raritySkinCatalogV2";
const LOCAL_RARITY_CATALOG_REVISION_KEY =
  rarityShared?.LOCAL_CATALOG_REVISION_KEY || "raritySkinCatalogRevision";
const SYNC_ACTIVE_RARITY_SKIN_ID_KEY =
  rarityShared?.SYNC_ACTIVE_SKIN_ID_KEY || "activeRaritySkinId";
const SYNC_HIDDEN_RARITY_TIERS_BY_SKIN_ID_KEY =
  rarityShared?.SYNC_HIDDEN_TIERS_BY_SKIN_ID_KEY || "hiddenRarityTiersBySkinId";
let raritySkinCatalog = rarityShared ? rarityShared.createBuiltInCatalog() : null;
let raritySkinCatalogRevision = 0;

function buildRuntimeSkinMapFromCatalog(catalog) {
  const normalized = rarityShared
    ? rarityShared.normalizeCatalog(catalog)
    : { skins: [] };
  const skinMap = {};
  normalized.skins.forEach((skin) => {
    skinMap[skin.id] = {
      id: skin.id,
      name: skin.name,
      styleFamily: skin.styleFamily || "glass",
      style: skin.style || {},
      tiers: (skin.tiers || []).map((tier) => ({
        key: tier.key,
        label: tier.label,
        bodyColor: tier.bodyColor,
        textColor: tier.textColor,
        borderColor: tier.borderColor,
        markerColor: tier.markerColor,
        markerWidthPx: Number(tier.markerWidthPx || 5),
        markerHeightPct: Number(tier.markerHeightPct || 120),
        markerOffsetTopPct: Number(tier.markerOffsetTopPct || -10),
        percentileFactor: Number(tier.percentileFactor || 1),
        minLikes: Number(tier.minLikes || 0),
        minGapFromPrevious: Number(tier.minGapFromPrevious || 0),
        minGapFromGold:
          tier.minGapFromPrimary === null || tier.minGapFromPrimary === undefined
            ? Number.NEGATIVE_INFINITY
            : Number(tier.minGapFromPrimary),
        minGapFromPrimary:
          tier.minGapFromPrimary === null || tier.minGapFromPrimary === undefined
            ? null
            : Number(tier.minGapFromPrimary),
        heatmapWeight: Number(tier.heatmapWeight || 1),
        durationMultiplier: Number(tier.durationMultiplier || 1),
        effects: Array.isArray(tier.effects)
          ? tier.effects.map((entry) => String(entry))
          : ["none"]
      })),
      nonPopularityPrimaryTierKey: skin.nonPopularityPrimaryTierKey,
      nonPopularityEliteTierKey: skin.nonPopularityEliteTierKey
    };
  });
  return {
    catalog: normalized,
    map: skinMap,
    ids: normalized.skins.map((skin) => skin.id)
  };
}

function refreshDefaultHiddenMapFromRuntime() {
  const next = {};
  RARITY_SKIN_VALUES.forEach((skinId) => {
    next[skinId] = {};
    const tiers = (RARITY_SKINS[skinId]?.tiers || []).map((tier) => tier.key);
    tiers.forEach((tierKey) => {
      next[skinId][tierKey] = Boolean(next[skinId][tierKey]);
    });
  });
  DEFAULT_HIDDEN_RARITY_TIERS_BY_SKIN = Object.freeze(next);
}

function applyCatalogToRuntime(catalog, preferredSkinId = raritySkin) {
  if (!rarityShared) {
    return;
  }
  const runtime = buildRuntimeSkinMapFromCatalog(catalog);
  raritySkinCatalog = runtime.catalog;
  RARITY_SKINS = runtime.map;
  RARITY_SKIN_VALUES = runtime.ids.length > 0 ? runtime.ids : [DEFAULT_RARITY_SKIN];
  refreshDefaultHiddenMapFromRuntime();
  raritySkin = normalizeRaritySkin(preferredSkinId || raritySkin);
}

function applyActiveSkinConfigOverride(activeSkinId, skinConfig) {
  if (!rarityShared || !skinConfig) {
    return;
  }
  const preferredId = String(activeSkinId || skinConfig?.id || raritySkin || DEFAULT_RARITY_SKIN);
  const nextCatalog = rarityShared.upsertSkin(
    raritySkinCatalog || rarityShared.createBuiltInCatalog(),
    skinConfig,
    preferredId
  );
  applyCatalogToRuntime(nextCatalog, preferredId);
}

function normalizeRaritySkin(value) {
  return RARITY_SKIN_VALUES.includes(value) ? value : DEFAULT_RARITY_SKIN;
}

function normalizeRarityLogicMode(value) {
  return RARITY_LOGIC_MODE_VALUES.includes(value) ? value : DEFAULT_RARITY_LOGIC_MODE;
}

function normalizeHiddenRarityTiersBySkin(value) {
  const source =
    value && typeof value === "object" && !Array.isArray(value)
      ? value
      : DEFAULT_HIDDEN_RARITY_TIERS_BY_SKIN;
  const result = {};
  for (const skin of RARITY_SKIN_VALUES) {
    const skinMap =
      source[skin] && typeof source[skin] === "object" && !Array.isArray(source[skin])
        ? source[skin]
        : {};
    result[skin] = {};
    const tiers = (RARITY_SKINS[skin]?.tiers || []).map((tier) => tier.key);
    tiers.forEach((tierKey) => {
      result[skin][tierKey] = Boolean(skinMap[tierKey]);
    });
  }
  return result;
}

function normalizeRadiusValue(value, fallback = DEFAULT_OVERLAY_RADIUS) {
  return clamp(Number(value ?? fallback), MIN_OVERLAY_RADIUS, MAX_OVERLAY_RADIUS);
}

function normalizeOverlayRadiusBySkin(value, fallbackRadius = DEFAULT_OVERLAY_RADIUS) {
  const source =
    value && typeof value === "object" && !Array.isArray(value)
      ? value
      : {};
  const fallback = normalizeRadiusValue(fallbackRadius, DEFAULT_OVERLAY_RADIUS);
  const result = {};
  for (const skin of RARITY_SKIN_VALUES) {
    result[skin] = normalizeRadiusValue(source[skin], fallback);
  }
  return result;
}

function getOverlayRadiusForSkin(skin) {
  const normalizedSkin = normalizeRaritySkin(skin);
  if (overlayRadiusBySkin && typeof overlayRadiusBySkin === "object") {
    const saved = overlayRadiusBySkin[normalizedSkin];
    if (saved !== undefined && saved !== null) {
      return normalizeRadiusValue(saved, overlayRadius);
    }
  }
  const configRadius = Number(RARITY_SKINS?.[normalizedSkin]?.style?.radius);
  if (Number.isFinite(configRadius)) {
    return normalizeRadiusValue(configRadius, overlayRadius);
  }
  return normalizeRadiusValue(overlayRadius, DEFAULT_OVERLAY_RADIUS);
}

function getRaritySkinConfig() {
  return RARITY_SKINS[normalizeRaritySkin(raritySkin)] || RARITY_SKINS[DEFAULT_RARITY_SKIN];
}

function getTierConfigs() {
  return getRaritySkinConfig().tiers || RARITY_SKINS.default.tiers;
}

function getTierKeys() {
  return getTierConfigs().map((tier) => tier.key);
}

function getTierConfigByKey(key) {
  return getTierConfigs().find((tier) => tier.key === key) || null;
}

function getTierEffectsStartRank() {
  const tierCount = getTierKeys().length;
  return Math.max(1, Math.floor(tierCount / 2));
}

function isTierEffectsEnabled(tierRank, tierName) {
  const tierConfig = getTierConfigByKey(tierName);
  if (typeof tierConfig?.effectsEnabled === "boolean") {
    return tierConfig.effectsEnabled;
  }
  return Number(tierRank) >= getTierEffectsStartRank();
}

function getTierThresholdByKey(tierKey) {
  const value = Number(activeTierThresholds[tierKey]);
  if (!Number.isFinite(value)) {
    return Number.POSITIVE_INFINITY;
  }
  return value;
}

function getNonPopularityTierKeys() {
  const config = getRaritySkinConfig();
  const tierKeys = getTierKeys();
  const defaultPrimary = tierKeys[Math.min(1, Math.max(0, tierKeys.length - 1))] || tierKeys[0];
  const defaultElite = tierKeys[Math.max(0, tierKeys.length - 1)] || defaultPrimary;
  return {
    base: tierKeys[0] || "silver",
    primary:
      config.nonPopularityPrimaryTierKey && tierKeys.includes(config.nonPopularityPrimaryTierKey)
        ? config.nonPopularityPrimaryTierKey
        : defaultPrimary,
    elite:
      config.nonPopularityEliteTierKey && tierKeys.includes(config.nonPopularityEliteTierKey)
        ? config.nonPopularityEliteTierKey
        : defaultElite
  };
}

function debugLog(...args) {
  if (debugMode) {
    console.log("[TimestampChatter]", ...args);
  }
}

function isExtensionContextInvalidatedError(error) {
  const message = String(error?.message || error || "");
  return message.toLowerCase().includes("extension context invalidated");
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
  const tierKeys = getTierKeys();
  if (tierKeys.length === 0) {
    return "silver";
  }
  const safeRank = clamp(Number(tierRank) || 0, 0, tierKeys.length - 1);
  if (!popularityModeEnabled) {
    const collapsedKeys = getNonPopularityTierKeys();
    if (safeRank >= 2) {
      return collapsedKeys.elite;
    }
    if (safeRank >= 1) {
      return collapsedKeys.primary;
    }
    return collapsedKeys.base;
  }
  return tierKeys[safeRank] || tierKeys[0];
}

function getHiddenTierMapForCurrentSkin() {
  const skin = normalizeRaritySkin(raritySkin);
  const fallback = DEFAULT_HIDDEN_RARITY_TIERS_BY_SKIN[skin] || {};
  if (!hiddenRarityTiersBySkin || typeof hiddenRarityTiersBySkin !== "object") {
    return fallback;
  }
  const value = hiddenRarityTiersBySkin[skin];
  return value && typeof value === "object" ? value : fallback;
}

function isCommentTierHidden(comment) {
  const likesCount = Number(comment?.likes || 0);
  const tierName = getTierName(getTierRank(likesCount, comment));
  return Boolean(getHiddenTierMapForCurrentSkin()[tierName]);
}

function getTierDisplayName(tierName) {
  const tierConfig = getTierConfigByKey(tierName);
  if (tierConfig?.label) {
    return String(tierConfig.label);
  }
  return String(tierName || "Rarity");
}

function getTierDurationMultiplier(tierRank) {
  const tierName = getTierName(tierRank);
  const tierConfig = getTierConfigByKey(tierName);
  return Number(tierConfig?.durationMultiplier) || 1;
}

function getCommentDisplayDurationSeconds(comment, playbackRate = 1) {
  const baseSeconds = getBaseDisplayDurationSeconds();
  const likesCount = Number(comment?.likes || 0);
  const tierRank = getTierRank(likesCount, comment);
  const tierDurationSeconds = baseSeconds * getTierDurationMultiplier(tierRank);
  if (followPlaybackSpeed) {
    return tierDurationSeconds;
  }
  return tierDurationSeconds * playbackRate;
}

function getDisplayDurationMs(comment = null, playbackRate = 1) {
  return Math.round(getCommentDisplayDurationSeconds(comment, playbackRate) * 1000);
}

function getCurrentSkinStyleConfig() {
  const skinConfig = getRaritySkinConfig();
  return skinConfig?.style || {};
}

function getTierEffects(tierConfig, tierRank = 0) {
  const configured = Array.isArray(tierConfig?.effects)
    ? tierConfig.effects.map((entry) => String(entry).toLowerCase())
    : [];
  const filtered = configured.filter((entry) => entry && entry !== "none");
  if (filtered.length > 0) {
    return filtered;
  }
  return isTierEffectsEnabled(tierRank, tierConfig?.key) ? ["glow"] : [];
}

function applyTierCardVisualStyle(card, tierConfig, tierRank = 0) {
  if (!card || !tierConfig) {
    return;
  }
  // Revert to legacy CSS-driven visuals: clear dynamic inline overrides.
  card.style.removeProperty("--overlay-tier-scale");
  card.style.background = "";
  card.style.color = "";
  card.style.borderRadius = "";
  card.style.borderStyle = "";
  card.style.borderWidth = "";
  card.style.borderColor = "";
  card.style.boxShadow = "";

  card.classList.remove("tier-effects-disabled");
  card.classList.remove("effect-glow", "effect-pulse", "effect-rainbow-cycle", "effect-sheen");
}

function applyTierMarkerVisualStyle(marker, tierConfig, tierRank = 0) {
  if (!marker || !tierConfig) {
    return;
  }
  // Revert to legacy CSS-driven marker visuals.
  marker.style.width = "";
  marker.style.minWidth = "";
  marker.style.height = "";
  marker.style.top = "";
  marker.style.background = "";
  marker.style.borderRadius = "";
  marker.classList.remove("effect-glow", "effect-pulse", "effect-rainbow-cycle", "effect-sheen");
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

function safeInsertBefore(parentNode, nodeToInsert, referenceNode) {
  if (!parentNode || !nodeToInsert) {
    return;
  }
  const safeReferenceNode =
    referenceNode && referenceNode.parentNode === parentNode ? referenceNode : null;
  parentNode.insertBefore(nodeToInsert, safeReferenceNode);
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
      safeInsertBefore(mountTarget, eyeToggleElement, anchor || null);
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
      safeInsertBefore(mountTarget, eyeToggleElement, anchor || null);
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
  safeInsertBefore(mountTarget, eyeToggleElement, anchor || null);
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
  if (!host || host.dataset.tcHoverBound === "1") {
    return;
  }
  host.dataset.tcHoverBound = "1";
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

function getCommentSourceKey(comment) {
  if (comment?.sourceId !== undefined && comment?.sourceId !== null) {
    return `src:${String(comment.sourceId)}`;
  }
  if (comment?.id !== undefined && comment?.id !== null) {
    return `id:${String(comment.id)}`;
  }
  return `fallback:${String(comment?.time || 0)}:${String(comment?.name || "")}:${String(comment?.text || "")}`;
}

function normalizeCorner(value, fallback) {
  return CORNERS.includes(value) ? value : fallback;
}

function detectYouTubeGameMetadataText() {
  const rowSelectors = [
    "ytd-watch-metadata ytd-metadata-row-renderer",
    "ytd-video-secondary-info-renderer ytd-metadata-row-renderer"
  ];
  for (const selector of rowSelectors) {
    const rows = document.querySelectorAll(selector);
    for (const row of rows) {
      const title =
        row.querySelector("#title")?.textContent?.trim() ||
        row.querySelector("h4")?.textContent?.trim() ||
        "";
      if (!title || !/game/i.test(title)) {
        continue;
      }
      const value =
        row.querySelector("#contents")?.textContent?.trim() ||
        row.querySelector("#subtitle")?.textContent?.trim() ||
        row.textContent?.trim() ||
        "";
      if (value) {
        return value;
      }
    }
  }

  const genreMeta =
    document.querySelector('meta[itemprop="genre"]')?.getAttribute("content") ||
    "";
  if (genreMeta && /game|gaming/i.test(genreMeta)) {
    return genreMeta;
  }
  return "";
}

function getPriorityScore(comment) {
  if (!priorityScoringEnabled) {
    return 0;
  }
  const likes = Number(comment?.likes || 0);
  return likes * priorityLikesWeight;
}

function collectUniqueSortedLikes(sourceComments, includeZero = false) {
  const likeBySource = new Map();
  (sourceComments || []).forEach((comment) => {
    const sourceKey = comment?.sourceId || comment?.id;
    const likes = Number(comment?.likes || 0);
    if (!sourceKey || !Number.isFinite(likes)) {
      return;
    }
    if (!includeZero && likes <= 0) {
      return;
    }
    const previous = likeBySource.get(sourceKey) || 0;
    if (likes > previous) {
      likeBySource.set(sourceKey, likes);
    }
  });

  return [...likeBySource.values()].sort((a, b) => b - a);
}

function allocateIntegersByWeights(total, weights) {
  const count = Math.max(0, Math.floor(Number(total || 0)));
  if (count <= 0 || !Array.isArray(weights) || weights.length === 0) {
    return new Array(Array.isArray(weights) ? weights.length : 0).fill(0);
  }
  const normalizedWeights = weights.map((weight) => Math.max(0, Number(weight) || 0));
  const weightSum = normalizedWeights.reduce((sum, weight) => sum + weight, 0);
  if (!Number.isFinite(weightSum) || weightSum <= 0) {
    return new Array(normalizedWeights.length).fill(0);
  }
  const exact = normalizedWeights.map((weight) => (count * weight) / weightSum);
  const base = exact.map((value) => Math.floor(value));
  const result = base.slice();
  let remaining = count - base.reduce((sum, value) => sum + value, 0);
  const fractions = exact
    .map((value, index) => ({ index, fractional: value - base[index] }))
    .sort((a, b) => b.fractional - a.fractional);
  for (let index = 0; index < fractions.length && remaining > 0; index += 1) {
    result[fractions[index].index] += 1;
    remaining -= 1;
  }
  return result;
}

function geometricWeights(count, ratio) {
  const size = Math.max(0, Math.floor(Number(count || 0)));
  const safeRatio = clamp(
    Number(ratio || DEFAULT_RARITY_GEOMETRIC_RATIO),
    MIN_RARITY_GEOMETRIC_RATIO,
    MAX_RARITY_GEOMETRIC_RATIO
  );
  return Array.from({ length: size }, (_, index) => Math.pow(safeRatio, index));
}

function computeGeometricCountsHighToLow(totalItems, tierCount, ratio) {
  const total = Math.max(0, Math.floor(Number(totalItems || 0)));
  const count = Math.max(1, Math.floor(Number(tierCount || 0)));
  const safeRatio = clamp(
    Number(ratio || DEFAULT_RARITY_GEOMETRIC_RATIO),
    MIN_RARITY_GEOMETRIC_RATIO,
    MAX_RARITY_GEOMETRIC_RATIO
  );
  const counts = new Array(count).fill(0);
  if (total <= 0) {
    return counts;
  }
  if (total <= count) {
    for (let index = 0; index < total; index += 1) {
      counts[index] = 1;
    }
    return counts;
  }

  for (let index = 0; index < count; index += 1) {
    counts[index] = 1;
  }
  counts[0] = 1;
  const extras = total - count;
  const extraWeights = new Array(Math.max(0, count - 1))
    .fill(0)
    .map((_, index) => Math.pow(safeRatio, index));
  const allocatedExtras = allocateIntegersByWeights(extras, extraWeights);
  for (let index = 1; index < count; index += 1) {
    counts[index] += Number(allocatedExtras[index - 1] || 0);
  }
  return counts;
}

function computeGeometricTierThresholds(sortedLikes, tierConfigs, ratio) {
  const thresholds = Object.create(null);
  const tiers = Array.isArray(tierConfigs) ? tierConfigs : [];
  const likes = Array.isArray(sortedLikes) ? sortedLikes : [];
  if (tiers.length === 0) {
    return thresholds;
  }
  thresholds[tiers[0].key] = 0;
  if (likes.length === 0) {
    tiers.slice(1).forEach((tierConfig) => {
      thresholds[tierConfig.key] = Number.POSITIVE_INFINITY;
    });
    return thresholds;
  }

  const highToLowCounts = computeGeometricCountsHighToLow(likes.length, tiers.length, ratio);
  const lowToHighCounts = highToLowCounts.slice().reverse();
  for (let index = 1; index < tiers.length; index += 1) {
    const countForTierAndAbove = lowToHighCounts
      .slice(index)
      .reduce((sum, value) => sum + Number(value || 0), 0);
    if (countForTierAndAbove <= 0) {
      thresholds[tiers[index].key] = Number.POSITIVE_INFINITY;
      continue;
    }
    const rankIndex = Math.max(0, Math.min(likes.length - 1, countForTierAndAbove - 1));
    thresholds[tiers[index].key] = Number(likes[rankIndex] || 0);
  }
  return thresholds;
}

function buildUniqueCommentLikeEntries(sourceComments) {
  const bySource = new Map();
  for (const comment of sourceComments || []) {
    const sourceKey = getCommentSourceKey(comment);
    if (!sourceKey) {
      continue;
    }
    const likes = Number(comment?.likes || 0);
    if (!Number.isFinite(likes)) {
      continue;
    }
    const previous = bySource.get(sourceKey);
    if (!previous || likes > previous.likes) {
      bySource.set(sourceKey, { sourceKey, likes });
    }
  }
  return [...bySource.values()];
}

function computeGeometricTierRanksBySource(sourceComments) {
  const tierCount = getTierKeys().length;
  const result = new Map();
  if (tierCount <= 0) {
    return result;
  }
  const entries = buildUniqueCommentLikeEntries(sourceComments);
  const total = entries.length;
  if (total <= 0) {
    return result;
  }

  const quotasQualityOrder = allocateIntegersByWeights(
    total,
    geometricWeights(tierCount, rarityGeometricRatio)
  );
  const oneLike = [];
  const rest = [];
  for (const entry of entries) {
    if (entry.likes === 1) {
      oneLike.push(entry);
    } else {
      rest.push(entry);
    }
  }

  rest.sort((a, b) => {
    if (b.likes !== a.likes) {
      return b.likes - a.likes;
    }
    return String(a.sourceKey).localeCompare(String(b.sourceKey));
  });

  const remainingQuotas = quotasQualityOrder.slice();
  const worstQualityIndex = tierCount - 1;
  remainingQuotas[worstQualityIndex] = Math.max(
    0,
    Number(remainingQuotas[worstQualityIndex] || 0) - oneLike.length
  );

  for (const entry of oneLike) {
    // Force likes==1 to the lowest/common tier.
    result.set(entry.sourceKey, 0);
  }

  let cursor = 0;
  for (let qualityIndex = 0; qualityIndex < tierCount; qualityIndex += 1) {
    const take = Math.max(0, Number(remainingQuotas[qualityIndex] || 0));
    for (let offset = 0; offset < take && cursor < rest.length; offset += 1) {
      const entry = rest[cursor++];
      const rankLowToHigh = tierCount - 1 - qualityIndex;
      result.set(entry.sourceKey, rankLowToHigh);
    }
  }
  while (cursor < rest.length) {
    const entry = rest[cursor++];
    result.set(entry.sourceKey, 0);
  }
  return result;
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

function computeTierThresholds(sourceComments) {
  const tierConfigs = getTierConfigs();
  const baseTierKey = tierConfigs[0]?.key || "silver";
  const likes =
    rarityLogicMode === "geometric"
      ? collectUniqueSortedLikes(sourceComments, true)
      : collectUniqueSortedLikes(sourceComments);
  if (likes.length === 0) {
    const thresholds = Object.create(null);
    thresholds[baseTierKey] = 0;
    tierConfigs.slice(1).forEach((tierConfig) => {
      thresholds[tierConfig.key] = Number.POSITIVE_INFINITY;
    });
    return thresholds;
  }

  if (rarityLogicMode === "geometric") {
    return computeGeometricTierThresholds(likes, tierConfigs, rarityGeometricRatio);
  }

  const thresholds = Object.create(null);
  thresholds[baseTierKey] = 0;

  let previousThreshold = 0;
  let goldLikeThreshold = 0;
  for (let index = 1; index < tierConfigs.length; index += 1) {
    const tierConfig = tierConfigs[index];
    const percentileFactor = Number(tierConfig.percentileFactor || 1);
    const percentile = clamp(
      topLikedThresholdPercent * percentileFactor,
      MIN_TOP_LIKED_THRESHOLD_PERCENT,
      MAX_TOP_LIKED_THRESHOLD_PERCENT
    );
    const percentileCutoff = computePercentileThreshold(likes, percentile, previousThreshold);
    let nextThreshold = percentileCutoff;
    if (rarityLogicMode !== "percentile") {
      const fromPrevious = previousThreshold + Number(tierConfig.minGapFromPrevious || 0);
      const fromGold =
        index > 1 && Number.isFinite(tierConfig.minGapFromGold)
          ? goldLikeThreshold + Number(tierConfig.minGapFromGold)
          : Number.NEGATIVE_INFINITY;
      nextThreshold = Math.max(
        Number(tierConfig.minLikes || 0),
        percentileCutoff,
        fromPrevious,
        fromGold
      );
    }

    thresholds[tierConfig.key] = nextThreshold;
    previousThreshold = nextThreshold;
    if (index === 1) {
      goldLikeThreshold = nextThreshold;
    }
  }

  return thresholds;
}

function recomputeLikeTierThresholds() {
  activeTierThresholds = computeTierThresholds(comments);
  geometricTierRankByCommentSource =
    rarityLogicMode === "geometric"
      ? computeGeometricTierRanksBySource(comments)
      : new Map();
  const nonPopularityKeys = getNonPopularityTierKeys();
  nonPopularityPrimaryThreshold = getTierThresholdByKey(nonPopularityKeys.primary);
  nonPopularityEliteThreshold = getTierThresholdByKey(nonPopularityKeys.elite);
}

function compareByPriority(a, b) {
  const scoreDiff = getPriorityScore(b) - getPriorityScore(a);
  if (scoreDiff !== 0) {
    return scoreDiff;
  }
  const likesDiff = Number(b?.likes || 0) - Number(a?.likes || 0);
  if (likesDiff !== 0) {
    return likesDiff;
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

function getTierRank(likesCount, comment = null) {
  const numericLikes = Number(likesCount || 0);
  if (!Number.isFinite(numericLikes) || numericLikes <= 0) {
    return 0;
  }

  if (popularityModeEnabled) {
    if (rarityLogicMode === "geometric" && comment) {
      const sourceKey = getCommentSourceKey(comment);
      if (sourceKey && geometricTierRankByCommentSource.has(sourceKey)) {
        const mapped = Number(geometricTierRankByCommentSource.get(sourceKey));
        const maxRank = Math.max(0, getTierKeys().length - 1);
        return clamp(mapped, 0, maxRank);
      }
    }
    const tierKeys = getTierKeys();
    for (let index = tierKeys.length - 1; index >= 1; index -= 1) {
      const tierKey = tierKeys[index];
      if (numericLikes >= getTierThresholdByKey(tierKey)) {
        return index;
      }
    }
    return 0;
  }

  if (numericLikes >= nonPopularityEliteThreshold) {
    return 2;
  }
  if (numericLikes >= nonPopularityPrimaryThreshold) {
    return 1;
  }
  return 0;
}

function getHeatmapCommentWeight(comment) {
  const likesCount = Number(comment?.likes || 0);
  const tierName = getTierName(getTierRank(likesCount, comment));
  const tierConfig = getTierConfigByKey(tierName);
  return Number(tierConfig?.heatmapWeight) || 1;
}

function getTierOrderForCorner(corner, tierRank, likesCount = 0) {
  const isTopCorner = corner === "top-left" || corner === "top-right";
  const tierBand = 1_000_000;
  const safeTier = Math.max(0, Math.floor(Number(tierRank) || 0));
  const safeLikes = Math.max(
    0,
    Math.min(tierBand - 1, Math.floor(Number(likesCount) || 0))
  );
  const tierBase = (isTopCorner ? -safeTier : safeTier) * tierBand;
  // Within the same tier, higher likes gets a larger order, so it appears lower in the stack.
  return tierBase + safeLikes;
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

function armLandingRubberband(comment, anchorTime) {
  const commentKey = getCommentKey(comment);
  const anchor = Number(anchorTime);
  if (!commentKey || !Number.isFinite(anchor)) {
    return;
  }
  clickLandingRubberbandByCommentId.set(commentKey, {
    targetTime: anchor,
    played: false
  });
  const existingCardState = activeCardByCommentId.get(commentKey);
  if (existingCardState) {
    existingCardState.landingRubberbandAt = anchor;
    existingCardState.landingRubberbandPlayed = false;
  }
}

function triggerCardRubberband(card) {
  if (!card) {
    return;
  }
  card.classList.remove("accent-rubberband");
  requestAnimationFrame(() => {
    if (!card.isConnected) {
      return;
    }
    card.classList.add("accent-rubberband");
    setTimeout(() => {
      if (card.isConnected) {
        card.classList.remove("accent-rubberband");
      }
    }, LANDING_RUBBERBAND_DURATION_MS);
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
  const normalizedSkin = normalizeRaritySkin(raritySkin);
  const selectedOverlayRadius = getOverlayRadiusForSkin(normalizedSkin);
  const packOpacityRaw =
    normalizedSkin === "minecraft" || normalizedSkin === "animalcrossing"
      ? clamp(0.4 + glassNormalized * 0.6, 0.4, 1)
      : clamp(0.32 + glassNormalized * 0.68, 0.18, 1);
  const packOpacity = packOpacityRaw.toFixed(3);
  const effectiveOverlayRadius =
    normalizedSkin === "animalcrossing"
      ? clamp(Math.max(selectedOverlayRadius, 34), MIN_OVERLAY_RADIUS, MAX_OVERLAY_RADIUS)
      : selectedOverlayRadius;

  overlayElement.style.setProperty("--overlay-scale", String(overlayScale));
  overlayElement.style.setProperty("--overlay-radius", `${effectiveOverlayRadius}px`);
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
  const skinPackOpacity = clamp(
    Number(getCurrentSkinStyleConfig()?.packOpacity ?? packOpacity),
    0.08,
    1
  );
  overlayElement.style.setProperty("--overlay-pack-opacity", String(skinPackOpacity));
  overlayElement.dataset.raritySkin = normalizedSkin;
  overlayElement.dataset.skinRenderer = "dynamic";
  overlayElement.classList.toggle("debug-mode", debugMode);
  updateLaneVisibility();
}

async function getOverlaySettings() {
  const [values, localValues] = await Promise.all([
    chrome.storage.sync.get([
      "overlayScale",
      "displayDuration",
      "overlayRadius",
      "overlayRadiusBySkin",
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
      "experimentalGameSkinAutoEnabled",
      "showRarityLabelInNotifications",
      "raritySkin",
      "activeRaritySkinId",
      "rarityLogicMode",
      "rarityGeometricRatio",
      "hiddenRarityTiersBySkin",
      "hiddenRarityTiersBySkinId",
      "commentScanStartDelaySec",
      "presetProfile",
      "freePositionEnabled",
      "freePositionX",
      "freePositionY"
    ]),
    chrome.storage.local.get([
      LOCAL_RARITY_CATALOG_KEY,
      LOCAL_RARITY_CATALOG_REVISION_KEY
    ])
  ]);

  if (rarityShared) {
    let catalog = localValues?.[LOCAL_RARITY_CATALOG_KEY];
    if (!catalog || typeof catalog !== "object") {
      const migrated = rarityShared.migrateLegacyState(values || {});
      catalog = migrated.catalog;
      raritySkinCatalogRevision = Date.now();
      try {
        await chrome.storage.local.set({
          [LOCAL_RARITY_CATALOG_KEY]: catalog,
          [LOCAL_RARITY_CATALOG_REVISION_KEY]: raritySkinCatalogRevision
        });
      } catch (error) {
        debugLog("Failed to persist migrated rarity catalog", error);
      }
    } else {
      raritySkinCatalogRevision = Number(
        localValues?.[LOCAL_RARITY_CATALOG_REVISION_KEY] || Date.now()
      );
    }
    applyCatalogToRuntime(
      catalog,
      values?.[SYNC_ACTIVE_RARITY_SKIN_ID_KEY] || values?.raritySkin || DEFAULT_RARITY_SKIN
    );
  }

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
  overlayRadiusBySkin = normalizeOverlayRadiusBySkin(
    values?.overlayRadiusBySkin,
    overlayRadius
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
  showRarityLabelInNotifications =
    presetProfile === "minimal"
      ? false
      : Boolean(
          values?.showRarityLabelInNotifications ??
            DEFAULT_SHOW_RARITY_LABEL_IN_NOTIFICATIONS
        );
  showUpcomingDot = Boolean(
    values?.showUpcomingDot ?? DEFAULT_SHOW_UPCOMING_DOT
  );
  experimentalGameSkinAutoEnabled = Boolean(
    values?.experimentalGameSkinAutoEnabled ??
      DEFAULT_EXPERIMENTAL_GAME_SKIN_AUTO_ENABLED
  );
  raritySkin = normalizeRaritySkin(
    String(
      values?.[SYNC_ACTIVE_RARITY_SKIN_ID_KEY] ??
        values?.raritySkin ??
        DEFAULT_RARITY_SKIN
    )
  );
  overlayRadius = getOverlayRadiusForSkin(raritySkin);
  rarityLogicMode = normalizeRarityLogicMode(
    String(values?.rarityLogicMode ?? DEFAULT_RARITY_LOGIC_MODE)
  );
  rarityGeometricRatio = clamp(
    Number(values?.rarityGeometricRatio ?? DEFAULT_RARITY_GEOMETRIC_RATIO),
    MIN_RARITY_GEOMETRIC_RATIO,
    MAX_RARITY_GEOMETRIC_RATIO
  );
  hiddenRarityTiersBySkin = normalizeHiddenRarityTiersBySkin(
    values?.[SYNC_HIDDEN_RARITY_TIERS_BY_SKIN_ID_KEY] ??
      values?.hiddenRarityTiersBySkin
  );
  commentScanStartDelaySec = clamp(
    Number(values?.commentScanStartDelaySec ?? DEFAULT_COMMENT_SCAN_START_DELAY_SEC),
    MIN_COMMENT_SCAN_START_DELAY_SEC,
    MAX_COMMENT_SCAN_START_DELAY_SEC
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
    createInterface();
    scheduleRenderTimeMarkers();
    if (monitoringInitialized === false) {
      startMonitoring();
    }
    scheduleAutoSkinDetect(videoId, AUTO_SKIN_DETECT_DELAY_MS);
    scheduleCommentsRequest(
      videoId,
      0,
      clamp(
        Number(commentScanStartDelaySec ?? DEFAULT_COMMENT_SCAN_START_DELAY_SEC),
        MIN_COMMENT_SCAN_START_DELAY_SEC,
        MAX_COMMENT_SCAN_START_DELAY_SEC
      ) * 1000
    );
  }
}

function clearStartupRequestTimers() {
  if (commentsRequestRetryTimerId !== null) {
    clearTimeout(commentsRequestRetryTimerId);
    commentsRequestRetryTimerId = null;
  }
  if (autoSkinDetectTimerId !== null) {
    clearTimeout(autoSkinDetectTimerId);
    autoSkinDetectTimerId = null;
  }
}

function scheduleAutoSkinDetect(videoId, delayMs = AUTO_SKIN_DETECT_DELAY_MS) {
  if (!videoId) {
    return;
  }
  if (autoSkinDetectTimerId !== null) {
    clearTimeout(autoSkinDetectTimerId);
  }
  autoSkinDetectTimerId = setTimeout(async () => {
    autoSkinDetectTimerId = null;
    if (currentVideoId !== videoId || getVideoId() !== videoId) {
      return;
    }
    try {
      await chrome.runtime.sendMessage({ type: "auto_detect_skin", video_id: videoId });
    } catch (error) {
      if (!isExtensionContextInvalidatedError(error)) {
        debugLog("auto skin detect trigger failed", error);
      }
    }
  }, Math.max(0, Number(delayMs) || 0));
}

function scheduleCommentsRequest(videoId, attempt = 0, delayMs = 0) {
  if (!videoId) {
    return;
  }
  if (commentsRequestRetryTimerId !== null) {
    clearTimeout(commentsRequestRetryTimerId);
  }
  commentsRequestRetryTimerId = setTimeout(async () => {
    commentsRequestRetryTimerId = null;
    if (currentVideoId !== videoId || getVideoId() !== videoId) {
      return;
    }
    try {
      await chrome.runtime.sendMessage({
        type: "comments",
        video_id: videoId,
        forceRefresh: true
      });
    } catch (error) {
      if (isExtensionContextInvalidatedError(error)) {
        return;
      }
      debugLog("comments bootstrap request failed", error);
      if (attempt < COMMENTS_REQUEST_RETRY_DELAYS_MS.length) {
        scheduleCommentsRequest(
          videoId,
          attempt + 1,
          COMMENTS_REQUEST_RETRY_DELAYS_MS[attempt]
        );
      }
    }
  }, Math.max(0, Number(delayMs) || 0));
}

async function safeMain() {
  try {
    await main();
  } catch (error) {
    if (isExtensionContextInvalidatedError(error)) {
      return;
    }
    throw error;
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

  markerBarElement = container.querySelector(".__tc-ts-marker-bar");
  if (!markerBarElement) {
    markerBarElement = document.createElement("div");
    markerBarElement.className = "__tc-ts-marker-bar";
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

  markerPreviewElement = host.querySelector(".__tc-ts-marker-preview");
  if (!markerPreviewElement) {
    markerPreviewElement = document.createElement("div");
    markerPreviewElement.className = "__tc-ts-marker-preview";
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
  let wave = bar.querySelector(".__tc-ts-heatmap-wave");
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
    wave.className = "__tc-ts-heatmap-wave";
    bar.appendChild(wave);
    waveCreated = true;
  } else {
    wave.innerHTML = "";
  }

  const bins = 420;
  const counts = new Array(bins).fill(0);
  for (const comment of comments) {
    if (isCommentTierHidden(comment)) {
      continue;
    }
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
    bin.className = "__tc-ts-heatmap-bin";
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
    if (isCommentTierHidden(comment)) {
      continue;
    }
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
    marker.className = "__tc-ts-marker";
    marker.classList.add(`skin-${normalizeRaritySkin(raritySkin)}`);
    const highestTierRank = groupedComments.reduce((currentMax, comment) => {
      const likesCount = Number(comment?.likes || 0);
      return Math.max(currentMax, getTierRank(likesCount, comment));
    }, 0);
    const highestTierName = getTierName(highestTierRank);
    marker.classList.add(`tier-${highestTierName}`);
    const tierConfig = getTierConfigByKey(highestTierName);
    applyTierMarkerVisualStyle(marker, tierConfig, highestTierRank);
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

function detachVideoMonitoring() {
  if (!monitoredVideo || !videoMonitorHandlers) {
    monitoredVideo = null;
    videoMonitorHandlers = null;
    return;
  }
  monitoredVideo.removeEventListener("timeupdate", videoMonitorHandlers.onTimeUpdate);
  monitoredVideo.removeEventListener("seeking", videoMonitorHandlers.onSeeking);
  monitoredVideo.removeEventListener("seeked", videoMonitorHandlers.onSeeked);
  monitoredVideo.removeEventListener("play", videoMonitorHandlers.onPlay);
  monitoredVideo.removeEventListener("ratechange", videoMonitorHandlers.onRateChange);
  monitoredVideo = null;
  videoMonitorHandlers = null;
  monitoringInitialized = false;
}

function startMonitoring() {
  const video = document.querySelector("video");
  videoContainer = getOverlayHost() || document.querySelector("#container .html5-video-player");

  if (!video) {
    return;
  }

  if (monitoredVideo === video && videoMonitorHandlers) {
    monitoringInitialized = true;
    return;
  }

  detachVideoMonitoring();

  const onTimeUpdate = () => {
    if (isAdPlaying()) {
      return;
    }
    scheduleReconcile(video.currentTime);
  };

  const onSeeking = () => {
    if (isAdPlaying()) {
      return;
    }
    scheduleReconcile(video.currentTime);
    debugLog("Seek reconcile", video.currentTime);
  };

  const onSeeked = () => {
    if (isAdPlaying()) {
      return;
    }
    scheduleReconcile(video.currentTime);
  };

  const onPlay = () => {
    if (isAdPlaying()) {
      return;
    }
    scheduleReconcile(video.currentTime);
  };

  const onRateChange = () => {
    if (isAdPlaying()) {
      return;
    }
    scheduleReconcile(video.currentTime);
  };

  video.addEventListener("timeupdate", onTimeUpdate);
  video.addEventListener("seeking", onSeeking);
  video.addEventListener("seeked", onSeeked);
  video.addEventListener("play", onPlay);
  video.addEventListener("ratechange", onRateChange);

  monitoredVideo = video;
  videoMonitorHandlers = { onTimeUpdate, onSeeking, onSeeked, onPlay, onRateChange };
  monitoringInitialized = true;
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
    if (isCommentTierHidden(comment)) {
      continue;
    }
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
    if (
      Number.isFinite(cardState?.landingRubberbandAt) &&
      cardState.landingRubberbandPlayed !== true &&
      currentTime >= Number(cardState.landingRubberbandAt) - LANDING_RUBBERBAND_FUZZ_SECONDS
    ) {
      triggerCardRubberband(cardState.card);
      cardState.landingRubberbandPlayed = true;
      if (cardState.commentId) {
        clickLandingRubberbandByCommentId.delete(cardState.commentId);
      }
    }
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
  if (isCommentTierHidden(comment)) {
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
  const tierRank = getTierRank(likesCount, comment);
  const tierName = getTierName(tierRank);
  const tierConfig = getTierConfigByKey(tierName);
  card.classList.add(`${tierName}-liked`);
  applyTierCardVisualStyle(card, tierConfig, tierRank);
  card.style.order = String(getTierOrderForCorner(targetCorner, tierRank, likesCount));
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
      armLandingRubberband(comment, seekResult.anchorTime);
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
      const raritySuffix = showRarityLabelInNotifications
        ? ` - ${getTierDisplayName(tierName)}`
        : "";
      likesElement.textContent = `Likes ${formatLikesLabel(likesCount)}${raritySuffix}`;
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
    landingRubberbandAt: null,
    landingRubberbandPlayed: true,
    remainingMs: getDisplayDurationMs(comment, playbackRate),
    hideTimeoutId: null,
    hideStartedAt: Date.now()
  };
  const landingState = clickLandingRubberbandByCommentId.get(commentId);
  if (landingState && landingState.played !== true && Number.isFinite(landingState.targetTime)) {
    cardState.landingRubberbandAt = Number(landingState.targetTime);
    cardState.landingRubberbandPlayed = false;
  }
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
  geometricTierRankByCommentSource.clear();
  contextualVisibilityLocks.clear();
  clickLandingRubberbandByCommentId.clear();
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
  clearStartupRequestTimers();
  detachVideoMonitoring();
  monitoringInitialized = false;
  currentVideoId = null;
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
  geometricTierRankByCommentSource = new Map();
  contextualVisibilityLocks = new Map();
  clickLandingRubberbandByCommentId = new Map();
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
  activeTierThresholds = Object.create(null);
  nonPopularityPrimaryThreshold = 0;
  nonPopularityEliteThreshold = Number.POSITIVE_INFINITY;
  showRarityLabelInNotifications = DEFAULT_SHOW_RARITY_LABEL_IN_NOTIFICATIONS;
  raritySkin = DEFAULT_RARITY_SKIN;
  rarityLogicMode = DEFAULT_RARITY_LOGIC_MODE;
  rarityGeometricRatio = DEFAULT_RARITY_GEOMETRIC_RATIO;
  hiddenRarityTiersBySkin = DEFAULT_HIDDEN_RARITY_TIERS_BY_SKIN;
  commentScanStartDelaySec = DEFAULT_COMMENT_SCAN_START_DELAY_SEC;
  clearMarkers();
  hideOverlay();
}

window.addEventListener("load", async () => {
  await safeMain();
});

locationChange(() => {
  safeMain();
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === "detectGameMetadata") {
    sendResponse({ gameText: detectYouTubeGameMetadataText() });
    return;
  }
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
    const previousRaritySkin = raritySkin;
    const previousRarityLogicMode = rarityLogicMode;
    const previousPopularityModeEnabled = popularityModeEnabled;
    const previousHiddenRarityState = JSON.stringify(
      normalizeHiddenRarityTiersBySkin(hiddenRarityTiersBySkin)
    );
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
    overlayRadiusBySkin = normalizeOverlayRadiusBySkin(
      message.overlayRadiusBySkin ?? overlayRadiusBySkin,
      overlayRadius
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
    experimentalGameSkinAutoEnabled = Boolean(
      message.experimentalGameSkinAutoEnabled ??
        experimentalGameSkinAutoEnabled
    );
    showRarityLabelInNotifications =
      messagePresetProfile === "minimal"
        ? false
        : Boolean(
            message.showRarityLabelInNotifications ??
              showRarityLabelInNotifications
          );
    if (message.activeRaritySkinConfig) {
      applyActiveSkinConfigOverride(
        String(message.activeRaritySkinId ?? message.raritySkin ?? raritySkin),
        message.activeRaritySkinConfig
      );
    }
    if (message.raritySkinCatalogRevision) {
      raritySkinCatalogRevision = Number(message.raritySkinCatalogRevision || raritySkinCatalogRevision);
    }
    raritySkin = normalizeRaritySkin(
      String(message.activeRaritySkinId ?? message.raritySkin ?? raritySkin)
    );
    overlayRadius = getOverlayRadiusForSkin(raritySkin);
    rarityLogicMode = normalizeRarityLogicMode(
      String(message.rarityLogicMode ?? rarityLogicMode)
    );
    rarityGeometricRatio = clamp(
      Number(message.rarityGeometricRatio ?? rarityGeometricRatio),
      MIN_RARITY_GEOMETRIC_RATIO,
      MAX_RARITY_GEOMETRIC_RATIO
    );
    hiddenRarityTiersBySkin = normalizeHiddenRarityTiersBySkin(
      message.hiddenRarityTiersBySkinId ??
        message.hiddenRarityTiersBySkin ??
        hiddenRarityTiersBySkin
    );
    commentScanStartDelaySec = clamp(
      Number(message.commentScanStartDelaySec ?? commentScanStartDelaySec),
      MIN_COMMENT_SCAN_START_DELAY_SEC,
      MAX_COMMENT_SCAN_START_DELAY_SEC
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
    const rarityBehaviorChanged =
      previousRaritySkin !== raritySkin ||
      previousRarityLogicMode !== rarityLogicMode ||
      previousPopularityModeEnabled !== popularityModeEnabled ||
      previousHiddenRarityState !==
        JSON.stringify(normalizeHiddenRarityTiersBySkin(hiddenRarityTiersBySkin));
    if (video && !isAdPlaying() && rarityBehaviorChanged) {
      hideOverlay();
      scheduleReconcile(video.currentTime);
    }
    if (video && !isAdPlaying() && timingBehaviorChanged) {
      scheduleReconcile(video.currentTime);
    }
    updateEyeToggleVisibility();
    return;
  }

  if (message.type === "autoRaritySkin") {
    if (!experimentalGameSkinAutoEnabled) {
      return;
    }
    const nextSkin = normalizeRaritySkin(
      String(message.raritySkin ?? DEFAULT_RARITY_SKIN)
    );
    if (nextSkin === raritySkin) {
      return;
    }
    raritySkin = nextSkin;
    overlayRadius = getOverlayRadiusForSkin(raritySkin);
    recomputeLikeTierThresholds();
    applyOverlayStyles();
    scheduleRenderTimeMarkers();
    const video = getVideo();
    if (video && !isAdPlaying()) {
      hideOverlay();
      scheduleReconcile(video.currentTime);
    }
    return;
  }

  if (message.type === "comments_filter_settings_changed") {
    debugLog("Comment filter changed, force refreshing comments");
    const videoId = getVideoId();
    if (videoId) {
      try {
        const maybePromise = chrome.runtime.sendMessage({
          type: "comments",
          video_id: videoId,
          forceRefresh: true
        });
        if (maybePromise && typeof maybePromise.catch === "function") {
          maybePromise.catch((error) => {
            if (!isExtensionContextInvalidatedError(error)) {
              debugLog("comments refresh message failed", error);
            }
          });
        }
      } catch (error) {
        if (!isExtensionContextInvalidatedError(error)) {
          debugLog("comments refresh message failed", error);
        }
      }
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
