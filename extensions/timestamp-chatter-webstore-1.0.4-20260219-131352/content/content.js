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
let reactNotificationsOverlayMounted = false;
let geometricTierRankByCommentSource = new Map();
let currentVideoId = null;
let laneElements = new Map();
let activeTierThresholds = Object.create(null);
let eyeToggleElement = null;
let notificationsMutedByEye = false;
let localOverlayForceEnabledWhileGlobalOff = false;
let isVideoHovering = false;
let reconcileRafId = null;
let pendingReconcileTime = null;
let renderMarkersRafId = null;
let eyeMountRetryIntervalId = null;
let eyeMountHeartbeatIntervalId = null;
let contextualVisibilityLocks = new Map();
let clickLandingRubberbandByCommentId = new Map();
let commentsLoadComplete = false;
let commentsLoadPagesFetched = null;
let commentsLoadPagesTarget = null;
let cardDragState = null;
let suppressCardClickUntil = 0;
let suppressGlobalClickUntil = 0;
let freePositionEnabled = false;
let freePositionX = 0;
let freePositionY = 0;
let commentsRequestRetryTimerId = null;
let autoSkinDetectTimerId = null;
let commentsScanInProgress = false;
let monitoredVideo = null;
let videoMonitorHandlers = null;
const settingsSchema = globalThis.TimestampChatterSettingsSchema || null;

const DEFAULT_OVERLAY_SCALE = 1.05;
const DEFAULT_DISPLAY_DURATION = 10;
const DEFAULT_OVERLAY_RADIUS = 25;
const DEFAULT_OVERLAY_AVATAR_SIZE = 40;
const DEFAULT_OVERLAY_GLASSINESS = 20;
const DEFAULT_OVERLAY_DARKNESS = 90;
const DEFAULT_DEBUG_MODE = false;
const DEFAULT_EARLY_MODE_ENABLED = false;
const DEFAULT_FOLLOW_PLAYBACK_SPEED = true;
const DEFAULT_CLICK_BACK_CONTEXT_SECONDS =
  settingsSchema?.defaults?.clickBackContextSeconds ?? 3;
const DEFAULT_MARKER_PREVIEW_BOTTOM_OFFSET_PX = 78;
const DEFAULT_EARLY_SECONDS = 5;
const DEFAULT_TIMESTAMP_ACCENT_EFFECT = "rubberband";
const DEFAULT_REVERSE_STACK_ORDER = false;
const DEFAULT_PRIORITY_SCORING_ENABLED = true;
const DEFAULT_PRIORITY_LIKES_WEIGHT = 1;
const DEFAULT_TOP_LIKED_THRESHOLD_PERCENT = 12;
const DEFAULT_HEATMAP_ENABLED =
  settingsSchema?.defaults?.heatmapEnabled ?? true;
const DEFAULT_HEATMAP_INTENSITY = 500;
const DEFAULT_SHOW_AUTHOR_IN_NOTIFICATIONS =
  settingsSchema?.defaults?.showAuthorInNotifications ?? true;
const DEFAULT_SHOW_LIKES_IN_NOTIFICATIONS = true;
const DEFAULT_SHOW_UPCOMING_DOT =
  settingsSchema?.defaults?.showUpcomingDot ?? true;
const DEFAULT_STACK_OPACITY_FADE_ENABLED =
  settingsSchema?.defaults?.stackOpacityFadeEnabled ?? true;
const DEFAULT_STACK_OPACITY_FADE_START =
  settingsSchema?.defaults?.stackOpacityFadeStart ?? 6;
const DEFAULT_STACK_OPACITY_FADE_STEP_PERCENT =
  settingsSchema?.defaults?.stackOpacityFadeStepPercent ?? 20;
const DEFAULT_SHOW_RARITY_LABEL_IN_NOTIFICATIONS = true;
const DEFAULT_EXPERIMENTAL_GAME_SKIN_AUTO_ENABLED = false;
const DEFAULT_PRESET_PROFILE = "balanced";
const MINIMAL_MODE_BACKUP_SYNC_KEY = "minimalModeBackupV1";
const DEFAULT_RARITY_SKIN = "default";
const DEFAULT_RARITY_LOGIC_MODE = "geometric";
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
let clickBackContextSeconds = DEFAULT_CLICK_BACK_CONTEXT_SECONDS;
let markerPreviewBottomOffsetPx = DEFAULT_MARKER_PREVIEW_BOTTOM_OFFSET_PX;
let earlySeconds = DEFAULT_EARLY_SECONDS;
let timestampAccentEffect = DEFAULT_TIMESTAMP_ACCENT_EFFECT;
let reverseStackOrder = DEFAULT_REVERSE_STACK_ORDER;
let priorityScoringEnabled = DEFAULT_PRIORITY_SCORING_ENABLED;
let priorityLikesWeight = DEFAULT_PRIORITY_LIKES_WEIGHT;
let topLikedThresholdPercent = DEFAULT_TOP_LIKED_THRESHOLD_PERCENT;
let heatmapEnabled = DEFAULT_HEATMAP_ENABLED;
let timelineMarkersEnabled = settingsSchema?.defaults?.timelineMarkersEnabled ?? true;
let heatmapIntensity = DEFAULT_HEATMAP_INTENSITY;
let showAuthorInNotifications = DEFAULT_SHOW_AUTHOR_IN_NOTIFICATIONS;
let showLikesInNotifications = DEFAULT_SHOW_LIKES_IN_NOTIFICATIONS;
let showUpcomingDot = DEFAULT_SHOW_UPCOMING_DOT;
let stackOpacityFadeEnabled = DEFAULT_STACK_OPACITY_FADE_ENABLED;
let stackOpacityFadeStart = DEFAULT_STACK_OPACITY_FADE_START;
let stackOpacityFadeStepPercent = DEFAULT_STACK_OPACITY_FADE_STEP_PERCENT;
let showRarityLabelInNotifications = DEFAULT_SHOW_RARITY_LABEL_IN_NOTIFICATIONS;
let experimentalGameSkinAutoEnabled = DEFAULT_EXPERIMENTAL_GAME_SKIN_AUTO_ENABLED;
let presetProfile = DEFAULT_PRESET_PROFILE;
let raritySkin = DEFAULT_RARITY_SKIN;
let rarityLogicMode = DEFAULT_RARITY_LOGIC_MODE;
let rarityGeometricRatio = DEFAULT_RARITY_GEOMETRIC_RATIO;
let overlayRadiusBySkin = null;
let hiddenRarityTiersBySkin = DEFAULT_HIDDEN_RARITY_TIERS_BY_SKIN;
let commentScanStartDelaySec =
  settingsSchema?.defaults?.commentScanStartDelaySec ?? 3;
let clearTimestampCacheOnRefresh =
  settingsSchema?.defaults?.clearTimestampCacheOnRefresh ?? false;

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
const MIN_STACK_OPACITY_FADE_START =
  settingsSchema?.limits?.stackOpacityFadeStart?.min ?? 0;
const MAX_STACK_OPACITY_FADE_START =
  settingsSchema?.limits?.stackOpacityFadeStart?.max ?? 50;
const MIN_STACK_OPACITY_FADE_STEP_PERCENT =
  settingsSchema?.limits?.stackOpacityFadeStepPercent?.min ?? 0;
const MAX_STACK_OPACITY_FADE_STEP_PERCENT =
  settingsSchema?.limits?.stackOpacityFadeStepPercent?.max ?? 25;
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
const MIN_CLICK_BACK_CONTEXT_SECONDS =
  settingsSchema?.limits?.clickBackContextSeconds?.min ?? 0;
const MAX_CLICK_BACK_CONTEXT_SECONDS =
  settingsSchema?.limits?.clickBackContextSeconds?.max ?? 30;
const CLICK_LOCK_FUZZ_SECONDS = 0.35;
const LANDING_RUBBERBAND_FUZZ_SECONDS = 0.08;
const LANDING_RUBBERBAND_DURATION_MS = 1000;
const COMMENTS_REQUEST_INITIAL_DELAY_MS = 900;
const COMMENTS_REQUEST_RETRY_DELAYS_MS = [1800, 3500, 6000];
const AUTO_SKIN_DETECT_DELAY_MS = 1200;
const FULLSCREEN_OVERLAY_SCALE_BONUS = 0.1;
const DEFAULT_COMMENT_SCAN_START_DELAY_SEC =
  settingsSchema?.defaults?.commentScanStartDelaySec ?? 3;
const DEFAULT_CLEAR_TIMESTAMP_CACHE_ON_REFRESH =
  settingsSchema?.defaults?.clearTimestampCacheOnRefresh ?? false;
const MIN_COMMENT_SCAN_START_DELAY_SEC =
  settingsSchema?.limits?.commentScanStartDelaySec?.min ?? 0;
const MAX_COMMENT_SCAN_START_DELAY_SEC =
  settingsSchema?.limits?.commentScanStartDelaySec?.max ?? 20;
const CARD_DRAG_ENABLED = false;
const CARD_DRAG_MOVE_THRESHOLD_PX = 10;
const CARD_DRAG_CLICK_SUPPRESS_MS = 320;
const FREE_POSITION_MARGIN_PX = 8;
const CORNERS = ["bottom-left", "bottom-right", "top-left", "top-right"];
let RARITY_SKIN_VALUES = ["default", "borderlands", "borderlands2", "minecraft", "animalcrossing"];
const RARITY_LOGIC_MODE_VALUES = ["geometric"];
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
const EYE_STATE_LOADING = "loading";
const EYE_STATE_OPEN = "eye";
const EYE_STATE_CLOSED = "crossed-eye";
const EYE_TRANSITION_DURATION_MS = 620;
let eyeVisualState = EYE_STATE_LOADING;
let eyeVisualTransitionTimerId = null;
let quickMenuOpen = false;
let quickMenuActivePanel = "main";
let quickMenuStatusText = "";
let quickMenuStatusTimerId = null;
let quickMenuGlobalDocumentHandlersAttached = false;
let quickMenuMenuElement = null;
let commentDraftPopupOpen = false;
let commentDraftPopupElement = null;
let commentDraftTextareaElement = null;
let commentDraftTimestampSeconds = null;
let commentDraftStatusText = "";
let commentDraftStatusTone = "";
let commentDraftHotkeyHandlersAttached = false;
let notificationsSuppressedByDraftPopup = false;
let commentDraftOpenSeq = 0;
const QUICK_MENU_SCAN_DEBUG_MAX_ENTRIES = 20;
let quickMenuScanDebugEntries = [];
let tabSessionRaritySkinOverride = null;
let clickedNotificationPrioritySeq = 0;
const QUICK_MENU_RARE_COMMENTS_PRESETS = Object.freeze([
  { label: "Very low", ratio: 3.0 },
  { label: "Low", ratio: 2.5 },
  { label: "Medium", ratio: 2.0 },
  { label: "High", ratio: 1.5 },
  { label: "Very High", ratio: 1.05 }
]);
const COMMENT_DRAFT_SHORTCUT_HINT_MAC = "⌘⇧A";
const COMMENT_DRAFT_SHORTCUT_HINT_WIN = "Ctrl+Shift+A";
const COMMENT_DRAFT_POPUP_DEFAULT_LEFT_PX = 64;
const COMMENT_DRAFT_POPUP_DEFAULT_BOTTOM_PX = 64;
const COMMENT_DRAFT_POPUP_PLAYER_CONTROLS_BOTTOM_PX = 128;
const COMMENT_DRAFT_TIMESTAMP_PREFIX_REGEX = /^\s*(\d{1,}:\d{2}(?::\d{2})?)\s*/;
const COMMENT_DRAFT_TIMESTAMP_ANY_REGEX = /(\d{1,}:\d{2}(?::\d{2})?)/;

function isTabOverlayEnabled() {
  if (!isActive) {
    return Boolean(localOverlayForceEnabledWhileGlobalOff);
  }
  return !notificationsMutedByEye;
}

function isOverlayRuntimeEnabled() {
  return Boolean((isActive && !notificationsMutedByEye) || (!isActive && localOverlayForceEnabledWhileGlobalOff));
}

function pauseTimestampRuntime() {
  if (autoSkinDetectTimerId !== null) {
    clearTimeout(autoSkinDetectTimerId);
    autoSkinDetectTimerId = null;
  }
  detachVideoMonitoring();
  hideOverlay();
  clearMarkers();
  setUpcomingDotVisible(false);
}

function resumeTimestampRuntime({ runScan = true } = {}) {
  const video = getVideo();
  if (video && monitoringInitialized === false) {
    startMonitoring();
  }
  if (video) {
    scheduleReconcile(video.currentTime);
  }
  scheduleRenderTimeMarkers();
  if (runScan) {
    const videoId = currentVideoId || getVideoId();
    if (videoId) {
      scheduleCommentsRequest(videoId, 0, 0, "resume_runtime");
    }
  }
}

function shouldRunFreshScanOnResume() {
  const hasLoadedComments = Array.isArray(comments) && comments.length > 0;
  const scanInProgress = commentsScanInProgress;
  return !(hasLoadedComments || scanInProgress);
}

function getEyeSteadySvgMarkup(state) {
  if (state === EYE_STATE_CLOSED) {
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" width="100%" height="100%">
      <g stroke="white" fill="none" stroke-width="8" stroke-linecap="round" stroke-linejoin="round">
        <path d="M 10 60 Q 60 10 110 60 Q 60 110 10 60 Z" />
        <circle cx="60" cy="60" r="18" fill="white" stroke="none" />
        <line x1="20" y1="100" x2="100" y2="20" />
      </g>
    </svg>`;
  }
  if (state === EYE_STATE_OPEN) {
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" width="100%" height="100%">
      <g stroke="white" fill="none" stroke-width="8" stroke-linecap="round" stroke-linejoin="round">
        <path d="M 10 60 Q 60 10 110 60 Q 60 110 10 60 Z" />
        <circle cx="60" cy="60" r="18" fill="white" stroke="none" />
      </g>
    </svg>`;
  }
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" width="100%" height="100%">
    <g stroke="white" fill="none" stroke-width="8" stroke-linecap="round" stroke-linejoin="round">
      <path d="M 15 30 H 105 V 80 H 45 L 20 100 V 80 H 15 Z" />
      <line x1="35" y1="55" x2="85" y2="55" stroke-width="6" stroke="rgba(255,255,255,0.3)"/>
      <circle cx="35" cy="55" r="5" fill="white" stroke="none">
        <animate attributeName="cx" values="35; 85; 35" dur="1.5s" repeatCount="indefinite" calcMode="spline" keySplines="0.4 0 0.2 1; 0.4 0 0.2 1" />
      </circle>
    </g>
  </svg>`;
}

function getEyeTransitionSvgMarkup(fromState, toState) {
  const begin = "0s";
  if (fromState === EYE_STATE_LOADING && toState === EYE_STATE_OPEN) {
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" width="100%" height="100%">
      <g stroke="white" fill="none" stroke-width="8" stroke-linecap="round" stroke-linejoin="round">
        <g transform-origin="60 60">
          <animateTransform attributeName="transform" type="scale" from="1" to="0.6" begin="${begin}" dur="0.35s" fill="freeze" calcMode="spline" keySplines="0.4 0 1 1" />
          <animate attributeName="opacity" from="1" to="0" begin="${begin}" dur="0.26s" fill="freeze" />
          <path d="M 15 30 H 105 V 80 H 45 L 20 100 V 80 H 15 Z" />
          <line x1="35" y1="55" x2="85" y2="55" stroke-width="6" stroke="rgba(255,255,255,0.3)"/>
          <circle cx="35" cy="55" r="5" fill="white" stroke="none">
            <animate attributeName="cx" values="35; 85; 35" dur="1.5s" repeatCount="indefinite" calcMode="spline" keySplines="0.4 0 0.2 1; 0.4 0 0.2 1" />
          </circle>
        </g>
        <g opacity="0" transform-origin="60 60" transform="scale(0.6)">
          <animateTransform attributeName="transform" type="scale" from="0.6" to="1" begin="0.16s" dur="0.42s" fill="freeze" calcMode="spline" keySplines="0 0 0.2 1" />
          <animate attributeName="opacity" from="0" to="1" begin="0.16s" dur="0.36s" fill="freeze" />
          <path d="M 10 60 Q 60 10 110 60 Q 60 110 10 60 Z" />
          <circle cx="60" cy="60" r="18" fill="white" stroke="none" />
        </g>
      </g>
    </svg>`;
  }
  if (fromState === EYE_STATE_LOADING && toState === EYE_STATE_CLOSED) {
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" width="100%" height="100%">
      <g stroke="white" fill="none" stroke-width="8" stroke-linecap="round" stroke-linejoin="round">
        <g transform-origin="60 60">
          <animateTransform attributeName="transform" type="scale" from="1" to="0.6" begin="${begin}" dur="0.35s" fill="freeze" calcMode="spline" keySplines="0.4 0 1 1" />
          <animate attributeName="opacity" from="1" to="0" begin="${begin}" dur="0.26s" fill="freeze" />
          <path d="M 15 30 H 105 V 80 H 45 L 20 100 V 80 H 15 Z" />
          <line x1="35" y1="55" x2="85" y2="55" stroke-width="6" stroke="rgba(255,255,255,0.3)"/>
          <circle cx="35" cy="55" r="5" fill="white" stroke="none">
            <animate attributeName="cx" values="35; 85; 35" dur="1.5s" repeatCount="indefinite" calcMode="spline" keySplines="0.4 0 0.2 1; 0.4 0 0.2 1" />
          </circle>
        </g>
        <g opacity="0" transform-origin="60 60" transform="scale(0.6)">
          <animateTransform attributeName="transform" type="scale" from="0.6" to="1" begin="0.16s" dur="0.42s" fill="freeze" calcMode="spline" keySplines="0 0 0.2 1" />
          <animate attributeName="opacity" from="0" to="1" begin="0.16s" dur="0.36s" fill="freeze" />
          <path d="M 10 60 Q 60 10 110 60 Q 60 110 10 60 Z" />
          <circle cx="60" cy="60" r="18" fill="white" stroke="none" />
          <line x1="20" y1="100" x2="100" y2="20" />
        </g>
      </g>
    </svg>`;
  }
  if (fromState === EYE_STATE_OPEN && toState === EYE_STATE_LOADING) {
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" width="100%" height="100%">
      <g stroke="white" fill="none" stroke-width="8" stroke-linecap="round" stroke-linejoin="round">
        <g transform-origin="60 60">
          <animateTransform attributeName="transform" type="scale" from="1" to="0.6" begin="${begin}" dur="0.35s" fill="freeze" calcMode="spline" keySplines="0.4 0 1 1" />
          <animate attributeName="opacity" from="1" to="0" begin="${begin}" dur="0.26s" fill="freeze" />
          <path d="M 10 60 Q 60 10 110 60 Q 60 110 10 60 Z" />
          <circle cx="60" cy="60" r="18" fill="white" stroke="none" />
        </g>
        <g opacity="0" transform-origin="60 60" transform="scale(0.6)">
          <animateTransform attributeName="transform" type="scale" from="0.6" to="1" begin="0.16s" dur="0.42s" fill="freeze" calcMode="spline" keySplines="0 0 0.2 1" />
          <animate attributeName="opacity" from="0" to="1" begin="0.16s" dur="0.36s" fill="freeze" />
          <path d="M 15 30 H 105 V 80 H 45 L 20 100 V 80 H 15 Z" />
          <line x1="35" y1="55" x2="85" y2="55" stroke-width="6" stroke="rgba(255,255,255,0.3)"/>
          <circle cx="35" cy="55" r="5" fill="white" stroke="none">
            <animate attributeName="cx" values="35; 85; 35" dur="1.5s" repeatCount="indefinite" calcMode="spline" keySplines="0.4 0 0.2 1; 0.4 0 0.2 1" />
          </circle>
        </g>
      </g>
    </svg>`;
  }
  if (fromState === EYE_STATE_OPEN && toState === EYE_STATE_CLOSED) {
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" width="100%" height="100%">
      <g stroke="white" fill="none" stroke-width="8" stroke-linecap="round" stroke-linejoin="round">
        <g transform-origin="60 60">
          <animateTransform attributeName="transform" type="scale" values="1; 0.85; 1" begin="${begin}" dur="0.26s" calcMode="spline" keySplines="0.4 0 0.2 1; 0.4 0 0.2 1" />
          <path d="M 10 60 Q 60 10 110 60 Q 60 110 10 60 Z" />
          <circle cx="60" cy="60" r="18" fill="white" stroke="none" />
        </g>
        <line x1="20" y1="100" x2="100" y2="20" stroke-dasharray="120" stroke-dashoffset="120">
          <animate attributeName="stroke-dashoffset" from="120" to="0" begin="${begin}" dur="0.2s" fill="freeze" calcMode="spline" keySplines="0 0 0.2 1" />
        </line>
      </g>
    </svg>`;
  }
  if (fromState === EYE_STATE_CLOSED && toState === EYE_STATE_LOADING) {
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" width="100%" height="100%">
      <g stroke="white" fill="none" stroke-width="8" stroke-linecap="round" stroke-linejoin="round">
        <g transform-origin="60 60">
          <animateTransform attributeName="transform" type="scale" from="1" to="0.6" begin="${begin}" dur="0.35s" fill="freeze" calcMode="spline" keySplines="0.4 0 1 1" />
          <animate attributeName="opacity" from="1" to="0" begin="${begin}" dur="0.26s" fill="freeze" />
          <path d="M 10 60 Q 60 10 110 60 Q 60 110 10 60 Z" />
          <circle cx="60" cy="60" r="18" fill="white" stroke="none" />
          <line x1="20" y1="100" x2="100" y2="20" />
        </g>
        <g opacity="0" transform-origin="60 60" transform="scale(0.6)">
          <animateTransform attributeName="transform" type="scale" from="0.6" to="1" begin="0.16s" dur="0.42s" fill="freeze" calcMode="spline" keySplines="0 0 0.2 1" />
          <animate attributeName="opacity" from="0" to="1" begin="0.16s" dur="0.36s" fill="freeze" />
          <path d="M 15 30 H 105 V 80 H 45 L 20 100 V 80 H 15 Z" />
          <line x1="35" y1="55" x2="85" y2="55" stroke-width="6" stroke="rgba(255,255,255,0.3)"/>
          <circle cx="35" cy="55" r="5" fill="white" stroke="none">
            <animate attributeName="cx" values="35; 85; 35" dur="1.5s" repeatCount="indefinite" calcMode="spline" keySplines="0.4 0 0.2 1; 0.4 0 0.2 1" />
          </circle>
        </g>
      </g>
    </svg>`;
  }
  if (fromState === EYE_STATE_CLOSED && toState === EYE_STATE_OPEN) {
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" width="100%" height="100%">
      <g stroke="white" fill="none" stroke-width="8" stroke-linecap="round" stroke-linejoin="round">
        <g transform-origin="60 60">
          <animateTransform attributeName="transform" type="scale" values="1; 0.85; 1" begin="${begin}" dur="0.26s" calcMode="spline" keySplines="0.4 0 0.2 1; 0.4 0 0.2 1" />
          <path d="M 10 60 Q 60 10 110 60 Q 60 110 10 60 Z" />
          <circle cx="60" cy="60" r="18" fill="white" stroke="none" />
        </g>
        <line x1="20" y1="100" x2="100" y2="20" stroke-dasharray="120" stroke-dashoffset="0">
          <animate attributeName="stroke-dashoffset" from="0" to="120" begin="${begin}" dur="0.2s" fill="freeze" calcMode="spline" keySplines="0 0 0.2 1" />
        </line>
      </g>
    </svg>`;
  }
  return "";
}

function getEyeSvgDataUrl(markup) {
  return `data:image/svg+xml;utf8,${encodeURIComponent(String(markup || ""))}`;
}

function getQuickMenuButtonSvgMarkup() {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" aria-hidden="true">
    <path fill="#FFFFFF" fill-rule="evenodd" d="M19.14 12.94c.04-.3.06-.61.06-.94 0-.32-.02-.64-.06-.94l2.03-1.58c.18-.14.23-.41.12-.61l-1.92-3.32c-.12-.22-.37-.29-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54c-.04-.24-.24-.41-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.56-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22l-1.92 3.32c-.12.22-.07.49.12.61l2.03 1.58c-.04.3-.06.62-.06.94s.02.64.06.94l-2.03 1.58c-.18.14-.23.41-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .43-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.49-.12-.61l-2.03-1.58z M12 8.5c-1.93 0-3.5 1.57-3.5 3.5 0 1.05.47 2.01 1.22 2.66l-.47 1.84 1.95-1.04c.26.06.53.09.8.09 1.93 0 3.5-1.57 3.5-3.5S13.93 8.5 12 8.5z"/>
  </svg>`;
}

function getQuickMenuButtonSvgDataUrl() {
  return getEyeSvgDataUrl(getQuickMenuButtonSvgMarkup());
}

function setQuickMenuStatus(message = "", timeoutMs = 1600) {
  quickMenuStatusText = String(message || "");
  if (quickMenuStatusTimerId !== null) {
    clearTimeout(quickMenuStatusTimerId);
    quickMenuStatusTimerId = null;
  }
  if (quickMenuStatusText && timeoutMs > 0) {
    quickMenuStatusTimerId = setTimeout(() => {
      quickMenuStatusText = "";
      quickMenuStatusTimerId = null;
      updateEyeIconElement(true);
    }, timeoutMs);
  }
  updateEyeIconElement(true);
}

function formatQuickDebugClockTime(timestampMs) {
  const date = new Date(Number(timestampMs) || Date.now());
  const hh = String(date.getHours()).padStart(2, "0");
  const mm = String(date.getMinutes()).padStart(2, "0");
  const ss = String(date.getSeconds()).padStart(2, "0");
  return `${hh}:${mm}:${ss}`;
}

function normalizeQuickMenuRarityGeometricRatio(value) {
  return clamp(
    Number(value ?? DEFAULT_RARITY_GEOMETRIC_RATIO),
    MIN_RARITY_GEOMETRIC_RATIO,
    MAX_RARITY_GEOMETRIC_RATIO
  );
}

function getQuickMenuRareCommentsPresetByIndex(index) {
  const safeIndex = clamp(
    Math.round(Number(index || 0)),
    0,
    Math.max(0, QUICK_MENU_RARE_COMMENTS_PRESETS.length - 1)
  );
  return QUICK_MENU_RARE_COMMENTS_PRESETS[safeIndex] || QUICK_MENU_RARE_COMMENTS_PRESETS[2];
}

function getQuickMenuRareCommentsPresetIndexForRatio(ratio) {
  const normalized = Number(normalizeQuickMenuRarityGeometricRatio(ratio).toFixed(2));
  const exact = QUICK_MENU_RARE_COMMENTS_PRESETS.findIndex(
    (preset) => Number(preset.ratio.toFixed(2)) === normalized
  );
  if (exact >= 0) {
    return { index: exact, exact: true };
  }
  let nearestIndex = 0;
  let nearestDiff = Number.POSITIVE_INFINITY;
  QUICK_MENU_RARE_COMMENTS_PRESETS.forEach((preset, index) => {
    const diff = Math.abs(Number(preset.ratio) - normalized);
    if (diff < nearestDiff) {
      nearestDiff = diff;
      nearestIndex = index;
    }
  });
  return { index: nearestIndex, exact: false };
}

function updateQuickMenuRareCommentsControl(menu) {
  if (!menu) {
    return;
  }
  const slider = menu.querySelector(".js-rare-comments-slider");
  const value = menu.querySelector(".js-rare-comments-value");
  if (!slider || !value) {
    return;
  }
  const match = getQuickMenuRareCommentsPresetIndexForRatio(rarityGeometricRatio);
  const preset = getQuickMenuRareCommentsPresetByIndex(match.index);
  slider.value = String(match.index);
  value.textContent = match.exact ? preset.label : "Custom (Advanced)";
}

function pushQuickMenuScanDebugEvent(source, detail = "") {
  const sourceText = String(source || "unknown");
  const detailText = String(detail || "").trim();
  quickMenuScanDebugEntries.unshift({
    at: Date.now(),
    source: sourceText,
    detail: detailText
  });
  if (quickMenuScanDebugEntries.length > QUICK_MENU_SCAN_DEBUG_MAX_ENTRIES) {
    quickMenuScanDebugEntries.length = QUICK_MENU_SCAN_DEBUG_MAX_ENTRIES;
  }
  updateEyeIconElement();
}

function getQuickMenuLoadStatusText() {
  const timestampsCount = Number.isFinite(comments?.length) ? comments.length : 0;
  if (commentsLoadComplete) {
    const pagesFetched = Number.isFinite(commentsLoadPagesFetched)
      ? Math.max(0, Math.floor(commentsLoadPagesFetched))
      : null;
    if (pagesFetched !== null && pagesFetched > 0) {
      return `Timestamps loaded\n(${pagesFetched} pages, ${timestampsCount} timestamps)`;
    }
    return `Timestamps loaded\n(${timestampsCount} timestamps)`;
  }
  const pagesFetched = Number.isFinite(commentsLoadPagesFetched)
    ? Math.max(0, Math.floor(commentsLoadPagesFetched))
    : 0;
  if (pagesFetched > 0) {
    return `Timestamps loading...\n(${pagesFetched} pages scanned so far, ${timestampsCount} timestamps)`;
  }
  return `Timestamps loading...\n(${timestampsCount} timestamps)`;
}

function getQuickMenuTierCountDebugData() {
  const tierKeys = getTierKeys();
  if (!Array.isArray(tierKeys) || tierKeys.length === 0) {
    return [];
  }
  const countsByTier = new Map();
  const likeValuesByTier = new Map();
  tierKeys.forEach((tierKey) => countsByTier.set(String(tierKey), 0));
  tierKeys.forEach((tierKey) => likeValuesByTier.set(String(tierKey), new Set()));
  const loadedComments = Array.isArray(comments) ? comments : [];
  loadedComments.forEach((comment) => {
    if (!comment || isCommentTierHidden(comment)) {
      return;
    }
    const likesCount = Number(comment?.likes || 0);
    const tierKey = getTierName(getTierRank(likesCount, comment));
    if (!countsByTier.has(tierKey)) {
      countsByTier.set(tierKey, 0);
    }
    if (!likeValuesByTier.has(tierKey)) {
      likeValuesByTier.set(tierKey, new Set());
    }
    countsByTier.set(tierKey, Number(countsByTier.get(tierKey) || 0) + 1);
    likeValuesByTier.get(tierKey).add(Math.max(0, Math.floor(likesCount)));
  });
  return tierKeys.map((tierKey, index) => {
    const tierConfig = getTierConfigByKey(tierKey);
    const label =
      typeof tierConfig?.label === "string" && tierConfig.label.length > 0
        ? tierConfig.label
        : `(Tier ${index + 1})`;
    const likeValues = Array.from(likeValuesByTier.get(tierKey) || []);
    return {
      tierKey,
      label,
      count: Number(countsByTier.get(tierKey) || 0),
      likePoolCount: likeValues.length
    };
  });
}

function getQuickMenuSkinEntries() {
  if (rarityShared && raritySkinCatalog?.skins?.length) {
    return raritySkinCatalog.skins.map((skin) => ({
      id: normalizeRaritySkin(skin.id),
      name: String(skin.name || skin.id || "Skin")
    }));
  }
  return Object.keys(RARITY_SKINS || {}).map((skinId) => ({
    id: normalizeRaritySkin(skinId),
    name: String(RARITY_SKINS?.[skinId]?.name || skinId)
  }));
}

function setQuickMenuPanel(panelName) {
  quickMenuActivePanel = panelName === "skins" ? "skins" : "main";
  updateEyeIconElement(true);
  requestAnimationFrame(() => updateEyeIconElement(true));
}

function setQuickMenuOpen(nextOpen) {
  quickMenuOpen = Boolean(nextOpen);
  if (quickMenuOpen && commentDraftPopupOpen) {
    setCommentDraftPopupOpen(false, { resetDraft: true });
  }
  if (!quickMenuOpen) {
    quickMenuActivePanel = "main";
  }
  updateEyeIconElement(true);
}

function positionQuickMenu(button, menu) {
  if (!button || !menu) {
    return;
  }
  const buttonRect = button.getBoundingClientRect();
  const menuWidth = 270;
  const menuHeight = Math.max(220, menu.offsetHeight || 0);
  const viewportWidth = window.innerWidth || document.documentElement.clientWidth || 1280;
  const viewportHeight = window.innerHeight || document.documentElement.clientHeight || 720;
  const desiredLeft = Math.round(buttonRect.left + (buttonRect.width / 2) - (menuWidth / 2));
  const desiredTop = Math.round(buttonRect.top - menuHeight - 10);
  const clampedLeft = Math.min(Math.max(8, desiredLeft), Math.max(8, viewportWidth - menuWidth - 8));
  const clampedTop = Math.min(Math.max(8, desiredTop), Math.max(8, viewportHeight - menuHeight - 8));
  menu.style.left = `${clampedLeft}px`;
  menu.style.top = `${clampedTop}px`;
  menu.style.bottom = "auto";
  menu.style.right = "auto";
}

function getCommentDraftShortcutHint() {
  try {
    return /Mac|iPhone|iPad|iPod/i.test(navigator.platform || "")
      ? COMMENT_DRAFT_SHORTCUT_HINT_MAC
      : COMMENT_DRAFT_SHORTCUT_HINT_WIN;
  } catch (_error) {
    return COMMENT_DRAFT_SHORTCUT_HINT_WIN;
  }
}

function isEditableElement(node) {
  const element = node instanceof Element ? node : node?.parentElement;
  if (!element) {
    return false;
  }
  if (element.closest("textarea, input, [contenteditable='true'], [contenteditable='']")) {
    return true;
  }
  return false;
}

function getCommentDraftPopupHost() {
  return overlayElement || getOverlayHost() || document.body;
}

function getCommentDraftPopupTextareaValue() {
  return String(commentDraftTextareaElement?.value || "");
}

function autosizeCommentDraftTextarea() {
  const textarea = commentDraftTextareaElement;
  if (!textarea) {
    return;
  }
  const minHeightPx = 40;
  const maxHeightPx = 220;
  textarea.style.height = `${minHeightPx}px`;
  const scrollHeight = Math.max(minHeightPx, Number(textarea.scrollHeight) || minHeightPx);
  const nextHeight = Math.min(maxHeightPx, scrollHeight);
  textarea.style.height = `${nextHeight}px`;
  textarea.style.overflowY = scrollHeight > maxHeightPx ? "auto" : "hidden";
}

function setCommentDraftStatus(text = "", tone = "") {
  commentDraftStatusText = String(text || "");
  commentDraftStatusTone = String(tone || "");
  updateCommentDraftPopupView();
}

function resetCommentDraftPopupState() {
  commentDraftTimestampSeconds = null;
  commentDraftStatusText = "";
  commentDraftStatusTone = "";
  if (commentDraftTextareaElement) {
    commentDraftTextareaElement.value = "";
    autosizeCommentDraftTextarea();
  }
}

function formatDraftTimestamp(seconds) {
  return formatTime(Math.max(0, Number(seconds) || 0));
}

function makeCommentDraftPrefillText(seconds) {
  return `${formatDraftTimestamp(seconds)} `;
}

function replaceDraftTimestampPrefix(textValue, seconds) {
  const nextTimestamp = formatDraftTimestamp(seconds);
  const nextPrefix = `${nextTimestamp} `;
  const text = String(textValue || "");
  const match = COMMENT_DRAFT_TIMESTAMP_PREFIX_REGEX.exec(text);
  if (match) {
    return `${nextPrefix}${text.slice(match[0].length)}`;
  }
  if (COMMENT_DRAFT_TIMESTAMP_ANY_REGEX.test(text)) {
    return text.replace(COMMENT_DRAFT_TIMESTAMP_ANY_REGEX, nextTimestamp);
  }
  return `${nextPrefix}${text}`;
}

function setCommentDraftPopupNotificationsSuppressed(nextSuppressed) {
  notificationsSuppressedByDraftPopup = Boolean(nextSuppressed);
  if (overlayElement) {
    overlayElement.classList.toggle(
      "comment-draft-popup-open",
      notificationsSuppressedByDraftPopup
    );
  }
}

function positionCommentDraftPopup() {
  if (!commentDraftPopupElement || !commentDraftPopupElement.isConnected) {
    return;
  }
  const host = getCommentDraftPopupHost();
  const bottomPx = COMMENT_DRAFT_POPUP_DEFAULT_BOTTOM_PX;
  if (host !== document.body && window.getComputedStyle(host).position === "static") {
    host.style.position = "relative";
  }
  const isTop = position === "top-left" || position === "top-right";
  const isRight = position === "top-right" || position === "bottom-right";
  const topBottomPx = isTop ? COMMENT_DRAFT_POPUP_DEFAULT_BOTTOM_PX : bottomPx;
  commentDraftPopupElement.style.left = isRight ? "auto" : `${COMMENT_DRAFT_POPUP_DEFAULT_LEFT_PX}px`;
  commentDraftPopupElement.style.right = isRight ? `${COMMENT_DRAFT_POPUP_DEFAULT_LEFT_PX}px` : "auto";
  commentDraftPopupElement.style.top = isTop ? `${topBottomPx}px` : "auto";
  commentDraftPopupElement.style.bottom = isTop ? "auto" : `${topBottomPx}px`;
}

function updateCommentDraftTimestampUi() {
  if (!commentDraftPopupElement) {
    return;
  }
  const label = commentDraftPopupElement.querySelector(".js-comment-draft-timestamp");
  if (label) {
    label.textContent =
      commentDraftTimestampSeconds === null
        ? "0:00"
        : formatDraftTimestamp(commentDraftTimestampSeconds);
  }
}

function updateCommentDraftPopupView() {
  const popup = commentDraftPopupElement;
  if (!popup) {
    return;
  }
  popup.classList.toggle("open", commentDraftPopupOpen);
  popup.setAttribute("aria-hidden", commentDraftPopupOpen ? "false" : "true");
  updateCommentDraftTimestampUi();
  const hint = popup.querySelector(".js-comment-draft-shortcut");
  if (hint) {
    hint.textContent = getCommentDraftShortcutHint();
  }
  const status = popup.querySelector(".js-comment-draft-status");
  if (status) {
    status.textContent = commentDraftStatusText || "";
    status.hidden = !commentDraftStatusText;
    status.classList.toggle("is-error", commentDraftStatusTone === "error");
    status.classList.toggle("is-success", commentDraftStatusTone === "success");
  }
  const textarea = popup.querySelector(".js-comment-draft-textarea");
  if (textarea && textarea !== commentDraftTextareaElement) {
    commentDraftTextareaElement = textarea;
  }
  setCommentDraftPopupNotificationsSuppressed(commentDraftPopupOpen);
  positionCommentDraftPopup();
}

function ensureCommentDraftPopup() {
  const host = getCommentDraftPopupHost();
  if (!host) {
    return null;
  }
  if (host !== document.body && window.getComputedStyle(host).position === "static") {
    host.style.position = "relative";
  }
  if (commentDraftPopupElement && commentDraftPopupElement.isConnected) {
    if (commentDraftPopupElement.parentElement !== host) {
      host.appendChild(commentDraftPopupElement);
    }
    updateCommentDraftPopupView();
    return commentDraftPopupElement;
  }
  const popup = document.createElement("div");
  popup.className = "__tc-comment-draft-popup";
  popup.setAttribute("role", "dialog");
  popup.setAttribute("aria-label", "Timestamp comment draft");
  popup.setAttribute("aria-hidden", "true");
  popup.innerHTML = `
    <div class="__tc-comment-draft-bar">
      <div class="__tc-comment-draft-stack" aria-label="Timestamp adjuster">
        <button type="button" class="__tc-comment-draft-small-btn __tc-comment-draft-step js-comment-draft-step" data-step="1" aria-label="Move timestamp forward 1 second" title="Timestamp +1s">+</button>
        <button type="button" class="__tc-comment-draft-small-btn __tc-comment-draft-step js-comment-draft-step" data-step="-1" aria-label="Move timestamp back 1 second" title="Timestamp -1s">-</button>
      </div>
      <textarea class="__tc-comment-draft-textarea js-comment-draft-textarea" rows="1" spellcheck="true" placeholder="Write..." aria-label="Comment draft"></textarea>
      <div class="__tc-comment-draft-group __tc-comment-draft-group-attached">
        <button type="button" class="__tc-comment-draft-clear js-comment-draft-clear" aria-label="Close draft popup" title="Close">×</button>
        <button type="button" class="__tc-comment-draft-post js-comment-draft-post" aria-label="Insert into YouTube comment box" title="Insert into comment box">Post</button>
      </div>
    </div>
    <div class="__tc-comment-draft-status js-comment-draft-status" hidden></div>
  `;
  host.appendChild(popup);
  commentDraftPopupElement = popup;
  commentDraftTextareaElement = popup.querySelector(".js-comment-draft-textarea");

  popup.addEventListener("click", (event) => {
    event.stopPropagation();
  });
  const stopPopupKeyEvent = (event) => {
    event.stopPropagation();
    if (event.type === "keydown" && event.key === "Escape") {
      event.preventDefault();
      setCommentDraftPopupOpen(false, { resetDraft: true });
    }
  };
  popup.addEventListener("keydown", stopPopupKeyEvent);
  popup.addEventListener("keyup", stopPopupKeyEvent);
  popup.addEventListener("keypress", stopPopupKeyEvent);
  const clearBtn = popup.querySelector(".js-comment-draft-clear");
  if (clearBtn) {
    clearBtn.addEventListener("click", () => {
      setCommentDraftPopupOpen(false, { resetDraft: true });
    });
  }
  popup.querySelectorAll(".js-comment-draft-step").forEach((button) => {
    button.addEventListener("click", () => {
      const delta = Number(button.getAttribute("data-step") || 0);
      nudgeCommentDraftTimestamp(delta);
    });
  });
  const postBtn = popup.querySelector(".js-comment-draft-post");
  if (postBtn) {
    postBtn.addEventListener("click", async () => {
      await insertCommentDraftIntoYouTubeComposer();
    });
  }
  if (commentDraftTextareaElement) {
    commentDraftTextareaElement.addEventListener("input", () => {
      autosizeCommentDraftTextarea();
      if (commentDraftStatusText) {
        setCommentDraftStatus("", "");
      }
    });
  }
  updateCommentDraftPopupView();
  return popup;
}

function focusCommentDraftTextareaAtEnd(openSeq = commentDraftOpenSeq) {
  requestAnimationFrame(() => {
    if (!commentDraftPopupOpen || openSeq !== commentDraftOpenSeq) {
      return;
    }
    const textarea = commentDraftTextareaElement;
    if (!textarea) {
      return;
    }
    textarea.focus({ preventScroll: true });
    const end = textarea.value.length;
    textarea.setSelectionRange(end, end);
  });
}

function setCommentDraftPopupOpen(nextOpen, options = {}) {
  const open = Boolean(nextOpen);
  ensureCommentDraftPopup();
  if (!commentDraftPopupElement) {
    return;
  }
  if (!open) {
    commentDraftPopupOpen = false;
    if (options.resetDraft !== false) {
      resetCommentDraftPopupState();
    }
    updateCommentDraftPopupView();
    return;
  }
  if (quickMenuOpen) {
    setQuickMenuOpen(false);
  }
  const video = getVideo();
  const rawTime = Number(video?.currentTime || 0);
  commentDraftTimestampSeconds = Math.max(0, Number.isFinite(rawTime) ? rawTime : 0);
  commentDraftStatusText = "";
  commentDraftStatusTone = "";
  commentDraftPopupOpen = true;
  if (commentDraftTextareaElement) {
    commentDraftTextareaElement.value = makeCommentDraftPrefillText(commentDraftTimestampSeconds);
    autosizeCommentDraftTextarea();
  }
  commentDraftOpenSeq += 1;
  updateCommentDraftPopupView();
  focusCommentDraftTextareaAtEnd(commentDraftOpenSeq);
}

function nudgeCommentDraftTimestamp(deltaSeconds) {
  const delta = Math.trunc(Number(deltaSeconds) || 0);
  if (!delta) {
    return;
  }
  const video = getVideo();
  if (!video) {
    setCommentDraftStatus("No video found on this page.", "error");
    return;
  }
  const duration = Number(video.duration);
  const maxTime = Number.isFinite(duration) && duration > 0 ? duration : Number.POSITIVE_INFINITY;
  const base = Number.isFinite(Number(commentDraftTimestampSeconds))
    ? Number(commentDraftTimestampSeconds)
    : Number(video.currentTime || 0);
  const next = clamp(base + delta, 0, maxTime);
  commentDraftTimestampSeconds = next;
  try {
    video.pause();
  } catch (_error) {}
  try {
    video.currentTime = next;
  } catch (_error) {}
  if (commentDraftTextareaElement) {
    commentDraftTextareaElement.value = replaceDraftTimestampPrefix(
      commentDraftTextareaElement.value,
      next
    );
    autosizeCommentDraftTextarea();
  }
  setCommentDraftStatus("", "");
}

async function waitForElement(getter, timeoutMs = 1800, stepMs = 60) {
  const started = Date.now();
  while (Date.now() - started < timeoutMs) {
    const node = getter();
    if (node) {
      return node;
    }
    await new Promise((resolve) => setTimeout(resolve, stepMs));
  }
  return getter() || null;
}

function getYouTubeCommentSimplebox() {
  return (
    document.querySelector("ytd-comments ytd-comment-simplebox-renderer") ||
    document.querySelector("ytd-comment-simplebox-renderer")
  );
}

function getYouTubeCommentComposerEditor() {
  return (
    document.querySelector("ytd-comments ytd-comment-simplebox-renderer #contenteditable-root[contenteditable='true']") ||
    document.querySelector("ytd-comments ytd-comment-simplebox-renderer div[contenteditable='true'][role='textbox']") ||
    document.querySelector("ytd-comments #contenteditable-root[contenteditable='true']") ||
    document.querySelector("ytd-comments div[contenteditable='true'][role='textbox']")
  );
}

function getYouTubeCommentComposerActivator(simplebox) {
  if (!simplebox) {
    return null;
  }
  return (
    simplebox.querySelector("#simple-box") ||
    simplebox.querySelector("#placeholder-area") ||
    simplebox.querySelector("#placeholder") ||
    simplebox.querySelector('[role="button"]')
  );
}

function dispatchInputEventsForContentEditable(editor) {
  try {
    editor.dispatchEvent(new InputEvent("input", { bubbles: true, inputType: "insertText" }));
  } catch (_error) {
    editor.dispatchEvent(new Event("input", { bubbles: true }));
  }
}

function replaceContentEditableText(editor, text) {
  if (!editor) {
    return false;
  }
  try {
    editor.focus({ preventScroll: true });
  } catch (_error) {
    try {
      editor.focus();
    } catch (__error) {}
  }

  const selection = window.getSelection?.();
  if (selection && typeof document.createRange === "function") {
    const range = document.createRange();
    range.selectNodeContents(editor);
    selection.removeAllRanges();
    selection.addRange(range);
  }

  let inserted = false;
  try {
    inserted = Boolean(document.execCommand && document.execCommand("insertText", false, text));
  } catch (_error) {
    inserted = false;
  }

  if (!inserted) {
    editor.textContent = text;
    dispatchInputEventsForContentEditable(editor);
    return true;
  }

  dispatchInputEventsForContentEditable(editor);
  return true;
}

async function tryClipboardFallbackForCommentDraft(text) {
  try {
    if (navigator?.clipboard?.writeText) {
      await navigator.clipboard.writeText(text);
      return true;
    }
  } catch (_error) {}
  return false;
}

async function insertCommentDraftIntoYouTubeComposer() {
  const draftText = getCommentDraftPopupTextareaValue();
  if (!draftText.trim()) {
    setCommentDraftStatus("Write something before posting to comment box.", "error");
    return false;
  }

  let simplebox = getYouTubeCommentSimplebox();
  if (!simplebox) {
    setCommentDraftStatus("Comments unavailable on this video.", "error");
    const copied = await tryClipboardFallbackForCommentDraft(draftText);
    if (copied) {
      setCommentDraftPopupOpen(false, { resetDraft: true });
      return true;
    }
    setCommentDraftStatus("Comments unavailable on this video.", "error");
    return false;
  }

  try {
    simplebox.scrollIntoView({ block: "center", behavior: "smooth" });
  } catch (_error) {}

  let editor = getYouTubeCommentComposerEditor();
  if (!editor) {
    const activator = getYouTubeCommentComposerActivator(simplebox);
    if (activator) {
      try {
        activator.click();
      } catch (_error) {}
    }
    editor = await waitForElement(() => getYouTubeCommentComposerEditor(), 2200, 70);
  }

  if (!editor) {
    const copied = await tryClipboardFallbackForCommentDraft(draftText);
    if (copied) {
      setCommentDraftPopupOpen(false, { resetDraft: true });
      return true;
    }
    setCommentDraftStatus("Couldn't find YouTube comment box.", "error");
    return false;
  }

  const inserted = replaceContentEditableText(editor, draftText);
  if (!inserted) {
    const copied = await tryClipboardFallbackForCommentDraft(draftText);
    if (copied) {
      setCommentDraftPopupOpen(false, { resetDraft: true });
      return true;
    }
    setCommentDraftStatus("Couldn't insert into YouTube comment box.", "error");
    return false;
  }

  setCommentDraftPopupOpen(false, { resetDraft: true });
  return true;
}

function attachCommentDraftPopupHandlersOnce() {
  if (commentDraftHotkeyHandlersAttached) {
    return;
  }
  commentDraftHotkeyHandlersAttached = true;
  document.addEventListener("keydown", (event) => {
    if (event.defaultPrevented) {
      return;
    }
    if (event.repeat) {
      return;
    }
    if (event.altKey) {
      return;
    }
    const key = String(event.key || "").toLowerCase();
    if (key !== "a") {
      return;
    }
    const modPressed = Boolean(event.metaKey || event.ctrlKey);
    if (!modPressed || !event.shiftKey) {
      return;
    }

    const target = event.target;
    const insideDraftPopup =
      target instanceof Node &&
      commentDraftPopupElement &&
      commentDraftPopupElement.contains(target);
    if (isEditableElement(target) && !insideDraftPopup) {
      return;
    }

    event.preventDefault();
    event.stopPropagation();
    if (typeof event.stopImmediatePropagation === "function") {
      event.stopImmediatePropagation();
    }

    setCommentDraftPopupOpen(!commentDraftPopupOpen, { resetDraft: true });
  }, true);
}

function repositionQuickMenuIfOpen() {
  if (!quickMenuOpen || !eyeToggleElement || !quickMenuMenuElement) {
    return;
  }
  const button = eyeToggleElement.querySelector(".tc-yt-settings-btn");
  if (!button || !quickMenuMenuElement.isConnected) {
    return;
  }
  positionQuickMenu(button, quickMenuMenuElement);
}

async function setGlobalOverlayActiveFromQuickMenu(nextValue) {
  const next = Boolean(nextValue);
  isActive = next;
  if (next) {
    localOverlayForceEnabledWhileGlobalOff = false;
  }
  try {
    const maybePromise = chrome.storage.sync.set({ active: next });
    if (maybePromise && typeof maybePromise.catch === "function") {
      maybePromise.catch(() => {});
    }
  } catch (error) {}
  try {
    await chrome.runtime.sendMessage({ type: "isActive", status: next });
  } catch (error) {}
  if (!next) {
    pauseTimestampRuntime();
  } else {
    resumeTimestampRuntime({ runScan: shouldRunFreshScanOnResume() });
  }
  updateEyeToggleVisibility();
}

function setLocalNotificationsMutedFromQuickMenu(nextValue) {
  if (!isActive) {
    localOverlayForceEnabledWhileGlobalOff = !Boolean(nextValue);
  } else {
    notificationsMutedByEye = Boolean(nextValue);
    localOverlayForceEnabledWhileGlobalOff = false;
  }
  if (!isOverlayRuntimeEnabled()) {
    pauseTimestampRuntime();
  } else {
    resumeTimestampRuntime({ runScan: shouldRunFreshScanOnResume() });
  }
  updateEyeToggleVisibility();
}

async function sendQuickOverlaySettingPatch(patch = {}) {
  try {
    if (patch && typeof patch === "object") {
      const storagePatch = {};
      if (Object.prototype.hasOwnProperty.call(patch, "heatmapEnabled")) {
        storagePatch.heatmapEnabled = Boolean(patch.heatmapEnabled);
      }
      if (Object.prototype.hasOwnProperty.call(patch, "showUpcomingDot")) {
        storagePatch.showUpcomingDot = Boolean(patch.showUpcomingDot);
      }
      if (Object.prototype.hasOwnProperty.call(patch, "timelineMarkersEnabled")) {
        storagePatch.timelineMarkersEnabled = Boolean(patch.timelineMarkersEnabled);
      }
      if (Object.prototype.hasOwnProperty.call(patch, "overlayScale")) {
        storagePatch.overlayScale = clamp(
          Number(patch.overlayScale ?? overlayScale),
          MIN_OVERLAY_SCALE,
          MAX_OVERLAY_SCALE
        );
      }
      if (Object.prototype.hasOwnProperty.call(patch, "overlayAvatarSize")) {
        storagePatch.overlayAvatarSize = clamp(
          Number(patch.overlayAvatarSize ?? overlayAvatarSize),
          MIN_OVERLAY_AVATAR_SIZE,
          MAX_OVERLAY_AVATAR_SIZE
        );
      }
      if (Object.prototype.hasOwnProperty.call(patch, "showAuthorInNotifications")) {
        storagePatch.showAuthorInNotifications = Boolean(patch.showAuthorInNotifications);
      }
      if (Object.prototype.hasOwnProperty.call(patch, "showLikesInNotifications")) {
        storagePatch.showLikesInNotifications = Boolean(patch.showLikesInNotifications);
      }
      if (Object.prototype.hasOwnProperty.call(patch, "showRarityLabelInNotifications")) {
        storagePatch.showRarityLabelInNotifications = Boolean(patch.showRarityLabelInNotifications);
      }
      if (Object.prototype.hasOwnProperty.call(patch, "presetProfile")) {
        storagePatch.presetProfile =
          String(patch.presetProfile) === "minimal" ? "minimal" : "balanced";
      }
      if (Object.prototype.hasOwnProperty.call(patch, "raritySkin")) {
        storagePatch.raritySkin = normalizeRaritySkin(patch.raritySkin);
        storagePatch.activeRaritySkinId = storagePatch.raritySkin;
      }
      if (Object.prototype.hasOwnProperty.call(patch, "rarityGeometricRatio")) {
        storagePatch.rarityGeometricRatio = normalizeQuickMenuRarityGeometricRatio(
          patch.rarityGeometricRatio
        );
      }
      if (Object.keys(storagePatch).length > 0) {
        const maybePromise = chrome.storage.sync.set(storagePatch);
        if (maybePromise && typeof maybePromise.catch === "function") {
          maybePromise.catch(() => {});
        }
      }
    }
  } catch (error) {}

  try {
    await chrome.runtime.sendMessage({
      type: "overlaySettings",
      ...patch
    });
  } catch (error) {}
}

async function setHeatmapEnabledFromQuickMenu(nextValue) {
  heatmapEnabled = Boolean(nextValue);
  await sendQuickOverlaySettingPatch({ heatmapEnabled });
  scheduleRenderTimeMarkers();
}

async function setTimelineMarkersEnabledFromQuickMenu(nextValue) {
  timelineMarkersEnabled = Boolean(nextValue);
  await sendQuickOverlaySettingPatch({ timelineMarkersEnabled });
  scheduleRenderTimeMarkers();
}

async function setShowUpcomingDotFromQuickMenu(nextValue) {
  showUpcomingDot = Boolean(nextValue);
  if (!showUpcomingDot) {
    setUpcomingDotVisible(false);
  }
  await sendQuickOverlaySettingPatch({ showUpcomingDot });
  scheduleRenderTimeMarkers();
}

async function setMinimalModeFromQuickMenu(nextValue) {
  const enableMinimal = Boolean(nextValue);
  let patch = null;

  if (enableMinimal) {
    const minimalBackup = {
      overlayScale: clamp(Number(overlayScale ?? DEFAULT_OVERLAY_SCALE), MIN_OVERLAY_SCALE, MAX_OVERLAY_SCALE),
      overlayAvatarSize: clamp(
        Number(overlayAvatarSize ?? DEFAULT_OVERLAY_AVATAR_SIZE),
        MIN_OVERLAY_AVATAR_SIZE,
        MAX_OVERLAY_AVATAR_SIZE
      ),
      showAuthorInNotifications: Boolean(showAuthorInNotifications),
      showLikesInNotifications: Boolean(showLikesInNotifications),
      showRarityLabelInNotifications: Boolean(showRarityLabelInNotifications)
    };
    try {
      await chrome.storage.sync.set({ [MINIMAL_MODE_BACKUP_SYNC_KEY]: minimalBackup });
    } catch (error) {
      // Ignore backup write failures.
    }
    patch = {
      presetProfile: "minimal",
      overlayScale: clamp(
        Number(minimalBackup.overlayScale) - 0.1,
        MIN_OVERLAY_SCALE,
        MAX_OVERLAY_SCALE
      ),
      overlayAvatarSize: 22,
      showAuthorInNotifications: false,
      showLikesInNotifications: false,
      showRarityLabelInNotifications: false
    };
  } else {
    let backup = null;
    try {
      const backupState = await chrome.storage.sync.get([MINIMAL_MODE_BACKUP_SYNC_KEY]);
      backup = backupState?.[MINIMAL_MODE_BACKUP_SYNC_KEY] || null;
    } catch (error) {
      backup = null;
    }
    patch = {
      presetProfile: "balanced",
      ...(backup && typeof backup === "object"
        ? {
            overlayScale: clamp(
              Number(backup.overlayScale ?? DEFAULT_OVERLAY_SCALE),
              MIN_OVERLAY_SCALE,
              MAX_OVERLAY_SCALE
            ),
            overlayAvatarSize: clamp(
              Number(backup.overlayAvatarSize ?? DEFAULT_OVERLAY_AVATAR_SIZE),
              MIN_OVERLAY_AVATAR_SIZE,
              MAX_OVERLAY_AVATAR_SIZE
            ),
            showAuthorInNotifications: Boolean(
              backup.showAuthorInNotifications ?? DEFAULT_SHOW_AUTHOR_IN_NOTIFICATIONS
            ),
            showLikesInNotifications: Boolean(
              backup.showLikesInNotifications ?? DEFAULT_SHOW_LIKES_IN_NOTIFICATIONS
            ),
            showRarityLabelInNotifications: Boolean(
              backup.showRarityLabelInNotifications ?? DEFAULT_SHOW_RARITY_LABEL_IN_NOTIFICATIONS
            )
          }
        : {})
    };
    try {
      await chrome.storage.sync.remove(MINIMAL_MODE_BACKUP_SYNC_KEY);
    } catch (error) {
      // Ignore cleanup failures.
    }
  }

  presetProfile = String(patch.presetProfile || "balanced") === "minimal" ? "minimal" : "balanced";
  if (Object.prototype.hasOwnProperty.call(patch, "overlayScale")) {
    overlayScale = clamp(Number(patch.overlayScale), MIN_OVERLAY_SCALE, MAX_OVERLAY_SCALE);
  }
  if (Object.prototype.hasOwnProperty.call(patch, "overlayAvatarSize")) {
    overlayAvatarSize = clamp(
      Number(patch.overlayAvatarSize),
      MIN_OVERLAY_AVATAR_SIZE,
      MAX_OVERLAY_AVATAR_SIZE
    );
  }
  if (Object.prototype.hasOwnProperty.call(patch, "showAuthorInNotifications")) {
    showAuthorInNotifications = Boolean(patch.showAuthorInNotifications);
  }
  if (Object.prototype.hasOwnProperty.call(patch, "showLikesInNotifications")) {
    showLikesInNotifications = Boolean(patch.showLikesInNotifications);
  }
  if (Object.prototype.hasOwnProperty.call(patch, "showRarityLabelInNotifications")) {
    showRarityLabelInNotifications = Boolean(patch.showRarityLabelInNotifications);
  }

  refreshActiveCardVisualsForCurrentSkin();
  applyOverlayStyles();
  pushReactNotificationOverlayState();
  updateEyeToggleVisibility();
  await sendQuickOverlaySettingPatch(patch);
}

async function setRaritySkinFromQuickMenu(nextSkinId) {
  const nextSkin = normalizeRaritySkin(nextSkinId);
  if (!nextSkin || nextSkin === raritySkin) {
    setQuickMenuPanel("main");
    return;
  }
  raritySkin = nextSkin;
  tabSessionRaritySkinOverride = nextSkin;
  const activeRaritySkinConfig = rarityShared
    ? rarityShared.deepClone(rarityShared.getSkinById(raritySkinCatalog, nextSkin))
    : null;
  await sendQuickOverlaySettingPatch({
    raritySkin: nextSkin,
    activeRaritySkinId: nextSkin,
    activeRaritySkinConfig,
    raritySkinCatalogRevision
  });
  scheduleRenderTimeMarkers();
  const video = getVideo();
  if (video) {
    scheduleReconcile(video.currentTime);
  }
  const nextSkinName =
    rarityShared && raritySkinCatalog
      ? rarityShared.getSkinById(raritySkinCatalog, nextSkin)?.name || nextSkin
      : nextSkin;
  setQuickMenuStatus(`Skin: ${nextSkinName}`);
  setQuickMenuPanel("main");
}

async function triggerRescanFromQuickMenu() {
  const videoId = getVideoId();
  if (!videoId) {
    setQuickMenuStatus("Open a YouTube video first.");
    return;
  }
  setQuickMenuStatus("Rescan started.");
  pushQuickMenuScanDebugEvent("manual_rescan", `video=${videoId}`);
  try {
    await chrome.runtime.sendMessage({ type: "rescan_now", videoId });
  } catch (error) {
    setQuickMenuStatus("Rescan failed.", 2200);
    return;
  }
}

function attachQuickMenuGlobalHandlersOnce() {
  if (quickMenuGlobalDocumentHandlersAttached) {
    return;
  }
  quickMenuGlobalDocumentHandlersAttached = true;
  document.addEventListener("click", (event) => {
    if (!quickMenuOpen || !eyeToggleElement) {
      return;
    }
    if (eyeToggleElement.contains(event.target)) {
      return;
    }
    setQuickMenuOpen(false);
  });
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && quickMenuOpen) {
      setQuickMenuOpen(false);
    }
  });
  window.addEventListener(
    "scroll",
    () => {
      repositionQuickMenuIfOpen();
    },
    { capture: true, passive: true }
  );
  window.addEventListener(
    "resize",
    () => {
      repositionQuickMenuIfOpen();
    },
    { passive: true }
  );
}

function ensureQuickMenuContent() {
  if (!eyeToggleElement) {
    return null;
  }
  let button = eyeToggleElement.querySelector(".tc-yt-settings-btn");
  let menu = quickMenuMenuElement;
  if (button && menu) {
    return { button, menu };
  }
  if (!button) {
    eyeToggleElement.innerHTML = `
      <button class="ytp-button tc-yt-settings-btn" type="button" aria-label="Timestamp Chatter quick menu" title="Timestamp Chatter quick menu">
        <span class="tc-yt-settings-btn-icon"><img class="tc-yt-settings-btn-icon-img" alt="" src="${getQuickMenuButtonSvgDataUrl()}"></span>
      </button>
    `;
  }

  if (!quickMenuMenuElement || !quickMenuMenuElement.isConnected) {
    const host = getOverlayHost() || document.body;
    quickMenuMenuElement = document.createElement("div");
    quickMenuMenuElement.className = "tc-yt-quick-menu";
    quickMenuMenuElement.setAttribute("role", "menu");
    quickMenuMenuElement.setAttribute("aria-hidden", "true");
    quickMenuMenuElement.innerHTML = `
      <div class="menu-panel menu-panel-main active" data-panel="main">
        <div class="menu-item" data-action="toggle-global"><span>Overlay enabled</span><div class="toggle-switch"></div></div>
        <div class="menu-item" data-action="toggle-local"><span>This Tab (on)</span><div class="toggle-switch"></div></div>
        <div class="menu-item" data-action="toggle-minimal"><span>Minimal mode</span><div class="toggle-switch"></div></div>
        <div class="menu-item" data-action="toggle-markers"><span>Timeline Markers</span><div class="toggle-switch"></div></div>
        <div class="menu-item" data-action="toggle-heatmap"><span>Heatmap</span><div class="toggle-switch"></div></div>
        <div class="menu-item" data-action="toggle-dot"><span>Warning dot</span><div class="toggle-switch"></div></div>
        <div class="menu-item" data-action="open-skins"><span>Rarity skin</span><span class="selected-value js-current-skin"></span></div>
        <div class="menu-item-status menu-item-status-control" data-role="rare-comments-control">
          <div class="menu-control-row">
            <span>Amount of rare comments</span>
            <span class="selected-value js-rare-comments-value">Medium</span>
          </div>
          <input class="menu-control-slider js-rare-comments-slider" type="range" min="0" max="4" step="1" value="2" />
        </div>
        <div class="menu-item" data-action="rescan"><span>Rescan Comments</span><span class="selected-value">Click to scan now</span></div>
        <div class="menu-item menu-item-status menu-item-status-load" data-role="load-status">
          <span class="selected-value js-load-status-text"></span>
          <span class="selected-value js-load-status-note" hidden></span>
        </div>
        <div class="menu-item-status menu-item-status-debug" data-role="debug-root" hidden>
          <details class="js-debug-details">
            <summary class="js-debug-summary">Debug</summary>
            <div class="menu-debug-section" data-role="tier-debug" hidden>
              <div class="menu-debug-title js-tier-debug-summary">Notifications per tier</div>
              <div class="js-tier-debug-body"></div>
            </div>
            <div class="menu-debug-section" data-role="scan-debug" hidden>
              <div class="menu-debug-title js-scan-debug-summary">Scan / rescan sources</div>
              <div class="js-scan-debug-body"></div>
            </div>
          </details>
        </div>
        <div class="menu-item menu-item-status" data-role="status" hidden><span class="selected-value js-status-text"></span></div>
      </div>
      <div class="menu-panel menu-panel-skins" data-panel="skins">
        <div class="menu-header" data-action="back-main">&lt; Rarity skin</div>
        <div class="menu-list js-skin-list"></div>
      </div>
    `;
    host.appendChild(quickMenuMenuElement);
  }

  button = eyeToggleElement.querySelector(".tc-yt-settings-btn");
  menu = quickMenuMenuElement;
  if (!button || !menu) {
    return null;
  }

  button.addEventListener("click", (event) => {
    event.preventDefault();
    event.stopPropagation();
    if (commentsLoadComplete) {
      button.classList.remove("is-click-spin");
      // Restart the click animation if user clicks repeatedly.
      void button.offsetWidth;
      button.classList.add("is-click-spin");
    }
    setQuickMenuOpen(!quickMenuOpen);
  });
  button.addEventListener("animationend", () => {
    button.classList.remove("is-click-spin");
  });

  eyeToggleElement.addEventListener("click", (event) => {
    event.stopPropagation();
  });

  menu.addEventListener("click", async (event) => {
    event.stopPropagation();
    const item = event.target.closest(".menu-item, .menu-header");
    if (!item) {
      return;
    }
    event.preventDefault();
    const action = item.getAttribute("data-action") || "";
    if (action === "toggle-global") {
      await setGlobalOverlayActiveFromQuickMenu(!isActive);
      return;
    }
    if (action === "toggle-local") {
      setLocalNotificationsMutedFromQuickMenu(isTabOverlayEnabled());
      return;
    }
    if (action === "toggle-minimal") {
      await setMinimalModeFromQuickMenu(presetProfile !== "minimal");
      return;
    }
    if (action === "toggle-markers") {
      await setTimelineMarkersEnabledFromQuickMenu(!timelineMarkersEnabled);
      return;
    }
    if (action === "toggle-heatmap") {
      await setHeatmapEnabledFromQuickMenu(!heatmapEnabled);
      return;
    }
    if (action === "toggle-dot") {
      await setShowUpcomingDotFromQuickMenu(!showUpcomingDot);
      return;
    }
    if (action === "open-skins") {
      setQuickMenuPanel("skins");
      return;
    }
    if (action === "back-main") {
      setQuickMenuPanel("main");
      return;
    }
    if (action === "rescan") {
      await triggerRescanFromQuickMenu();
      return;
    }
    if (action === "select-skin") {
      const skinId = item.getAttribute("data-skin-id") || "";
      await setRaritySkinFromQuickMenu(skinId);
      return;
    }
  });

  const rareCommentsSlider = menu.querySelector(".js-rare-comments-slider");
  if (rareCommentsSlider) {
    rareCommentsSlider.addEventListener("input", () => {
      const preset = getQuickMenuRareCommentsPresetByIndex(rareCommentsSlider.value);
      const value = menu.querySelector(".js-rare-comments-value");
      if (value) {
        value.textContent = preset?.label || "Medium";
      }
    });
    rareCommentsSlider.addEventListener("change", async () => {
      const preset = getQuickMenuRareCommentsPresetByIndex(rareCommentsSlider.value);
      const nextRatio = normalizeQuickMenuRarityGeometricRatio(preset?.ratio);
      if (Math.abs(nextRatio - rarityGeometricRatio) < 0.0001) {
        updateQuickMenuRareCommentsControl(menu);
        return;
      }
      rarityGeometricRatio = nextRatio;
      recomputeLikeTierThresholds();
      refreshActiveCardVisualsForCurrentSkin();
      pushReactNotificationOverlayState();
      scheduleRenderTimeMarkers();
      const video = getVideo();
      if (video && !isAdPlaying()) {
        scheduleReconcile(video.currentTime);
      }
      await sendQuickOverlaySettingPatch({ rarityGeometricRatio: nextRatio });
      updateQuickMenuRareCommentsControl(menu);
      setQuickMenuStatus(`Rare comments: ${preset?.label || "Custom"}`);
    });
  }

  const debugDetails = menu.querySelector(".js-debug-details");
  if (debugDetails) {
    debugDetails.addEventListener("toggle", () => {
      try {
        if (debugDetails.open) {
          menu.scrollTop = menu.scrollHeight;
        }
        positionQuickMenu(button, menu);
      } catch (_error) {}
      requestAnimationFrame(() => {
        try {
          if (debugDetails.open) {
            menu.scrollTop = menu.scrollHeight;
          }
          positionQuickMenu(button, menu);
        } catch (_error) {}
      });
    });
  }

  attachQuickMenuGlobalHandlersOnce();
  positionQuickMenu(button, menu);
  return { button, menu };
}

function updateEyeIconElement(force = false) {
  try {
    if (!eyeToggleElement) {
      return;
    }
    const parts = ensureQuickMenuContent();
    if (!parts) {
      return;
    }
    const { button, menu } = parts;
    button.classList.toggle("active", quickMenuOpen);
    button.classList.toggle("is-muted", !isOverlayRuntimeEnabled());
    button.classList.toggle("is-loading", !commentsLoadComplete);
    menu.classList.toggle("open", quickMenuOpen);
    menu.setAttribute("aria-hidden", quickMenuOpen ? "false" : "true");

    menu.querySelectorAll(".menu-panel").forEach((panel) => {
      const panelName = panel.getAttribute("data-panel");
      panel.classList.toggle("active", panelName === quickMenuActivePanel);
    });
    positionQuickMenu(button, menu);

    const setSwitch = (action, on) => {
      const item = menu.querySelector(`.menu-item[data-action="${action}"]`);
      const sw = item?.querySelector(".toggle-switch");
      if (sw) {
        sw.classList.toggle("on", Boolean(on));
      }
    };
    setSwitch("toggle-global", isActive);
    setSwitch("toggle-local", isTabOverlayEnabled());
    setSwitch("toggle-minimal", presetProfile === "minimal");
    setSwitch("toggle-markers", timelineMarkersEnabled);
    setSwitch("toggle-heatmap", heatmapEnabled);
    setSwitch("toggle-dot", showUpcomingDot);

    const globalLabel = menu.querySelector('.menu-item[data-action="toggle-global"] > span');
    if (globalLabel) {
      globalLabel.textContent = `Timestamp Chatter (${isActive ? "on" : "off"})`;
    }
    const localLabel = menu.querySelector('.menu-item[data-action="toggle-local"] > span');
    if (localLabel) {
      localLabel.textContent = `This Tab (${isTabOverlayEnabled() ? "on" : "off"})`;
    }

    const currentSkinLabel = menu.querySelector(".js-current-skin");
    if (currentSkinLabel) {
      const currentSkinConfig =
        rarityShared && raritySkinCatalog
          ? rarityShared.getSkinById(raritySkinCatalog, raritySkin)
          : null;
      currentSkinLabel.textContent = `${currentSkinConfig?.name || raritySkin}`;
    }
    updateQuickMenuRareCommentsControl(menu);

    const statusRow = menu.querySelector('[data-role="status"]');
    const statusText = menu.querySelector(".js-status-text");
    if (statusRow && statusText) {
      const hasStatus = Boolean(quickMenuStatusText);
      statusRow.hidden = !hasStatus;
      statusText.textContent = quickMenuStatusText || "";
    }

    const loadStatusText = menu.querySelector(".js-load-status-text");
    if (loadStatusText) {
      loadStatusText.textContent = getQuickMenuLoadStatusText();
    }
    const loadStatusNote = menu.querySelector(".js-load-status-note");
    if (loadStatusNote) {
      const showHeatmapWaitNote = Boolean(heatmapEnabled && !commentsLoadComplete);
      loadStatusNote.hidden = !showHeatmapWaitNote;
      loadStatusNote.textContent = showHeatmapWaitNote
        ? "Heatmap will display after the scan finishes"
        : "";
    }
    const debugRootRow = menu.querySelector('[data-role="debug-root"]');
    const tierDebugRow = menu.querySelector('[data-role="tier-debug"]');
    const tierDebugSummary = menu.querySelector(".js-tier-debug-summary");
    const tierDebugBody = menu.querySelector(".js-tier-debug-body");
    if (tierDebugRow && tierDebugSummary && tierDebugBody) {
      const tierCounts = getQuickMenuTierCountDebugData();
      const totalVisibleNotifications = tierCounts.reduce(
        (sum, entry) => sum + Math.max(0, Number(entry?.count || 0)),
        0
      );
      tierDebugRow.hidden = tierCounts.length === 0;
      tierDebugSummary.textContent = `Notifications per tier (${totalVisibleNotifications})`;
      tierDebugBody.textContent = tierCounts
        .map((entry) => {
          const likePoolCount = Math.max(0, Number(entry.likePoolCount || 0));
          const likeSuffix =
            likePoolCount > 0
              ? ` - ${likePoolCount} like pool${likePoolCount === 1 ? "" : "s"}`
              : "";
          return `${entry.label}: ${entry.count}${likeSuffix}`;
        })
        .join("\n");
    }
    const scanDebugRow = menu.querySelector('[data-role="scan-debug"]');
    const scanDebugSummary = menu.querySelector(".js-scan-debug-summary");
    const scanDebugBody = menu.querySelector(".js-scan-debug-body");
    if (scanDebugRow && scanDebugSummary && scanDebugBody) {
      const entries = Array.isArray(quickMenuScanDebugEntries) ? quickMenuScanDebugEntries : [];
      scanDebugRow.hidden = entries.length === 0;
      scanDebugSummary.textContent = `Scan / rescan sources (${entries.length})`;
      scanDebugBody.textContent = entries
        .map((entry) => {
          const time = formatQuickDebugClockTime(entry.at);
          const detail = entry.detail ? ` - ${entry.detail}` : "";
          return `[${time}] ${entry.source}${detail}`;
        })
        .join("\n");
    }
    if (debugRootRow) {
      const hideTier = !tierDebugRow || tierDebugRow.hidden;
      const hideScan = !scanDebugRow || scanDebugRow.hidden;
      debugRootRow.hidden = hideTier && hideScan;
    }

    const skinList = menu.querySelector(".js-skin-list");
    if (skinList) {
      const desiredEntries = getQuickMenuSkinEntries();
      const nextSignature = desiredEntries.map((entry) => `${entry.id}:${entry.name}`).join("|");
      if (skinList.dataset.signature !== nextSignature || force) {
        skinList.dataset.signature = nextSignature;
        skinList.innerHTML = "";
        desiredEntries.forEach((entry) => {
          const row = document.createElement("div");
          row.className = "menu-item";
          row.setAttribute("data-action", "select-skin");
          row.setAttribute("data-skin-id", entry.id);
          const name = document.createElement("span");
          name.textContent = entry.name;
          const value = document.createElement("span");
          value.className = "selected-value";
          value.textContent = entry.id === raritySkin ? "Selected" : "";
          row.append(name, value);
          if (entry.id === raritySkin) {
            row.classList.add("is-selected");
          }
          skinList.appendChild(row);
        });
      } else {
        skinList.querySelectorAll('.menu-item[data-action="select-skin"]').forEach((row) => {
          const isSelected = row.getAttribute("data-skin-id") === raritySkin;
          row.classList.toggle("is-selected", isSelected);
          const value = row.querySelector(".selected-value");
          if (value) {
            value.textContent = isSelected ? "Selected" : "";
          }
        });
      }
    }
  } catch (error) {
    try {
      if (eyeToggleElement) {
        eyeToggleElement.classList.remove("muted");
      }
    } catch (_e) {}
    console.error("[Timestamp Chatter] quick menu render failed", error);
  }
}

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

const rarityShared = globalThis.RaritySkinsShared || null;
const themeCatalogV2Shared = globalThis.TimestampChatterThemeCatalogV2 || null;
const LOCAL_RARITY_CATALOG_KEY = rarityShared?.LOCAL_CATALOG_KEY || "raritySkinCatalogV2";
const LOCAL_RARITY_CATALOG_REVISION_KEY =
  rarityShared?.LOCAL_CATALOG_REVISION_KEY || "raritySkinCatalogRevision";
const SYNC_ACTIVE_RARITY_SKIN_ID_KEY =
  rarityShared?.SYNC_ACTIVE_SKIN_ID_KEY || "activeRaritySkinId";
const SYNC_HIDDEN_RARITY_TIERS_BY_SKIN_ID_KEY =
  rarityShared?.SYNC_HIDDEN_TIERS_BY_SKIN_ID_KEY || "hiddenRarityTiersBySkinId";
let raritySkinCatalog = rarityShared ? rarityShared.createBuiltInCatalog() : null;
let raritySkinCatalogRevision = 0;
let themeCatalogV2 = null;
let themeCatalogV2Revision = 0;

function applyThemeCatalogV2ToRuntimeCatalog(nextThemeCatalog, nextRevision = Date.now()) {
  if (!themeCatalogV2Shared || !rarityShared) {
    return false;
  }
  try {
    const normalizedThemeCatalog = themeCatalogV2Shared.normalizeThemeCatalog(nextThemeCatalog);
    const runtimeCatalog =
      themeCatalogV2Shared.buildRuntimeRarityCatalogFromThemeCatalog(normalizedThemeCatalog);
    themeCatalogV2 = normalizedThemeCatalog;
    themeCatalogV2Revision = Number(nextRevision || Date.now());
    applyCatalogToRuntime(runtimeCatalog, raritySkin);
    raritySkinCatalogRevision = themeCatalogV2Revision;
    return true;
  } catch (error) {
    console.error("[Timestamp Chatter] Failed to apply ThemeCatalogV2", error);
    return false;
  }
}

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

function mapStoredAppearanceValueToCenteredDeltaRuntime(storedValue, defaultValue) {
  const safeStored = clamp(Number(storedValue ?? defaultValue), 0, 100);
  const safeDefault = clamp(Number(defaultValue ?? 50), 0, 100);
  if (safeStored >= safeDefault) {
    const den = Math.max(1, 100 - safeDefault);
    return ((safeStored - safeDefault) / den) * 100;
  }
  const den = Math.max(1, safeDefault);
  return -((safeDefault - safeStored) / den) * 100;
}

function getSkinAppearanceLocalModifiers() {
  return {
    opacityDeltaPercent: mapStoredAppearanceValueToCenteredDeltaRuntime(
      overlayGlassiness,
      DEFAULT_OVERLAY_GLASSINESS
    ),
    darknessDeltaPercent: mapStoredAppearanceValueToCenteredDeltaRuntime(
      overlayDarkness,
      DEFAULT_OVERLAY_DARKNESS
    )
  };
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

function parseHexColorToRgb(colorValue) {
  const raw = String(colorValue || "").trim();
  if (!raw) {
    return null;
  }
  let hex = raw;
  if (/^#[0-9a-fA-F]{3}$/.test(hex)) {
    hex = `#${hex[1]}${hex[1]}${hex[2]}${hex[2]}${hex[3]}${hex[3]}`;
  }
  if (!/^#[0-9a-fA-F]{6}$/.test(hex)) {
    return null;
  }
  const r = Number.parseInt(hex.slice(1, 3), 16);
  const g = Number.parseInt(hex.slice(3, 5), 16);
  const b = Number.parseInt(hex.slice(5, 7), 16);
  if (![r, g, b].every(Number.isFinite)) {
    return null;
  }
  return { r, g, b };
}

function rgbToHexColor(rgb) {
  if (!rgb) {
    return null;
  }
  const toHex = (value) =>
    clamp(Math.round(Number(value) || 0), 0, 255).toString(16).padStart(2, "0");
  return `#${toHex(rgb.r)}${toHex(rgb.g)}${toHex(rgb.b)}`;
}

function adjustHexColorForDarknessDelta(colorValue, darknessDeltaPercent) {
  const rgb = parseHexColorToRgb(colorValue);
  if (!rgb) {
    return String(colorValue || "");
  }
  const delta = clamp(Number(darknessDeltaPercent || 0), -100, 100);
  if (Math.abs(delta) < 0.001) {
    return rgbToHexColor(rgb) || String(colorValue || "");
  }
  const strength = Math.min(1, Math.abs(delta) / 100) * 0.8;
  const target = delta > 0 ? 255 : 0; // positive = brighter, negative = darker
  const mixed = {
    r: rgb.r + (target - rgb.r) * strength,
    g: rgb.g + (target - rgb.g) * strength,
    b: rgb.b + (target - rgb.b) * strength
  };
  return rgbToHexColor(mixed) || String(colorValue || "");
}

function relativeLuminanceFromHex(colorValue) {
  const rgb = parseHexColorToRgb(colorValue);
  if (!rgb) {
    return null;
  }
  const linearize = (channel) => {
    const c = channel / 255;
    return c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  };
  const r = linearize(rgb.r);
  const g = linearize(rgb.g);
  const b = linearize(rgb.b);
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function colorVibranceScoreFromHex(colorValue) {
  const rgb = parseHexColorToRgb(colorValue);
  if (!rgb) {
    return null;
  }
  const r = rgb.r / 255;
  const g = rgb.g / 255;
  const b = rgb.b / 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const delta = max - min;
  const saturation = max <= 0 ? 0 : delta / max; // HSV saturation
  const luminance = relativeLuminanceFromHex(colorValue) ?? 0;

  // Favor bright colors first, then vividness, so pale bright borders still win over dark saturated fills.
  return luminance * 0.7 + saturation * 0.3;
}

function getLuminousTierMarkerDotColor(tierConfig) {
  const bodyColor = String(tierConfig?.bodyColor || "").trim();
  const borderColor = String(tierConfig?.borderColor || "").trim();
  const bodyScore = colorVibranceScoreFromHex(bodyColor);
  const borderScore = colorVibranceScoreFromHex(borderColor);

  if (bodyScore !== null && borderScore !== null) {
    if (bodyScore !== borderScore) {
      return bodyScore >= borderScore ? bodyColor : borderColor;
    }
    // Tie-breaker: prefer the brighter color.
    const bodyLum = relativeLuminanceFromHex(bodyColor) ?? 0;
    const borderLum = relativeLuminanceFromHex(borderColor) ?? 0;
    return bodyLum >= borderLum ? bodyColor : borderColor;
  }
  if (borderScore !== null) {
    return borderColor;
  }
  if (bodyScore !== null) {
    return bodyColor;
  }
  return String(tierConfig?.markerColor || borderColor || bodyColor || "#ffffff");
}

function getTierMarkerMetrics(tierConfig, tierRank = 0) {
  const safeRank = Math.max(0, Math.floor(Number(tierRank) || 0));
  const tierCount = Math.max(1, getTierKeys().length);
  const rankProgress = tierCount <= 1 ? 0 : safeRank / (tierCount - 1);
  const fallbackWidth = 5 + Math.min(18, safeRank) * 2;
  const fallbackHeightPct = 118 + Math.min(18, safeRank) * 18;
  const fallbackOffsetTopPct = -(9 + Math.min(18, safeRank) * 8);

  const baseMarkerWidthPx = clamp(
    Number(tierConfig?.markerWidthPx ?? fallbackWidth),
    3,
    40
  );
  const baseMarkerHeightPct = clamp(
    Number(tierConfig?.markerHeightPct ?? fallbackHeightPct),
    100,
    400
  );
  const baseMarkerOffsetTopPct = clamp(
    Number(tierConfig?.markerOffsetTopPct ?? fallbackOffsetTopPct),
    -200,
    40
  );

  // Emphasize inter-tier marker size differences so higher tiers read more clearly on the timeline.
  const markerWidthPx = clamp(
    baseMarkerWidthPx + rankProgress * Math.max(2, baseMarkerWidthPx * 0.5),
    3,
    48
  );
  const markerHeightPct = clamp(
    baseMarkerHeightPct * (1 + rankProgress * 0.42),
    100,
    460
  );
  const markerOffsetTopPct = clamp(
    baseMarkerOffsetTopPct < 0
      ? baseMarkerOffsetTopPct * (1 + rankProgress * 0.36)
      : baseMarkerOffsetTopPct - rankProgress * 8,
    -240,
    40
  );

  return {
    markerWidthPx,
    markerHeightPct,
    markerOffsetTopPct
  };
}

function applyTierMarkerVisualStyle(marker, tierConfig, tierRank = 0) {
  if (!marker || !tierConfig) {
    return;
  }
  // Revert to legacy CSS-driven marker visuals.
  const { markerWidthPx, markerHeightPct, markerOffsetTopPct } = getTierMarkerMetrics(
    tierConfig,
    tierRank
  );
  marker.style.width = `${markerWidthPx}px`;
  marker.style.minWidth = `${markerWidthPx}px`;
  marker.style.height = `${markerHeightPct}%`;
  marker.style.top = `${markerOffsetTopPct}%`;
  marker.style.background = getLuminousTierMarkerDotColor(tierConfig);
  marker.style.borderRadius = "";
  marker.classList.remove("effect-glow", "effect-pulse", "effect-rainbow-cycle", "effect-sheen");
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
    const hostControls = host.querySelector(".ytp-right-controls");
    if (hostControls) {
      return hostControls;
    }
  }
  const selectors = [
    ".ytp-right-controls",
    ".ytp-right-controls-left",
    ".ytp-right-controls-right",
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
  const rightInnerLeft = controls.querySelector(":scope > .ytp-right-controls-left");
  if (rightInnerLeft) {
    return rightInnerLeft;
  }
  const rightInnerRight = controls.querySelector(":scope > .ytp-right-controls-right");
  if (rightInnerRight) {
    return rightInnerRight;
  }
  const nativeButton =
    controls.querySelector(".ytp-settings-button") ||
    controls.querySelector(".ytp-subtitles-button") ||
    controls.querySelector(".ytp-autonav-toggle-button") ||
    controls.querySelector(".ytp-play-button") ||
    controls.querySelector(".ytp-mute-button");
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
  const autoplayButtonInMountTarget =
    mountTarget.querySelector(':scope > .ytp-autonav-toggle') ||
    mountTarget.querySelector(':scope > .ytp-autonav-toggle-button') ||
    mountTarget.querySelector(':scope > button[data-tooltip-target-id="ytp-autonav-toggle-button"]');
  if (autoplayButtonInMountTarget) {
    return autoplayButtonInMountTarget;
  }
  const autoplayButton =
    controls.querySelector(".ytp-autonav-toggle") ||
    controls.querySelector(".ytp-autonav-toggle-button") ||
    controls.querySelector('button[data-tooltip-target-id="ytp-autonav-toggle-button"]');
  if (autoplayButton?.parentElement === mountTarget) {
    return autoplayButton;
  }
  const settingsButton = controls.querySelector(".ytp-settings-button");
  if (settingsButton?.parentElement === mountTarget) {
    return settingsButton;
  }
  const subtitlesButton = controls.querySelector(".ytp-subtitles-button");
  if (subtitlesButton?.parentElement === mountTarget) {
    return subtitlesButton;
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
    ensureQuickMenuContent();
    return eyeToggleElement;
  }
  const existing =
    mountTarget.querySelector(".overlay-eye-toggle") ||
    document.querySelector(".overlay-eye-toggle");
  if (existing) {
    if (existing.tagName === "BUTTON") {
      const replacement = document.createElement("div");
      replacement.className = "overlay-eye-toggle";
      try {
        existing.replaceWith(replacement);
      } catch (_error) {
        if (existing.parentElement) {
          existing.parentElement.insertBefore(replacement, existing);
          existing.remove();
        }
      }
      eyeToggleElement = replacement;
    } else {
      eyeToggleElement = existing;
    }
    eyeToggleElement.classList.add("overlay-eye-toggle");
    eyeToggleElement.classList.toggle("ytp-button", Boolean(controls));
    eyeToggleElement.classList.toggle("floating", !controls);
    eyeToggleElement.classList.toggle("in-controls-strip", Boolean(controls));
    if (eyeToggleElement.parentElement !== mountTarget) {
      const anchor = resolveEyeInsertAnchor(controls, mountTarget);
      safeInsertBefore(mountTarget, eyeToggleElement, anchor || null);
    }
    ensureQuickMenuContent();
    return eyeToggleElement;
  }

  eyeToggleElement = document.createElement("div");
  eyeToggleElement.className = "overlay-eye-toggle";
  eyeToggleElement.classList.toggle("ytp-button", Boolean(controls));
  eyeToggleElement.classList.toggle("floating", !controls);
  eyeToggleElement.classList.toggle("in-controls-strip", Boolean(controls));
  eyeToggleElement.classList.toggle("muted", notificationsMutedByEye);
  ensureQuickMenuContent();
  updateEyeIconElement(true);
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

function computeGeometricTierRanksBySourceLegacy(sourceComments) {
  const tierCount = getTierKeys().length;
  const result = new Map();
  if (tierCount <= 0) {
    return result;
  }
  const entries = buildUniqueCommentLikeEntries(sourceComments);
  if (entries.length <= 0) {
    return result;
  }
  const distinctLikeLevels = new Set(entries.map((entry) => entry.likes)).size;

  if (distinctLikeLevels < tierCount) {
    const sortedLowToHigh = entries.slice().sort((a, b) => {
      if (a.likes !== b.likes) {
        return a.likes - b.likes;
      }
      return String(a.sourceKey).localeCompare(String(b.sourceKey));
    });
    const groups = [];
    for (const entry of sortedLowToHigh) {
      const lastGroup = groups[groups.length - 1];
      if (!lastGroup || lastGroup.likes !== entry.likes) {
        groups.push({ likes: entry.likes, items: [entry] });
      } else {
        lastGroup.items.push(entry);
      }
    }
    for (let groupIndex = 0; groupIndex < groups.length; groupIndex += 1) {
      const runtimeTierRank = Math.min(tierCount - 1, groupIndex);
      for (const entry of groups[groupIndex].items) {
        result.set(entry.sourceKey, runtimeTierRank);
      }
    }
    return result;
  }

  const quotasBestToWorst = allocateIntegersByWeights(
    entries.length,
    geometricWeights(tierCount, rarityGeometricRatio)
  );
  const sortedHighToLow = entries.slice().sort((a, b) => {
    if (b.likes !== a.likes) {
      return b.likes - a.likes;
    }
    return String(a.sourceKey).localeCompare(String(b.sourceKey));
  });
  let cursor = 0;
  for (let bestTierIndex = 0; bestTierIndex < tierCount; bestTierIndex += 1) {
    const take = Math.max(0, Number(quotasBestToWorst[bestTierIndex] || 0));
    const runtimeTierRank = tierCount - 1 - bestTierIndex;
    for (let offset = 0; offset < take && cursor < sortedHighToLow.length; offset += 1) {
      result.set(sortedHighToLow[cursor].sourceKey, runtimeTierRank);
      cursor += 1;
    }
  }
  while (cursor < sortedHighToLow.length) {
    result.set(sortedHighToLow[cursor].sourceKey, 0);
    cursor += 1;
  }
  return result;
}

function computeGeometricTierRanksBySource(sourceComments) {
  const tierCount = getTierKeys().length;
  const result = new Map();
  if (tierCount <= 0) {
    return result;
  }

  const entries = buildUniqueCommentLikeEntries(sourceComments);
  if (entries.length <= 0) {
    return result;
  }

  const groupsLowToHigh = [];
  for (const entry of entries.slice().sort((a, b) => {
    if (a.likes !== b.likes) {
      return a.likes - b.likes;
    }
    return String(a.sourceKey).localeCompare(String(b.sourceKey));
  })) {
    const lastGroup = groupsLowToHigh[groupsLowToHigh.length - 1];
    if (!lastGroup || lastGroup.likes !== entry.likes) {
      groupsLowToHigh.push({ likes: entry.likes, items: [entry], assignedRank: 0 });
    } else {
      lastGroup.items.push(entry);
    }
  }

  const groupCount = groupsLowToHigh.length;
  const maxRank = Math.max(0, tierCount - 1);

  if (groupCount < tierCount) {
    // Not enough distinct like pools to fill all tiers: use the lowest N tiers.
    for (let index = 0; index < groupCount; index += 1) {
      groupsLowToHigh[index].assignedRank = clamp(index, 0, maxRank);
    }
  } else {
    // Pool-first assignment: guarantee at least one like pool in every tier,
    // then distribute the remaining pools with geometric weighting.
    const quotasWorstToBest = new Array(tierCount).fill(1);
    const extraPoolCount = groupCount - tierCount;
    if (extraPoolCount > 0) {
      const extraQuotasBestToWorst = allocateIntegersByWeights(
        extraPoolCount,
        geometricWeights(tierCount, rarityGeometricRatio)
      );
      for (let bestTierIndex = 0; bestTierIndex < tierCount; bestTierIndex += 1) {
        const runtimeTierRank = maxRank - bestTierIndex;
        quotasWorstToBest[runtimeTierRank] += Math.max(
          0,
          Number(extraQuotasBestToWorst[bestTierIndex] || 0)
        );
      }
    }

    let cursor = 0;
    for (let runtimeTierRank = 0; runtimeTierRank < tierCount; runtimeTierRank += 1) {
      const take = Math.max(1, Number(quotasWorstToBest[runtimeTierRank] || 1));
      for (let offset = 0; offset < take && cursor < groupCount; offset += 1) {
        groupsLowToHigh[cursor].assignedRank = runtimeTierRank;
        cursor += 1;
      }
    }
    while (cursor < groupCount) {
      groupsLowToHigh[cursor].assignedRank = maxRank;
      cursor += 1;
    }
  }

  for (const group of groupsLowToHigh) {
    for (const entry of group.items) {
      result.set(entry.sourceKey, group.assignedRank);
    }
  }

  return result;
}

function computeTierThresholds(sourceComments, precomputedRanks = null) {
  const tierConfigs = getTierConfigs();
  const thresholds = Object.create(null);
  const baseTierKey = tierConfigs[0]?.key;
  if (!baseTierKey) {
    return thresholds;
  }
  thresholds[baseTierKey] = 0;
  if (tierConfigs.length <= 1) {
    return thresholds;
  }

  const entries = buildUniqueCommentLikeEntries(sourceComments);
  if (entries.length === 0) {
    tierConfigs.slice(1).forEach((tierConfig) => {
      thresholds[tierConfig.key] = Number.POSITIVE_INFINITY;
    });
    return thresholds;
  }

  const rankBySource =
    precomputedRanks instanceof Map ? precomputedRanks : computeGeometricTierRanksBySource(sourceComments);
  for (let tierIndex = 1; tierIndex < tierConfigs.length; tierIndex += 1) {
    let cutoff = Number.POSITIVE_INFINITY;
    for (const entry of entries) {
      const rank = Number(rankBySource.get(entry.sourceKey));
      if (Number.isFinite(rank) && rank >= tierIndex && entry.likes < cutoff) {
        cutoff = entry.likes;
      }
    }
    thresholds[tierConfigs[tierIndex].key] = cutoff;
  }
  return thresholds;
}

function recomputeLikeTierThresholds() {
  geometricTierRankByCommentSource = computeGeometricTierRanksBySource(comments);
  activeTierThresholds = computeTierThresholds(comments, geometricTierRankByCommentSource);
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
  return position;
}

function getTierRank(likesCount, comment = null) {
  const numericLikes = Number(likesCount || 0);
  if (!Number.isFinite(numericLikes) || numericLikes <= 0) {
    return 0;
  }

  if (comment) {
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

function getPinnedOrderTowardCorner(corner, pinSeq = 0) {
  const safeSeq = Math.max(0, Math.floor(Number(pinSeq) || 0));
  const isTopCorner = corner === "top-left" || corner === "top-right";
  // Lanes sort ascending by order. Use extremes to bring clicked cards toward the anchor edge.
  return isTopCorner ? (-1_000_000_000_000 + safeSeq) : (1_000_000_000_000 - safeSeq);
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
  if (!freePositionEnabled) {
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
  // Free-position persistence is disabled while card dragging is disabled.
}

function startCardDrag(event, card, initialCorner) {
  if (!CARD_DRAG_ENABLED) {
    return;
  }
  if (!card) {
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
    const visible = corner === position;
    lane.classList.toggle("hidden", !visible);
  }
  overlayElement.classList.toggle("comment-draft-popup-open", notificationsSuppressedByDraftPopup);
  applyFreeLanePosition();
  updateEyeToggleVisibility();
}

function seekToCommentContext(comment, contextSeconds = DEFAULT_CLICK_BACK_CONTEXT_SECONDS) {
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

function setContextualVisibilityLock(
  comment,
  anchorTime,
  contextSeconds = DEFAULT_CLICK_BACK_CONTEXT_SECONDS
) {
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
    position !== "bottom-left"
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

  // Legacy shell look uses stable defaults; user-facing appearance sliders now act as
  // local skin modifiers applied non-destructively at render time.
  const glassNormalized =
    clamp(DEFAULT_OVERLAY_GLASSINESS, MIN_OVERLAY_GLASSINESS, MAX_OVERLAY_GLASSINESS) / 100;
  const darknessNormalized =
    clamp(DEFAULT_OVERLAY_DARKNESS, MIN_OVERLAY_DARKNESS, MAX_OVERLAY_DARKNESS) / 100;
  const { opacityDeltaPercent } = getSkinAppearanceLocalModifiers();

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
  const fullscreenScaleBonus = isVideoInFullscreen() ? FULLSCREEN_OVERLAY_SCALE_BONUS : 0;
  const effectiveOverlayScale = clamp(
    Number(overlayScale || DEFAULT_OVERLAY_SCALE) + fullscreenScaleBonus,
    MIN_OVERLAY_SCALE,
    MAX_OVERLAY_SCALE
  );

  overlayElement.style.setProperty("--overlay-scale", String(effectiveOverlayScale));
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
    Number(getCurrentSkinStyleConfig()?.packOpacity ?? packOpacity) + (opacityDeltaPercent / 100) * 0.5,
    0.08,
    1
  );
  overlayElement.style.setProperty("--overlay-pack-opacity", String(skinPackOpacity));
  overlayElement.dataset.raritySkin = normalizedSkin;
  overlayElement.dataset.skinRenderer = "dynamic";
  overlayElement.classList.toggle("debug-mode", debugMode);
  updateLaneVisibility();
  positionCommentDraftPopup();
}

function isVideoInFullscreen() {
  const fsElement = document.fullscreenElement || document.webkitFullscreenElement || null;
  const host = getOverlayHost();
  if (fsElement && host && (fsElement === host || fsElement.contains(host) || host.contains(fsElement))) {
    return true;
  }
  if (fsElement && getVideo() && (fsElement === getVideo() || fsElement.contains(getVideo()))) {
    return true;
  }
  return Boolean(document.querySelector("#movie_player.ytp-fullscreen, .html5-video-player.ytp-fullscreen"));
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
      "clickBackContextSeconds",
      "earlySeconds",
      "timestampAccentEffect",
      "reverseStackOrder",
      "priorityScoringEnabled",
      "priorityLikesWeight",
      "topLikedThresholdPercent",
      "timelineMarkersEnabled",
      "heatmapEnabled",
      "heatmapIntensity",
      "showAuthorInNotifications",
      "showLikesInNotifications",
      "showUpcomingDot",
      "stackOpacityFadeEnabled",
      "stackOpacityFadeStart",
      "stackOpacityFadeStepPercent",
      "experimentalGameSkinAutoEnabled",
      "showRarityLabelInNotifications",
      "raritySkin",
      "activeRaritySkinId",
      "rarityLogicMode",
      "rarityGeometricRatio",
      "hiddenRarityTiersBySkin",
      "hiddenRarityTiersBySkinId",
      "clearTimestampCacheOnRefresh",
      "commentScanStartDelaySec",
      "presetProfile"
    ]),
    chrome.storage.local.get([
      LOCAL_RARITY_CATALOG_KEY,
      LOCAL_RARITY_CATALOG_REVISION_KEY,
      themeCatalogV2Shared?.THEME_CATALOG_V2_KEY || "themeCatalogV2",
      themeCatalogV2Shared?.THEME_CATALOG_V2_REVISION_KEY || "themeCatalogV2Revision"
    ])
  ]);

  if (rarityShared) {
    const storedThemeCatalog = themeCatalogV2Shared
      ? localValues?.[themeCatalogV2Shared.THEME_CATALOG_V2_KEY]
      : null;
    const storedThemeCatalogRevision = themeCatalogV2Shared
      ? Number(localValues?.[themeCatalogV2Shared.THEME_CATALOG_V2_REVISION_KEY] || Date.now())
      : 0;
    if (storedThemeCatalog && themeCatalogV2Shared) {
      applyThemeCatalogV2ToRuntimeCatalog(storedThemeCatalog, storedThemeCatalogRevision);
    }

    let catalog = localValues?.[LOCAL_RARITY_CATALOG_KEY];
    if ((!catalog || typeof catalog !== "object") && !(storedThemeCatalog && themeCatalogV2Shared)) {
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
    } else if (!storedThemeCatalog || !themeCatalogV2Shared) {
      raritySkinCatalogRevision = Number(
        localValues?.[LOCAL_RARITY_CATALOG_REVISION_KEY] || Date.now()
      );
    }
    if (!storedThemeCatalog || !themeCatalogV2Shared) {
      applyCatalogToRuntime(
        catalog,
        values?.[SYNC_ACTIVE_RARITY_SKIN_ID_KEY] || values?.raritySkin || DEFAULT_RARITY_SKIN
      );
    }
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
  clickBackContextSeconds = clamp(
    Number(values?.clickBackContextSeconds ?? DEFAULT_CLICK_BACK_CONTEXT_SECONDS),
    MIN_CLICK_BACK_CONTEXT_SECONDS,
    MAX_CLICK_BACK_CONTEXT_SECONDS
  );
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
  timelineMarkersEnabled = Boolean(values?.timelineMarkersEnabled ?? true);
  heatmapEnabled = Boolean(values?.heatmapEnabled ?? DEFAULT_HEATMAP_ENABLED);
  heatmapIntensity = clamp(
    Number(values?.heatmapIntensity ?? DEFAULT_HEATMAP_INTENSITY),
    MIN_HEATMAP_INTENSITY,
    MAX_HEATMAP_INTENSITY
  );
  presetProfile = String(values?.presetProfile ?? DEFAULT_PRESET_PROFILE) === "minimal"
    ? "minimal"
    : "balanced";
  showAuthorInNotifications =
    presetProfile === "minimal"
      ? false
      : Boolean(
          values?.showAuthorInNotifications ?? DEFAULT_SHOW_AUTHOR_IN_NOTIFICATIONS
        );
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
  stackOpacityFadeEnabled = Boolean(
    values?.stackOpacityFadeEnabled ?? DEFAULT_STACK_OPACITY_FADE_ENABLED
  );
  stackOpacityFadeStart = clamp(
    Number(values?.stackOpacityFadeStart ?? DEFAULT_STACK_OPACITY_FADE_START),
    MIN_STACK_OPACITY_FADE_START,
    MAX_STACK_OPACITY_FADE_START
  );
  stackOpacityFadeStepPercent = clamp(
    Number(
      values?.stackOpacityFadeStepPercent ?? DEFAULT_STACK_OPACITY_FADE_STEP_PERCENT
    ),
    MIN_STACK_OPACITY_FADE_STEP_PERCENT,
    MAX_STACK_OPACITY_FADE_STEP_PERCENT
  );
  experimentalGameSkinAutoEnabled = Boolean(
    values?.experimentalGameSkinAutoEnabled ??
      DEFAULT_EXPERIMENTAL_GAME_SKIN_AUTO_ENABLED
  );
  const storedPreferredRaritySkin = normalizeRaritySkin(
    String(
      values?.[SYNC_ACTIVE_RARITY_SKIN_ID_KEY] ??
        values?.raritySkin ??
        DEFAULT_RARITY_SKIN
    )
  );
  const sessionPreferredRaritySkin = tabSessionRaritySkinOverride
    ? normalizeRaritySkin(tabSessionRaritySkinOverride)
    : null;
  raritySkin = normalizeRaritySkin(
    String(sessionPreferredRaritySkin || storedPreferredRaritySkin || DEFAULT_RARITY_SKIN)
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
  clearTimestampCacheOnRefresh = Boolean(
    values?.clearTimestampCacheOnRefresh ?? DEFAULT_CLEAR_TIMESTAMP_CACHE_ON_REFRESH
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
    if (isOverlayRuntimeEnabled() && monitoringInitialized === false) {
      startMonitoring();
    }
    scheduleAutoSkinDetect(videoId, AUTO_SKIN_DETECT_DELAY_MS);
    scheduleCommentsRequest(
      videoId,
      0,
      0,
      "startup_immediate"
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

function scheduleCommentsRequest(videoId, attempt = 0, delayMs = 0, source = "unknown") {
  if (!videoId) {
    return;
  }
  if (!isOverlayRuntimeEnabled() && !commentsScanInProgress) {
    return;
  }
  commentsScanInProgress = true;
  if (commentsRequestRetryTimerId !== null) {
    clearTimeout(commentsRequestRetryTimerId);
  }
  pushQuickMenuScanDebugEvent(
    attempt > 0 ? `${source}_retry` : source,
    attempt > 0
      ? `attempt ${attempt + 1}, scheduled in ${Math.max(0, Math.round(Number(delayMs) || 0))}ms`
      : `scheduled in ${Math.max(0, Math.round(Number(delayMs) || 0))}ms`
  );
  commentsRequestRetryTimerId = setTimeout(async () => {
    commentsRequestRetryTimerId = null;
    if (currentVideoId !== videoId || getVideoId() !== videoId) {
      commentsScanInProgress = false;
      return;
    }
    if (!isOverlayRuntimeEnabled() && !commentsScanInProgress) {
      return;
    }
    try {
      pushQuickMenuScanDebugEvent(
        source,
        `comments request sent${Boolean(clearTimestampCacheOnRefresh) ? " (forceRefresh)" : ""}`
      );
      await chrome.runtime.sendMessage({
        type: "comments",
        video_id: videoId,
        forceRefresh: Boolean(clearTimestampCacheOnRefresh)
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
          COMMENTS_REQUEST_RETRY_DELAYS_MS[attempt],
          source
        );
      } else {
        commentsScanInProgress = false;
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
  if (commentDraftPopupElement && commentDraftPopupElement.parentElement !== overlayElement) {
    overlayElement.appendChild(commentDraftPopupElement);
  }
  ensureReactNotificationOverlayMounted();
  updateCommentDraftPopupView();
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
    ensureReactNotificationOverlayMounted();
    applyOverlayStyles();
    updateLaneVisibility();
    ensureCommentDraftPopup();
    attachCommentDraftPopupHandlersOnce();
    updateEyeToggleVisibility();
    scheduleEyeToggleBootstrap();
    scheduleEyeToggleHeartbeat();
    return;
  }

  overlayElement = document.createElement("div");
  overlayElement.id = "overlay-element";
  overlayElement.classList.add("overlay-root");
  ensureLaneContainers();
  ensureReactNotificationOverlayMounted();
  applyOverlayStyles();
  updateLaneVisibility();

  host.appendChild(overlayElement);
  ensureOverlayAttached();
  ensureCommentDraftPopup();
  attachCommentDraftPopupHandlersOnce();
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
  preview.style.bottom = `${Math.round(markerPreviewBottomOffsetPx)}px`;

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
    !isOverlayRuntimeEnabled() ||
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
  const colorR = new Array(bins).fill(0);
  const colorG = new Array(bins).fill(0);
  const colorB = new Array(bins).fill(0);
  const colorWeight = new Array(bins).fill(0);
  const tierCount = Math.max(1, getTierKeys().length);
  for (const comment of comments) {
    if (isCommentTierHidden(comment)) {
      continue;
    }
    if (comment.time < 0 || comment.time > videoDuration) {
      continue;
    }
    const ratio = comment.time / videoDuration;
    const idx = Math.min(bins - 1, Math.max(0, Math.floor(ratio * bins)));
    const likesCount = Number(comment?.likes || 0);
    const tierRank = getTierRank(likesCount, comment);
    const tierName = getTierName(tierRank);
    const tierConfig = getTierConfigByKey(tierName);
    const baseWeight = getHeatmapCommentWeight(comment);
    counts[idx] += baseWeight;

    const tintColor = parseHexColorToRgb(getLuminousTierMarkerDotColor(tierConfig));
    if (tintColor) {
      const rankProgress = tierCount <= 1 ? 0 : clamp(tierRank / (tierCount - 1), 0, 1);
      // Favor higher tiers strongly so they dominate overlapping areas of the heatmap.
      const priorityBoost = 1 + Math.pow(rankProgress, 1.8) * 8.5;
      const tintWeight = baseWeight * priorityBoost;
      colorR[idx] += tintColor.r * tintWeight;
      colorG[idx] += tintColor.g * tintWeight;
      colorB[idx] += tintColor.b * tintWeight;
      colorWeight[idx] += tintWeight;
    }
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
  const smoothColorChannelThrice = (source) => applyKernelSmoothing(applyKernelSmoothing(applyKernelSmoothing(source)));
  const smoothedColorR = smoothColorChannelThrice(colorR);
  const smoothedColorG = smoothColorChannelThrice(colorG);
  const smoothedColorB = smoothColorChannelThrice(colorB);
  const smoothedColorWeight = smoothColorChannelThrice(colorWeight);

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
      0.28 + eased * (0.34 + 0.62 * Math.min(1, intensityScale / 3)),
      0.16,
      0.99
    );

    const bin = document.createElement("span");
    bin.className = "__tc-ts-heatmap-bin";
    bin.style.height = `${height.toFixed(2)}px`;
    bin.style.opacity = alpha.toFixed(3);
    const tintWeight = Number(smoothedColorWeight[i] || 0);
    if (tintWeight > 0.001) {
      const baseR = clamp(smoothedColorR[i] / tintWeight, 0, 255);
      const baseG = clamp(smoothedColorG[i] / tintWeight, 0, 255);
      const baseB = clamp(smoothedColorB[i] / tintWeight, 0, 255);
      const whiten = (channel, amount) => clamp(channel + (255 - channel) * amount, 0, 255);
      const topMix = [whiten(baseR, 0.48), whiten(baseG, 0.48), whiten(baseB, 0.48)];
      const midMix = [whiten(baseR, 0.24), whiten(baseG, 0.24), whiten(baseB, 0.24)];
      const botMix = [baseR, baseG, baseB];
      const asCssRgb = (triplet, alphaValue) =>
        `rgb(${Math.round(triplet[0])} ${Math.round(triplet[1])} ${Math.round(triplet[2])} / ${alphaValue})`;
      bin.style.background = `linear-gradient(180deg, ${asCssRgb(topMix, 0.98)} 0%, ${asCssRgb(
        midMix,
        0.9
      )} 52%, ${asCssRgb(botMix, 0.78)} 100%)`;
    }
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
  if (!isOverlayRuntimeEnabled()) {
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
  if (!timelineMarkersEnabled) {
    return;
  }
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
    if (isAdPlaying() || !isOverlayRuntimeEnabled()) {
      return;
    }
    scheduleReconcile(video.currentTime);
  };

  const onSeeking = () => {
    if (isAdPlaying() || !isOverlayRuntimeEnabled()) {
      return;
    }
    scheduleReconcile(video.currentTime);
    debugLog("Seek reconcile", video.currentTime);
  };

  const onSeeked = () => {
    if (isAdPlaying() || !isOverlayRuntimeEnabled()) {
      return;
    }
    scheduleReconcile(video.currentTime);
  };

  const onPlay = () => {
    if (isAdPlaying() || !isOverlayRuntimeEnabled()) {
      return;
    }
    scheduleReconcile(video.currentTime);
  };

  const onRateChange = () => {
    if (isAdPlaying() || !isOverlayRuntimeEnabled()) {
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

function getReactOverlayRenderer() {
  return globalThis.TimestampChatterReactOverlay || globalThis.TimestampChatterReactNotifications || null;
}

function ensureReactNotificationOverlayMounted() {
  if (!overlayElement) {
    return false;
  }
  const reactRenderer = getReactOverlayRenderer();
  if (!reactRenderer?.mountOverlay || !reactRenderer?.setOverlayState) {
    return false;
  }
  try {
    reactRenderer.mountOverlay(overlayElement, {
      onCardClick: (commentId) => {
        const cardState = activeCardByCommentId.get(commentId);
        const comment = cardState?.comment;
        if (!comment) {
          return;
        }
        if (Date.now() < suppressCardClickUntil) {
          return;
        }
        const currentVideo = getVideo();
        const wasPaused = Boolean(currentVideo?.paused);
        const previousTime = Number(currentVideo?.currentTime || 0);
        const seekResult = seekToCommentContext(comment, clickBackContextSeconds);
        if (seekResult) {
          if (
            currentVideo &&
            wasPaused &&
            Number.isFinite(seekResult.targetTime) &&
            seekResult.targetTime < previousTime - 0.05
          ) {
            const playResult = currentVideo.play?.();
            if (playResult && typeof playResult.catch === "function") {
              playResult.catch(() => {});
            }
          }
          setContextualVisibilityLock(comment, seekResult.anchorTime, clickBackContextSeconds);
          armLandingRubberband(comment, seekResult.anchorTime);
          if (cardState?.targetCorner) {
            clickedNotificationPrioritySeq += 1;
            cardState.pinnedTowardCorner = true;
            cardState.pinnedPrioritySeq = clickedNotificationPrioritySeq;
            cardState.order = getPinnedOrderTowardCorner(
              cardState.targetCorner,
              cardState.pinnedPrioritySeq
            );
            pushReactNotificationOverlayState();
          }
          scheduleReconcile(seekResult.targetTime);
        }
      }
    });
    if (themeCatalogV2) {
      reactRenderer.setThemeCatalog?.(themeCatalogV2);
    }
    reactRenderer.setActiveThemeId?.(raritySkin);
    reactNotificationsOverlayMounted = true;
    pushReactNotificationOverlayState();
    return true;
  } catch (error) {
    debugLog("React overlay mount failed", error);
    return false;
  }
}

function slugifyReactThemeTierName(value, fallback = "tier") {
  const text = String(value || "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  return text || fallback;
}

function buildReactTierForComment(tierName, tierConfig, tierRank = 0) {
  const activeTheme = themeCatalogV2Shared?.getThemeById && themeCatalogV2
    ? themeCatalogV2Shared.getThemeById(themeCatalogV2, raritySkin)
    : null;
  const themeTiers = Array.isArray(activeTheme?.tiers) ? activeTheme.tiers : [];
  const targetTierKey = String(tierName || "");
  const themeTierByKey = themeTiers.find(
    (entry, index) => slugifyReactThemeTierName(entry?.name, `tier-${index + 1}`) === targetTierKey
  ) || null;
  const themeTierByRank =
    themeTiers[Math.max(0, Math.min(themeTiers.length - 1, Number(tierRank || 0)))] || null;
  const themeTier = themeTierByKey || themeTierByRank;
  const { opacityDeltaPercent, darknessDeltaPercent } = getSkinAppearanceLocalModifiers();
  const hasExplicitThemeTierName =
    Boolean(themeTier) &&
    Object.prototype.hasOwnProperty.call(themeTier, "name");
  const resolvedTierDisplayName = hasExplicitThemeTierName
    ? String(themeTier?.name ?? "")
    : getTierDisplayName(tierName);
  const baseBody = String(
    themeTier?.body ||
      (rarityShared?.normalizeHexColor?.(tierConfig?.bodyColor, "#2b2b2b") ||
        tierConfig?.bodyColor ||
        "#2b2b2b")
  );
  const baseBorder = String(
    themeTier?.border ||
      (rarityShared?.normalizeHexColor?.(tierConfig?.borderColor, "#ffffff") ||
        tierConfig?.borderColor ||
        "#ffffff")
  );
  const baseText = String(
    themeTier?.text ||
      (rarityShared?.normalizeHexColor?.(tierConfig?.textColor, "#ffffff") ||
        tierConfig?.textColor ||
        "#ffffff")
  );
  const baseOpacity = themeTier
    ? Math.max(0, Number(themeTier.opacity ?? 90))
    : 90;
  const baseBorderOpacity = themeTier
    ? Math.max(0, Number(themeTier.borderOpacity ?? 100))
    : 100;
  const baseTextOpacity = themeTier
    ? Math.max(0, Number(themeTier.textOpacity ?? 100))
    : 100;
  return {
    id: String(tierConfig?.key || tierName),
    name: resolvedTierDisplayName,
    body: adjustHexColorForDarknessDelta(baseBody, darknessDeltaPercent),
    border: adjustHexColorForDarknessDelta(baseBorder, darknessDeltaPercent),
    text: adjustHexColorForDarknessDelta(baseText, darknessDeltaPercent * 0.45),
    radius: themeTier ? Math.max(0, Number(themeTier.radius ?? 8)) : Math.round(getOverlayRadiusForSkin(raritySkin)),
    borderWidth: themeTier ? Math.max(0, Number(themeTier.borderWidth ?? 2)) : Math.max(0, Number(getCurrentSkinStyleConfig()?.borderWidth || 1)),
    opacity: clamp(baseOpacity + opacityDeltaPercent, 0, 100),
    borderOpacity: clamp(baseBorderOpacity + opacityDeltaPercent, 0, 100),
    textOpacity: clamp(baseTextOpacity + opacityDeltaPercent * 0.8, 0, 100),
    effect: themeTier
      ? String(themeTier.effect || "none")
      : ((Array.isArray(tierConfig?.effects) && tierConfig.effects.includes("rainbow-cycle"))
          ? "aurora"
          : (Array.isArray(tierConfig?.effects) && (tierConfig.effects.includes("glow") || tierConfig.effects.includes("pulse")))
            ? "galaxy"
            : "none")
  };
}

function buildLikesMetaLabel(comment, tierName, tierDisplayLabelOverride) {
  const likesCount = Number(comment?.likes || 0);
  const hasTierLabelOverride = arguments.length >= 3;
  const tierDisplayLabel = hasTierLabelOverride
    ? String(tierDisplayLabelOverride ?? "").trim()
    : String(getTierDisplayName(tierName) || "").trim();
  const showLikesMeta = showLikesInNotifications && likesCount > 0;
  const showTierMeta = showRarityLabelInNotifications && Boolean(tierDisplayLabel);

  if (showLikesMeta && showTierMeta) {
    return `Likes ${formatLikesLabel(likesCount)} - ${tierDisplayLabel}`;
  }
  if (showLikesMeta) {
    return `Likes ${formatLikesLabel(likesCount)}`;
  }
  if (showTierMeta) {
    return tierDisplayLabel;
  }
  return "";
}

function buildReactOverlayCardEntry(cardState) {
  if (!cardState?.comment) {
    return null;
  }
  return {
    id: cardState.commentId,
    corner: cardState.targetCorner,
    order: cardState.order,
    phase: cardState.phase,
    tier: cardState.reactTier,
    tierClass: cardState.tierClass,
    comment: {
      text: String(cardState.comment?.text || ""),
      author: String(cardState.comment?.name || cardState.comment?.author || "@User"),
      avatar: String(cardState.comment?.avatar || "")
    },
    likesLabel: cardState.likesText,
    showMeta: cardState.showMeta,
    accentClass: cardState.accentClass || "",
    rubberbandPulse: cardState.rubberbandPulse === true
  };
}

function refreshActiveCardVisualsForCurrentSkin() {
  if (!activeCards.length) {
    return;
  }
  for (const cardState of activeCards) {
    const comment = cardState?.comment;
    if (!comment) continue;
    const likesCount = Number(comment?.likes || 0);
    const tierRank = getTierRank(likesCount, comment);
    const tierName = getTierName(tierRank);
    const tierConfig = getTierConfigByKey(tierName);
    cardState.tierName = tierName;
    cardState.tierClass = `${tierName}-liked`;
    cardState.reactTier = buildReactTierForComment(tierName, tierConfig, tierRank);
    cardState.likesText = buildLikesMetaLabel(
      comment,
      tierName,
      cardState.reactTier?.name
    );
    cardState.showMeta =
      showAuthorInNotifications ||
      showLikesInNotifications ||
      showRarityLabelInNotifications;
    if (cardState.targetCorner) {
      cardState.order = cardState.pinnedTowardCorner
        ? getPinnedOrderTowardCorner(cardState.targetCorner, cardState.pinnedPrioritySeq)
        : getTierOrderForCorner(cardState.targetCorner, tierRank, likesCount);
    }
  }
}

function pushReactNotificationOverlayState() {
  const reactRenderer = getReactOverlayRenderer();
  if (!reactRenderer?.setOverlayState || !overlayElement) {
    return;
  }
  const lanes = {
    "top-left": [],
    "top-right": [],
    "bottom-left": [],
    "bottom-right": []
  };
  for (const cardState of activeCards) {
    const entry = buildReactOverlayCardEntry(cardState);
    if (!entry || !lanes[entry.corner]) {
      continue;
    }
    lanes[entry.corner].push(entry);
  }
  for (const key of Object.keys(lanes)) {
    lanes[key].sort((a, b) => Number(a.order || 0) - Number(b.order || 0));
  }
  try {
    reactRenderer.setOverlayState({
      lanes,
      globalVisible: isOverlayRuntimeEnabled(),
      runtimeConfig: {
        showLikesInNotifications,
        showRarityLabelInNotifications,
        showAuthorInNotifications,
        stackOpacityFadeEnabled,
        stackOpacityFadeStart,
        stackOpacityFadeStepPercent,
        overlayRadius,
        overlayAvatarSize,
        overlayGlassiness,
        overlayDarkness,
        reverseStackOrder,
        timestampAccentEffect
      }
    });
  } catch (error) {
    debugLog("React overlay state push failed", error);
  }
}

function clearCardStateTimers(cardState) {
  if (!cardState) return;
  for (const key of ["hideTimeoutId", "visibleTimerId", "accentTimerId", "accentClearTimerId", "rubberbandTimerId"]) {
    if (cardState[key]) {
      clearTimeout(cardState[key]);
      cardState[key] = null;
    }
  }
}

function scheduleCardPhaseVisible(cardState) {
  if (!cardState) return;
  if (cardState.visibleTimerId) {
    clearTimeout(cardState.visibleTimerId);
  }
  cardState.visibleTimerId = setTimeout(() => {
    if (activeCardByCommentId.get(cardState.commentId) !== cardState) return;
    if (cardState.phase === "entering") {
      cardState.phase = "visible";
      pushReactNotificationOverlayState();
    }
    cardState.visibleTimerId = null;
  }, 16);
}

function scheduleCardAccent(cardState, delayMs, playbackRate) {
  if (!cardState || !earlyModeEnabled || timestampAccentEffect === "none") {
    return;
  }
  const effectClass = `accent-${timestampAccentEffect}`;
  const delay = Math.max(0, Math.min(getDisplayDurationMs(cardState.comment, playbackRate), delayMs));
  cardState.accentTimerId = setTimeout(() => {
    if (activeCardByCommentId.get(cardState.commentId) !== cardState) return;
    cardState.accentClass = effectClass;
    pushReactNotificationOverlayState();
    cardState.accentClearTimerId = setTimeout(() => {
      if (activeCardByCommentId.get(cardState.commentId) !== cardState) return;
      cardState.accentClass = "";
      pushReactNotificationOverlayState();
      cardState.accentClearTimerId = null;
    }, 1300);
    cardState.accentTimerId = null;
  }, delay);
}

function triggerCardRubberbandState(cardState) {
  if (!cardState) {
    return;
  }
  cardState.rubberbandPulse = false;
  pushReactNotificationOverlayState();
  setTimeout(() => {
    if (activeCardByCommentId.get(cardState.commentId) !== cardState) return;
    cardState.rubberbandPulse = true;
    pushReactNotificationOverlayState();
    if (cardState.rubberbandTimerId) {
      clearTimeout(cardState.rubberbandTimerId);
    }
    cardState.rubberbandTimerId = setTimeout(() => {
      if (activeCardByCommentId.get(cardState.commentId) !== cardState) return;
      cardState.rubberbandPulse = false;
      pushReactNotificationOverlayState();
      cardState.rubberbandTimerId = null;
    }, LANDING_RUBBERBAND_DURATION_MS);
  }, 0);
}

function removeCardState(cardState) {
  clearCardStateTimers(cardState);
  const index = activeCards.indexOf(cardState);
  if (index >= 0) {
    activeCards.splice(index, 1);
  }
  if (cardState?.commentId) {
    activeCardByCommentId.delete(cardState.commentId);
  }
  pushReactNotificationOverlayState();
}

function beginCardHide(cardState) {
  if (!cardState || cardState.phase !== "visible") {
    removeCardState(cardState);
    return;
  }
  cardState.phase = "hiding";
  pushReactNotificationOverlayState();
  cardState.hideTimeoutId = setTimeout(() => {
    cardState.hideTimeoutId = null;
    removeCardState(cardState);
  }, 1000);
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
  if (!isOverlayRuntimeEnabled() || !overlayElement) {
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
      triggerCardRubberbandState(cardState);
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
  if (!overlayElement || !isOverlayRuntimeEnabled()) {
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
  ensureLaneContainers();
  const reactMounted = ensureReactNotificationOverlayMounted();
  const targetCorner = resolveCommentCorner(comment);
  if (!reactMounted) {
    return;
  }

  const likesCount = Number(comment?.likes || 0);
  const tierRank = getTierRank(likesCount, comment);
  const tierName = getTierName(tierRank);
  const tierConfig = getTierConfigByKey(tierName);
  const cardOrder = getTierOrderForCorner(targetCorner, tierRank, likesCount);
  const reactTier = buildReactTierForComment(tierName, tierConfig, tierRank);
  const likesText = buildLikesMetaLabel(comment, tierName, reactTier?.name);
  const playbackRate = getActivePlaybackRate();

  const cardState = {
    commentId,
    card: null,
    comment,
    targetCorner,
    order: cardOrder,
    pinnedTowardCorner: false,
    pinnedPrioritySeq: 0,
    tierName,
    tierClass: `${tierName}-liked`,
    reactTier,
    likesText,
    showMeta:
      showAuthorInNotifications ||
      showLikesInNotifications ||
      showRarityLabelInNotifications,
    phase: "entering",
    accentClass: "",
    rubberbandPulse: false,
    landingRubberbandAt: null,
    landingRubberbandPlayed: true,
    remainingMs: getDisplayDurationMs(comment, playbackRate),
    hideTimeoutId: null,
    hideStartedAt: Date.now(),
    visibleTimerId: null,
    accentTimerId: null,
    accentClearTimerId: null,
    rubberbandTimerId: null
  };
  const landingState = clickLandingRubberbandByCommentId.get(commentId);
  if (landingState && landingState.played !== true && Number.isFinite(landingState.targetTime)) {
    cardState.landingRubberbandAt = Number(landingState.targetTime);
    cardState.landingRubberbandPlayed = false;
  }
  activeCards.push(cardState);
  activeCardByCommentId.set(commentId, cardState);
  pushReactNotificationOverlayState();
  scheduleCardPhaseVisible(cardState);
  scheduleCardAccent(cardState, accentDelayMs, playbackRate);
}

function hideOverlay() {
  if (!overlayElement) {
    cancelCardDrag();
    return;
  }
  cancelCardDrag();
  for (const cardState of activeCards) {
    clearCardStateTimers(cardState);
  }
  activeCards = [];
  activeCardByCommentId.clear();
  contextualVisibilityLocks.clear();
  clickLandingRubberbandByCommentId.clear();
  if (upcomingDotElement && upcomingDotElement.parentElement) {
    upcomingDotElement.remove();
  }
  upcomingDotElement = null;
  pushReactNotificationOverlayState();
}

function changePosition(newPosition) {
  if (!overlayElement) {
    return;
  }
  position = newPosition;
  freePositionEnabled = false;
  freePositionX = DEFAULT_FREE_POSITION_X;
  freePositionY = DEFAULT_FREE_POSITION_Y;
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
  commentsScanInProgress = false;
  commentsLoadComplete = false;
  commentsLoadPagesFetched = null;
  commentsLoadPagesTarget = null;
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
  if (eyeVisualTransitionTimerId !== null) {
    clearTimeout(eyeVisualTransitionTimerId);
    eyeVisualTransitionTimerId = null;
  }
  if (quickMenuStatusTimerId !== null) {
    clearTimeout(quickMenuStatusTimerId);
    quickMenuStatusTimerId = null;
  }
  quickMenuOpen = false;
  quickMenuActivePanel = "main";
  quickMenuStatusText = "";
  notificationsMutedByEye = false;
  localOverlayForceEnabledWhileGlobalOff = false;
  commentDraftPopupOpen = false;
  notificationsSuppressedByDraftPopup = false;
  commentDraftTimestampSeconds = null;
  commentDraftStatusText = "";
  commentDraftStatusTone = "";
  eyeVisualState = EYE_STATE_LOADING;
  if (quickMenuMenuElement && quickMenuMenuElement.parentElement) {
    quickMenuMenuElement.remove();
  }
  quickMenuMenuElement = null;
  try {
    getReactOverlayRenderer()?.unmountOverlay?.();
  } catch (error) {
    // ignore teardown errors
  }
  reactNotificationsOverlayMounted = false;
  if (commentDraftPopupElement && commentDraftPopupElement.parentElement) {
    commentDraftPopupElement.remove();
  }
  commentDraftPopupElement = null;
  commentDraftTextareaElement = null;
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
  showAuthorInNotifications = DEFAULT_SHOW_AUTHOR_IN_NOTIFICATIONS;
  showRarityLabelInNotifications = DEFAULT_SHOW_RARITY_LABEL_IN_NOTIFICATIONS;
  timelineMarkersEnabled = true;
  raritySkin = DEFAULT_RARITY_SKIN;
  rarityLogicMode = DEFAULT_RARITY_LOGIC_MODE;
  rarityGeometricRatio = DEFAULT_RARITY_GEOMETRIC_RATIO;
  hiddenRarityTiersBySkin = DEFAULT_HIDDEN_RARITY_TIERS_BY_SKIN;
  commentScanStartDelaySec = DEFAULT_COMMENT_SCAN_START_DELAY_SEC;
  clearTimestampCacheOnRefresh = DEFAULT_CLEAR_TIMESTAMP_CACHE_ON_REFRESH;
  clearMarkers();
  hideOverlay();
}

if (document.readyState === "complete") {
  safeMain();
} else {
  window.addEventListener("load", async () => {
    await safeMain();
  });
}

document.addEventListener("fullscreenchange", () => {
  applyOverlayStyles();
  positionCommentDraftPopup();
});
document.addEventListener("webkitfullscreenchange", () => {
  applyOverlayStyles();
  positionCommentDraftPopup();
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
    if (isActive) {
      localOverlayForceEnabledWhileGlobalOff = false;
    }
    if (!isOverlayRuntimeEnabled()) {
      pauseTimestampRuntime();
    } else {
      resumeTimestampRuntime({ runScan: shouldRunFreshScanOnResume() });
    }
    updateEyeToggleVisibility();
    return;
  }

  if (message.type === "theme_catalog_updated") {
    if (themeCatalogV2Shared && message.themeCatalogV2) {
      applyThemeCatalogV2ToRuntimeCatalog(
        message.themeCatalogV2,
        Number(message.themeCatalogV2Revision || Date.now())
      );
      raritySkin = normalizeRaritySkin(
        String(message.activeThemeId || message.activeRaritySkinId || raritySkin)
      );
      tabSessionRaritySkinOverride = raritySkin;
      recomputeLikeTierThresholds();
      refreshActiveCardVisualsForCurrentSkin();
      getReactOverlayRenderer()?.setThemeCatalog?.(themeCatalogV2);
      getReactOverlayRenderer()?.setActiveThemeId?.(raritySkin);
      pushReactNotificationOverlayState();
      applyOverlayStyles();
      scheduleRenderTimeMarkers();
      const video = getVideo();
      if (video && !isAdPlaying()) {
        scheduleReconcile(video.currentTime);
      }
      updateEyeToggleVisibility();
    }
    return;
  }

  if (message.type === "overlaySettings") {
    const previousDisplayDuration = displayDuration;
    const previousEarlyModeEnabled = earlyModeEnabled;
    const previousEarlySeconds = earlySeconds;
    const previousFollowPlaybackSpeed = followPlaybackSpeed;
    const previousClickBackContextSeconds = clickBackContextSeconds;
    const previousRaritySkin = raritySkin;
    const previousRarityLogicMode = rarityLogicMode;
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
    clickBackContextSeconds = clamp(
      Number(message.clickBackContextSeconds ?? clickBackContextSeconds),
      MIN_CLICK_BACK_CONTEXT_SECONDS,
      MAX_CLICK_BACK_CONTEXT_SECONDS
    );
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
    timelineMarkersEnabled = Boolean(
      message.timelineMarkersEnabled ?? timelineMarkersEnabled
    );
    heatmapEnabled = Boolean(message.heatmapEnabled ?? heatmapEnabled);
    heatmapIntensity = clamp(
      Number(message.heatmapIntensity ?? heatmapIntensity),
      MIN_HEATMAP_INTENSITY,
      MAX_HEATMAP_INTENSITY
    );
    const messagePresetProfile = String(message.presetProfile ?? "");
    if (messagePresetProfile) {
      presetProfile = messagePresetProfile === "minimal" ? "minimal" : "balanced";
    }
    showAuthorInNotifications =
      messagePresetProfile === "minimal"
        ? false
        : Boolean(message.showAuthorInNotifications ?? showAuthorInNotifications);
    showLikesInNotifications =
      messagePresetProfile === "minimal"
        ? false
        : Boolean(message.showLikesInNotifications ?? showLikesInNotifications);
    showUpcomingDot = Boolean(
      message.showUpcomingDot ?? showUpcomingDot
    );
    stackOpacityFadeEnabled = Boolean(
      message.stackOpacityFadeEnabled ?? stackOpacityFadeEnabled
    );
    stackOpacityFadeStart = clamp(
      Number(message.stackOpacityFadeStart ?? stackOpacityFadeStart),
      MIN_STACK_OPACITY_FADE_START,
      MAX_STACK_OPACITY_FADE_START
    );
    stackOpacityFadeStepPercent = clamp(
      Number(message.stackOpacityFadeStepPercent ?? stackOpacityFadeStepPercent),
      MIN_STACK_OPACITY_FADE_STEP_PERCENT,
      MAX_STACK_OPACITY_FADE_STEP_PERCENT
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
    if (themeCatalogV2Shared && message.themeCatalogV2) {
      applyThemeCatalogV2ToRuntimeCatalog(
        message.themeCatalogV2,
        Number(message.themeCatalogV2Revision || Date.now())
      );
    }
    if (message.raritySkinCatalogRevision) {
      raritySkinCatalogRevision = Number(message.raritySkinCatalogRevision || raritySkinCatalogRevision);
    }
    raritySkin = normalizeRaritySkin(
      String(message.activeRaritySkinId ?? message.raritySkin ?? raritySkin)
    );
    if (
      Object.prototype.hasOwnProperty.call(message, "raritySkin") ||
      Object.prototype.hasOwnProperty.call(message, "activeRaritySkinId")
    ) {
      tabSessionRaritySkinOverride = raritySkin;
    }
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
    clearTimestampCacheOnRefresh = Boolean(
      message.clearTimestampCacheOnRefresh ?? clearTimestampCacheOnRefresh
    );
    recomputeLikeTierThresholds();
    refreshActiveCardVisualsForCurrentSkin();
    getReactOverlayRenderer()?.setThemeCatalog?.(themeCatalogV2);
    getReactOverlayRenderer()?.setActiveThemeId?.(raritySkin);
    pushReactNotificationOverlayState();
    applyOverlayStyles();
    scheduleRenderTimeMarkers();
    const timingBehaviorChanged =
      previousDisplayDuration !== displayDuration ||
      previousEarlyModeEnabled !== earlyModeEnabled ||
      previousEarlySeconds !== earlySeconds ||
      previousFollowPlaybackSpeed !== followPlaybackSpeed ||
      previousClickBackContextSeconds !== clickBackContextSeconds;
    const video = getVideo();
    const rarityBehaviorChanged =
      previousRaritySkin !== raritySkin ||
      previousRarityLogicMode !== rarityLogicMode ||
      previousHiddenRarityState !==
        JSON.stringify(normalizeHiddenRarityTiersBySkin(hiddenRarityTiersBySkin));
    if (!isOverlayRuntimeEnabled()) {
      pauseTimestampRuntime();
      updateEyeToggleVisibility();
      return;
    }
    if (video && !isAdPlaying() && rarityBehaviorChanged) {
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
    tabSessionRaritySkinOverride = nextSkin;
    overlayRadius = getOverlayRadiusForSkin(raritySkin);
    recomputeLikeTierThresholds();
    refreshActiveCardVisualsForCurrentSkin();
    getReactOverlayRenderer()?.setThemeCatalog?.(themeCatalogV2);
    getReactOverlayRenderer()?.setActiveThemeId?.(raritySkin);
    pushReactNotificationOverlayState();
    applyOverlayStyles();
    scheduleRenderTimeMarkers();
    const video = getVideo();
    if (video && !isAdPlaying()) {
      scheduleReconcile(video.currentTime);
    }
    return;
  }

  if (message.type === "comments_filter_settings_changed") {
    debugLog("Comment filter changed, force refreshing comments");
    const videoId = getVideoId();
    if (videoId) {
      pushQuickMenuScanDebugEvent("filter_settings_changed", "force refresh requested");
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
    pushQuickMenuScanDebugEvent(
      "comments_replace",
      message.complete === false ? "partial (cached/startup/lazy continuing)" : "complete/cached"
    );
    comments = message.comments || [];
    commentsLoadComplete = message.complete === undefined ? true : Boolean(message.complete);
    commentsScanInProgress = !commentsLoadComplete;
    if (message.progress && typeof message.progress === "object") {
      commentsLoadPagesFetched = Number.isFinite(Number(message.progress.pagesFetched))
        ? Number(message.progress.pagesFetched)
        : commentsLoadPagesFetched;
      commentsLoadPagesTarget = Number.isFinite(Number(message.progress.pagesTarget))
        ? Number(message.progress.pagesTarget)
        : null;
    }
    comments.sort((a, b) => {
      if (a.time !== b.time) {
        return a.time - b.time;
      }
      return compareByPriority(a, b);
    });
    recomputeLikeTierThresholds();
    hideOverlay();
    scheduleRenderTimeMarkers();
    updateEyeToggleVisibility();
    if (isOverlayRuntimeEnabled() && monitoringInitialized === false) {
      startMonitoring();
    }
    const video = getVideo();
    if (video && !isAdPlaying() && isOverlayRuntimeEnabled()) {
      scheduleReconcile(video.currentTime);
    }
    return;
  }

  if (message.type === "comments_update") {
    comments.push(...(message.comments || []));
    if (message.complete !== undefined) {
      commentsLoadComplete = Boolean(message.complete);
      if (commentsLoadComplete) {
        commentsScanInProgress = false;
      }
    }
    if (message.progress && typeof message.progress === "object") {
      if (Number.isFinite(Number(message.progress.pagesFetched))) {
        commentsLoadPagesFetched = Number(message.progress.pagesFetched);
      }
      commentsLoadPagesTarget = Number.isFinite(Number(message.progress.pagesTarget))
        ? Number(message.progress.pagesTarget)
        : commentsLoadPagesTarget;
    }
    comments.sort((a, b) => {
      if (a.time !== b.time) {
        return a.time - b.time;
      }
      return compareByPriority(a, b);
    });
    recomputeLikeTierThresholds();
    scheduleRenderTimeMarkers();
    updateEyeToggleVisibility();
    if (isOverlayRuntimeEnabled() && monitoringInitialized === false) {
      startMonitoring();
    }
    const video = getVideo();
    if (video && !isAdPlaying() && isOverlayRuntimeEnabled()) {
      scheduleReconcile(video.currentTime);
    }
  }
});
