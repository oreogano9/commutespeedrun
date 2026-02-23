let lastPosition = "";
const IS_EDITOR_MODE = false;

const DEFAULT_OVERLAY_SCALE = 1.05;
const DEFAULT_DISPLAY_DURATION = 10;
const DEFAULT_OVERLAY_RADIUS = 25;
const DEFAULT_OVERLAY_AVATAR_SIZE = 40;
const DEFAULT_OVERLAY_GLASSINESS = 20;
const DEFAULT_OVERLAY_DARKNESS = 90;
const DEFAULT_DEBUG_MODE = false;
const DEFAULT_ALLOW_LONG_MESSAGES = false;
const DEFAULT_MAX_MESSAGE_CHARS = 300;
const DEFAULT_EARLY_MODE_ENABLED = false;
const DEFAULT_FOLLOW_PLAYBACK_SPEED = true;
const DEFAULT_EARLY_SECONDS = 5;
const DEFAULT_TIMESTAMP_ACCENT_EFFECT = "rubberband";
const DEFAULT_REVERSE_STACK_ORDER = false;
const DEFAULT_POPUP_DARK_MODE = true;
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
const DEFAULT_HIDE_TIMESTAMP_ONLY_MESSAGES = true;
const DEFAULT_HIDE_MULTI_TIMESTAMP_MESSAGES = true;
const DEFAULT_EXPERIMENTAL_GAME_SKIN_AUTO_ENABLED = true;
const DEFAULT_COMMENT_FETCH_STARTUP_PAGES = 1;
const DEFAULT_COMMENT_FETCH_MAX_PAGES = 8;
const DEFAULT_COMMENT_FETCH_AGGRESSIVE = false;
const DEFAULT_COMMENT_FETCH_ADAPTIVE = true;
const DEFAULT_LIVE_PAGE_MARKER_UPDATES = true;
const DEFAULT_COMMENT_SCAN_START_DELAY_SEC = 3;
const DEFAULT_PRESET_PROFILE = "balanced";
const DEFAULT_RARITY_SKIN = "default";
const DEFAULT_RARITY_LOGIC_MODE = "geometric";
const DEFAULT_RARITY_GEOMETRIC_RATIO = 2.23;
const MIN_GOLD_TIER_LIKES = 15;
const MIN_PLATINUM_TIER_LIKES = 28;
const MIN_PLATINUM_TIER_GAP_FROM_GOLD = 8;
const MIN_BORDERLANDS_EPIC_TIER_LIKES = 16;
const MIN_BORDERLANDS_LEGENDARY_TIER_LIKES = 50;
const MIN_BORDERLANDS_LEGENDARY_GAP_FROM_EPIC = 8;
const MIN_BORDERLANDS2_LEGENDARY_TIER_LIKES = 60;
const MIN_BORDERLANDS2_PEARLESCENT_TIER_LIKES = 101;
const MIN_BORDERLANDS2_PEARLESCENT_GAP_FROM_LEGENDARY = 20;
const MIN_MINECRAFT_RARE_TIER_LIKES = 11;
const MIN_MINECRAFT_EPIC_TIER_LIKES = 16;
const MIN_MINECRAFT_EPIC_GAP_FROM_RARE = 5;
const MIN_ANIMAL_BLOSSOM_TIER_LIKES = 11;
const MIN_ANIMAL_SUNNY_TIER_LIKES = 24;
const MIN_ANIMAL_SUNNY_GAP_FROM_BLOSSOM = 8;

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
const MIN_MAX_MESSAGE_CHARS = 1;
const MAX_MAX_MESSAGE_CHARS = 5000;
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
const MIN_COMMENT_FETCH_STARTUP_PAGES = 1;
const MAX_COMMENT_FETCH_STARTUP_PAGES = 5;
const MIN_COMMENT_FETCH_MAX_PAGES = 1;
const MAX_COMMENT_FETCH_MAX_PAGES = 200;
const MIN_COMMENT_SCAN_START_DELAY_SEC = 0;
const MAX_COMMENT_SCAN_START_DELAY_SEC = 20;
const MIN_RARITY_GEOMETRIC_RATIO = 1.05;
const MAX_RARITY_GEOMETRIC_RATIO = 3.0;
const PRESET_PROFILE_VALUES = ["minimal", "balanced"];
const RARITY_SKIN_VALUES = ["default", "borderlands", "borderlands2", "minecraft", "animalcrossing"];
const RARITY_LOGIC_MODE_VALUES = ["geometric"];
const DEFAULT_OVERLAY_RADIUS_BY_SKIN = Object.freeze({
  default: DEFAULT_OVERLAY_RADIUS,
  borderlands: DEFAULT_OVERLAY_RADIUS,
  borderlands2: DEFAULT_OVERLAY_RADIUS,
  minecraft: DEFAULT_OVERLAY_RADIUS,
  animalcrossing: DEFAULT_OVERLAY_RADIUS
});
const RARITY_SKIN_CUTOFF_LABELS = {
  default: { primary: "Gold cutoff", elite: "Platinum cutoff" },
  borderlands: { primary: "Epic cutoff", elite: "Legendary cutoff" },
  borderlands2: { primary: "Legendary cutoff", elite: "Pearlescent cutoff" },
  minecraft: { primary: "Rare cutoff", elite: "Epic cutoff" },
  animalcrossing: { primary: "Blossom cutoff", elite: "Sunny cutoff" }
};
const RARITY_PREVIEW_SCHEMES = {
  default: [
    { label: "Silver", color: "#b5b5b5" },
    { label: "Gold", color: "#ffd14d" },
    { label: "Platinum", color: "#9ae7ff" }
  ],
  borderlands: [
    { label: "Common (0-4)", color: "#FFFFFF" },
    { label: "Uncommon (5-10)", color: "#1EFF00" },
    { label: "Rare (11-15)", color: "#0070DD" },
    { label: "Epic (16-49)", color: "#A335EE" },
    { label: "Legendary (yellow) (50-60)", color: "#FFD100" },
    { label: "Legendary (orange) (61-65)", color: "#FF8000" },
    { label: "Legendary (dark orange) (66-100)", color: "#CC5A00" },
    { label: "Pearlescent (101+)", color: "#66FFFF" }
  ],
  borderlands2: [
    { label: "Common", color: "#FFFFFF" },
    { label: "Uncommon", color: "#1EFF00" },
    { label: "Rare", color: "#0070DD" },
    { label: "Cursed", color: "#4B0082" },
    { label: "Epic", color: "#A335EE" },
    { label: "E-tech", color: "#FF33CC" },
    { label: "Gemstone", color: "#00FFD5" },
    { label: "Legendary", color: "#FF8000" },
    { label: "Effervescent", color: "#FF4FD8" },
    { label: "Seraph", color: "#FF69B4" },
    { label: "Pearlescent", color: "#66FFFF" }
  ],
  minecraft: [
    { label: "Common", color: "#FFFFFF" },
    { label: "Uncommon", color: "#FFD700" },
    { label: "Rare", color: "#55FFFF" },
    { label: "Epic", color: "#FF55FF" }
  ],
  animalcrossing: [
    { label: "Paper", color: "#F7F4EE" },
    { label: "Leaf", color: "#7ED6A2" },
    { label: "Blossom", color: "#FF9ACB" },
    { label: "Sky", color: "#6EC6FF" },
    { label: "Sunny", color: "#FFD36A" }
  ]
};
const RARITY_TIER_OPTIONS = {
  default: [
    { key: "silver", label: "Silver" },
    { key: "gold", label: "Gold" },
    { key: "platinum", label: "Platinum" }
  ],
  borderlands: [
    { key: "common", label: "Common" },
    { key: "uncommon", label: "Uncommon" },
    { key: "rare", label: "Rare" },
    { key: "epic", label: "Epic" },
    { key: "legendary-yellow", label: "Legendary (Yellow)" },
    { key: "legendary-orange", label: "Legendary (Orange)" },
    { key: "legendary-dark-orange", label: "Legendary (Dark Orange)" },
    { key: "pearlescent", label: "Pearlescent" }
  ],
  borderlands2: [
    { key: "common", label: "Common" },
    { key: "uncommon", label: "Uncommon" },
    { key: "rare", label: "Rare" },
    { key: "cursed", label: "Cursed" },
    { key: "epic", label: "Epic" },
    { key: "e-tech", label: "E-tech" },
    { key: "gemstone", label: "Gemstone" },
    { key: "legendary", label: "Legendary" },
    { key: "effervescent", label: "Effervescent" },
    { key: "seraph", label: "Seraph" },
    { key: "pearlescent", label: "Pearlescent" }
  ],
  minecraft: [
    { key: "common", label: "Common" },
    { key: "uncommon", label: "Uncommon" },
    { key: "rare", label: "Rare" },
    { key: "epic", label: "Epic" }
  ],
  animalcrossing: [
    { key: "paper", label: "Paper" },
    { key: "leaf", label: "Leaf" },
    { key: "blossom", label: "Blossom" },
    { key: "sky", label: "Sky" },
    { key: "sunny", label: "Sunny" }
  ]
};
const RARITY_SKIN_CUTOFF_RULES = {
  default: {
    primaryMin: MIN_GOLD_TIER_LIKES,
    eliteMin: MIN_PLATINUM_TIER_LIKES,
    eliteGapFromPrimary: MIN_PLATINUM_TIER_GAP_FROM_GOLD
  },
  borderlands: {
    primaryMin: MIN_BORDERLANDS_EPIC_TIER_LIKES,
    eliteMin: MIN_BORDERLANDS_LEGENDARY_TIER_LIKES,
    eliteGapFromPrimary: MIN_BORDERLANDS_LEGENDARY_GAP_FROM_EPIC
  },
  borderlands2: {
    primaryMin: MIN_BORDERLANDS2_LEGENDARY_TIER_LIKES,
    eliteMin: MIN_BORDERLANDS2_PEARLESCENT_TIER_LIKES,
    eliteGapFromPrimary: MIN_BORDERLANDS2_PEARLESCENT_GAP_FROM_LEGENDARY
  },
  minecraft: {
    primaryMin: MIN_MINECRAFT_RARE_TIER_LIKES,
    eliteMin: MIN_MINECRAFT_EPIC_TIER_LIKES,
    eliteGapFromPrimary: MIN_MINECRAFT_EPIC_GAP_FROM_RARE
  },
  animalcrossing: {
    primaryMin: MIN_ANIMAL_BLOSSOM_TIER_LIKES,
    eliteMin: MIN_ANIMAL_SUNNY_TIER_LIKES,
    eliteGapFromPrimary: MIN_ANIMAL_SUNNY_GAP_FROM_BLOSSOM
  }
};
const PRESET_PROFILES = {
  minimal: {
    overlayScale: 0.95,
    displayDuration: DEFAULT_DISPLAY_DURATION,
    overlayRadius: 25,
    overlayAvatarSize: 22,
    showLikesInNotifications: false
  },
  balanced: {
    overlayScale: DEFAULT_OVERLAY_SCALE,
    displayDuration: DEFAULT_DISPLAY_DURATION,
    overlayRadius: DEFAULT_OVERLAY_RADIUS,
    overlayAvatarSize: DEFAULT_OVERLAY_AVATAR_SIZE,
    showLikesInNotifications: true
  }
};

const rarityShared = globalThis.RaritySkinsShared;
if (!rarityShared) {
  throw new Error("Rarity skin shared module failed to load");
}
const LOCAL_RARITY_CATALOG_KEY = rarityShared.LOCAL_CATALOG_KEY;
const LOCAL_RARITY_CATALOG_REVISION_KEY = rarityShared.LOCAL_CATALOG_REVISION_KEY;
const SYNC_ACTIVE_RARITY_SKIN_ID_KEY = rarityShared.SYNC_ACTIVE_SKIN_ID_KEY;
const SYNC_HIDDEN_RARITY_TIERS_BY_SKIN_ID_KEY =
  rarityShared.SYNC_HIDDEN_TIERS_BY_SKIN_ID_KEY;
let raritySkinCatalog = rarityShared.createBuiltInCatalog();
let raritySkinCatalogRevision = Date.now();

function getCatalogSkinIds() {
  return rarityShared.getSkinIds(raritySkinCatalog);
}

function getSkinConfigById(skinId) {
  return rarityShared.getSkinById(raritySkinCatalog, skinId, DEFAULT_RARITY_SKIN);
}

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function normalizePresetProfile(value) {
  return PRESET_PROFILE_VALUES.includes(value) ? value : DEFAULT_PRESET_PROFILE;
}

function normalizeRaritySkin(value) {
  return rarityShared.normalizeActiveSkinId(value, raritySkinCatalog, DEFAULT_RARITY_SKIN);
}

function normalizeRarityLogicMode(value) {
  return RARITY_LOGIC_MODE_VALUES.includes(value) ? value : DEFAULT_RARITY_LOGIC_MODE;
}

function normalizeHiddenRarityTiersBySkin(value) {
  return rarityShared.normalizeHiddenTiersBySkinId(value, raritySkinCatalog);
}

function normalizeRadiusValue(value, fallback = DEFAULT_OVERLAY_RADIUS) {
  return clamp(Number(value ?? fallback), MIN_OVERLAY_RADIUS, MAX_OVERLAY_RADIUS);
}

function normalizeOverlayRadiusBySkin(value, fallbackRadius = DEFAULT_OVERLAY_RADIUS) {
  const source =
    value && typeof value === "object" && !Array.isArray(value)
      ? value
      : DEFAULT_OVERLAY_RADIUS_BY_SKIN;
  const fallback = normalizeRadiusValue(fallbackRadius, DEFAULT_OVERLAY_RADIUS);
  const result = {};
  for (const skin of getCatalogSkinIds()) {
    result[skin] = normalizeRadiusValue(source[skin], fallback);
  }
  return result;
}

function getRaritySkinCutoffLabels(raritySkin) {
  return rarityShared.getTopTierLabels(getSkinConfigById(raritySkin));
}

function getRaritySkinCutoffRules(raritySkin) {
  return rarityShared.getTopTierRules(getSkinConfigById(raritySkin));
}

function getRarityPreviewScheme(raritySkin) {
  const skin = getSkinConfigById(raritySkin);
  return (skin?.tiers || []).map((tier) => ({
    key: tier.key,
    label: tier.label,
    color: tier.bodyColor
  }));
}

function getPresetShowLikesDefault(presetProfile) {
  const profileKey = normalizePresetProfile(presetProfile);
  const preset = PRESET_PROFILES[profileKey] || PRESET_PROFILES[DEFAULT_PRESET_PROFILE];
  return Boolean(
    preset?.showLikesInNotifications ?? DEFAULT_SHOW_LIKES_IN_NOTIFICATIONS
  );
}

function deriveDiamondThresholdPercent(topLikedThresholdPercent) {
  const top = clamp(
    Number(topLikedThresholdPercent ?? DEFAULT_TOP_LIKED_THRESHOLD_PERCENT),
    MIN_TOP_LIKED_THRESHOLD_PERCENT,
    MAX_TOP_LIKED_THRESHOLD_PERCENT
  );
  return Math.max(1, Math.floor(top * 0.35));
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

async function getActiveYouTubeVideoId() {
  const tabGroups = await Promise.all([
    chrome.tabs.query({ active: true, currentWindow: true }),
    chrome.tabs.query({ active: true, lastFocusedWindow: true }),
    chrome.tabs.query({ currentWindow: true })
  ]);

  for (const tabs of tabGroups) {
    for (const tab of tabs || []) {
      const videoId = extractVideoIdFromUrl(tab?.url || "");
      if (videoId) {
        return videoId;
      }
    }
  }

  const allTabs = await chrome.tabs.query({});
  for (const tab of allTabs) {
    const videoId = extractVideoIdFromUrl(tab?.url || "");
    if (videoId) {
      return videoId;
    }
  }
  return null;
}

async function getConfigs() {
  const [storedSync, storedLocal] = await Promise.all([
    chrome.storage.sync.get([
      "active",
      "position",
      "overlayScale",
      "displayDuration",
      "overlayRadius",
      "overlayRadiusBySkin",
      "overlayAvatarSize",
      "overlayGlassiness",
      "overlayDarkness",
      "debugMode",
      "allowLongMessages",
      "maxMessageChars",
      "earlyModeEnabled",
      "followPlaybackSpeed",
      "earlySeconds",
      "timestampAccentEffect",
      "reverseStackOrder",
      "popupDarkMode",
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
      "hideTimestampOnlyMessages",
      "hideMultiTimestampMessages",
      "hiddenRarityTiersBySkin",
      "hiddenRarityTiersBySkinId",
      "showRarityLabelInNotifications",
      "experimentalGameSkinAutoEnabled",
      "commentFetchStartupPages",
      "commentFetchMaxPages",
      "commentFetchAggressive",
      "commentFetchAdaptive",
      "commentScanStartDelaySec",
      "livePageMarkerUpdates",
      "raritySkin",
      "activeRaritySkinId",
      "rarityLogicMode",
      "rarityGeometricRatio",
      "presetProfile"
    ]),
    chrome.storage.local.get([
      LOCAL_RARITY_CATALOG_KEY,
      LOCAL_RARITY_CATALOG_REVISION_KEY
    ])
  ]);

  const hasStoredCatalog =
    Boolean(storedLocal?.[LOCAL_RARITY_CATALOG_KEY]) &&
    typeof storedLocal?.[LOCAL_RARITY_CATALOG_KEY] === "object";
  const migrated = rarityShared.migrateLegacyState(storedSync || {});
  raritySkinCatalog = hasStoredCatalog
    ? rarityShared.normalizeCatalog(storedLocal?.[LOCAL_RARITY_CATALOG_KEY])
    : migrated.catalog;
  raritySkinCatalogRevision = Number(
    storedLocal?.[LOCAL_RARITY_CATALOG_REVISION_KEY] || Date.now()
  );

  const isActive =
    storedSync?.active !== undefined && storedSync?.active !== null
      ? storedSync.active
      : true;
  const position = storedSync?.position || "bottom-left";
  const overlayScale = clamp(
    Number(storedSync?.overlayScale ?? DEFAULT_OVERLAY_SCALE),
    MIN_OVERLAY_SCALE,
    MAX_OVERLAY_SCALE
  );
  const displayDuration = clamp(
    Number(storedSync?.displayDuration ?? DEFAULT_DISPLAY_DURATION),
    MIN_DISPLAY_DURATION,
    MAX_DISPLAY_DURATION
  );
  const overlayRadius = clamp(
    Number(storedSync?.overlayRadius ?? DEFAULT_OVERLAY_RADIUS),
    MIN_OVERLAY_RADIUS,
    MAX_OVERLAY_RADIUS
  );
  const overlayRadiusBySkin = normalizeOverlayRadiusBySkin(
    storedSync?.overlayRadiusBySkin,
    overlayRadius
  );
  const overlayAvatarSize = clamp(
    Number(storedSync?.overlayAvatarSize ?? DEFAULT_OVERLAY_AVATAR_SIZE),
    MIN_OVERLAY_AVATAR_SIZE,
    MAX_OVERLAY_AVATAR_SIZE
  );
  const overlayGlassiness = clamp(
    Number(storedSync?.overlayGlassiness ?? DEFAULT_OVERLAY_GLASSINESS),
    MIN_OVERLAY_GLASSINESS,
    MAX_OVERLAY_GLASSINESS
  );
  const overlayDarkness = clamp(
    Number(storedSync?.overlayDarkness ?? DEFAULT_OVERLAY_DARKNESS),
    MIN_OVERLAY_DARKNESS,
    MAX_OVERLAY_DARKNESS
  );
  const debugMode = Boolean(storedSync?.debugMode ?? DEFAULT_DEBUG_MODE);
  const allowLongMessages =
    storedSync?.allowLongMessages === undefined
      ? DEFAULT_ALLOW_LONG_MESSAGES
      : Boolean(storedSync.allowLongMessages);
  const maxMessageChars = clamp(
    Number(storedSync?.maxMessageChars ?? DEFAULT_MAX_MESSAGE_CHARS),
    MIN_MAX_MESSAGE_CHARS,
    MAX_MAX_MESSAGE_CHARS
  );
  const earlyModeEnabled = Boolean(
    storedSync?.earlyModeEnabled ?? DEFAULT_EARLY_MODE_ENABLED
  );
  const followPlaybackSpeed = Boolean(
    storedSync?.followPlaybackSpeed ?? DEFAULT_FOLLOW_PLAYBACK_SPEED
  );
  const earlySeconds = clamp(
    Number(storedSync?.earlySeconds ?? DEFAULT_EARLY_SECONDS),
    MIN_EARLY_SECONDS,
    MAX_EARLY_SECONDS
  );
  const timestampAccentEffect = String(
    storedSync?.timestampAccentEffect ?? DEFAULT_TIMESTAMP_ACCENT_EFFECT
  );
  const reverseStackOrder = Boolean(
    storedSync?.reverseStackOrder ?? DEFAULT_REVERSE_STACK_ORDER
  );
  const popupDarkMode = Boolean(storedSync?.popupDarkMode ?? DEFAULT_POPUP_DARK_MODE);
  const priorityScoringEnabled = Boolean(
    storedSync?.priorityScoringEnabled ?? DEFAULT_PRIORITY_SCORING_ENABLED
  );
  const priorityLikesWeight = clamp(
    Number(storedSync?.priorityLikesWeight ?? DEFAULT_PRIORITY_LIKES_WEIGHT),
    MIN_PRIORITY_LIKES_WEIGHT,
    MAX_PRIORITY_LIKES_WEIGHT
  );
  const topLikedThresholdPercent = clamp(
    Number(storedSync?.topLikedThresholdPercent ?? DEFAULT_TOP_LIKED_THRESHOLD_PERCENT),
    MIN_TOP_LIKED_THRESHOLD_PERCENT,
    MAX_TOP_LIKED_THRESHOLD_PERCENT
  );
  const diamondThresholdPercent = deriveDiamondThresholdPercent(topLikedThresholdPercent);
  const popularityModeEnabled = Boolean(
    storedSync?.popularityModeEnabled ?? DEFAULT_POPULARITY_MODE_ENABLED
  );
  const heatmapEnabled = Boolean(storedSync?.heatmapEnabled ?? DEFAULT_HEATMAP_ENABLED);
  const heatmapIntensity = clamp(
    Number(storedSync?.heatmapIntensity ?? DEFAULT_HEATMAP_INTENSITY),
    MIN_HEATMAP_INTENSITY,
    MAX_HEATMAP_INTENSITY
  );
  const routingEnabled = Boolean(storedSync?.routingEnabled ?? DEFAULT_ROUTING_ENABLED);
  const routingThreshold = clamp(
    Number(storedSync?.routingThreshold ?? DEFAULT_ROUTING_THRESHOLD),
    MIN_ROUTING_THRESHOLD,
    MAX_ROUTING_THRESHOLD
  );
  const routingShortCorner = String(
    storedSync?.routingShortCorner ?? DEFAULT_ROUTING_SHORT_CORNER
  );
  const routingLongCorner = String(
    storedSync?.routingLongCorner ?? DEFAULT_ROUTING_LONG_CORNER
  );
  const presetProfile = normalizePresetProfile(
    String(storedSync?.presetProfile ?? DEFAULT_PRESET_PROFILE)
  );
  const showLikesInNotifications =
    presetProfile === "minimal"
      ? false
      : Boolean(
          storedSync?.showLikesInNotifications ?? getPresetShowLikesDefault(presetProfile)
        );
  const showRarityLabelInNotifications =
    presetProfile === "minimal"
      ? false
      : Boolean(
          storedSync?.showRarityLabelInNotifications ??
            DEFAULT_SHOW_RARITY_LABEL_IN_NOTIFICATIONS
        );
  const showUpcomingDot = Boolean(
    storedSync?.showUpcomingDot ?? DEFAULT_SHOW_UPCOMING_DOT
  );
  const hideTimestampOnlyMessages = Boolean(
    storedSync?.hideTimestampOnlyMessages ?? DEFAULT_HIDE_TIMESTAMP_ONLY_MESSAGES
  );
  const hideMultiTimestampMessages = Boolean(
    storedSync?.hideMultiTimestampMessages ?? DEFAULT_HIDE_MULTI_TIMESTAMP_MESSAGES
  );
  const hiddenMapSource =
    storedSync?.[SYNC_HIDDEN_RARITY_TIERS_BY_SKIN_ID_KEY] ??
    storedSync?.hiddenRarityTiersBySkin ??
    migrated.hiddenBySkinId;
  const hiddenRarityTiersBySkin = normalizeHiddenRarityTiersBySkin(
    hiddenMapSource
  );
  const experimentalGameSkinAutoEnabled = Boolean(
    storedSync?.experimentalGameSkinAutoEnabled ??
      DEFAULT_EXPERIMENTAL_GAME_SKIN_AUTO_ENABLED
  );
  const commentFetchStartupPages = clamp(
    Number(storedSync?.commentFetchStartupPages ?? DEFAULT_COMMENT_FETCH_STARTUP_PAGES),
    MIN_COMMENT_FETCH_STARTUP_PAGES,
    MAX_COMMENT_FETCH_STARTUP_PAGES
  );
  const commentFetchMaxPages = clamp(
    Number(storedSync?.commentFetchMaxPages ?? DEFAULT_COMMENT_FETCH_MAX_PAGES),
    MIN_COMMENT_FETCH_MAX_PAGES,
    MAX_COMMENT_FETCH_MAX_PAGES
  );
  const commentFetchAggressive = Boolean(
    storedSync?.commentFetchAggressive ?? DEFAULT_COMMENT_FETCH_AGGRESSIVE
  );
  const commentFetchAdaptive = Boolean(
    storedSync?.commentFetchAdaptive ?? DEFAULT_COMMENT_FETCH_ADAPTIVE
  );
  const commentScanStartDelaySec = clamp(
    Number(storedSync?.commentScanStartDelaySec ?? DEFAULT_COMMENT_SCAN_START_DELAY_SEC),
    MIN_COMMENT_SCAN_START_DELAY_SEC,
    MAX_COMMENT_SCAN_START_DELAY_SEC
  );
  const livePageMarkerUpdates = Boolean(
    storedSync?.livePageMarkerUpdates ?? DEFAULT_LIVE_PAGE_MARKER_UPDATES
  );
  const requestedSkinId = String(
    storedSync?.[SYNC_ACTIVE_RARITY_SKIN_ID_KEY] ??
      storedSync?.raritySkin ??
      DEFAULT_RARITY_SKIN
  );
  const raritySkin = normalizeRaritySkin(
    requestedSkinId
  );
  const overlayRadiusForSkin = normalizeRadiusValue(
    overlayRadiusBySkin[raritySkin],
    overlayRadius
  );
  const rarityLogicMode = normalizeRarityLogicMode(
    String(storedSync?.rarityLogicMode ?? DEFAULT_RARITY_LOGIC_MODE)
  );
  const rarityGeometricRatio = clamp(
    Number(storedSync?.rarityGeometricRatio ?? DEFAULT_RARITY_GEOMETRIC_RATIO),
    MIN_RARITY_GEOMETRIC_RATIO,
    MAX_RARITY_GEOMETRIC_RATIO
  );
  const syncWrite = {
    active: isActive,
    position,
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
    popupDarkMode,
    priorityScoringEnabled,
    priorityLikesWeight,
    topLikedThresholdPercent,
    diamondThresholdPercent,
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
    hideMultiTimestampMessages,
    hiddenRarityTiersBySkin,
    [SYNC_HIDDEN_RARITY_TIERS_BY_SKIN_ID_KEY]: hiddenRarityTiersBySkin,
    experimentalGameSkinAutoEnabled,
    commentFetchStartupPages,
    commentFetchMaxPages,
    commentFetchAggressive,
    commentFetchAdaptive,
    commentScanStartDelaySec,
    livePageMarkerUpdates,
    showRarityLabelInNotifications,
    raritySkin,
    [SYNC_ACTIVE_RARITY_SKIN_ID_KEY]: raritySkin,
    rarityLogicMode,
    rarityGeometricRatio,
    presetProfile
  };

  const localWrite = {};
  if (!hasStoredCatalog) {
    localWrite[LOCAL_RARITY_CATALOG_KEY] = raritySkinCatalog;
    localWrite[LOCAL_RARITY_CATALOG_REVISION_KEY] = raritySkinCatalogRevision;
  } else if (!storedLocal?.[LOCAL_RARITY_CATALOG_REVISION_KEY]) {
    localWrite[LOCAL_RARITY_CATALOG_REVISION_KEY] = raritySkinCatalogRevision;
  }

  const syncNeedsWrite = Object.entries(syncWrite).some(([key, value]) => {
    const current = storedSync?.[key];
    if (typeof value === "object" && value !== null) {
      return JSON.stringify(current ?? null) !== JSON.stringify(value);
    }
    return current !== value;
  });

  if (syncNeedsWrite) {
    await chrome.storage.sync.set(syncWrite);
  }
  if (Object.keys(localWrite).length > 0) {
    await chrome.storage.local.set(localWrite);
  }

  return {
    isActive,
    position,
    overlayScale,
    displayDuration,
    overlayRadius: overlayRadiusForSkin,
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
    popupDarkMode,
    priorityScoringEnabled,
    priorityLikesWeight,
    topLikedThresholdPercent,
    diamondThresholdPercent,
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
    hideMultiTimestampMessages,
    hiddenRarityTiersBySkin,
    experimentalGameSkinAutoEnabled,
    commentFetchStartupPages,
    commentFetchMaxPages,
    commentFetchAggressive,
    commentFetchAdaptive,
    commentScanStartDelaySec,
    livePageMarkerUpdates,
    showRarityLabelInNotifications,
    raritySkin,
    rarityLogicMode,
    rarityGeometricRatio,
    presetProfile,
    raritySkinCatalog,
    raritySkinCatalogRevision
  };
}

function updateSizeLabel(sizeSlider, sizeValue) {
  sizeValue.textContent = `${Math.round(Number(sizeSlider.value))}%`;
}

function updateDurationLabel(durationSlider, durationValue) {
  durationValue.textContent = `${Number(durationSlider.value).toFixed(1)}s`;
}

function updateRadiusLabel(radiusSlider, radiusValue) {
  radiusValue.textContent = `${Math.round(Number(radiusSlider.value))}px`;
}

function updateAvatarSizeLabel(avatarSizeSlider, avatarSizeValue) {
  avatarSizeValue.textContent = `${Math.round(Number(avatarSizeSlider.value))}px`;
}

function updateGlassLabel(glassSlider, glassValue) {
  glassValue.textContent = `${Math.round(Number(glassSlider.value))}%`;
}

function updateDarknessLabel(darknessSlider, darknessValue) {
  darknessValue.textContent = `${Math.round(Number(darknessSlider.value))}%`;
}

function updateHeatmapIntensityLabel(heatmapSlider, heatmapValue) {
  heatmapValue.textContent = `${Math.round(Number(heatmapSlider.value))}%`;
}

function updateTopLikedThresholdLabel(thresholdSlider, thresholdValue) {
  if (!thresholdSlider || !thresholdValue) {
    return;
  }
  thresholdValue.textContent = `${Math.round(Number(thresholdSlider.value))}%`;
}

function updateGeometricRatioLabel(ratioSlider, ratioValue) {
  ratioValue.textContent = Number(ratioSlider.value).toFixed(2);
}

function applySettingHoverDescriptions() {
  const tooltips = {
    togglebtn: {
      name: "Overlay enabled",
      description: "Turns timestamp notifications on or off globally."
    },
    "size-slider": {
      name: "Overlay size",
      description: "Scales the notification cards on top of the video."
    },
    "minimal-mode-toggle": {
      name: "Minimal mode",
      description: "Quickly switches between Minimal and Normal visual presets."
    },
    "duration-slider": {
      name: "On-screen time",
      description: "Controls how long each notification stays visible."
    },
    "radius-slider": {
      name: "Corner roundness",
      description: "Adjusts the corner radius of notification cards."
    },
    "avatar-size-slider": {
      name: "Avatar size",
      description: "Changes avatar size and card height proportionally."
    },
    "glass-slider": {
      name: "Opacity",
      description: "Adjusts notification opacity, including flat skins like Minecraft and Animal Crossing."
    },
    "darkness-slider": {
      name: "Overlay darkness",
      description: "Controls background darkness behind notification text."
    },
    "reverse-stack-toggle": {
      name: "Reverse stack order",
      description: "Reverses where newest comments appear in the stack."
    },
    "popup-dark-toggle": {
      name: "Dark mode",
      description: "Toggles dark theme for the settings popup."
    },
    "allow-long-toggle": {
      name: "Allow long messages",
      description: "If enabled, long comments are allowed regardless of max chars."
    },
    "hide-timestamp-only-toggle": {
      name: "Hide timestamp-only comments",
      description: "Filters out comments that are only timestamps, like 12:34."
    },
    "early-mode-toggle": {
      name: "Early notification mode",
      description: "Shows notifications before their timestamp."
    },
    "follow-playback-speed-toggle": {
      name: "Follow playback speed",
      description: "Adapts timing so duration feels natural at different speeds."
    },
    "top-liked-threshold-slider": {
      name: "Top-liked threshold",
      description: "Shows cutoff previews for the current tier distribution."
    },
    "popularity-mode-toggle": {
      name: "Temporary popularity mode",
      description: "Enables full rarity tiers instead of basic 3-level ranking."
    },
    "rarity-skin-select": {
      name: "Rarity skin",
      description: "Switches the rarity ladder and visuals, including Borderlands mode."
    },
    "rarity-logic-select": {
      name: "Rarity logic",
      description:
        "Uses two-mode assignment: unlock tiers by distinct likes first, then geometric weighted quotas once enough distinct levels exist."
    },
    "rarity-geometric-ratio-slider": {
      name: "Geometric ratio",
      description: "In geometric mode, higher r shifts more comments into higher tiers."
    },
    "priority-scoring-toggle": {
      name: "Priority scoring",
      description: "Prioritizes higher-like comments in display ordering."
    },
    "heatmap-enabled-toggle": {
      name: "Mini heatmap",
      description: "Shows timeline intensity where comments cluster."
    },
    "heatmap-intensity-slider": {
      name: "Heatmap intensity",
      description: "Scales the visual strength of the timeline heatmap."
    },
    "routing-enabled-toggle": {
      name: "Multi-corner routing",
      description: "Routes comments to different corners by message length."
    },
    "show-likes-toggle": {
      name: "Show likes in notifications",
      description: "Displays each comment's like count in the card."
    },
    "show-rarity-label-toggle": {
      name: "Show rarity labels",
      description: "Appends the rarity title after likes inside each notification."
    },
    "show-upcoming-dot-toggle": {
      name: "Show warning dot",
      description: "Shows the red pre-notification dot before comments appear."
    },
    "experimental-game-skin-toggle": {
      name: "Auto game skin (experimental)",
      description: "Attempts to detect the game from video metadata and auto-select a matching rarity skin."
    },
    "comment-fetch-startup-pages-input": {
      name: "Startup pages",
      description: "How many comment pages are fetched immediately when a video loads."
    },
    "comment-scan-delay-input": {
      name: "Scan start delay",
      description: "How long to wait before scan begins after video load."
    },
    "comment-fetch-max-pages-input": {
      name: "Max pages",
      description: "Maximum total comment pages fetched per video."
    },
    "comment-fetch-aggressive-toggle": {
      name: "Aggressive full scan",
      description: "Pushes deeper scanning for more timestamps, with higher resource usage."
    },
    "comment-fetch-adaptive-toggle": {
      name: "Adaptive fetch mode",
      description: "Dynamically increases fetch depth when timestamp density is low."
    },
    "live-page-markers-toggle": {
      name: "Live page-by-page dots",
      description: "Updates timeline dots as each comment page arrives."
    }
  };

  Object.entries(tooltips).forEach(([id, meta]) => {
    const element = document.getElementById(id);
    if (!element) {
      return;
    }
    const title = `${meta.name}: ${meta.description}`;
    element.title = title;

    const label = document.querySelector(`label[for="${id}"]`);
    if (label) {
      label.title = title;
    }

    const row = element.closest(".setting-row, .setting-toggle-row");
    if (row) {
      row.title = title;
    }

    const switchWrapper = element.closest(".mini-switch");
    if (switchWrapper) {
      switchWrapper.title = title;
      const visualSlider = switchWrapper.querySelector(".mini-switch-slider");
      if (visualSlider) {
        visualSlider.title = title;
      }
    }
  });
}

async function broadcastOverlaySettings({
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
  diamondThresholdPercent,
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
  hideMultiTimestampMessages,
  hiddenRarityTiersBySkin,
  experimentalGameSkinAutoEnabled,
  commentFetchStartupPages,
  commentFetchMaxPages,
  commentFetchAggressive,
  commentFetchAdaptive,
  commentScanStartDelaySec,
  livePageMarkerUpdates,
  showRarityLabelInNotifications,
  raritySkin,
  rarityLogicMode,
  rarityGeometricRatio,
  presetProfile,
  raritySkinCatalogRevision,
  activeRaritySkinConfig
}) {
  await chrome.runtime.sendMessage({
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
    diamondThresholdPercent,
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
    hideMultiTimestampMessages,
    hiddenRarityTiersBySkin,
    hiddenRarityTiersBySkinId: hiddenRarityTiersBySkin,
    experimentalGameSkinAutoEnabled,
    commentFetchStartupPages,
    commentFetchMaxPages,
    commentFetchAggressive,
    commentFetchAdaptive,
    commentScanStartDelaySec,
    livePageMarkerUpdates,
    showRarityLabelInNotifications,
    raritySkin,
    activeRaritySkinId: raritySkin,
    activeRaritySkinConfig,
    raritySkinCatalogRevision,
    rarityLogicMode,
    rarityGeometricRatio,
    presetProfile
  });
}

document.addEventListener("DOMContentLoaded", async () => {
  const configs = await getConfigs();
  const positionButtons = document.querySelectorAll(".position-button");
  const toggleButton = document.getElementById("togglebtn");
  const settingsTabs = document.querySelectorAll(".settings-tab");
  const settingsPages = document.querySelectorAll(".settings-page");

  const sizeSlider = document.getElementById("size-slider");
  const sizeValue = document.getElementById("size-value");
  const minimalModeToggle = document.getElementById("minimal-mode-toggle");
  const durationSlider = document.getElementById("duration-slider");
  const durationValue = document.getElementById("duration-value");
  const radiusSlider = document.getElementById("radius-slider");
  const radiusValue = document.getElementById("radius-value");
  const avatarSizeSlider = document.getElementById("avatar-size-slider");
  const avatarSizeValue = document.getElementById("avatar-size-value");
  const glassSlider = document.getElementById("glass-slider");
  const glassValue = document.getElementById("glass-value");
  const darknessSlider = document.getElementById("darkness-slider");
  const darknessValue = document.getElementById("darkness-value");
  const debugToggle = document.getElementById("debug-toggle");
  const allowLongToggle = document.getElementById("allow-long-toggle");
  const hideTimestampOnlyToggle = document.getElementById("hide-timestamp-only-toggle");
  const hideMultiTimestampToggle = document.getElementById("hide-multi-timestamp-toggle");
  const maxCharsInput = document.getElementById("max-chars-input");
  const earlyModeToggle = document.getElementById("early-mode-toggle");
  const followPlaybackSpeedToggle = document.getElementById("follow-playback-speed-toggle");
  const earlySecondsInput = document.getElementById("early-seconds-input");
  const accentEffectSelect = document.getElementById("accent-effect-select");
  const reverseStackToggle = document.getElementById("reverse-stack-toggle");
  const popupDarkToggle = document.getElementById("popup-dark-toggle");
  const priorityScoringToggle = document.getElementById("priority-scoring-toggle");
  const priorityLikesWeightInput = document.getElementById("priority-likes-weight-input");
  const topLikedThresholdSlider = document.getElementById("top-liked-threshold-slider");
  const topLikedThresholdValue = document.getElementById("top-liked-threshold-value");
  const rarityGeometricRatioRow = document.getElementById("rarity-geometric-ratio-row");
  const rarityGeometricRatioSlider = document.getElementById("rarity-geometric-ratio-slider");
  const rarityGeometricRatioValue = document.getElementById("rarity-geometric-ratio-value");
  const popularityModeToggle = document.getElementById("popularity-mode-toggle");
  const raritySkinSelect = document.getElementById("rarity-skin-select");
  const rarityLogicSelect = document.getElementById("rarity-logic-select");
  const rarityPreviewGrid = document.getElementById("rarity-preview-grid");
  const raritySkinActionsRow = document.getElementById("rarity-skin-actions-row");
  const rarityAddSkinButton = document.getElementById("rarity-add-skin-button");
  const rarityDuplicateSkinButton = document.getElementById("rarity-duplicate-skin-button");
  const rarityDeleteSkinButton = document.getElementById("rarity-delete-skin-button");
  const rarityEditorSkinNameInput = document.getElementById("rarity-editor-skin-name-input");
  const rarityEditorSkinIdInput = document.getElementById("rarity-editor-skin-id-input");
  const rarityStyleFamilySelect = document.getElementById("rarity-style-family-select");
  const rarityStyleRadiusSlider = document.getElementById("rarity-style-radius-slider");
  const rarityStyleRadiusValue = document.getElementById("rarity-style-radius-value");
  const rarityStyleBorderEnabledToggle = document.getElementById("rarity-style-border-enabled-toggle");
  const rarityStyleBorderWidthInput = document.getElementById("rarity-style-border-width-input");
  const rarityStylePackOpacitySlider = document.getElementById("rarity-style-pack-opacity-slider");
  const rarityStylePackOpacityValue = document.getElementById("rarity-style-pack-opacity-value");
  const rarityTierList = document.getElementById("rarity-tier-list");
  const rarityAddTierButton = document.getElementById("rarity-add-tier-button");
  const rarityTierMoveUpButton = document.getElementById("rarity-tier-move-up-button");
  const rarityTierMoveDownButton = document.getElementById("rarity-tier-move-down-button");
  const rarityTierDeleteButton = document.getElementById("rarity-tier-delete-button");
  const rarityTierLabelInput = document.getElementById("rarity-tier-label-input");
  const rarityTierKeyInput = document.getElementById("rarity-tier-key-input");
  const rarityTierBodyColorInput = document.getElementById("rarity-tier-body-color-input");
  const rarityTierTextColorInput = document.getElementById("rarity-tier-text-color-input");
  const rarityTierBorderColorInput = document.getElementById("rarity-tier-border-color-input");
  const rarityTierMarkerColorInput = document.getElementById("rarity-tier-marker-color-input");
  const rarityTierMarkerWidthInput = document.getElementById("rarity-tier-marker-width-input");
  const rarityTierMarkerHeightInput = document.getElementById("rarity-tier-marker-height-input");
  const rarityTierMarkerOffsetInput = document.getElementById("rarity-tier-marker-offset-input");
  const rarityTierPercentileFactorInput = document.getElementById("rarity-tier-percentile-factor-input");
  const rarityTierMinLikesInput = document.getElementById("rarity-tier-min-likes-input");
  const rarityTierMinGapPrevInput = document.getElementById("rarity-tier-min-gap-prev-input");
  const rarityTierMinGapPrimaryInput = document.getElementById("rarity-tier-min-gap-primary-input");
  const rarityTierHeatmapWeightInput = document.getElementById("rarity-tier-heatmap-weight-input");
  const rarityTierDurationMultiplierInput = document.getElementById("rarity-tier-duration-multiplier-input");
  const rarityTierEffectsList = document.getElementById("rarity-tier-effects-list");
  const rarityExportSkinButton = document.getElementById("rarity-export-skin-button");
  const rarityExportAllSkinsButton = document.getElementById("rarity-export-all-skins-button");
  const rarityImportSkinsButton = document.getElementById("rarity-import-skins-button");
  const rarityImportFileInput = document.getElementById("rarity-import-file-input");
  const rarityEditorStatus = document.getElementById("rarity-editor-status");
  const heatmapEnabledToggle = document.getElementById("heatmap-enabled-toggle");
  const heatmapIntensitySlider = document.getElementById("heatmap-intensity-slider");
  const heatmapIntensityValue = document.getElementById("heatmap-intensity-value");
  const routingEnabledToggle = document.getElementById("routing-enabled-toggle");
  const routingThresholdInput = document.getElementById("routing-threshold-input");
  const routingShortCornerSelect = document.getElementById("routing-short-corner-select");
  const routingLongCornerSelect = document.getElementById("routing-long-corner-select");
  const showLikesToggle = document.getElementById("show-likes-toggle");
  const showRarityLabelToggle = document.getElementById("show-rarity-label-toggle");
  const showUpcomingDotToggle = document.getElementById("show-upcoming-dot-toggle");
  const experimentalGameSkinToggle = document.getElementById("experimental-game-skin-toggle");
  const commentFetchStartupPagesInput = document.getElementById("comment-fetch-startup-pages-input");
  const commentScanDelayInput = document.getElementById("comment-scan-delay-input");
  const commentFetchMaxPagesInput = document.getElementById("comment-fetch-max-pages-input");
  const commentFetchAggressiveToggle = document.getElementById("comment-fetch-aggressive-toggle");
  const commentFetchAdaptiveToggle = document.getElementById("comment-fetch-adaptive-toggle");
  const livePageMarkersToggle = document.getElementById("live-page-markers-toggle");
  const copySettingsButton = document.getElementById("copy-settings-button");
  const copySettingsStatus = document.getElementById("copy-settings-status");
  const copyDebugTierListButton = document.getElementById("copy-debug-tier-list-button");
  const copyDebugTierListStatus = document.getElementById("copy-debug-tier-list-status");
  const rescanNowButton = document.getElementById("rescan-now-button");
  const rescanNowStatus = document.getElementById("rescan-now-status");
  const topLikedCutoffInline = document.getElementById("top-liked-cutoff-inline");
  const popupRarityEditorSection = document.getElementById("popup-rarity-editor-section");
  const openEditorLauncherSection = document.getElementById("open-editor-launcher-section");
  const rarityLivePreviewCard = document.getElementById("rarity-live-preview-card");
  const rarityLivePreviewText = document.getElementById("rarity-live-preview-text");
  const rarityLivePreviewLikes = document.getElementById("rarity-live-preview-likes");
  let overlayRadiusBySkin = normalizeOverlayRadiusBySkin(
    configs.overlayRadiusBySkin,
    configs.overlayRadius
  );
  let hiddenRarityTiersBySkin = normalizeHiddenRarityTiersBySkin(
    configs.hiddenRarityTiersBySkin
  );
  let thresholdPreviewRequestSeq = 0;
  let selectedTierKey = null;
  raritySkinCatalog = rarityShared.normalizeCatalog(
    configs.raritySkinCatalog || raritySkinCatalog
  );
  raritySkinCatalogRevision = Number(
    configs.raritySkinCatalogRevision || raritySkinCatalogRevision || Date.now()
  );

  function activateSettingsTab(tabKey) {
    settingsTabs.forEach((tab) => {
      const isActive = tab.dataset.tab === tabKey;
      tab.classList.toggle("active", isActive);
      tab.setAttribute("aria-selected", isActive ? "true" : "false");
    });
    settingsPages.forEach((page) => {
      const isActive = page.dataset.page === tabKey;
      page.classList.toggle("active", isActive);
    });
  }

  const getSettingRow = (element) =>
    element?.closest?.(".setting-row, .setting-toggle-row, .setting-row-full") || null;

  const setSettingRowVisible = (element, visible) => {
    const row = getSettingRow(element);
    if (row) {
      row.style.display = visible ? "" : "none";
    }
  };

  function renderEditorStickyPreviewMeta() {}
  const readTopLikedThresholdPercent = () =>
    clamp(
      Number(
        topLikedThresholdSlider?.value ??
          configs.topLikedThresholdPercent ??
          DEFAULT_TOP_LIKED_THRESHOLD_PERCENT
      ),
      MIN_TOP_LIKED_THRESHOLD_PERCENT,
      MAX_TOP_LIKED_THRESHOLD_PERCENT
    );

  settingsTabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      activateSettingsTab(tab.dataset.tab || "overlay");
    });
  });
  activateSettingsTab("overlay");

  if (popupRarityEditorSection) {
    popupRarityEditorSection.style.display = "none";
  }
  if (raritySkinActionsRow) {
    raritySkinActionsRow.style.display = "none";
  }
  if (openEditorLauncherSection) {
    openEditorLauncherSection.style.display = "none";
  }

  if (configs.isActive === true) {
    toggleButton.classList.add("toggle_active");
  }

  sizeSlider.value = String(Math.round(configs.overlayScale * 100));
  durationSlider.value = String(configs.displayDuration);
  radiusSlider.value = String(configs.overlayRadius);
  avatarSizeSlider.value = String(configs.overlayAvatarSize);
  glassSlider.value = String(configs.overlayGlassiness);
  darknessSlider.value = String(configs.overlayDarkness);
  if (debugToggle) {
    debugToggle.checked = configs.debugMode;
  }
  allowLongToggle.checked = configs.allowLongMessages;
  hideTimestampOnlyToggle.checked = configs.hideTimestampOnlyMessages;
  hideMultiTimestampToggle.checked = configs.hideMultiTimestampMessages;
  maxCharsInput.value = String(configs.maxMessageChars);
  maxCharsInput.disabled = configs.allowLongMessages;
  earlyModeToggle.checked = configs.earlyModeEnabled;
  followPlaybackSpeedToggle.checked = configs.followPlaybackSpeed;
  earlySecondsInput.value = String(configs.earlySeconds);
  earlySecondsInput.disabled = !configs.earlyModeEnabled;
  accentEffectSelect.value = configs.timestampAccentEffect;
  accentEffectSelect.disabled = !configs.earlyModeEnabled;
  reverseStackToggle.checked = configs.reverseStackOrder;
  popupDarkToggle.checked = configs.popupDarkMode;
  priorityScoringToggle.checked = configs.priorityScoringEnabled;
  priorityLikesWeightInput.value = String(configs.priorityLikesWeight);
  if (topLikedThresholdSlider) {
    topLikedThresholdSlider.value = String(configs.topLikedThresholdPercent);
  }
  popularityModeToggle.checked = configs.popularityModeEnabled;
  raritySkinSelect.value = normalizeRaritySkin(configs.raritySkin);
  rarityLogicSelect.value = normalizeRarityLogicMode(configs.rarityLogicMode);
  rarityGeometricRatioSlider.value = Number(configs.rarityGeometricRatio).toFixed(2);
  heatmapEnabledToggle.checked = configs.heatmapEnabled;
  heatmapIntensitySlider.value = String(configs.heatmapIntensity);
  routingEnabledToggle.checked = configs.routingEnabled;
  routingThresholdInput.value = String(configs.routingThreshold);
  routingShortCornerSelect.value = configs.routingShortCorner;
  routingLongCornerSelect.value = configs.routingLongCorner;
  showLikesToggle.checked = configs.showLikesInNotifications;
  showRarityLabelToggle.checked = configs.showRarityLabelInNotifications;
  showUpcomingDotToggle.checked = configs.showUpcomingDot;
  experimentalGameSkinToggle.checked = configs.experimentalGameSkinAutoEnabled;
  commentFetchStartupPagesInput.value = String(configs.commentFetchStartupPages);
  commentScanDelayInput.value = String(configs.commentScanStartDelaySec);
  commentFetchMaxPagesInput.value = String(configs.commentFetchMaxPages);
  commentFetchAggressiveToggle.checked = configs.commentFetchAggressive;
  commentFetchAdaptiveToggle.checked = configs.commentFetchAdaptive;
  livePageMarkersToggle.checked = configs.livePageMarkerUpdates;
  minimalModeToggle.checked = configs.presetProfile === "minimal";
  showRarityLabelToggle.disabled = configs.presetProfile === "minimal";
  priorityLikesWeightInput.disabled = !configs.priorityScoringEnabled;
  heatmapIntensitySlider.disabled = !configs.heatmapEnabled;
  routingThresholdInput.disabled = !configs.routingEnabled;
  routingShortCornerSelect.disabled = !configs.routingEnabled;
  routingLongCornerSelect.disabled = !configs.routingEnabled;
  document.body.classList.toggle("dark-mode", configs.popupDarkMode);
  applySettingHoverDescriptions();

  updateSizeLabel(sizeSlider, sizeValue);
  updateDurationLabel(durationSlider, durationValue);
  updateRadiusLabel(radiusSlider, radiusValue);
  updateAvatarSizeLabel(avatarSizeSlider, avatarSizeValue);
  updateGlassLabel(glassSlider, glassValue);
  updateDarknessLabel(darknessSlider, darknessValue);
  updateHeatmapIntensityLabel(heatmapIntensitySlider, heatmapIntensityValue);
  updateTopLikedThresholdLabel(topLikedThresholdSlider, topLikedThresholdValue);
  updateGeometricRatioLabel(rarityGeometricRatioSlider, rarityGeometricRatioValue);
  const syncGeometricRatioControlState = () => {
    const geometricActive = rarityLogicSelect.value === "geometric";
    if (rarityGeometricRatioRow) {
      rarityGeometricRatioRow.style.display = geometricActive ? "" : "none";
    }
    rarityGeometricRatioSlider.disabled = !geometricActive;
    rarityGeometricRatioValue.style.opacity = geometricActive ? "1" : "0.55";
  };
  syncGeometricRatioControlState();
  function setRarityEditorStatus(message = "", isError = false) {
    if (!rarityEditorStatus) {
      return;
    }
    rarityEditorStatus.textContent = String(message || "");
    rarityEditorStatus.style.color = isError ? "#b91c1c" : "";
  }

  function getSelectedSkinId() {
    return normalizeRaritySkin(
      String(raritySkinSelect?.value || configs.raritySkin || DEFAULT_RARITY_SKIN)
    );
  }

  function getSelectedSkinConfig() {
    return getSkinConfigById(getSelectedSkinId());
  }

  function ensureRaritySkinSelectOptions() {
    if (!raritySkinSelect) {
      return;
    }
    const selectedBefore = getSelectedSkinId();
    raritySkinSelect.replaceChildren();
    raritySkinCatalog.skins.forEach((skin) => {
      const option = document.createElement("option");
      option.value = skin.id;
      option.textContent = skin.name;
      raritySkinSelect.appendChild(option);
    });
    raritySkinSelect.value = normalizeRaritySkin(selectedBefore);
  }

  function ensureStyleFamilyOptions() {
    if (!rarityStyleFamilySelect) {
      return;
    }
    rarityStyleFamilySelect.replaceChildren();
    rarityShared.STYLE_FAMILIES.forEach((family) => {
      const option = document.createElement("option");
      option.value = family;
      option.textContent = rarityShared.capitalizeWords(family);
      rarityStyleFamilySelect.appendChild(option);
    });
  }

  async function persistCatalog(nextCatalog, preserveSkinId = null) {
    raritySkinCatalog = rarityShared.normalizeCatalog(nextCatalog);
    raritySkinCatalogRevision = Date.now();
    await chrome.storage.local.set({
      [LOCAL_RARITY_CATALOG_KEY]: raritySkinCatalog,
      [LOCAL_RARITY_CATALOG_REVISION_KEY]: raritySkinCatalogRevision
    });
    ensureRaritySkinSelectOptions();
    const nextSkinId = normalizeRaritySkin(preserveSkinId || getSelectedSkinId());
    if (raritySkinSelect) {
      raritySkinSelect.value = nextSkinId;
    }
    hiddenRarityTiersBySkin = normalizeHiddenRarityTiersBySkin(hiddenRarityTiersBySkin);
  }

  function getSelectedTier() {
    const skin = getSelectedSkinConfig();
    const tiers = skin?.tiers || [];
    if (tiers.length === 0) {
      return null;
    }
    if (!selectedTierKey || !tiers.some((tier) => tier.key === selectedTierKey)) {
      selectedTierKey = tiers[0].key;
    }
    return tiers.find((tier) => tier.key === selectedTierKey) || tiers[0] || null;
  }

  function getPreviewRgb(hexColor, fallback = "255 255 255") {
    return rarityShared.hexToRgb(hexColor, fallback);
  }

  function renderLiveNotificationPreview() {
    if (!rarityLivePreviewCard || !rarityLivePreviewText || !rarityLivePreviewLikes) {
      return;
    }
    const skin = getSelectedSkinConfig();
    const tier = getSelectedTier();
    if (!skin || !tier) {
      return;
    }

    const profileKey = minimalModeToggle?.checked ? "minimal" : "balanced";
    const showLikes = profileKey === "minimal" ? false : Boolean(showLikesToggle?.checked);
    const showRarityLabel =
      profileKey === "minimal" ? false : Boolean(showRarityLabelToggle?.checked);
    const avatarPx = clamp(
      Number(avatarSizeSlider?.value || DEFAULT_OVERLAY_AVATAR_SIZE),
      MIN_OVERLAY_AVATAR_SIZE,
      MAX_OVERLAY_AVATAR_SIZE
    );
    const radiusPx = clamp(
      Number(rarityStyleRadiusSlider?.value || skin?.style?.radius || DEFAULT_OVERLAY_RADIUS),
      MIN_OVERLAY_RADIUS,
      MAX_OVERLAY_RADIUS
    );
    const packOpacity = rarityShared.clamp(
      Number(rarityStylePackOpacitySlider?.value || Math.round((skin?.style?.packOpacity || 0.48) * 100)) /
        100,
      0.08,
      1
    );
    const borderEnabled = rarityStyleBorderEnabledToggle
      ? Boolean(rarityStyleBorderEnabledToggle.checked)
      : skin?.style?.borderEnabled !== false;
    const borderWidth = rarityShared.clamp(
      Number(rarityStyleBorderWidthInput?.value || skin?.style?.borderWidth || 1),
      0,
      12
    );
    const styleFamily = String(
      rarityStyleFamilySelect?.value || skin?.styleFamily || rarityShared.DEFAULT_STYLE_FAMILY
    );
    const bodyColor = rarityShared.normalizeHexColor(tier.bodyColor, "#B5B5B5");
    const textColor = rarityShared.normalizeHexColor(tier.textColor, "#FFFFFF");
    const borderColor = rarityShared.normalizeHexColor(tier.borderColor, bodyColor);
    const bodyRgb = getPreviewRgb(bodyColor, "181 181 181");
    const borderRgb = getPreviewRgb(borderColor, bodyRgb);
    const effects = new Set((tier.effects || []).map((entry) => String(entry)));

    rarityLivePreviewCard.style.borderRadius = `${Math.round(radiusPx)}px`;
    rarityLivePreviewCard.style.color = textColor;
    rarityLivePreviewCard.style.borderStyle = "solid";
    rarityLivePreviewCard.style.borderWidth = borderEnabled ? `${Math.round(borderWidth)}px` : "0px";
    rarityLivePreviewCard.style.borderColor = `rgb(${borderRgb} / 0.9)`;
    rarityLivePreviewCard.style.boxShadow = effects.has("glow")
      ? `0 0 0 1px rgb(${borderRgb} / 0.45), 0 8px 22px rgb(${borderRgb} / 0.42)`
      : "0 4px 16px rgb(2 8 20 / 0.25)";
    rarityLivePreviewCard.style.backdropFilter = "none";
    rarityLivePreviewCard.style.animation = effects.has("pulse")
      ? "previewPulse 1.8s ease-in-out infinite"
      : "none";

    let baseBackground = "";
    if (styleFamily === "flat") {
      baseBackground = `rgb(${bodyRgb} / ${packOpacity})`;
    } else if (styleFamily === "solid") {
      baseBackground = `rgb(${bodyRgb} / 1)`;
    } else if (styleFamily === "pixel") {
      baseBackground = `rgb(${bodyRgb} / ${packOpacity})`;
      rarityLivePreviewCard.style.boxShadow = "none";
    } else {
      baseBackground = `linear-gradient(160deg, rgb(${bodyRgb} / ${Math.min(
        1,
        packOpacity + 0.22
      )}) 0%, rgb(${bodyRgb} / ${Math.max(0.08, packOpacity - 0.14)}) 100%)`;
      rarityLivePreviewCard.style.backdropFilter = "blur(8px)";
    }

    if (effects.has("rainbow-cycle")) {
      baseBackground = "linear-gradient(140deg, #ff4fd8 0%, #66ffff 35%, #ffd100 68%, #ff8000 100%)";
      rarityLivePreviewCard.style.backgroundSize = "240% 240%";
      rarityLivePreviewCard.style.animation = "previewRainbow 6s linear infinite";
    } else {
      rarityLivePreviewCard.style.backgroundSize = "";
    }

    if (effects.has("sheen")) {
      rarityLivePreviewCard.style.background = `${baseBackground}, linear-gradient(120deg, rgb(255 255 255 / 0) 15%, rgb(255 255 255 / 0.2) 45%, rgb(255 255 255 / 0) 75%)`;
    } else {
      rarityLivePreviewCard.style.background = baseBackground;
    }

    const avatarElement = rarityLivePreviewCard.querySelector(".editor-live-preview-avatar");
    if (avatarElement) {
      avatarElement.style.width = `${Math.round(avatarPx)}px`;
      avatarElement.style.height = `${Math.round(avatarPx)}px`;
    }
    rarityLivePreviewText.textContent = "21:00 Live preview comment";
    rarityLivePreviewText.style.color = textColor;
    rarityLivePreviewLikes.style.color = textColor;
    rarityLivePreviewLikes.style.display = showLikes ? "block" : "none";
    rarityLivePreviewLikes.textContent = showRarityLabel ? `Likes 120 - ${tier.label}` : "Likes 120";
  }

  function renderTierEffectsEditor(tier) {
    if (!rarityTierEffectsList) {
      return;
    }
    rarityTierEffectsList.replaceChildren();
    const effectSet = new Set((tier?.effects || []).map((entry) => String(entry)));
    rarityShared.EFFECT_TOKENS.forEach((effect) => {
      const chip = document.createElement("label");
      chip.className = "tier-effect-chip";
      const input = document.createElement("input");
      input.type = "checkbox";
      input.checked = effectSet.has(effect);
      input.dataset.effect = effect;
      const text = document.createElement("span");
      text.textContent = effect;
      chip.append(input, text);
      rarityTierEffectsList.appendChild(chip);
    });
  }

  function renderTierEditor() {
    const skin = getSelectedSkinConfig();
    const tier = getSelectedTier();
    const disabled = !skin || !tier;
    [
      rarityTierLabelInput,
      rarityTierBodyColorInput,
      rarityTierTextColorInput,
      rarityTierBorderColorInput,
      rarityTierMarkerColorInput,
      rarityTierMarkerWidthInput,
      rarityTierMarkerHeightInput,
      rarityTierMarkerOffsetInput,
      rarityTierPercentileFactorInput,
      rarityTierMinLikesInput,
      rarityTierMinGapPrevInput,
      rarityTierMinGapPrimaryInput,
      rarityTierHeatmapWeightInput,
      rarityTierDurationMultiplierInput,
      rarityTierDeleteButton,
      rarityTierMoveUpButton,
      rarityTierMoveDownButton
    ].forEach((element) => {
      if (element) {
        element.disabled = disabled;
      }
    });
    if (!tier) {
      if (rarityTierKeyInput) {
        rarityTierKeyInput.value = "";
      }
      if (rarityTierEffectsList) {
        rarityTierEffectsList.replaceChildren();
      }
      renderEditorStickyPreviewMeta();
      return;
    }

    rarityTierLabelInput.value = tier.label;
    rarityTierKeyInput.value = tier.key;
    rarityTierBodyColorInput.value = rarityShared.normalizeHexColor(tier.bodyColor, "#FFFFFF");
    rarityTierTextColorInput.value = rarityShared.normalizeHexColor(tier.textColor, "#111111");
    rarityTierBorderColorInput.value = rarityShared.normalizeHexColor(tier.borderColor, "#DDDDDD");
    rarityTierMarkerColorInput.value = rarityShared.normalizeHexColor(tier.markerColor, "#FFFFFF");
    rarityTierMarkerWidthInput.value = String(Math.round(Number(tier.markerWidthPx || 5)));
    rarityTierMarkerHeightInput.value = String(Math.round(Number(tier.markerHeightPct || 120)));
    rarityTierMarkerOffsetInput.value = String(
      Math.round(Number(tier.markerOffsetTopPct || -10))
    );
    rarityTierPercentileFactorInput.value = String(Number(tier.percentileFactor || 1));
    rarityTierMinLikesInput.value = String(Math.round(Number(tier.minLikes || 0)));
    rarityTierMinGapPrevInput.value = String(
      Math.round(Number(tier.minGapFromPrevious || 0))
    );
    rarityTierMinGapPrimaryInput.value = String(
      tier.minGapFromPrimary === null || tier.minGapFromPrimary === undefined
        ? 0
        : Math.round(Number(tier.minGapFromPrimary || 0))
    );
    rarityTierHeatmapWeightInput.value = String(Number(tier.heatmapWeight || 1));
    rarityTierDurationMultiplierInput.value = String(
      Number(tier.durationMultiplier || 1)
    );
    renderTierEffectsEditor(tier);
    renderLiveNotificationPreview();
    renderEditorStickyPreviewMeta();
  }

  function renderTierList() {
    if (!rarityTierList) {
      return;
    }
    const skin = getSelectedSkinConfig();
    const tiers = skin?.tiers || [];
    if (!selectedTierKey || !tiers.some((tier) => tier.key === selectedTierKey)) {
      selectedTierKey = tiers[0]?.key || null;
    }
    rarityTierList.replaceChildren();
    tiers.forEach((tier) => {
      const item = document.createElement("button");
      item.type = "button";
      item.className = "rarity-tier-item";
      item.classList.toggle("active", tier.key === selectedTierKey);
      const left = document.createElement("span");
      left.className = "rarity-tier-item-left";
      const swatch = document.createElement("span");
      swatch.className = "rarity-preview-swatch";
      swatch.style.background = tier.bodyColor;
      const label = document.createElement("span");
      label.className = "rarity-tier-item-label";
      label.textContent = tier.label;
      left.append(swatch, label);
      const key = document.createElement("span");
      key.className = "rarity-tier-item-key";
      key.textContent = tier.key;
      item.append(left, key);
      item.addEventListener("click", () => {
        selectedTierKey = tier.key;
        renderTierList();
        renderTierEditor();
      });
      rarityTierList.appendChild(item);
    });
  }

  function renderSkinEditor() {
    const skin = getSelectedSkinConfig();
    if (!skin) {
      return;
    }
    rarityEditorSkinNameInput.value = skin.name;
    rarityEditorSkinIdInput.value = skin.id;
    rarityStyleFamilySelect.value = skin.styleFamily || rarityShared.DEFAULT_STYLE_FAMILY;
    rarityStyleRadiusSlider.value = String(
      Math.round(Number(skin?.style?.radius ?? configs.overlayRadius))
    );
    rarityStyleRadiusValue.textContent = `${Math.round(Number(rarityStyleRadiusSlider.value))}px`;
    rarityStyleBorderEnabledToggle.checked = skin?.style?.borderEnabled !== false;
    rarityStyleBorderWidthInput.value = String(
      Math.round(Number(skin?.style?.borderWidth ?? 1))
    );
    rarityStylePackOpacitySlider.value = String(
      Math.round(Number(skin?.style?.packOpacity ?? 0.48) * 100)
    );
    rarityStylePackOpacityValue.textContent = `${Math.round(
      Number(rarityStylePackOpacitySlider.value)
    )}%`;
    renderTierList();
    renderTierEditor();
    renderLiveNotificationPreview();
    renderEditorStickyPreviewMeta();
  }

  function renderRarityPreview(raritySkinId) {
    if (IS_EDITOR_MODE) {
      return;
    }
    if (!rarityPreviewGrid) {
      return;
    }
    const skinId = normalizeRaritySkin(raritySkinId);
    const skin = getSkinConfigById(skinId);
    const hiddenMap = hiddenRarityTiersBySkin[skinId] || {};
    const rows = rarityShared.createPreviewRows(skin, hiddenMap);
    rarityPreviewGrid.replaceChildren();

    rows.forEach((tier) => {
      const pill = document.createElement("div");
      pill.className = "rarity-preview-pill";

      const left = document.createElement("span");
      left.className = "rarity-preview-left";

      const swatch = document.createElement("span");
      swatch.className = "rarity-preview-swatch";
      swatch.style.background = tier.color;

      const text = document.createElement("span");
      text.className = "rarity-preview-pill-label";
      text.textContent = tier.label;
      left.append(swatch, text);

      const right = document.createElement("span");
      right.className = "rarity-preview-right";

      const switchLabel = document.createElement("label");
      switchLabel.className = "mini-switch";
      switchLabel.title = `Enable ${tier.label}`;
      const input = document.createElement("input");
      input.type = "checkbox";
      input.checked = !Boolean(hiddenMap[tier.key]);
      input.addEventListener("change", async () => {
        if (!hiddenRarityTiersBySkin[skinId]) {
          hiddenRarityTiersBySkin[skinId] = {};
        }
        hiddenRarityTiersBySkin[skinId][tier.key] = !Boolean(input.checked);
        await saveOverlaySettings();
        renderRarityPreview(skinId);
      });
      const visual = document.createElement("span");
      visual.className = "mini-switch-slider";
      switchLabel.append(input, visual);

      right.append(switchLabel);
      pill.append(left, right);
      rarityPreviewGrid.appendChild(pill);
    });
  }

  ensureStyleFamilyOptions();
  ensureRaritySkinSelectOptions();
  renderRarityPreview(raritySkinSelect.value);
  renderSkinEditor();
  renderLiveNotificationPreview();
  if (topLikedThresholdSlider) {
    showTopLikedCutoffPreview(Number(topLikedThresholdSlider.value));
  }

  function applyPresetToControls(presetProfile) {
    const profileKey = normalizePresetProfile(presetProfile);
    const preset = PRESET_PROFILES[profileKey] || PRESET_PROFILES[DEFAULT_PRESET_PROFILE];

    const presetScale = clamp(
      Number(preset.overlayScale ?? DEFAULT_OVERLAY_SCALE),
      MIN_OVERLAY_SCALE,
      MAX_OVERLAY_SCALE
    );
    const presetDuration = clamp(
      Number(preset.displayDuration ?? DEFAULT_DISPLAY_DURATION),
      MIN_DISPLAY_DURATION,
      MAX_DISPLAY_DURATION
    );
    const presetRadius = clamp(
      Number(preset.overlayRadius ?? DEFAULT_OVERLAY_RADIUS),
      MIN_OVERLAY_RADIUS,
      MAX_OVERLAY_RADIUS
    );
    const presetAvatar = clamp(
      Number(preset.overlayAvatarSize ?? DEFAULT_OVERLAY_AVATAR_SIZE),
      MIN_OVERLAY_AVATAR_SIZE,
      MAX_OVERLAY_AVATAR_SIZE
    );
    const selectedRaritySkin = normalizeRaritySkin(
      String(raritySkinSelect?.value || configs.raritySkin || DEFAULT_RARITY_SKIN)
    );

    sizeSlider.value = String(Math.round(presetScale * 100));
    durationSlider.value = String(presetDuration);
    radiusSlider.value = String(Math.round(presetRadius));
    avatarSizeSlider.value = String(Math.round(presetAvatar));
    overlayRadiusBySkin[selectedRaritySkin] = presetRadius;
    showLikesToggle.checked = getPresetShowLikesDefault(profileKey);

    updateSizeLabel(sizeSlider, sizeValue);
    updateDurationLabel(durationSlider, durationValue);
    updateRadiusLabel(radiusSlider, radiusValue);
    updateAvatarSizeLabel(avatarSizeSlider, avatarSizeValue);
  }

  async function applySkinCatalogUpdate(nextCatalog, preserveSkinId = null) {
    await persistCatalog(nextCatalog, preserveSkinId);
    const activeSkinId = normalizeRaritySkin(preserveSkinId || getSelectedSkinId());
    if (raritySkinSelect) {
      raritySkinSelect.value = activeSkinId;
    }
    renderRarityPreview(activeSkinId);
    renderSkinEditor();
    await saveOverlaySettings();
    if (topLikedThresholdSlider) {
      await showTopLikedCutoffPreview(Number(topLikedThresholdSlider.value));
    }
  }

  async function updateSelectedSkin(mutator) {
    const skinId = getSelectedSkinId();
    const skin = rarityShared.deepClone(getSkinConfigById(skinId));
    const updatedSkin = mutator(skin) || skin;
    const nextCatalog = rarityShared.upsertSkin(raritySkinCatalog, updatedSkin, skin.id);
    await applySkinCatalogUpdate(nextCatalog, skin.id);
  }

  async function showTopLikedCutoffPreview(thresholdPercent) {
    const selectedRaritySkin = normalizeRaritySkin(
      raritySkinSelect?.value || configs.raritySkin || DEFAULT_RARITY_SKIN
    );
    const cutoffLabels = getRaritySkinCutoffLabels(
      selectedRaritySkin
    );
    const cutoffRules = getRaritySkinCutoffRules(selectedRaritySkin);
    if (topLikedCutoffInline) {
      topLikedCutoffInline.textContent = `${cutoffLabels.primary}/${cutoffLabels.elite}: calculating...`;
    }

    const videoId = await getActiveYouTubeVideoId();
    if (!videoId) {
      if (topLikedCutoffInline) {
        topLikedCutoffInline.textContent = `${cutoffLabels.primary}: open a YouTube video`;
      }
      return;
    }

    const requestSeq = ++thresholdPreviewRequestSeq;
    const diamondPercent = deriveDiamondThresholdPercent(thresholdPercent);
    const [goldResponse, diamondResponse] = await Promise.all([
      chrome.runtime.sendMessage({
        type: "top_liked_cutoff_preview",
        videoId,
        thresholdPercent
      }),
      chrome.runtime.sendMessage({
        type: "top_liked_cutoff_preview",
        videoId,
        thresholdPercent: diamondPercent
      })
    ]);
    if (requestSeq !== thresholdPreviewRequestSeq) {
      return;
    }

    if (goldResponse?.ok) {
      const goldCutoff = Number(goldResponse.cutoffLikes || 0);
      const diamondCutoff = Number(diamondResponse?.cutoffLikes || 0);
      const flooredGoldCutoff = Math.max(cutoffRules.primaryMin, goldCutoff);
      const flooredDiamondCutoff = Math.max(
        cutoffRules.eliteMin,
        diamondCutoff,
        flooredGoldCutoff + cutoffRules.eliteGapFromPrimary
      );
      const goldText = `${cutoffLabels.primary}: ${flooredGoldCutoff}+ likes`;
      if (topLikedCutoffInline) {
        const diamondText = `${cutoffLabels.elite}: ${flooredDiamondCutoff}+ likes`;
        topLikedCutoffInline.textContent = `${goldText} • ${diamondText}`;
      }
    } else {
      if (topLikedCutoffInline) {
        topLikedCutoffInline.textContent = `${cutoffLabels.primary}/${cutoffLabels.elite}: preview unavailable`;
      }
    }
  }

  toggleButton.addEventListener("click", async () => {
    const wasActive = toggleButton.classList.contains("toggle_active");
    const currentState = !wasActive;
    toggleButton.classList.toggle("toggle_active", currentState);
    await chrome.storage.sync.set({ active: currentState });
    await chrome.runtime.sendMessage({ type: "isActive", status: currentState });
  });

  positionButtons.forEach((button) => {
    if (button.dataset.position === configs.position) {
      button.classList.add("selected");
    }

    button.addEventListener("click", async (event) => {
      const target = event.currentTarget;
      const newPosition = target.dataset.position;
      if (lastPosition === newPosition) {
        return;
      }

      const selected = target.parentElement.querySelector(".selected");
      if (selected) {
        selected.classList.remove("selected");
      }
      target.classList.add("selected");
      await chrome.runtime.sendMessage({ type: "position", position: newPosition });
      lastPosition = newPosition;
    });
  });

  sizeSlider.addEventListener("input", () => updateSizeLabel(sizeSlider, sizeValue));
  durationSlider.addEventListener("input", () =>
    updateDurationLabel(durationSlider, durationValue)
  );
  let liveRadiusSaveTimeout = null;
  radiusSlider.addEventListener("input", () => {
    updateRadiusLabel(radiusSlider, radiusValue);
    renderLiveNotificationPreview();
    if (liveRadiusSaveTimeout) {
      clearTimeout(liveRadiusSaveTimeout);
    }
    liveRadiusSaveTimeout = setTimeout(() => {
      saveOverlaySettings();
      liveRadiusSaveTimeout = null;
    }, 40);
  });
  avatarSizeSlider.addEventListener("input", () =>
    {
      updateAvatarSizeLabel(avatarSizeSlider, avatarSizeValue);
      renderLiveNotificationPreview();
    }
  );
  glassSlider.addEventListener("input", () => updateGlassLabel(glassSlider, glassValue));
  darknessSlider.addEventListener("input", () =>
    updateDarknessLabel(darknessSlider, darknessValue)
  );
  heatmapIntensitySlider.addEventListener("input", () =>
    updateHeatmapIntensityLabel(heatmapIntensitySlider, heatmapIntensityValue)
  );
  if (topLikedThresholdSlider) {
    topLikedThresholdSlider.addEventListener("input", () =>
      {
        updateTopLikedThresholdLabel(topLikedThresholdSlider, topLikedThresholdValue);
        showTopLikedCutoffPreview(Number(topLikedThresholdSlider.value));
      }
    );
  }

  async function saveOverlaySettings() {
    const overlayScale = clamp(
      Number(sizeSlider.value) / 100,
      MIN_OVERLAY_SCALE,
      MAX_OVERLAY_SCALE
    );
    const displayDuration = clamp(
      Number(durationSlider.value),
      MIN_DISPLAY_DURATION,
      MAX_DISPLAY_DURATION
    );
    const raritySkin = normalizeRaritySkin(
      String(raritySkinSelect?.value || DEFAULT_RARITY_SKIN)
    );
    const overlayRadius = normalizeRadiusValue(Number(radiusSlider.value));
    overlayRadiusBySkin[raritySkin] = overlayRadius;
    const overlayAvatarSize = clamp(
      Number(avatarSizeSlider.value),
      MIN_OVERLAY_AVATAR_SIZE,
      MAX_OVERLAY_AVATAR_SIZE
    );
    const overlayGlassiness = clamp(
      Number(glassSlider.value),
      MIN_OVERLAY_GLASSINESS,
      MAX_OVERLAY_GLASSINESS
    );
    const overlayDarkness = clamp(
      Number(darknessSlider.value),
      MIN_OVERLAY_DARKNESS,
      MAX_OVERLAY_DARKNESS
    );
    const debugMode = debugToggle ? Boolean(debugToggle.checked) : configs.debugMode;
    const allowLongMessages = Boolean(allowLongToggle.checked);
    const hideTimestampOnlyMessages = Boolean(hideTimestampOnlyToggle.checked);
    const hideMultiTimestampMessages = Boolean(hideMultiTimestampToggle.checked);
    const maxMessageChars = clamp(
      Number(maxCharsInput.value || DEFAULT_MAX_MESSAGE_CHARS),
      MIN_MAX_MESSAGE_CHARS,
      MAX_MAX_MESSAGE_CHARS
    );
    maxCharsInput.value = String(maxMessageChars);
    maxCharsInput.disabled = allowLongMessages;
    const earlyModeEnabled = Boolean(earlyModeToggle.checked);
    const followPlaybackSpeed = Boolean(followPlaybackSpeedToggle.checked);
    const earlySeconds = clamp(
      Number(earlySecondsInput.value || DEFAULT_EARLY_SECONDS),
      MIN_EARLY_SECONDS,
      MAX_EARLY_SECONDS
    );
    const timestampAccentEffect = String(
      accentEffectSelect.value || DEFAULT_TIMESTAMP_ACCENT_EFFECT
    );
    const reverseStackOrder = Boolean(reverseStackToggle.checked);
    const priorityScoringEnabled = Boolean(priorityScoringToggle.checked);
    const priorityLikesWeight = clamp(
      Number(priorityLikesWeightInput.value || DEFAULT_PRIORITY_LIKES_WEIGHT),
      MIN_PRIORITY_LIKES_WEIGHT,
      MAX_PRIORITY_LIKES_WEIGHT
    );
    const topLikedThresholdPercent = readTopLikedThresholdPercent();
    const diamondThresholdPercent = deriveDiamondThresholdPercent(topLikedThresholdPercent);
    const popularityModeEnabled = Boolean(popularityModeToggle.checked);
    const rarityLogicMode = normalizeRarityLogicMode(
      String(rarityLogicSelect?.value || DEFAULT_RARITY_LOGIC_MODE)
    );
    const rarityGeometricRatio = clamp(
      Number(rarityGeometricRatioSlider.value || DEFAULT_RARITY_GEOMETRIC_RATIO),
      MIN_RARITY_GEOMETRIC_RATIO,
      MAX_RARITY_GEOMETRIC_RATIO
    );
    const heatmapEnabled = Boolean(heatmapEnabledToggle.checked);
    const heatmapIntensity = clamp(
      Number(heatmapIntensitySlider.value || DEFAULT_HEATMAP_INTENSITY),
      MIN_HEATMAP_INTENSITY,
      MAX_HEATMAP_INTENSITY
    );
    const routingEnabled = Boolean(routingEnabledToggle.checked);
    const routingThreshold = clamp(
      Number(routingThresholdInput.value || DEFAULT_ROUTING_THRESHOLD),
      MIN_ROUTING_THRESHOLD,
      MAX_ROUTING_THRESHOLD
    );
    const routingShortCorner = String(
      routingShortCornerSelect.value || DEFAULT_ROUTING_SHORT_CORNER
    );
    const routingLongCorner = String(
      routingLongCornerSelect.value || DEFAULT_ROUTING_LONG_CORNER
    );
    const presetProfile = minimalModeToggle.checked ? "minimal" : "balanced";
    const showLikesInNotifications =
      presetProfile === "minimal"
        ? false
        : Boolean(showLikesToggle.checked);
    const showRarityLabelInNotifications =
      presetProfile === "minimal"
        ? false
        : Boolean(showRarityLabelToggle.checked);
    const showUpcomingDot = Boolean(showUpcomingDotToggle.checked);
    const experimentalGameSkinAutoEnabled = Boolean(
      experimentalGameSkinToggle.checked
    );
    const commentFetchStartupPages = clamp(
      Number(commentFetchStartupPagesInput.value || DEFAULT_COMMENT_FETCH_STARTUP_PAGES),
      MIN_COMMENT_FETCH_STARTUP_PAGES,
      MAX_COMMENT_FETCH_STARTUP_PAGES
    );
    const commentScanStartDelaySec = clamp(
      Number(commentScanDelayInput.value || DEFAULT_COMMENT_SCAN_START_DELAY_SEC),
      MIN_COMMENT_SCAN_START_DELAY_SEC,
      MAX_COMMENT_SCAN_START_DELAY_SEC
    );
    const commentFetchMaxPages = clamp(
      Number(commentFetchMaxPagesInput.value || DEFAULT_COMMENT_FETCH_MAX_PAGES),
      MIN_COMMENT_FETCH_MAX_PAGES,
      MAX_COMMENT_FETCH_MAX_PAGES
    );
    const commentFetchAggressive = Boolean(commentFetchAggressiveToggle.checked);
    const commentFetchAdaptive = Boolean(commentFetchAdaptiveToggle.checked);
    const livePageMarkerUpdates = Boolean(livePageMarkersToggle.checked);
    commentFetchStartupPagesInput.value = String(commentFetchStartupPages);
    commentScanDelayInput.value = String(commentScanStartDelaySec);
    commentFetchMaxPagesInput.value = String(commentFetchMaxPages);
    showLikesToggle.checked = showLikesInNotifications;
    showRarityLabelToggle.checked = showRarityLabelInNotifications;
    showRarityLabelToggle.disabled = presetProfile === "minimal";
    renderLiveNotificationPreview();
    earlySecondsInput.value = String(earlySeconds);
    priorityLikesWeightInput.value = String(priorityLikesWeight);
    if (topLikedThresholdSlider) {
      topLikedThresholdSlider.value = String(topLikedThresholdPercent);
    }
    rarityGeometricRatioSlider.value = rarityGeometricRatio.toFixed(2);
    updateGeometricRatioLabel(rarityGeometricRatioSlider, rarityGeometricRatioValue);
    syncGeometricRatioControlState();
    heatmapIntensitySlider.value = String(heatmapIntensity);
    routingThresholdInput.value = String(routingThreshold);
    earlySecondsInput.disabled = !earlyModeEnabled;
    accentEffectSelect.disabled = !earlyModeEnabled;
    priorityLikesWeightInput.disabled = !priorityScoringEnabled;
    heatmapIntensitySlider.disabled = !heatmapEnabled;
    routingThresholdInput.disabled = !routingEnabled;
    routingShortCornerSelect.disabled = !routingEnabled;
    routingLongCornerSelect.disabled = !routingEnabled;
    const hiddenBySkinId = normalizeHiddenRarityTiersBySkin(hiddenRarityTiersBySkin);
    const activeRaritySkinConfig = rarityShared.deepClone(getSkinConfigById(raritySkin));

    const settings = {
      overlayScale,
      displayDuration,
      overlayRadius,
      overlayRadiusBySkin: { ...overlayRadiusBySkin },
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
      diamondThresholdPercent,
      popularityModeEnabled,
      raritySkin,
      rarityLogicMode,
      rarityGeometricRatio,
      heatmapEnabled,
      heatmapIntensity,
      routingEnabled,
      routingThreshold,
      routingShortCorner,
      routingLongCorner,
      showLikesInNotifications,
      showRarityLabelInNotifications,
      showUpcomingDot,
      hideTimestampOnlyMessages,
      hideMultiTimestampMessages,
      hiddenRarityTiersBySkin: hiddenBySkinId,
      hiddenRarityTiersBySkinId: hiddenBySkinId,
      experimentalGameSkinAutoEnabled,
      commentFetchStartupPages,
      commentScanStartDelaySec,
      commentFetchMaxPages,
      commentFetchAggressive,
      commentFetchAdaptive,
      livePageMarkerUpdates,
      activeRaritySkinId: raritySkin,
      presetProfile
    };

    await chrome.storage.sync.set(settings);
    await broadcastOverlaySettings({
      ...settings,
      raritySkinCatalogRevision,
      activeRaritySkinConfig
    });
  }

  function buildSettingsSnapshot() {
    const overlayScale = clamp(
      Number(sizeSlider.value) / 100,
      MIN_OVERLAY_SCALE,
      MAX_OVERLAY_SCALE
    );
    const displayDuration = clamp(
      Number(durationSlider.value),
      MIN_DISPLAY_DURATION,
      MAX_DISPLAY_DURATION
    );
    const raritySkin = normalizeRaritySkin(
      String(raritySkinSelect?.value || DEFAULT_RARITY_SKIN)
    );
    const overlayRadius = normalizeRadiusValue(Number(radiusSlider.value));
    const snapshotRadiusBySkin = {
      ...overlayRadiusBySkin,
      [raritySkin]: overlayRadius
    };
    const overlayAvatarSize = clamp(
      Number(avatarSizeSlider.value),
      MIN_OVERLAY_AVATAR_SIZE,
      MAX_OVERLAY_AVATAR_SIZE
    );
    const overlayGlassiness = clamp(
      Number(glassSlider.value),
      MIN_OVERLAY_GLASSINESS,
      MAX_OVERLAY_GLASSINESS
    );
    const overlayDarkness = clamp(
      Number(darknessSlider.value),
      MIN_OVERLAY_DARKNESS,
      MAX_OVERLAY_DARKNESS
    );
    const debugMode = debugToggle ? Boolean(debugToggle.checked) : configs.debugMode;
    const allowLongMessages = Boolean(allowLongToggle.checked);
    const hideTimestampOnlyMessages = Boolean(hideTimestampOnlyToggle.checked);
    const hideMultiTimestampMessages = Boolean(hideMultiTimestampToggle.checked);
    const maxMessageChars = clamp(
      Number(maxCharsInput.value || DEFAULT_MAX_MESSAGE_CHARS),
      MIN_MAX_MESSAGE_CHARS,
      MAX_MAX_MESSAGE_CHARS
    );
    const earlyModeEnabled = Boolean(earlyModeToggle.checked);
    const followPlaybackSpeed = Boolean(followPlaybackSpeedToggle.checked);
    const earlySeconds = clamp(
      Number(earlySecondsInput.value || DEFAULT_EARLY_SECONDS),
      MIN_EARLY_SECONDS,
      MAX_EARLY_SECONDS
    );
    const timestampAccentEffect = String(
      accentEffectSelect.value || DEFAULT_TIMESTAMP_ACCENT_EFFECT
    );
    const reverseStackOrder = Boolean(reverseStackToggle.checked);
    const priorityScoringEnabled = Boolean(priorityScoringToggle.checked);
    const priorityLikesWeight = clamp(
      Number(priorityLikesWeightInput.value || DEFAULT_PRIORITY_LIKES_WEIGHT),
      MIN_PRIORITY_LIKES_WEIGHT,
      MAX_PRIORITY_LIKES_WEIGHT
    );
    const topLikedThresholdPercent = readTopLikedThresholdPercent();
    const diamondThresholdPercent = deriveDiamondThresholdPercent(topLikedThresholdPercent);
    const popularityModeEnabled = Boolean(popularityModeToggle.checked);
    const rarityLogicMode = normalizeRarityLogicMode(
      String(rarityLogicSelect?.value || DEFAULT_RARITY_LOGIC_MODE)
    );
    const heatmapEnabled = Boolean(heatmapEnabledToggle.checked);
    const heatmapIntensity = clamp(
      Number(heatmapIntensitySlider.value || DEFAULT_HEATMAP_INTENSITY),
      MIN_HEATMAP_INTENSITY,
      MAX_HEATMAP_INTENSITY
    );
    const routingEnabled = Boolean(routingEnabledToggle.checked);
    const routingThreshold = clamp(
      Number(routingThresholdInput.value || DEFAULT_ROUTING_THRESHOLD),
      MIN_ROUTING_THRESHOLD,
      MAX_ROUTING_THRESHOLD
    );
    const routingShortCorner = String(
      routingShortCornerSelect.value || DEFAULT_ROUTING_SHORT_CORNER
    );
    const routingLongCorner = String(
      routingLongCornerSelect.value || DEFAULT_ROUTING_LONG_CORNER
    );
    const presetProfile = minimalModeToggle.checked ? "minimal" : "balanced";
    const showLikesInNotifications =
      presetProfile === "minimal" ? false : Boolean(showLikesToggle.checked);
    const showRarityLabelInNotifications =
      presetProfile === "minimal" ? false : Boolean(showRarityLabelToggle.checked);
    const showUpcomingDot = Boolean(showUpcomingDotToggle.checked);
    const experimentalGameSkinAutoEnabled = Boolean(
      experimentalGameSkinToggle.checked
    );
    const commentFetchStartupPages = clamp(
      Number(commentFetchStartupPagesInput.value || DEFAULT_COMMENT_FETCH_STARTUP_PAGES),
      MIN_COMMENT_FETCH_STARTUP_PAGES,
      MAX_COMMENT_FETCH_STARTUP_PAGES
    );
    const commentScanStartDelaySec = clamp(
      Number(commentScanDelayInput.value || DEFAULT_COMMENT_SCAN_START_DELAY_SEC),
      MIN_COMMENT_SCAN_START_DELAY_SEC,
      MAX_COMMENT_SCAN_START_DELAY_SEC
    );
    const commentFetchMaxPages = clamp(
      Number(commentFetchMaxPagesInput.value || DEFAULT_COMMENT_FETCH_MAX_PAGES),
      MIN_COMMENT_FETCH_MAX_PAGES,
      MAX_COMMENT_FETCH_MAX_PAGES
    );
    const commentFetchAggressive = Boolean(commentFetchAggressiveToggle.checked);
    const commentFetchAdaptive = Boolean(commentFetchAdaptiveToggle.checked);
    const livePageMarkerUpdates = Boolean(livePageMarkersToggle.checked);
    const popupDarkMode = Boolean(popupDarkToggle.checked);
    const isActive = toggleButton.classList.contains("toggle_active");
    const selectedPosition =
      document.querySelector(".position-button.selected")?.dataset.position ||
      lastPosition ||
      configs.position ||
      "bottom-left";

    return {
      isActive,
      position: selectedPosition,
      overlayScale,
      displayDuration,
      overlayRadius,
      overlayRadiusBySkin: snapshotRadiusBySkin,
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
      diamondThresholdPercent,
      popularityModeEnabled,
      raritySkin,
      rarityLogicMode,
      rarityGeometricRatio,
      heatmapEnabled,
      heatmapIntensity,
      routingEnabled,
      routingThreshold,
      routingShortCorner,
      routingLongCorner,
      showLikesInNotifications,
      showRarityLabelInNotifications,
      showUpcomingDot,
      hideTimestampOnlyMessages,
      hideMultiTimestampMessages,
      hiddenRarityTiersBySkin: normalizeHiddenRarityTiersBySkin(hiddenRarityTiersBySkin),
      hiddenRarityTiersBySkinId: normalizeHiddenRarityTiersBySkin(hiddenRarityTiersBySkin),
      experimentalGameSkinAutoEnabled,
      commentFetchStartupPages,
      commentScanStartDelaySec,
      commentFetchMaxPages,
      commentFetchAggressive,
      commentFetchAdaptive,
      livePageMarkerUpdates,
      popupDarkMode,
      presetProfile,
      activeRaritySkinId: raritySkin,
      raritySkinCatalogRevision,
      raritySkinCatalog
    };
  }

  async function copySettingsSnapshotToClipboard() {
    if (!copySettingsButton) {
      return;
    }
    const snapshot = buildSettingsSnapshot();
    const payload = JSON.stringify(snapshot, null, 2);
    let copied = false;

    try {
      await navigator.clipboard.writeText(payload);
      copied = true;
    } catch (error) {
      const fallback = document.createElement("textarea");
      fallback.value = payload;
      fallback.setAttribute("readonly", "readonly");
      fallback.style.position = "fixed";
      fallback.style.opacity = "0";
      fallback.style.pointerEvents = "none";
      document.body.appendChild(fallback);
      fallback.select();
      copied = document.execCommand("copy");
      fallback.remove();
    }

    if (copySettingsStatus) {
      copySettingsStatus.textContent = copied
        ? "Copied current settings to clipboard."
        : "Could not copy settings. Try again.";
    }
  }

  async function copyDebugTimestampTierListToClipboard() {
    if (!copyDebugTierListButton) {
      return;
    }
    if (copyDebugTierListStatus) {
      copyDebugTierListStatus.textContent = "Collecting from current YouTube tab...";
    }
    try {
      const activeTabs = await chrome.tabs.query({ active: true, lastFocusedWindow: true });
      const activeWatchTab = (activeTabs || []).find((tab) =>
        /^https:\/\/www\.youtube\.com\/watch\?/.test(String(tab?.url || ""))
      );
      const response = await chrome.runtime.sendMessage({
        type: "copy_debug_timestamp_tier_list",
        tabId: activeWatchTab?.id ?? null
      });
      const payload = String(response?.text || "").trim();
      if (!payload) {
        if (copyDebugTierListStatus) {
          if (response?.reason === "no_youtube_tab") {
            copyDebugTierListStatus.textContent = "Open a YouTube watch tab first.";
          } else if (response?.reason === "no_data") {
            copyDebugTierListStatus.textContent =
              "No timestamped comments loaded yet for this tab.";
          } else {
            copyDebugTierListStatus.textContent = "No timestamped comments found.";
          }
        }
        return;
      }
      await navigator.clipboard.writeText(payload);
      if (copyDebugTierListStatus) {
        copyDebugTierListStatus.textContent = "Copied timestamp tier list.";
      }
    } catch (error) {
      if (copyDebugTierListStatus) {
        copyDebugTierListStatus.textContent = "Could not copy debug list.";
      }
    }
  }

  async function applySelectedPresetAndSave() {
    const presetProfile = minimalModeToggle.checked ? "minimal" : "balanced";
    applyPresetToControls(presetProfile);

    const overlayScale = clamp(
      Number(sizeSlider.value || DEFAULT_OVERLAY_SCALE * 100) / 100,
      MIN_OVERLAY_SCALE,
      MAX_OVERLAY_SCALE
    );
    const displayDuration = clamp(
      Number(durationSlider.value || DEFAULT_DISPLAY_DURATION),
      MIN_DISPLAY_DURATION,
      MAX_DISPLAY_DURATION
    );
    const selectedRaritySkin = normalizeRaritySkin(
      String(raritySkinSelect?.value || DEFAULT_RARITY_SKIN)
    );
    const overlayRadius = normalizeRadiusValue(
      Number(radiusSlider.value || DEFAULT_OVERLAY_RADIUS)
    );
    const overlayAvatarSize = clamp(
      Number(avatarSizeSlider.value || DEFAULT_OVERLAY_AVATAR_SIZE),
      MIN_OVERLAY_AVATAR_SIZE,
      MAX_OVERLAY_AVATAR_SIZE
    );
    const showLikesInNotifications = getPresetShowLikesDefault(presetProfile);
    const showRarityLabelInNotifications =
      presetProfile === "minimal"
        ? false
        : Boolean(showRarityLabelToggle.checked);
    showLikesToggle.checked = showLikesInNotifications;
    showRarityLabelToggle.checked = showRarityLabelInNotifications;
    showRarityLabelToggle.disabled = presetProfile === "minimal";
    renderLiveNotificationPreview();

    const presetSettings = {
      overlayScale,
      displayDuration,
      overlayRadius,
      overlayRadiusBySkin: {
        ...overlayRadiusBySkin,
        [selectedRaritySkin]: overlayRadius
      },
      overlayAvatarSize,
      showLikesInNotifications,
      showRarityLabelInNotifications,
      activeRaritySkinId: selectedRaritySkin,
      presetProfile
    };
    overlayRadiusBySkin[selectedRaritySkin] = overlayRadius;

    await chrome.storage.sync.set(presetSettings);
    await broadcastOverlaySettings({
      ...presetSettings,
      raritySkin: selectedRaritySkin,
      activeRaritySkinConfig: rarityShared.deepClone(getSkinConfigById(selectedRaritySkin)),
      raritySkinCatalogRevision
    });
  }

  sizeSlider.addEventListener("change", saveOverlaySettings);
  durationSlider.addEventListener("change", saveOverlaySettings);
  radiusSlider.addEventListener("change", saveOverlaySettings);
  avatarSizeSlider.addEventListener("change", saveOverlaySettings);
  glassSlider.addEventListener("change", saveOverlaySettings);
  darknessSlider.addEventListener("change", saveOverlaySettings);
  if (debugToggle) {
    debugToggle.addEventListener("change", saveOverlaySettings);
  }
  allowLongToggle.addEventListener("change", saveOverlaySettings);
  hideTimestampOnlyToggle.addEventListener("change", saveOverlaySettings);
  hideMultiTimestampToggle.addEventListener("change", saveOverlaySettings);
  maxCharsInput.addEventListener("change", saveOverlaySettings);
  earlyModeToggle.addEventListener("change", saveOverlaySettings);
  followPlaybackSpeedToggle.addEventListener("change", saveOverlaySettings);
  earlySecondsInput.addEventListener("change", saveOverlaySettings);
  accentEffectSelect.addEventListener("change", saveOverlaySettings);
  priorityLikesWeightInput.addEventListener("change", saveOverlaySettings);
  if (topLikedThresholdSlider) {
    topLikedThresholdSlider.addEventListener("change", saveOverlaySettings);
  }
  rarityLogicSelect.addEventListener("change", () => {
    syncGeometricRatioControlState();
    saveOverlaySettings();
  });
  rarityGeometricRatioSlider.addEventListener("input", () => {
    updateGeometricRatioLabel(rarityGeometricRatioSlider, rarityGeometricRatioValue);
  });
  rarityGeometricRatioSlider.addEventListener("change", saveOverlaySettings);
  heatmapEnabledToggle.addEventListener("change", saveOverlaySettings);
  heatmapIntensitySlider.addEventListener("change", saveOverlaySettings);
  routingEnabledToggle.addEventListener("change", saveOverlaySettings);
  routingThresholdInput.addEventListener("change", saveOverlaySettings);
  routingShortCornerSelect.addEventListener("change", saveOverlaySettings);
  routingLongCornerSelect.addEventListener("change", saveOverlaySettings);
  showUpcomingDotToggle.addEventListener("change", saveOverlaySettings);
  experimentalGameSkinToggle.addEventListener("change", saveOverlaySettings);
  commentFetchStartupPagesInput.addEventListener("change", saveOverlaySettings);
  commentScanDelayInput.addEventListener("change", saveOverlaySettings);
  commentFetchMaxPagesInput.addEventListener("change", saveOverlaySettings);
  commentFetchAggressiveToggle.addEventListener("change", saveOverlaySettings);
  commentFetchAdaptiveToggle.addEventListener("change", saveOverlaySettings);
  livePageMarkersToggle.addEventListener("change", saveOverlaySettings);
  const bindRealtime = (element, handler) => {
    element.addEventListener("input", handler);
    element.addEventListener("change", handler);
  };

  async function updateSelectedTier(mutator) {
    await updateSelectedSkin((skin) => {
      const tierIndex = skin.tiers.findIndex((tier) => tier.key === selectedTierKey);
      if (tierIndex < 0) {
        return skin;
      }
      mutator(skin.tiers[tierIndex], skin, tierIndex);
      return skin;
    });
  }

  function downloadJsonFile(filename, payload) {
    const json = JSON.stringify(payload, null, 2);
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = filename;
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
    URL.revokeObjectURL(url);
  }

  bindRealtime(reverseStackToggle, saveOverlaySettings);
  bindRealtime(showLikesToggle, saveOverlaySettings);
  bindRealtime(priorityScoringToggle, saveOverlaySettings);
  bindRealtime(showRarityLabelToggle, saveOverlaySettings);
  bindRealtime(popularityModeToggle, saveOverlaySettings);
  bindRealtime(raritySkinSelect, async () => {
    const selectedSkin = normalizeRaritySkin(raritySkinSelect.value);
    const selectedRadius = normalizeRadiusValue(
      overlayRadiusBySkin[selectedSkin],
      DEFAULT_OVERLAY_RADIUS
    );
    radiusSlider.value = String(Math.round(selectedRadius));
    updateRadiusLabel(radiusSlider, radiusValue);
    renderRarityPreview(selectedSkin);
    renderSkinEditor();
    await saveOverlaySettings();
    if (topLikedThresholdSlider) {
      await showTopLikedCutoffPreview(Number(topLikedThresholdSlider.value));
    }
  });

  if (rarityAddSkinButton) {
    rarityAddSkinButton.addEventListener("click", async () => {
      const requestedName = window.prompt("New skin name:", "My Skin");
      if (!requestedName) {
        return;
      }
      const baseId = rarityShared.toSlug(requestedName, "custom-skin");
      const nextCatalog = rarityShared.upsertSkin(raritySkinCatalog, {
        id: baseId,
        name: requestedName,
        builtIn: false,
        styleFamily: "glass",
        style: {
          borderEnabled: true,
          borderWidth: 1,
          radius: Number(radiusSlider.value || DEFAULT_OVERLAY_RADIUS),
          packOpacity: 0.48
        },
        nonPopularityPrimaryTierKey: "tier-2",
        nonPopularityEliteTierKey: "tier-3",
        tiers: [
          rarityShared.defaultTierShape(0),
          rarityShared.defaultTierShape(1),
          rarityShared.defaultTierShape(2)
        ]
      });
      const created = nextCatalog.skins[nextCatalog.skins.length - 1];
      selectedTierKey = created?.tiers?.[0]?.key || null;
      await applySkinCatalogUpdate(nextCatalog, created?.id);
      setRarityEditorStatus(`Created skin "${created?.name || requestedName}".`);
    });
  }

  if (rarityDuplicateSkinButton) {
    rarityDuplicateSkinButton.addEventListener("click", async () => {
      const current = rarityShared.deepClone(getSelectedSkinConfig());
      if (!current) {
        return;
      }
      current.id = `${current.id}-copy`;
      current.name = `${current.name} Copy`;
      current.builtIn = false;
      const nextCatalog = rarityShared.upsertSkin(raritySkinCatalog, current);
      const created = nextCatalog.skins[nextCatalog.skins.length - 1];
      selectedTierKey = created?.tiers?.[0]?.key || null;
      await applySkinCatalogUpdate(nextCatalog, created?.id);
      setRarityEditorStatus(`Duplicated to "${created?.name}".`);
    });
  }

  if (rarityDeleteSkinButton) {
    rarityDeleteSkinButton.addEventListener("click", async () => {
      const current = getSelectedSkinConfig();
      if (!current) {
        return;
      }
      if (raritySkinCatalog.skins.length <= 1) {
        setRarityEditorStatus("At least one skin must remain.", true);
        return;
      }
      const confirmed = window.confirm(`Delete skin "${current.name}"?`);
      if (!confirmed) {
        return;
      }
      const nextCatalog = rarityShared.deleteSkin(raritySkinCatalog, current.id);
      const fallback = nextCatalog.skins[0]?.id || DEFAULT_RARITY_SKIN;
      selectedTierKey = nextCatalog.skins[0]?.tiers?.[0]?.key || null;
      await applySkinCatalogUpdate(nextCatalog, fallback);
      setRarityEditorStatus(`Deleted "${current.name}".`);
    });
  }

  if (rarityEditorSkinNameInput) {
    rarityEditorSkinNameInput.addEventListener("change", async () => {
      const nextName = String(rarityEditorSkinNameInput.value || "").trim();
      if (!nextName) {
        renderSkinEditor();
        return;
      }
      await updateSelectedSkin((skin) => {
        skin.name = nextName;
        return skin;
      });
      setRarityEditorStatus("Updated skin name.");
    });
  }

  if (rarityStyleFamilySelect) {
    rarityStyleFamilySelect.addEventListener("input", renderLiveNotificationPreview);
    rarityStyleFamilySelect.addEventListener("change", async () => {
      await updateSelectedSkin((skin) => {
        skin.styleFamily = rarityStyleFamilySelect.value;
        return skin;
      });
      setRarityEditorStatus("Updated style family.");
    });
  }

  if (rarityStyleRadiusSlider) {
    rarityStyleRadiusSlider.addEventListener("input", () => {
      rarityStyleRadiusValue.textContent = `${Math.round(
        Number(rarityStyleRadiusSlider.value || 0)
      )}px`;
      renderLiveNotificationPreview();
    });
    rarityStyleRadiusSlider.addEventListener("change", async () => {
      const nextRadius = normalizeRadiusValue(
        Number(rarityStyleRadiusSlider.value || DEFAULT_OVERLAY_RADIUS)
      );
      await updateSelectedSkin((skin) => {
        skin.style = skin.style || {};
        skin.style.radius = nextRadius;
        return skin;
      });
      const activeSkinId = getSelectedSkinId();
      overlayRadiusBySkin[activeSkinId] = nextRadius;
      radiusSlider.value = String(Math.round(nextRadius));
      updateRadiusLabel(radiusSlider, radiusValue);
      await saveOverlaySettings();
      setRarityEditorStatus("Updated skin corner radius.");
    });
  }

  if (rarityStyleBorderEnabledToggle) {
    rarityStyleBorderEnabledToggle.addEventListener("input", renderLiveNotificationPreview);
    rarityStyleBorderEnabledToggle.addEventListener("change", async () => {
      await updateSelectedSkin((skin) => {
        skin.style = skin.style || {};
        skin.style.borderEnabled = Boolean(rarityStyleBorderEnabledToggle.checked);
        return skin;
      });
      setRarityEditorStatus("Updated border enabled.");
    });
  }

  if (rarityStyleBorderWidthInput) {
    rarityStyleBorderWidthInput.addEventListener("input", renderLiveNotificationPreview);
    rarityStyleBorderWidthInput.addEventListener("change", async () => {
      await updateSelectedSkin((skin) => {
        skin.style = skin.style || {};
        skin.style.borderWidth = rarityShared.clamp(
          Number(rarityStyleBorderWidthInput.value || 1),
          0,
          12
        );
        return skin;
      });
      setRarityEditorStatus("Updated border width.");
    });
  }

  if (rarityStylePackOpacitySlider) {
    rarityStylePackOpacitySlider.addEventListener("input", () => {
      rarityStylePackOpacityValue.textContent = `${Math.round(
        Number(rarityStylePackOpacitySlider.value || 0)
      )}%`;
      renderLiveNotificationPreview();
    });
    rarityStylePackOpacitySlider.addEventListener("change", async () => {
      await updateSelectedSkin((skin) => {
        skin.style = skin.style || {};
        skin.style.packOpacity = rarityShared.clamp(
          Number(rarityStylePackOpacitySlider.value || 48) / 100,
          0.08,
          1
        );
        return skin;
      });
      setRarityEditorStatus("Updated skin opacity.");
    });
  }

  if (rarityAddTierButton) {
    rarityAddTierButton.addEventListener("click", async () => {
      await updateSelectedSkin((skin) => rarityShared.addTierToSkin(skin));
      const tiers = getSelectedSkinConfig()?.tiers || [];
      selectedTierKey = tiers[tiers.length - 1]?.key || selectedTierKey;
      renderTierList();
      renderTierEditor();
      setRarityEditorStatus("Added tier.");
    });
  }

  if (rarityTierDeleteButton) {
    rarityTierDeleteButton.addEventListener("click", async () => {
      const tier = getSelectedTier();
      if (!tier) {
        return;
      }
      await updateSelectedSkin((skin) => rarityShared.removeTierFromSkin(skin, tier.key));
      selectedTierKey = getSelectedSkinConfig()?.tiers?.[0]?.key || null;
      renderTierList();
      renderTierEditor();
      setRarityEditorStatus("Deleted tier.");
    });
  }

  if (rarityTierMoveUpButton) {
    rarityTierMoveUpButton.addEventListener("click", async () => {
      const tier = getSelectedTier();
      if (!tier) {
        return;
      }
      await updateSelectedSkin((skin) => rarityShared.moveTierInSkin(skin, tier.key, "up"));
      renderTierList();
      renderTierEditor();
      setRarityEditorStatus("Moved tier up.");
    });
  }

  if (rarityTierMoveDownButton) {
    rarityTierMoveDownButton.addEventListener("click", async () => {
      const tier = getSelectedTier();
      if (!tier) {
        return;
      }
      await updateSelectedSkin((skin) => rarityShared.moveTierInSkin(skin, tier.key, "down"));
      renderTierList();
      renderTierEditor();
      setRarityEditorStatus("Moved tier down.");
    });
  }

  [
    rarityTierLabelInput,
    rarityTierBodyColorInput,
    rarityTierTextColorInput,
    rarityTierBorderColorInput,
    rarityTierMarkerColorInput,
    rarityTierMarkerWidthInput,
    rarityTierMarkerHeightInput,
    rarityTierMarkerOffsetInput,
    rarityTierPercentileFactorInput,
    rarityTierMinLikesInput,
    rarityTierMinGapPrevInput,
    rarityTierMinGapPrimaryInput,
    rarityTierHeatmapWeightInput,
    rarityTierDurationMultiplierInput
  ].forEach((element) => {
    if (!element) {
      return;
    }
    element.addEventListener("input", renderLiveNotificationPreview);
    element.addEventListener("change", async () => {
      await updateSelectedTier((tier) => {
        tier.label = String(rarityTierLabelInput.value || tier.label);
        tier.bodyColor = rarityShared.normalizeHexColor(rarityTierBodyColorInput.value, tier.bodyColor);
        tier.textColor = rarityShared.normalizeHexColor(rarityTierTextColorInput.value, tier.textColor);
        tier.borderColor = rarityShared.normalizeHexColor(rarityTierBorderColorInput.value, tier.borderColor);
        tier.markerColor = rarityShared.normalizeHexColor(rarityTierMarkerColorInput.value, tier.markerColor);
        tier.markerWidthPx = rarityShared.clamp(Number(rarityTierMarkerWidthInput.value || tier.markerWidthPx), 3, 30);
        tier.markerHeightPct = rarityShared.clamp(Number(rarityTierMarkerHeightInput.value || tier.markerHeightPct), 80, 420);
        tier.markerOffsetTopPct = rarityShared.clamp(Number(rarityTierMarkerOffsetInput.value || tier.markerOffsetTopPct), -180, 40);
        tier.percentileFactor = rarityShared.clamp(Number(rarityTierPercentileFactorInput.value || tier.percentileFactor), 0.05, 8);
        tier.minLikes = rarityShared.clamp(Number(rarityTierMinLikesInput.value || tier.minLikes), 0, 1000000);
        tier.minGapFromPrevious = rarityShared.clamp(Number(rarityTierMinGapPrevInput.value || tier.minGapFromPrevious), 0, 1000000);
        tier.minGapFromPrimary = rarityShared.clamp(Number(rarityTierMinGapPrimaryInput.value || 0), 0, 1000000);
        tier.heatmapWeight = rarityShared.clamp(Number(rarityTierHeatmapWeightInput.value || tier.heatmapWeight), 0.1, 100);
        tier.durationMultiplier = rarityShared.clamp(Number(rarityTierDurationMultiplierInput.value || tier.durationMultiplier), 0.1, 10);
      });
      setRarityEditorStatus("Updated tier.");
    });
  });

  if (rarityTierEffectsList) {
    rarityTierEffectsList.addEventListener("input", renderLiveNotificationPreview);
    rarityTierEffectsList.addEventListener("change", async () => {
      const checked = Array.from(
        rarityTierEffectsList.querySelectorAll("input[data-effect]:checked")
      ).map((input) => input.dataset.effect);
      await updateSelectedTier((tier) => {
        tier.effects = rarityShared.normalizeEffectTokens(checked);
      });
      setRarityEditorStatus("Updated tier effects.");
    });
  }

  if (rarityExportSkinButton) {
    rarityExportSkinButton.addEventListener("click", () => {
      const skin = rarityShared.deepClone(getSelectedSkinConfig());
      if (!skin) {
        return;
      }
      downloadJsonFile(
        `${skin.id}.json`,
        {
          schemaVersion: rarityShared.RARITY_SKIN_SCHEMA_VERSION,
          skins: [skin]
        }
      );
      setRarityEditorStatus(`Exported "${skin.name}".`);
    });
  }

  if (rarityExportAllSkinsButton) {
    rarityExportAllSkinsButton.addEventListener("click", () => {
      downloadJsonFile(
        "rarity-skins-catalog.json",
        {
          schemaVersion: rarityShared.RARITY_SKIN_SCHEMA_VERSION,
          skins: rarityShared.deepClone(raritySkinCatalog.skins)
        }
      );
      setRarityEditorStatus("Exported all skins.");
    });
  }

  if (rarityImportSkinsButton && rarityImportFileInput) {
    rarityImportSkinsButton.addEventListener("click", () => {
      rarityImportFileInput.value = "";
      rarityImportFileInput.click();
    });
    rarityImportFileInput.addEventListener("change", async () => {
      const file = rarityImportFileInput.files?.[0];
      if (!file) {
        return;
      }
      try {
        const text = await file.text();
        const payload = JSON.parse(text);
        const incomingCatalog = rarityShared.sanitizeImportedCatalogPayload(payload);
        let nextCatalog = rarityShared.deepClone(raritySkinCatalog);
        let lastImportedId = null;
        for (const incomingSkin of incomingCatalog.skins) {
          const exists = nextCatalog.skins.some((skin) => skin.id === incomingSkin.id);
          if (exists) {
            const shouldOverwrite = window.confirm(
              `Skin "${incomingSkin.id}" already exists. Overwrite it?`
            );
            if (!shouldOverwrite) {
              continue;
            }
          }
          nextCatalog = rarityShared.upsertSkin(nextCatalog, incomingSkin, incomingSkin.id);
          lastImportedId = incomingSkin.id;
        }
        await applySkinCatalogUpdate(nextCatalog, lastImportedId || getSelectedSkinId());
        setRarityEditorStatus("Imported skin file.");
      } catch (error) {
        setRarityEditorStatus(`Import failed: ${String(error?.message || error)}`, true);
      }
    });
  }
  if (copySettingsButton) {
    copySettingsButton.addEventListener("click", copySettingsSnapshotToClipboard);
  }
  if (copyDebugTierListButton) {
    copyDebugTierListButton.addEventListener(
      "click",
      copyDebugTimestampTierListToClipboard
    );
  }
  if (rescanNowButton) {
    rescanNowButton.addEventListener("click", async () => {
      const videoId = await getActiveYouTubeVideoId();
      if (!videoId) {
        if (rescanNowStatus) {
          rescanNowStatus.textContent = "Open a YouTube video first.";
        }
        return;
      }
      if (rescanNowStatus) {
        rescanNowStatus.textContent = "Rescanning current video...";
      }
      await chrome.runtime.sendMessage({ type: "rescan_now", videoId });
      if (rescanNowStatus) {
        rescanNowStatus.textContent = "Rescan started.";
      }
    });
  }
  minimalModeToggle.addEventListener("change", applySelectedPresetAndSave);
  popupDarkToggle.addEventListener("change", async () => {
    const popupDarkMode = Boolean(popupDarkToggle.checked);
    document.body.classList.toggle("dark-mode", popupDarkMode);
    await chrome.storage.sync.set({ popupDarkMode });
  });

});
