let lastPosition = "";

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
const DEFAULT_EXPERIMENTAL_GAME_SKIN_AUTO_ENABLED = true;
const DEFAULT_COMMENT_FETCH_STARTUP_PAGES = 1;
const DEFAULT_COMMENT_FETCH_MAX_PAGES = 8;
const DEFAULT_COMMENT_FETCH_AGGRESSIVE = false;
const DEFAULT_COMMENT_FETCH_ADAPTIVE = true;
const DEFAULT_LIVE_PAGE_MARKER_UPDATES = true;
const DEFAULT_COMMENT_SCAN_START_DELAY_SEC = 3;
const DEFAULT_PRESET_PROFILE = "balanced";
const DEFAULT_RARITY_SKIN = "default";
const DEFAULT_RARITY_LOGIC_MODE = "thresholds";
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
const PRESET_PROFILE_VALUES = ["minimal", "balanced"];
const RARITY_SKIN_VALUES = ["default", "borderlands", "borderlands2", "minecraft", "animalcrossing"];
const RARITY_LOGIC_MODE_VALUES = ["thresholds", "percentile"];
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

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function normalizePresetProfile(value) {
  return PRESET_PROFILE_VALUES.includes(value) ? value : DEFAULT_PRESET_PROFILE;
}

function normalizeRaritySkin(value) {
  return RARITY_SKIN_VALUES.includes(value) ? value : DEFAULT_RARITY_SKIN;
}

function normalizeRarityLogicMode(value) {
  return RARITY_LOGIC_MODE_VALUES.includes(value) ? value : DEFAULT_RARITY_LOGIC_MODE;
}

function normalizeHiddenRarityTiersBySkin(value) {
  const source = value && typeof value === "object" && !Array.isArray(value) ? value : {};
  const result = {};
  for (const skin of RARITY_SKIN_VALUES) {
    const tierOptions = RARITY_TIER_OPTIONS[skin] || [];
    const skinMap =
      source[skin] && typeof source[skin] === "object" && !Array.isArray(source[skin])
        ? source[skin]
        : {};
    result[skin] = {};
    tierOptions.forEach((tier) => {
      result[skin][tier.key] = Boolean(skinMap[tier.key]);
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
      : DEFAULT_OVERLAY_RADIUS_BY_SKIN;
  const fallback = normalizeRadiusValue(fallbackRadius, DEFAULT_OVERLAY_RADIUS);
  const result = {};
  for (const skin of RARITY_SKIN_VALUES) {
    result[skin] = normalizeRadiusValue(source[skin], fallback);
  }
  return result;
}

function getRaritySkinCutoffLabels(raritySkin) {
  return (
    RARITY_SKIN_CUTOFF_LABELS[normalizeRaritySkin(raritySkin)] ||
    RARITY_SKIN_CUTOFF_LABELS[DEFAULT_RARITY_SKIN]
  );
}

function getRaritySkinCutoffRules(raritySkin) {
  return (
    RARITY_SKIN_CUTOFF_RULES[normalizeRaritySkin(raritySkin)] ||
    RARITY_SKIN_CUTOFF_RULES[DEFAULT_RARITY_SKIN]
  );
}

function getRarityPreviewScheme(raritySkin) {
  return (
    RARITY_PREVIEW_SCHEMES[normalizeRaritySkin(raritySkin)] ||
    RARITY_PREVIEW_SCHEMES[DEFAULT_RARITY_SKIN]
  );
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
  const stored = await chrome.storage.sync.get([
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
    "hiddenRarityTiersBySkin",
    "showRarityLabelInNotifications",
    "experimentalGameSkinAutoEnabled",
    "commentFetchStartupPages",
    "commentFetchMaxPages",
    "commentFetchAggressive",
    "commentFetchAdaptive",
    "commentScanStartDelaySec",
    "livePageMarkerUpdates",
    "raritySkin",
    "rarityLogicMode",
    "presetProfile"
  ]);

  const isActive = stored?.active !== undefined && stored?.active !== null ? stored.active : true;
  const position = stored?.position || "bottom-left";
  const overlayScale = clamp(
    Number(stored?.overlayScale ?? DEFAULT_OVERLAY_SCALE),
    MIN_OVERLAY_SCALE,
    MAX_OVERLAY_SCALE
  );
  const displayDuration = clamp(
    Number(stored?.displayDuration ?? DEFAULT_DISPLAY_DURATION),
    MIN_DISPLAY_DURATION,
    MAX_DISPLAY_DURATION
  );
  const overlayRadius = clamp(
    Number(stored?.overlayRadius ?? DEFAULT_OVERLAY_RADIUS),
    MIN_OVERLAY_RADIUS,
    MAX_OVERLAY_RADIUS
  );
  const overlayRadiusBySkin = normalizeOverlayRadiusBySkin(
    stored?.overlayRadiusBySkin,
    overlayRadius
  );
  const overlayAvatarSize = clamp(
    Number(stored?.overlayAvatarSize ?? DEFAULT_OVERLAY_AVATAR_SIZE),
    MIN_OVERLAY_AVATAR_SIZE,
    MAX_OVERLAY_AVATAR_SIZE
  );
  const overlayGlassiness = clamp(
    Number(stored?.overlayGlassiness ?? DEFAULT_OVERLAY_GLASSINESS),
    MIN_OVERLAY_GLASSINESS,
    MAX_OVERLAY_GLASSINESS
  );
  const overlayDarkness = clamp(
    Number(stored?.overlayDarkness ?? DEFAULT_OVERLAY_DARKNESS),
    MIN_OVERLAY_DARKNESS,
    MAX_OVERLAY_DARKNESS
  );
  const debugMode = Boolean(stored?.debugMode ?? DEFAULT_DEBUG_MODE);
  const allowLongMessages =
    stored?.allowLongMessages === undefined
      ? DEFAULT_ALLOW_LONG_MESSAGES
      : Boolean(stored.allowLongMessages);
  const maxMessageChars = clamp(
    Number(stored?.maxMessageChars ?? DEFAULT_MAX_MESSAGE_CHARS),
    MIN_MAX_MESSAGE_CHARS,
    MAX_MAX_MESSAGE_CHARS
  );
  const earlyModeEnabled = Boolean(stored?.earlyModeEnabled ?? DEFAULT_EARLY_MODE_ENABLED);
  const followPlaybackSpeed = Boolean(
    stored?.followPlaybackSpeed ?? DEFAULT_FOLLOW_PLAYBACK_SPEED
  );
  const earlySeconds = clamp(
    Number(stored?.earlySeconds ?? DEFAULT_EARLY_SECONDS),
    MIN_EARLY_SECONDS,
    MAX_EARLY_SECONDS
  );
  const timestampAccentEffect = String(
    stored?.timestampAccentEffect ?? DEFAULT_TIMESTAMP_ACCENT_EFFECT
  );
  const reverseStackOrder = Boolean(stored?.reverseStackOrder ?? DEFAULT_REVERSE_STACK_ORDER);
  const popupDarkMode = Boolean(stored?.popupDarkMode ?? DEFAULT_POPUP_DARK_MODE);
  const priorityScoringEnabled = Boolean(
    stored?.priorityScoringEnabled ?? DEFAULT_PRIORITY_SCORING_ENABLED
  );
  const priorityLikesWeight = clamp(
    Number(stored?.priorityLikesWeight ?? DEFAULT_PRIORITY_LIKES_WEIGHT),
    MIN_PRIORITY_LIKES_WEIGHT,
    MAX_PRIORITY_LIKES_WEIGHT
  );
  const topLikedThresholdPercent = clamp(
    Number(stored?.topLikedThresholdPercent ?? DEFAULT_TOP_LIKED_THRESHOLD_PERCENT),
    MIN_TOP_LIKED_THRESHOLD_PERCENT,
    MAX_TOP_LIKED_THRESHOLD_PERCENT
  );
  const diamondThresholdPercent = deriveDiamondThresholdPercent(topLikedThresholdPercent);
  const popularityModeEnabled = Boolean(
    stored?.popularityModeEnabled ?? DEFAULT_POPULARITY_MODE_ENABLED
  );
  const heatmapEnabled = Boolean(stored?.heatmapEnabled ?? DEFAULT_HEATMAP_ENABLED);
  const heatmapIntensity = clamp(
    Number(stored?.heatmapIntensity ?? DEFAULT_HEATMAP_INTENSITY),
    MIN_HEATMAP_INTENSITY,
    MAX_HEATMAP_INTENSITY
  );
  const routingEnabled = Boolean(stored?.routingEnabled ?? DEFAULT_ROUTING_ENABLED);
  const routingThreshold = clamp(
    Number(stored?.routingThreshold ?? DEFAULT_ROUTING_THRESHOLD),
    MIN_ROUTING_THRESHOLD,
    MAX_ROUTING_THRESHOLD
  );
  const routingShortCorner = String(
    stored?.routingShortCorner ?? DEFAULT_ROUTING_SHORT_CORNER
  );
  const routingLongCorner = String(
    stored?.routingLongCorner ?? DEFAULT_ROUTING_LONG_CORNER
  );
  const presetProfile = normalizePresetProfile(
    String(stored?.presetProfile ?? DEFAULT_PRESET_PROFILE)
  );
  const showLikesInNotifications =
    presetProfile === "minimal"
      ? false
      : Boolean(
          stored?.showLikesInNotifications ?? getPresetShowLikesDefault(presetProfile)
        );
  const showRarityLabelInNotifications =
    presetProfile === "minimal"
      ? false
      : Boolean(
          stored?.showRarityLabelInNotifications ??
            DEFAULT_SHOW_RARITY_LABEL_IN_NOTIFICATIONS
        );
  const showUpcomingDot = Boolean(
    stored?.showUpcomingDot ?? DEFAULT_SHOW_UPCOMING_DOT
  );
  const hideTimestampOnlyMessages = Boolean(
    stored?.hideTimestampOnlyMessages ?? DEFAULT_HIDE_TIMESTAMP_ONLY_MESSAGES
  );
  const hiddenRarityTiersBySkin = normalizeHiddenRarityTiersBySkin(
    stored?.hiddenRarityTiersBySkin
  );
  const experimentalGameSkinAutoEnabled = Boolean(
    stored?.experimentalGameSkinAutoEnabled ??
      DEFAULT_EXPERIMENTAL_GAME_SKIN_AUTO_ENABLED
  );
  const commentFetchStartupPages = clamp(
    Number(stored?.commentFetchStartupPages ?? DEFAULT_COMMENT_FETCH_STARTUP_PAGES),
    MIN_COMMENT_FETCH_STARTUP_PAGES,
    MAX_COMMENT_FETCH_STARTUP_PAGES
  );
  const commentFetchMaxPages = clamp(
    Number(stored?.commentFetchMaxPages ?? DEFAULT_COMMENT_FETCH_MAX_PAGES),
    MIN_COMMENT_FETCH_MAX_PAGES,
    MAX_COMMENT_FETCH_MAX_PAGES
  );
  const commentFetchAggressive = Boolean(
    stored?.commentFetchAggressive ?? DEFAULT_COMMENT_FETCH_AGGRESSIVE
  );
  const commentFetchAdaptive = Boolean(
    stored?.commentFetchAdaptive ?? DEFAULT_COMMENT_FETCH_ADAPTIVE
  );
  const commentScanStartDelaySec = clamp(
    Number(stored?.commentScanStartDelaySec ?? DEFAULT_COMMENT_SCAN_START_DELAY_SEC),
    MIN_COMMENT_SCAN_START_DELAY_SEC,
    MAX_COMMENT_SCAN_START_DELAY_SEC
  );
  const livePageMarkerUpdates = Boolean(
    stored?.livePageMarkerUpdates ?? DEFAULT_LIVE_PAGE_MARKER_UPDATES
  );
  const raritySkin = normalizeRaritySkin(
    String(stored?.raritySkin ?? DEFAULT_RARITY_SKIN)
  );
  const overlayRadiusForSkin = normalizeRadiusValue(
    overlayRadiusBySkin[raritySkin],
    overlayRadius
  );
  const rarityLogicMode = normalizeRarityLogicMode(
    String(stored?.rarityLogicMode ?? DEFAULT_RARITY_LOGIC_MODE)
  );

  await chrome.storage.sync.set({
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
    presetProfile
  });

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
    presetProfile
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
  thresholdValue.textContent = `${Math.round(Number(thresholdSlider.value))}%`;
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
      description: "Sets how selective popularity tiers are by percentile."
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
      description: "Switches tier assignment between current threshold rules and percentile-only."
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
  presetProfile
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
  const popularityModeToggle = document.getElementById("popularity-mode-toggle");
  const raritySkinSelect = document.getElementById("rarity-skin-select");
  const rarityLogicSelect = document.getElementById("rarity-logic-select");
  const rarityPreviewGrid = document.getElementById("rarity-preview-grid");
  const rarityTierVisibilityList = document.getElementById("rarity-tier-visibility-list");
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
  const rescanNowButton = document.getElementById("rescan-now-button");
  const rescanNowStatus = document.getElementById("rescan-now-status");
  const topLikedCutoffInline = document.getElementById("top-liked-cutoff-inline");
  let overlayRadiusBySkin = normalizeOverlayRadiusBySkin(
    configs.overlayRadiusBySkin,
    configs.overlayRadius
  );
  let hiddenRarityTiersBySkin = normalizeHiddenRarityTiersBySkin(
    configs.hiddenRarityTiersBySkin
  );
  let thresholdPreviewRequestSeq = 0;

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

  settingsTabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      activateSettingsTab(tab.dataset.tab || "overlay");
    });
  });
  activateSettingsTab("overlay");

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
  topLikedThresholdSlider.value = String(configs.topLikedThresholdPercent);
  popularityModeToggle.checked = configs.popularityModeEnabled;
  raritySkinSelect.value = normalizeRaritySkin(configs.raritySkin);
  rarityLogicSelect.value = normalizeRarityLogicMode(configs.rarityLogicMode);
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
  function renderRarityPreview(raritySkin) {
    if (!rarityPreviewGrid) {
      return;
    }
    const tiers = getRarityPreviewScheme(raritySkin);
    rarityPreviewGrid.replaceChildren();

    tiers.forEach((tier) => {
      const pill = document.createElement("div");
      pill.className = "rarity-preview-pill";

      const swatch = document.createElement("span");
      swatch.className = "rarity-preview-swatch";
      swatch.style.background = tier.color;

      const text = document.createElement("span");
      text.textContent = tier.label;

      pill.append(swatch, text);
      rarityPreviewGrid.appendChild(pill);
    });
  }
  function renderTierVisibilityControls(raritySkin) {
    if (!rarityTierVisibilityList) {
      return;
    }
    const skin = normalizeRaritySkin(raritySkin);
    const tiers = RARITY_TIER_OPTIONS[skin] || [];
    const hiddenMap = hiddenRarityTiersBySkin[skin] || {};
    rarityTierVisibilityList.replaceChildren();

    tiers.forEach((tier) => {
      const row = document.createElement("div");
      row.className = "setting-toggle-row";

      const label = document.createElement("label");
      label.textContent = `Hide ${tier.label}`;
      label.setAttribute("for", `hide-tier-${skin}-${tier.key}`);

      const switchLabel = document.createElement("label");
      switchLabel.className = "mini-switch";
      switchLabel.setAttribute("for", `hide-tier-${skin}-${tier.key}`);

      const input = document.createElement("input");
      input.type = "checkbox";
      input.id = `hide-tier-${skin}-${tier.key}`;
      input.checked = Boolean(hiddenMap[tier.key]);
      input.addEventListener("change", async () => {
        if (!hiddenRarityTiersBySkin[skin]) {
          hiddenRarityTiersBySkin[skin] = {};
        }
        hiddenRarityTiersBySkin[skin][tier.key] = Boolean(input.checked);
        await saveOverlaySettings();
      });

      const visual = document.createElement("span");
      visual.className = "mini-switch-slider";
      switchLabel.append(input, visual);
      row.append(label, switchLabel);
      rarityTierVisibilityList.appendChild(row);
    });
  }
  renderRarityPreview(raritySkinSelect.value);
  renderTierVisibilityControls(raritySkinSelect.value);
  showTopLikedCutoffPreview(Number(topLikedThresholdSlider.value));

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
    if (liveRadiusSaveTimeout) {
      clearTimeout(liveRadiusSaveTimeout);
    }
    liveRadiusSaveTimeout = setTimeout(() => {
      saveOverlaySettings();
      liveRadiusSaveTimeout = null;
    }, 40);
  });
  avatarSizeSlider.addEventListener("input", () =>
    updateAvatarSizeLabel(avatarSizeSlider, avatarSizeValue)
  );
  glassSlider.addEventListener("input", () => updateGlassLabel(glassSlider, glassValue));
  darknessSlider.addEventListener("input", () =>
    updateDarknessLabel(darknessSlider, darknessValue)
  );
  heatmapIntensitySlider.addEventListener("input", () =>
    updateHeatmapIntensityLabel(heatmapIntensitySlider, heatmapIntensityValue)
  );
  topLikedThresholdSlider.addEventListener("input", () =>
    {
      updateTopLikedThresholdLabel(topLikedThresholdSlider, topLikedThresholdValue);
      showTopLikedCutoffPreview(Number(topLikedThresholdSlider.value));
    }
  );

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
    const topLikedThresholdPercent = clamp(
      Number(topLikedThresholdSlider.value || DEFAULT_TOP_LIKED_THRESHOLD_PERCENT),
      MIN_TOP_LIKED_THRESHOLD_PERCENT,
      MAX_TOP_LIKED_THRESHOLD_PERCENT
    );
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
    earlySecondsInput.value = String(earlySeconds);
    priorityLikesWeightInput.value = String(priorityLikesWeight);
    topLikedThresholdSlider.value = String(topLikedThresholdPercent);
    heatmapIntensitySlider.value = String(heatmapIntensity);
    routingThresholdInput.value = String(routingThreshold);
    earlySecondsInput.disabled = !earlyModeEnabled;
    accentEffectSelect.disabled = !earlyModeEnabled;
    priorityLikesWeightInput.disabled = !priorityScoringEnabled;
    heatmapIntensitySlider.disabled = !heatmapEnabled;
    routingThresholdInput.disabled = !routingEnabled;
    routingShortCornerSelect.disabled = !routingEnabled;
    routingLongCornerSelect.disabled = !routingEnabled;

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
      hiddenRarityTiersBySkin: normalizeHiddenRarityTiersBySkin(hiddenRarityTiersBySkin),
      experimentalGameSkinAutoEnabled,
      commentFetchStartupPages,
      commentScanStartDelaySec,
      commentFetchMaxPages,
      commentFetchAggressive,
      commentFetchAdaptive,
      livePageMarkerUpdates,
      presetProfile
    };

    await chrome.storage.sync.set(settings);
    await broadcastOverlaySettings(settings);
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
    const topLikedThresholdPercent = clamp(
      Number(topLikedThresholdSlider.value || DEFAULT_TOP_LIKED_THRESHOLD_PERCENT),
      MIN_TOP_LIKED_THRESHOLD_PERCENT,
      MAX_TOP_LIKED_THRESHOLD_PERCENT
    );
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
      hiddenRarityTiersBySkin: normalizeHiddenRarityTiersBySkin(hiddenRarityTiersBySkin),
      experimentalGameSkinAutoEnabled,
      commentFetchStartupPages,
      commentScanStartDelaySec,
      commentFetchMaxPages,
      commentFetchAggressive,
      commentFetchAdaptive,
      livePageMarkerUpdates,
      popupDarkMode,
      presetProfile
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
      presetProfile
    };
    overlayRadiusBySkin[selectedRaritySkin] = overlayRadius;

    await chrome.storage.sync.set(presetSettings);
    await broadcastOverlaySettings(presetSettings);
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
  maxCharsInput.addEventListener("change", saveOverlaySettings);
  earlyModeToggle.addEventListener("change", saveOverlaySettings);
  followPlaybackSpeedToggle.addEventListener("change", saveOverlaySettings);
  earlySecondsInput.addEventListener("change", saveOverlaySettings);
  accentEffectSelect.addEventListener("change", saveOverlaySettings);
  priorityLikesWeightInput.addEventListener("change", saveOverlaySettings);
  topLikedThresholdSlider.addEventListener("change", saveOverlaySettings);
  rarityLogicSelect.addEventListener("change", saveOverlaySettings);
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
    renderTierVisibilityControls(selectedSkin);
    await saveOverlaySettings();
    await showTopLikedCutoffPreview(Number(topLikedThresholdSlider.value));
  });
  if (copySettingsButton) {
    copySettingsButton.addEventListener("click", copySettingsSnapshotToClipboard);
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
