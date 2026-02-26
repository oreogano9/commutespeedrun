(function attachTimestampChatterSettingsSchema(globalScope) {
  const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

  const defaults = Object.freeze({
    active: true,
    overlayScale: 1.05,
    displayDuration: 10,
    overlayRadius: 25,
    overlayAvatarSize: 40,
    overlayGlassiness: 20,
    overlayDarkness: 90,
    debugMode: false,
    allowLongMessages: false,
    maxMessageChars: 200,
    earlyModeEnabled: false,
    followPlaybackSpeed: true,
    clickBackContextSeconds: 3,
    earlySeconds: 5,
    timestampAccentEffect: "rubberband",
    reverseStackOrder: false,
    popupDarkMode: true,
    priorityScoringEnabled: true,
    priorityLikesWeight: 1,
    topLikedThresholdPercent: 12,
    heatmapEnabled: true,
    timelineMarkersEnabled: true,
    heatmapIntensity: 500,
    showAuthorInNotifications: true,
    showLikesInNotifications: true,
    showUpcomingDot: true,
    stackOpacityFadeEnabled: true,
    stackOpacityFadeStart: 6,
    stackOpacityFadeStepPercent: 9,
    showRarityLabelInNotifications: true,
    hideTimestampOnlyMessages: true,
    hideMultiTimestampMessages: true,
    experimentalGameSkinAutoEnabled: false,
    commentFetchStartupPages: 1,
    commentFetchMaxPages: 8,
    commentFetchAggressive: false,
    commentFetchAdaptive: true,
    livePageMarkerUpdates: true,
    clearTimestampCacheOnRefresh: false,
    commentScanStartDelaySec: 3,
    presetProfile: "balanced",
    raritySkin: "default",
    rarityLogicMode: "geometric",
    rarityGeometricRatio: 2.23
  });

  const limits = Object.freeze({
    maxMessageChars: Object.freeze({ min: 1, max: 5000 }),
    commentFetchStartupPages: Object.freeze({ min: 1, max: 5 }),
    commentFetchMaxPages: Object.freeze({ min: 1, max: 200 }),
    commentScanStartDelaySec: Object.freeze({ min: 0, max: 20 }),
    clickBackContextSeconds: Object.freeze({ min: 0, max: 30 }),
    heatmapIntensity: Object.freeze({ min: 10, max: 2000 }),
    overlayScale: Object.freeze({ min: 0.5, max: 3.5 }),
    displayDuration: Object.freeze({ min: 1, max: 60 }),
    overlayRadius: Object.freeze({ min: 0, max: 120 }),
    overlayAvatarSize: Object.freeze({ min: 20, max: 84 }),
    overlayGlassiness: Object.freeze({ min: 0, max: 100 }),
    overlayDarkness: Object.freeze({ min: 0, max: 100 }),
    earlySeconds: Object.freeze({ min: 0, max: 60 }),
    priorityLikesWeight: Object.freeze({ min: 0, max: 5 }),
    topLikedThresholdPercent: Object.freeze({ min: 1, max: 50 }),
    stackOpacityFadeStart: Object.freeze({ min: 0, max: 50 }),
    stackOpacityFadeStepPercent: Object.freeze({ min: 0, max: 25 }),
    rarityGeometricRatio: Object.freeze({ min: 1.05, max: 3.0 })
  });

  function normalizeFilterSettings(raw = {}) {
    return {
      allowLongMessages: Boolean(raw.allowLongMessages ?? defaults.allowLongMessages),
      maxMessageChars: clamp(
        Number(raw.maxMessageChars ?? defaults.maxMessageChars),
        limits.maxMessageChars.min,
        limits.maxMessageChars.max
      ),
      hideTimestampOnlyMessages: Boolean(
        raw.hideTimestampOnlyMessages ?? defaults.hideTimestampOnlyMessages
      ),
      hideMultiTimestampMessages: Boolean(
        raw.hideMultiTimestampMessages ?? defaults.hideMultiTimestampMessages
      )
    };
  }

  function normalizeCommentFetchSettings(raw = {}) {
    return {
      commentFetchStartupPages: clamp(
        Number(raw.commentFetchStartupPages ?? defaults.commentFetchStartupPages),
        limits.commentFetchStartupPages.min,
        limits.commentFetchStartupPages.max
      ),
      commentFetchMaxPages: clamp(
        Number(raw.commentFetchMaxPages ?? defaults.commentFetchMaxPages),
        limits.commentFetchMaxPages.min,
        limits.commentFetchMaxPages.max
      ),
      commentFetchAggressive: Boolean(
        raw.commentFetchAggressive ?? defaults.commentFetchAggressive
      ),
      commentFetchAdaptive: Boolean(raw.commentFetchAdaptive ?? defaults.commentFetchAdaptive),
      livePageMarkerUpdates: Boolean(raw.livePageMarkerUpdates ?? defaults.livePageMarkerUpdates)
    };
  }

  function normalizeQuickVisibilitySettings(raw = {}) {
    return {
      heatmapEnabled: Boolean(raw.heatmapEnabled ?? defaults.heatmapEnabled),
      timelineMarkersEnabled: Boolean(raw.timelineMarkersEnabled ?? defaults.timelineMarkersEnabled),
      showUpcomingDot: Boolean(raw.showUpcomingDot ?? defaults.showUpcomingDot),
      popupDarkMode: Boolean(raw.popupDarkMode ?? defaults.popupDarkMode)
    };
  }

  const schema = Object.freeze({
    defaults,
    limits,
    clamp,
    normalizeFilterSettings,
    normalizeCommentFetchSettings,
    normalizeQuickVisibilitySettings
  });

  globalScope.TimestampChatterSettingsSchema = schema;
})(globalThis);
