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
const DEFAULT_RARITY_SKIN = "default";
const MIN_GOLD_TIER_LIKES = 15;
const MIN_DIAMOND_TIER_LIKES = 40;
const MIN_DIAMOND_TIER_GAP_FROM_GOLD = 10;
const MIN_BORDERLANDS_EPIC_TIER_LIKES = 16;
const MIN_BORDERLANDS_LEGENDARY_ORANGE_TIER_LIKES = 61;
const MIN_BORDERLANDS_LEGENDARY_ORANGE_GAP_FROM_EPIC = 6;

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
const PRESET_PROFILE_VALUES = ["minimal", "balanced"];
const RARITY_SKIN_VALUES = ["default", "borderlands"];
const RARITY_SKIN_CUTOFF_LABELS = {
  default: { primary: "Gold cutoff", elite: "Diamond cutoff" },
  borderlands: { primary: "Epic cutoff", elite: "Legendary Orange cutoff" }
};
const RARITY_SKIN_CUTOFF_RULES = {
  default: {
    primaryMin: MIN_GOLD_TIER_LIKES,
    eliteMin: MIN_DIAMOND_TIER_LIKES,
    eliteGapFromPrimary: MIN_DIAMOND_TIER_GAP_FROM_GOLD
  },
  borderlands: {
    primaryMin: MIN_BORDERLANDS_EPIC_TIER_LIKES,
    eliteMin: MIN_BORDERLANDS_LEGENDARY_ORANGE_TIER_LIKES,
    eliteGapFromPrimary: MIN_BORDERLANDS_LEGENDARY_ORANGE_GAP_FROM_EPIC
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
    "raritySkin",
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
  const showUpcomingDot = Boolean(
    stored?.showUpcomingDot ?? DEFAULT_SHOW_UPCOMING_DOT
  );
  const raritySkin = normalizeRaritySkin(
    String(stored?.raritySkin ?? DEFAULT_RARITY_SKIN)
  );

  await chrome.storage.sync.set({
    active: isActive,
    position,
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
    raritySkin,
    presetProfile
  });

  return {
    isActive,
    position,
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
    raritySkin,
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
      name: "Glass effect",
      description: "Adjusts how strong the glass-like styling appears."
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
    "show-upcoming-dot-toggle": {
      name: "Show warning dot",
      description: "Shows the red pre-notification dot before comments appear."
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
  raritySkin,
  presetProfile
}) {
  await chrome.runtime.sendMessage({
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
    raritySkin,
    presetProfile
  });
}

document.addEventListener("DOMContentLoaded", async () => {
  const configs = await getConfigs();
  const positionButtons = document.querySelectorAll(".position-button");
  const toggleButton = document.getElementById("togglebtn");

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
  const heatmapEnabledToggle = document.getElementById("heatmap-enabled-toggle");
  const heatmapIntensitySlider = document.getElementById("heatmap-intensity-slider");
  const heatmapIntensityValue = document.getElementById("heatmap-intensity-value");
  const routingEnabledToggle = document.getElementById("routing-enabled-toggle");
  const routingThresholdInput = document.getElementById("routing-threshold-input");
  const routingShortCornerSelect = document.getElementById("routing-short-corner-select");
  const routingLongCornerSelect = document.getElementById("routing-long-corner-select");
  const showLikesToggle = document.getElementById("show-likes-toggle");
  const showUpcomingDotToggle = document.getElementById("show-upcoming-dot-toggle");
  const topLikedCutoffInline = document.getElementById("top-liked-cutoff-inline");
  const thresholdPreviewBadge = document.getElementById("threshold-preview-badge");
  let thresholdPreviewHideTimer = null;
  let thresholdPreviewRequestSeq = 0;

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
  heatmapEnabledToggle.checked = configs.heatmapEnabled;
  heatmapIntensitySlider.value = String(configs.heatmapIntensity);
  routingEnabledToggle.checked = configs.routingEnabled;
  routingThresholdInput.value = String(configs.routingThreshold);
  routingShortCornerSelect.value = configs.routingShortCorner;
  routingLongCornerSelect.value = configs.routingLongCorner;
  showLikesToggle.checked = configs.showLikesInNotifications;
  showUpcomingDotToggle.checked = configs.showUpcomingDot;
  minimalModeToggle.checked = configs.presetProfile === "minimal";
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

    sizeSlider.value = String(Math.round(presetScale * 100));
    durationSlider.value = String(presetDuration);
    radiusSlider.value = String(Math.round(presetRadius));
    avatarSizeSlider.value = String(Math.round(presetAvatar));
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
    if (thresholdPreviewBadge) {
      thresholdPreviewBadge.textContent = `Calculating ${cutoffLabels.primary.toLowerCase()}...`;
      thresholdPreviewBadge.classList.add("visible");
    }
    if (thresholdPreviewHideTimer) {
      clearTimeout(thresholdPreviewHideTimer);
    }

    const videoId = await getActiveYouTubeVideoId();
    if (!videoId) {
      if (thresholdPreviewBadge) {
        thresholdPreviewBadge.textContent = "Open a YouTube video to preview cutoff";
      }
      if (topLikedCutoffInline) {
        topLikedCutoffInline.textContent = `${cutoffLabels.primary}: open a YouTube video`;
      }
      thresholdPreviewHideTimer = setTimeout(() => {
        if (thresholdPreviewBadge) {
          thresholdPreviewBadge.classList.remove("visible");
        }
      }, 1500);
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
      if (thresholdPreviewBadge) {
        thresholdPreviewBadge.textContent = goldText;
      }
      if (topLikedCutoffInline) {
        const diamondText = `${cutoffLabels.elite}: ${flooredDiamondCutoff}+ likes`;
        topLikedCutoffInline.textContent = `${goldText} • ${diamondText}`;
      }
    } else {
      if (thresholdPreviewBadge) {
        thresholdPreviewBadge.textContent = `${cutoffLabels.primary} preview unavailable`;
      }
      if (topLikedCutoffInline) {
        topLikedCutoffInline.textContent = `${cutoffLabels.primary}/${cutoffLabels.elite}: preview unavailable`;
      }
    }
    if (thresholdPreviewHideTimer) {
      clearTimeout(thresholdPreviewHideTimer);
    }
    thresholdPreviewHideTimer = setTimeout(() => {
      if (thresholdPreviewBadge) {
        thresholdPreviewBadge.classList.remove("visible");
      }
    }, 1500);
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
  radiusSlider.addEventListener("input", () => updateRadiusLabel(radiusSlider, radiusValue));
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
    const overlayRadius = clamp(
      Number(radiusSlider.value),
      MIN_OVERLAY_RADIUS,
      MAX_OVERLAY_RADIUS
    );
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
    const raritySkin = normalizeRaritySkin(
      String(raritySkinSelect?.value || DEFAULT_RARITY_SKIN)
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
    const showUpcomingDot = Boolean(showUpcomingDotToggle.checked);
    showLikesToggle.checked = showLikesInNotifications;
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

    await chrome.storage.sync.set(settings);
    await broadcastOverlaySettings(settings);
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
    const overlayRadius = clamp(
      Number(radiusSlider.value || DEFAULT_OVERLAY_RADIUS),
      MIN_OVERLAY_RADIUS,
      MAX_OVERLAY_RADIUS
    );
    const overlayAvatarSize = clamp(
      Number(avatarSizeSlider.value || DEFAULT_OVERLAY_AVATAR_SIZE),
      MIN_OVERLAY_AVATAR_SIZE,
      MAX_OVERLAY_AVATAR_SIZE
    );
    const showLikesInNotifications = getPresetShowLikesDefault(presetProfile);
    showLikesToggle.checked = showLikesInNotifications;

    const presetSettings = {
      overlayScale,
      displayDuration,
      overlayRadius,
      overlayAvatarSize,
      showLikesInNotifications,
      presetProfile
    };

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
  maxCharsInput.addEventListener("change", saveOverlaySettings);
  earlyModeToggle.addEventListener("change", saveOverlaySettings);
  followPlaybackSpeedToggle.addEventListener("change", saveOverlaySettings);
  earlySecondsInput.addEventListener("change", saveOverlaySettings);
  accentEffectSelect.addEventListener("change", saveOverlaySettings);
  reverseStackToggle.addEventListener("change", saveOverlaySettings);
  priorityScoringToggle.addEventListener("change", saveOverlaySettings);
  priorityLikesWeightInput.addEventListener("change", saveOverlaySettings);
  topLikedThresholdSlider.addEventListener("change", saveOverlaySettings);
  popularityModeToggle.addEventListener("change", saveOverlaySettings);
  raritySkinSelect.addEventListener("change", async () => {
    await saveOverlaySettings();
    await showTopLikedCutoffPreview(Number(topLikedThresholdSlider.value));
  });
  heatmapEnabledToggle.addEventListener("change", saveOverlaySettings);
  heatmapIntensitySlider.addEventListener("change", saveOverlaySettings);
  routingEnabledToggle.addEventListener("change", saveOverlaySettings);
  routingThresholdInput.addEventListener("change", saveOverlaySettings);
  routingShortCornerSelect.addEventListener("change", saveOverlaySettings);
  routingLongCornerSelect.addEventListener("change", saveOverlaySettings);
  showLikesToggle.addEventListener("change", saveOverlaySettings);
  showUpcomingDotToggle.addEventListener("change", saveOverlaySettings);
  minimalModeToggle.addEventListener("change", applySelectedPresetAndSave);
  popupDarkToggle.addEventListener("change", async () => {
    const popupDarkMode = Boolean(popupDarkToggle.checked);
    document.body.classList.toggle("dark-mode", popupDarkMode);
    await chrome.storage.sync.set({ popupDarkMode });
  });

});
