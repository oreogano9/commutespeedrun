"use strict";

(() => {
  const RARITY_SKIN_SCHEMA_VERSION = 2;
  const LOCAL_CATALOG_KEY = "raritySkinCatalogV2";
  const LOCAL_CATALOG_REVISION_KEY = "raritySkinCatalogRevision";
  const SYNC_ACTIVE_SKIN_ID_KEY = "activeRaritySkinId";
  const SYNC_HIDDEN_TIERS_BY_SKIN_ID_KEY = "hiddenRarityTiersBySkinId";
  const LEGACY_ACTIVE_SKIN_ID_KEY = "raritySkin";
  const LEGACY_HIDDEN_TIERS_KEY = "hiddenRarityTiersBySkin";
  const DEFAULT_STYLE_FAMILY = "glass";
  const STYLE_FAMILIES = ["glass", "flat", "solid", "pixel"];
  const EFFECT_TOKENS = ["none", "sheen", "glow", "pulse", "rainbow-cycle"];

  const BUILT_IN_SKINS = [
    {
      id: "default",
      name: "Default",
      builtIn: true,
      styleFamily: "glass",
      style: {
        borderEnabled: true,
        borderWidth: 1,
        radius: 25,
        packOpacity: 0.48
      },
      nonPopularityPrimaryTierKey: "gold",
      nonPopularityEliteTierKey: "platinum",
      tiers: [
        {
          key: "silver",
          label: "Silver",
          bodyColor: "#B5B5B5",
          textColor: "#FFFFFF",
          borderColor: "#D0D0D0",
          markerColor: "#B5B5B5",
          markerWidthPx: 5,
          markerHeightPct: 120,
          markerOffsetTopPct: -10,
          percentileFactor: 1.8,
          minLikes: 0,
          minGapFromPrevious: 0,
          heatmapWeight: 1,
          durationMultiplier: 1,
          effects: ["none"]
        },
        {
          key: "gold",
          label: "Gold",
          bodyColor: "#FFD14D",
          textColor: "#3A2A00",
          borderColor: "#F5E3A8",
          markerColor: "#FFD14D",
          markerWidthPx: 9,
          markerHeightPct: 188,
          markerOffsetTopPct: -44,
          percentileFactor: 1,
          minLikes: 15,
          minGapFromPrevious: 1,
          heatmapWeight: 2,
          durationMultiplier: 1.12,
          effects: ["glow", "sheen"]
        },
        {
          key: "platinum",
          label: "Platinum",
          bodyColor: "#9AE7FF",
          textColor: "#03222E",
          borderColor: "#C9F3FF",
          markerColor: "#9AE7FF",
          markerWidthPx: 13,
          markerHeightPct: 236,
          markerOffsetTopPct: -68,
          percentileFactor: 0.72,
          minLikes: 28,
          minGapFromPrevious: 8,
          minGapFromPrimary: 8,
          heatmapWeight: 2.55,
          durationMultiplier: 1.18,
          effects: ["glow", "sheen"]
        }
      ]
    },
    {
      id: "borderlands",
      name: "Borderlands",
      builtIn: true,
      styleFamily: "glass",
      style: {
        borderEnabled: true,
        borderWidth: 1,
        radius: 25,
        packOpacity: 0.48
      },
      nonPopularityPrimaryTierKey: "epic",
      nonPopularityEliteTierKey: "legendary-dark-orange",
      tiers: [
        { key: "common", label: "Common", bodyColor: "#FFFFFF", textColor: "#1A1A1A", borderColor: "#D8D8D8", markerColor: "#FFFFFF", markerWidthPx: 5, markerHeightPct: 118, markerOffsetTopPct: -9, percentileFactor: 2.8, minLikes: 0, minGapFromPrevious: 0, heatmapWeight: 1, durationMultiplier: 1, effects: ["none"] },
        { key: "uncommon", label: "Uncommon", bodyColor: "#1EFF00", textColor: "#022100", borderColor: "#9AF989", markerColor: "#1EFF00", markerWidthPx: 6, markerHeightPct: 130, markerOffsetTopPct: -15, percentileFactor: 2.2, minLikes: 5, minGapFromPrevious: 2, heatmapWeight: 1.45, durationMultiplier: 1.06, effects: ["none"] },
        { key: "rare", label: "Rare", bodyColor: "#0070DD", textColor: "#DDEEFF", borderColor: "#5CA7F0", markerColor: "#0070DD", markerWidthPx: 7, markerHeightPct: 142, markerOffsetTopPct: -21, percentileFactor: 1.55, minLikes: 11, minGapFromPrevious: 3, heatmapWeight: 1.9, durationMultiplier: 1.1, effects: ["none"] },
        { key: "epic", label: "Epic", bodyColor: "#A335EE", textColor: "#F3E6FF", borderColor: "#C893F5", markerColor: "#A335EE", markerWidthPx: 8, markerHeightPct: 154, markerOffsetTopPct: -27, percentileFactor: 1, minLikes: 16, minGapFromPrevious: 3, heatmapWeight: 2.45, durationMultiplier: 1.14, effects: ["sheen"] },
        { key: "legendary-yellow", label: "Legendary (yellow)", bodyColor: "#FFD100", textColor: "#3A2B00", borderColor: "#FFE49C", markerColor: "#FFD100", markerWidthPx: 10, markerHeightPct: 182, markerOffsetTopPct: -41, percentileFactor: 0.58, minLikes: 50, minGapFromPrevious: 6, minGapFromPrimary: 8, heatmapWeight: 3.35, durationMultiplier: 1.2, effects: ["glow", "sheen"] },
        { key: "legendary-orange", label: "Legendary (orange)", bodyColor: "#FF8000", textColor: "#301300", borderColor: "#FFC896", markerColor: "#FF8000", markerWidthPx: 12, markerHeightPct: 216, markerOffsetTopPct: -58, percentileFactor: 0.42, minLikes: 61, minGapFromPrevious: 6, minGapFromPrimary: 10, heatmapWeight: 3.85, durationMultiplier: 1.24, effects: ["glow", "sheen"] },
        { key: "legendary-dark-orange", label: "Legendary (dark orange)", bodyColor: "#CC5A00", textColor: "#FFEBDC", borderColor: "#E79058", markerColor: "#CC5A00", markerWidthPx: 14, markerHeightPct: 246, markerOffsetTopPct: -73, percentileFactor: 0.3, minLikes: 66, minGapFromPrevious: 4, minGapFromPrimary: 12, heatmapWeight: 4.25, durationMultiplier: 1.29, effects: ["glow", "sheen"] },
        { key: "pearlescent", label: "Pearlescent", bodyColor: "#66FFFF", textColor: "#012E2E", borderColor: "#BCFFFF", markerColor: "#66FFFF", markerWidthPx: 16, markerHeightPct: 280, markerOffsetTopPct: -90, percentileFactor: 0.18, minLikes: 101, minGapFromPrevious: 8, minGapFromPrimary: 20, heatmapWeight: 4.85, durationMultiplier: 1.35, effects: ["glow", "pulse"] }
      ]
    },
    {
      id: "borderlands2",
      name: "Borderlands 2",
      builtIn: true,
      styleFamily: "glass",
      style: {
        borderEnabled: true,
        borderWidth: 1,
        radius: 25,
        packOpacity: 0.48
      },
      nonPopularityPrimaryTierKey: "epic",
      nonPopularityEliteTierKey: "pearlescent",
      tiers: [
        { key: "common", label: "Common", bodyColor: "#FFFFFF", textColor: "#1A1A1A", borderColor: "#D8D8D8", markerColor: "#FFFFFF", markerWidthPx: 5, markerHeightPct: 118, markerOffsetTopPct: -9, percentileFactor: 3.2, minLikes: 0, minGapFromPrevious: 0, heatmapWeight: 1, durationMultiplier: 1, effects: ["none"] },
        { key: "uncommon", label: "Uncommon", bodyColor: "#1EFF00", textColor: "#022100", borderColor: "#9AF989", markerColor: "#1EFF00", markerWidthPx: 6, markerHeightPct: 130, markerOffsetTopPct: -15, percentileFactor: 2.6, minLikes: 5, minGapFromPrevious: 2, heatmapWeight: 1.35, durationMultiplier: 1.05, effects: ["none"] },
        { key: "rare", label: "Rare", bodyColor: "#0070DD", textColor: "#DDEEFF", borderColor: "#5CA7F0", markerColor: "#0070DD", markerWidthPx: 7, markerHeightPct: 142, markerOffsetTopPct: -21, percentileFactor: 2.1, minLikes: 11, minGapFromPrevious: 2, heatmapWeight: 1.7, durationMultiplier: 1.08, effects: ["none"] },
        { key: "cursed", label: "Cursed", bodyColor: "#4B0082", textColor: "#F0E5FF", borderColor: "#9A72B8", markerColor: "#4B0082", markerWidthPx: 8, markerHeightPct: 154, markerOffsetTopPct: -27, percentileFactor: 1.8, minLikes: 16, minGapFromPrevious: 3, heatmapWeight: 2.05, durationMultiplier: 1.11, effects: ["none"] },
        { key: "epic", label: "Epic", bodyColor: "#A335EE", textColor: "#F3E6FF", borderColor: "#C893F5", markerColor: "#A335EE", markerWidthPx: 9, markerHeightPct: 168, markerOffsetTopPct: -34, percentileFactor: 1.5, minLikes: 24, minGapFromPrevious: 3, heatmapWeight: 2.45, durationMultiplier: 1.14, effects: ["sheen"] },
        { key: "e-tech", label: "E-tech", bodyColor: "#FF33CC", textColor: "#3A0030", borderColor: "#FF9EEA", markerColor: "#FF33CC", markerWidthPx: 10, markerHeightPct: 182, markerOffsetTopPct: -41, percentileFactor: 1.2, minLikes: 34, minGapFromPrevious: 4, heatmapWeight: 2.85, durationMultiplier: 1.18, effects: ["sheen"] },
        { key: "gemstone", label: "Gemstone", bodyColor: "#00FFD5", textColor: "#00372E", borderColor: "#8DFFF0", markerColor: "#00FFD5", markerWidthPx: 11, markerHeightPct: 198, markerOffsetTopPct: -49, percentileFactor: 0.95, minLikes: 46, minGapFromPrevious: 4, heatmapWeight: 3.25, durationMultiplier: 1.21, effects: ["sheen"] },
        { key: "legendary", label: "Legendary", bodyColor: "#FF8000", textColor: "#301300", borderColor: "#FFC896", markerColor: "#FF8000", markerWidthPx: 12, markerHeightPct: 216, markerOffsetTopPct: -58, percentileFactor: 0.7, minLikes: 60, minGapFromPrevious: 6, minGapFromPrimary: 8, heatmapWeight: 3.65, durationMultiplier: 1.24, effects: ["glow", "sheen"] },
        { key: "effervescent", label: "Effervescent", bodyColor: "#FF4FD8", textColor: "#3E0031", borderColor: "#FFC0F2", markerColor: "#FF4FD8", markerWidthPx: 14, markerHeightPct: 246, markerOffsetTopPct: -73, percentileFactor: 0.52, minLikes: 72, minGapFromPrevious: 6, minGapFromPrimary: 12, heatmapWeight: 4.05, durationMultiplier: 1.28, effects: ["rainbow-cycle", "glow"] },
        { key: "seraph", label: "Seraph", bodyColor: "#FF69B4", textColor: "#3D0023", borderColor: "#FFC2E2", markerColor: "#FF69B4", markerWidthPx: 16, markerHeightPct: 270, markerOffsetTopPct: -85, percentileFactor: 0.34, minLikes: 86, minGapFromPrevious: 7, minGapFromPrimary: 16, heatmapWeight: 4.45, durationMultiplier: 1.32, effects: ["glow", "pulse"] },
        { key: "pearlescent", label: "Pearlescent", bodyColor: "#66FFFF", textColor: "#012E2E", borderColor: "#BCFFFF", markerColor: "#66FFFF", markerWidthPx: 18, markerHeightPct: 304, markerOffsetTopPct: -102, percentileFactor: 0.18, minLikes: 101, minGapFromPrevious: 9, minGapFromPrimary: 20, heatmapWeight: 4.95, durationMultiplier: 1.36, effects: ["glow", "pulse"] }
      ]
    },
    {
      id: "minecraft",
      name: "Minecraft",
      builtIn: true,
      styleFamily: "pixel",
      style: {
        borderEnabled: true,
        borderWidth: 4,
        radius: 25,
        packOpacity: 0.4
      },
      nonPopularityPrimaryTierKey: "rare",
      nonPopularityEliteTierKey: "epic",
      tiers: [
        { key: "common", label: "Common", bodyColor: "#F2F2F2", textColor: "#2B2B2B", borderColor: "#C6C6C6", markerColor: "#F2F2F2", markerWidthPx: 5, markerHeightPct: 118, markerOffsetTopPct: -9, percentileFactor: 1.8, minLikes: 0, minGapFromPrevious: 0, heatmapWeight: 1, durationMultiplier: 1, effects: ["none"] },
        { key: "uncommon", label: "Uncommon", bodyColor: "#FFF4B3", textColor: "#3A2F00", borderColor: "#D6B400", markerColor: "#FFD700", markerWidthPx: 7, markerHeightPct: 146, markerOffsetTopPct: -23, percentileFactor: 1.25, minLikes: 5, minGapFromPrevious: 2, heatmapWeight: 1.45, durationMultiplier: 1.06, effects: ["none"] },
        { key: "rare", label: "Rare", bodyColor: "#A8FFFF", textColor: "#003C3C", borderColor: "#00B3B3", markerColor: "#55FFFF", markerWidthPx: 10, markerHeightPct: 184, markerOffsetTopPct: -42, percentileFactor: 0.85, minLikes: 11, minGapFromPrevious: 3, heatmapWeight: 1.95, durationMultiplier: 1.12, effects: ["none"] },
        { key: "epic", label: "Epic", bodyColor: "#FFB3FF", textColor: "#3C003C", borderColor: "#B300B3", markerColor: "#FF55FF", markerWidthPx: 13, markerHeightPct: 236, markerOffsetTopPct: -68, percentileFactor: 0.52, minLikes: 16, minGapFromPrevious: 4, minGapFromPrimary: 5, heatmapWeight: 2.55, durationMultiplier: 1.18, effects: ["none"] }
      ]
    },
    {
      id: "animalcrossing",
      name: "Animal Crossing",
      builtIn: true,
      styleFamily: "flat",
      style: {
        borderEnabled: false,
        borderWidth: 0,
        radius: 25,
        packOpacity: 0.4
      },
      nonPopularityPrimaryTierKey: "blossom",
      nonPopularityEliteTierKey: "sunny",
      tiers: [
        { key: "paper", label: "Paper", bodyColor: "#F7F4EE", textColor: "#4A4A45", borderColor: "#E2DDD6", markerColor: "#F7F4EE", markerWidthPx: 5, markerHeightPct: 120, markerOffsetTopPct: -10, percentileFactor: 2.2, minLikes: 0, minGapFromPrevious: 0, heatmapWeight: 1, durationMultiplier: 1, effects: ["none"] },
        { key: "leaf", label: "Leaf", bodyColor: "#7ED6A2", textColor: "#1F2F28", borderColor: "#5DBC87", markerColor: "#7ED6A2", markerWidthPx: 7, markerHeightPct: 150, markerOffsetTopPct: -25, percentileFactor: 1.45, minLikes: 5, minGapFromPrevious: 2, heatmapWeight: 1.35, durationMultiplier: 1.05, effects: ["none"] },
        { key: "blossom", label: "Blossom", bodyColor: "#FF9ACB", textColor: "#3F2A33", borderColor: "#E77CAF", markerColor: "#FF9ACB", markerWidthPx: 9, markerHeightPct: 180, markerOffsetTopPct: -40, percentileFactor: 1, minLikes: 11, minGapFromPrevious: 3, heatmapWeight: 1.8, durationMultiplier: 1.1, effects: ["none"] },
        { key: "sky", label: "Sky", bodyColor: "#6EC6FF", textColor: "#1E2B36", borderColor: "#4AAEDD", markerColor: "#6EC6FF", markerWidthPx: 11, markerHeightPct: 220, markerOffsetTopPct: -60, percentileFactor: 0.72, minLikes: 16, minGapFromPrevious: 3, heatmapWeight: 2.2, durationMultiplier: 1.14, effects: ["none"] },
        { key: "sunny", label: "Sunny", bodyColor: "#FFD36A", textColor: "#3A2E14", borderColor: "#EAB94E", markerColor: "#FFD36A", markerWidthPx: 13, markerHeightPct: 250, markerOffsetTopPct: -75, percentileFactor: 0.45, minLikes: 24, minGapFromPrevious: 4, minGapFromPrimary: 8, heatmapWeight: 2.75, durationMultiplier: 1.2, effects: ["none"] }
      ]
    }
  ];

  function clamp(value, min, max) {
    return Math.min(max, Math.max(min, Number(value)));
  }

  function toSlug(value, fallback = "skin") {
    const slug = String(value || "")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
    return slug || fallback;
  }

  function capitalizeWords(value) {
    return String(value || "")
      .replace(/[-_]+/g, " ")
      .replace(/\s+/g, " ")
      .trim()
      .replace(/\b\w/g, (c) => c.toUpperCase());
  }

  function normalizeHexColor(value, fallback = "#FFFFFF") {
    const raw = String(value || "").trim().toUpperCase();
    if (/^#[0-9A-F]{6}$/.test(raw)) {
      return raw;
    }
    if (/^#[0-9A-F]{3}$/.test(raw)) {
      return `#${raw[1]}${raw[1]}${raw[2]}${raw[2]}${raw[3]}${raw[3]}`;
    }
    return fallback;
  }

  function hexToRgb(hexColor, fallback = "255 255 255") {
    const hex = normalizeHexColor(hexColor, "#FFFFFF");
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    if (![r, g, b].every(Number.isFinite)) {
      return fallback;
    }
    return `${r} ${g} ${b}`;
  }

  function deepClone(value) {
    return JSON.parse(JSON.stringify(value));
  }

  function defaultTierShape(index = 0) {
    return {
      key: `tier-${index + 1}`,
      label: `Tier ${index + 1}`,
      bodyColor: "#FFFFFF",
      textColor: "#111111",
      borderColor: "#DDDDDD",
      markerColor: "#FFFFFF",
      markerWidthPx: Math.max(5, 5 + index * 2),
      markerHeightPct: Math.max(110, 110 + index * 24),
      markerOffsetTopPct: -Math.max(8, 8 + index * 12),
      percentileFactor: 1,
      minLikes: Math.max(0, index * 5),
      minGapFromPrevious: index <= 0 ? 0 : 1,
      minGapFromPrimary: null,
      heatmapWeight: Math.max(1, 1 + index * 0.4),
      durationMultiplier: Math.max(1, 1 + index * 0.05),
      effects: index > 0 ? ["sheen"] : ["none"]
    };
  }

  function normalizeEffectTokens(value) {
    const input = Array.isArray(value) ? value : [value];
    const tokens = input
      .map((entry) => String(entry || "").trim().toLowerCase())
      .filter((entry) => EFFECT_TOKENS.includes(entry));
    if (tokens.length === 0) {
      return ["none"];
    }
    const unique = [...new Set(tokens)];
    if (unique.includes("none") && unique.length > 1) {
      return unique.filter((entry) => entry !== "none");
    }
    return unique;
  }

  function normalizeTier(tier, index = 0, usedKeys = new Set()) {
    const fallback = defaultTierShape(index);
    const baseKey = toSlug(tier?.key || tier?.label, fallback.key);
    let key = baseKey;
    let suffix = 2;
    while (usedKeys.has(key)) {
      key = `${baseKey}-${suffix}`;
      suffix += 1;
    }
    usedKeys.add(key);

    return {
      key,
      label: String(tier?.label || capitalizeWords(key) || fallback.label).slice(0, 64),
      bodyColor: normalizeHexColor(tier?.bodyColor, fallback.bodyColor),
      textColor: normalizeHexColor(tier?.textColor, fallback.textColor),
      borderColor: normalizeHexColor(tier?.borderColor, fallback.borderColor),
      markerColor: normalizeHexColor(tier?.markerColor, tier?.bodyColor || fallback.markerColor),
      markerWidthPx: clamp(tier?.markerWidthPx ?? fallback.markerWidthPx, 3, 30),
      markerHeightPct: clamp(tier?.markerHeightPct ?? fallback.markerHeightPct, 80, 420),
      markerOffsetTopPct: clamp(
        tier?.markerOffsetTopPct ?? fallback.markerOffsetTopPct,
        -180,
        40
      ),
      percentileFactor: clamp(tier?.percentileFactor ?? fallback.percentileFactor, 0.05, 8),
      minLikes: clamp(tier?.minLikes ?? fallback.minLikes, 0, 1000000),
      minGapFromPrevious: clamp(
        tier?.minGapFromPrevious ?? fallback.minGapFromPrevious,
        0,
        1000000
      ),
      minGapFromPrimary:
        tier?.minGapFromPrimary === null || tier?.minGapFromPrimary === undefined
          ? null
          : clamp(tier.minGapFromPrimary, 0, 1000000),
      heatmapWeight: clamp(tier?.heatmapWeight ?? fallback.heatmapWeight, 0.1, 100),
      durationMultiplier: clamp(
        tier?.durationMultiplier ?? fallback.durationMultiplier,
        0.1,
        10
      ),
      effects: normalizeEffectTokens(tier?.effects)
    };
  }

  function normalizeSkinStyle(style = {}, fallback = {}) {
    const merged = {
      borderEnabled:
        style?.borderEnabled === undefined
          ? fallback?.borderEnabled !== false
          : Boolean(style.borderEnabled),
      borderWidth: clamp(style?.borderWidth ?? fallback?.borderWidth ?? 1, 0, 12),
      radius: clamp(style?.radius ?? fallback?.radius ?? 25, 0, 120),
      packOpacity: clamp(style?.packOpacity ?? fallback?.packOpacity ?? 0.48, 0.08, 1)
    };
    return merged;
  }

  function normalizeSkin(skin, index = 0, usedSkinIds = new Set()) {
    const fallback = BUILT_IN_SKINS[index] || BUILT_IN_SKINS[0];
    const suggestedId = toSlug(skin?.id || skin?.name, `skin-${index + 1}`);
    let id = suggestedId;
    let suffix = 2;
    while (usedSkinIds.has(id)) {
      id = `${suggestedId}-${suffix}`;
      suffix += 1;
    }
    usedSkinIds.add(id);

    const styleFamily = STYLE_FAMILIES.includes(String(skin?.styleFamily || "").toLowerCase())
      ? String(skin.styleFamily).toLowerCase()
      : fallback?.styleFamily || DEFAULT_STYLE_FAMILY;

    const inputTiers = Array.isArray(skin?.tiers) ? skin.tiers : fallback?.tiers || [];
    const usedTierKeys = new Set();
    const tiers = inputTiers.map((tier, tierIndex) =>
      normalizeTier(tier, tierIndex, usedTierKeys)
    );
    const safeTiers = tiers.length > 0 ? tiers : [normalizeTier(defaultTierShape(0), 0, usedTierKeys)];
    const tierKeys = safeTiers.map((tier) => tier.key);

    const primary =
      tierKeys.includes(skin?.nonPopularityPrimaryTierKey) && skin?.nonPopularityPrimaryTierKey
        ? skin.nonPopularityPrimaryTierKey
        : tierKeys[Math.min(1, tierKeys.length - 1)];
    const elite =
      tierKeys.includes(skin?.nonPopularityEliteTierKey) && skin?.nonPopularityEliteTierKey
        ? skin.nonPopularityEliteTierKey
        : tierKeys[tierKeys.length - 1];

    return {
      id,
      name: String(skin?.name || capitalizeWords(id)).slice(0, 64),
      builtIn: Boolean(skin?.builtIn),
      styleFamily,
      style: normalizeSkinStyle(skin?.style, fallback?.style),
      nonPopularityPrimaryTierKey: primary,
      nonPopularityEliteTierKey: elite,
      tiers: safeTiers
    };
  }

  function normalizeCatalog(rawCatalog) {
    const source =
      rawCatalog && typeof rawCatalog === "object" && !Array.isArray(rawCatalog)
        ? rawCatalog
        : {};
    const sourceSkins = Array.isArray(source.skins) ? source.skins : BUILT_IN_SKINS;
    const usedSkinIds = new Set();
    const skins = sourceSkins.map((skin, index) => normalizeSkin(skin, index, usedSkinIds));
    return {
      schemaVersion: RARITY_SKIN_SCHEMA_VERSION,
      skins: skins.length > 0 ? skins : BUILT_IN_SKINS.map((skin, index) => normalizeSkin(skin, index, usedSkinIds))
    };
  }

  function createBuiltInCatalog() {
    return normalizeCatalog({
      schemaVersion: RARITY_SKIN_SCHEMA_VERSION,
      skins: deepClone(BUILT_IN_SKINS)
    });
  }

  function getSkinIds(catalog) {
    const normalized = normalizeCatalog(catalog);
    return normalized.skins.map((skin) => skin.id);
  }

  function getSkinById(catalog, skinId, fallbackId = "default") {
    const normalized = normalizeCatalog(catalog);
    const target = String(skinId || "");
    const found = normalized.skins.find((skin) => skin.id === target);
    if (found) {
      return found;
    }
    const fallback = normalized.skins.find((skin) => skin.id === fallbackId);
    return fallback || normalized.skins[0] || null;
  }

  function normalizeActiveSkinId(skinId, catalog, fallbackId = "default") {
    const skin = getSkinById(catalog, skinId, fallbackId);
    return skin?.id || fallbackId;
  }

  function normalizeHiddenTiersBySkinId(value, catalog) {
    const source =
      value && typeof value === "object" && !Array.isArray(value)
        ? value
        : {};
    const normalized = normalizeCatalog(catalog);
    const result = {};
    normalized.skins.forEach((skin) => {
      const map =
        source[skin.id] && typeof source[skin.id] === "object" && !Array.isArray(source[skin.id])
          ? source[skin.id]
          : {};
      result[skin.id] = {};
      skin.tiers.forEach((tier) => {
        result[skin.id][tier.key] = Boolean(map[tier.key]);
      });
    });
    return result;
  }

  function getTopTierLabels(skin) {
    const tiers = Array.isArray(skin?.tiers) ? skin.tiers : [];
    if (tiers.length === 0) {
      return { primary: "Primary cutoff", elite: "Elite cutoff" };
    }
    const primary = tiers[Math.min(1, tiers.length - 1)]?.label || "Primary";
    const elite = tiers[tiers.length - 1]?.label || primary;
    return {
      primary: `${primary} cutoff`,
      elite: `${elite} cutoff`
    };
  }

  function getTopTierRules(skin) {
    const tiers = Array.isArray(skin?.tiers) ? skin.tiers : [];
    const primaryTier = tiers[Math.min(1, tiers.length - 1)] || tiers[0];
    const eliteTier = tiers[tiers.length - 1] || primaryTier;
    const primaryMin = Number(primaryTier?.minLikes || 0);
    const eliteMin = Number(eliteTier?.minLikes || primaryMin);
    const eliteGapFromPrimary =
      Number.isFinite(Number(eliteTier?.minGapFromPrimary)) && eliteTier?.minGapFromPrimary !== null
        ? Number(eliteTier.minGapFromPrimary)
        : Math.max(0, Number(eliteTier?.minGapFromPrevious || 0));
    return {
      primaryMin,
      eliteMin,
      eliteGapFromPrimary
    };
  }

  function createPreviewRows(skin, hiddenMap) {
    const tiers = Array.isArray(skin?.tiers) ? skin.tiers : [];
    return tiers.map((tier) => ({
      key: tier.key,
      label: tier.label,
      color: tier.bodyColor,
      hidden: Boolean(hiddenMap?.[tier.key])
    }));
  }

  function createTierFromTemplate(template, index = 0, existingKeys = new Set()) {
    return normalizeTier(template || defaultTierShape(index), index, existingKeys);
  }

  function addTierToSkin(skin, template = null) {
    const normalizedSkin = normalizeSkin(skin, 0, new Set());
    const used = new Set(normalizedSkin.tiers.map((tier) => tier.key));
    const newTier = createTierFromTemplate(
      template || defaultTierShape(normalizedSkin.tiers.length),
      normalizedSkin.tiers.length,
      used
    );
    normalizedSkin.tiers.push(newTier);
    if (!normalizedSkin.nonPopularityPrimaryTierKey) {
      normalizedSkin.nonPopularityPrimaryTierKey =
        normalizedSkin.tiers[Math.min(1, normalizedSkin.tiers.length - 1)].key;
    }
    normalizedSkin.nonPopularityEliteTierKey =
      normalizedSkin.tiers[normalizedSkin.tiers.length - 1].key;
    return normalizeSkin(normalizedSkin, 0, new Set());
  }

  function removeTierFromSkin(skin, tierKey) {
    const normalizedSkin = normalizeSkin(skin, 0, new Set());
    normalizedSkin.tiers = normalizedSkin.tiers.filter((tier) => tier.key !== tierKey);
    if (normalizedSkin.tiers.length === 0) {
      normalizedSkin.tiers = [normalizeTier(defaultTierShape(0), 0, new Set())];
    }
    const keys = normalizedSkin.tiers.map((tier) => tier.key);
    if (!keys.includes(normalizedSkin.nonPopularityPrimaryTierKey)) {
      normalizedSkin.nonPopularityPrimaryTierKey = keys[Math.min(1, keys.length - 1)];
    }
    if (!keys.includes(normalizedSkin.nonPopularityEliteTierKey)) {
      normalizedSkin.nonPopularityEliteTierKey = keys[keys.length - 1];
    }
    return normalizeSkin(normalizedSkin, 0, new Set());
  }

  function moveTierInSkin(skin, tierKey, direction) {
    const normalizedSkin = normalizeSkin(skin, 0, new Set());
    const tiers = [...normalizedSkin.tiers];
    const index = tiers.findIndex((tier) => tier.key === tierKey);
    if (index < 0) {
      return normalizedSkin;
    }
    const nextIndex = clamp(index + (direction === "up" ? -1 : 1), 0, tiers.length - 1);
    if (nextIndex === index) {
      return normalizedSkin;
    }
    const [removed] = tiers.splice(index, 1);
    tiers.splice(nextIndex, 0, removed);
    normalizedSkin.tiers = tiers;
    return normalizeSkin(normalizedSkin, 0, new Set());
  }

  function upsertSkin(catalog, skinInput, preferredId = null) {
    const normalizedCatalog = normalizeCatalog(catalog);
    const currentIds = new Set(normalizedCatalog.skins.map((skin) => skin.id));
    const incomingBase = normalizeSkin(
      { ...skinInput, id: preferredId || skinInput?.id },
      normalizedCatalog.skins.length,
      new Set()
    );
    const targetId = String(preferredId || incomingBase.id);
    const existingIndex = normalizedCatalog.skins.findIndex((skin) => skin.id === targetId);
    if (existingIndex >= 0) {
      normalizedCatalog.skins[existingIndex] = normalizeSkin(
        { ...incomingBase, id: targetId },
        existingIndex,
        new Set(normalizedCatalog.skins.filter((_, i) => i !== existingIndex).map((s) => s.id))
      );
      return normalizedCatalog;
    }

    let id = incomingBase.id;
    let suffix = 2;
    while (currentIds.has(id)) {
      id = `${incomingBase.id}-${suffix}`;
      suffix += 1;
    }
    normalizedCatalog.skins.push(normalizeSkin({ ...incomingBase, id }, normalizedCatalog.skins.length, new Set(normalizedCatalog.skins.map((s) => s.id))));
    return normalizeCatalog(normalizedCatalog);
  }

  function deleteSkin(catalog, skinId) {
    const normalized = normalizeCatalog(catalog);
    normalized.skins = normalized.skins.filter((skin) => skin.id !== skinId);
    if (normalized.skins.length === 0) {
      return createBuiltInCatalog();
    }
    return normalizeCatalog(normalized);
  }

  function renameSkinId(catalog, oldId, newId) {
    const normalized = normalizeCatalog(catalog);
    const targetIndex = normalized.skins.findIndex((skin) => skin.id === oldId);
    if (targetIndex < 0) {
      return normalizeCatalog(normalized);
    }
    const slug = toSlug(newId, oldId);
    const used = new Set(normalized.skins.filter((_, idx) => idx !== targetIndex).map((skin) => skin.id));
    let nextId = slug;
    let suffix = 2;
    while (used.has(nextId)) {
      nextId = `${slug}-${suffix}`;
      suffix += 1;
    }
    normalized.skins[targetIndex].id = nextId;
    return normalizeCatalog(normalized);
  }

  function migrateLegacyState(legacy = {}) {
    const catalog = createBuiltInCatalog();
    const activeSkinId = normalizeActiveSkinId(
      legacy?.[SYNC_ACTIVE_SKIN_ID_KEY] || legacy?.[LEGACY_ACTIVE_SKIN_ID_KEY] || "default",
      catalog,
      "default"
    );
    const hidden = normalizeHiddenTiersBySkinId(
      legacy?.[SYNC_HIDDEN_TIERS_BY_SKIN_ID_KEY] || legacy?.[LEGACY_HIDDEN_TIERS_KEY] || {},
      catalog
    );
    return {
      catalog,
      activeSkinId,
      hiddenBySkinId: hidden
    };
  }

  function sanitizeImportedCatalogPayload(payload) {
    if (!payload || typeof payload !== "object") {
      throw new Error("Invalid import payload");
    }
    const rawSkins = Array.isArray(payload.skins) ? payload.skins : Array.isArray(payload.catalog?.skins) ? payload.catalog.skins : null;
    if (!rawSkins || rawSkins.length === 0) {
      throw new Error("No skins found in import payload");
    }
    return normalizeCatalog({
      schemaVersion: payload.schemaVersion || RARITY_SKIN_SCHEMA_VERSION,
      skins: rawSkins
    });
  }

  const api = {
    RARITY_SKIN_SCHEMA_VERSION,
    LOCAL_CATALOG_KEY,
    LOCAL_CATALOG_REVISION_KEY,
    SYNC_ACTIVE_SKIN_ID_KEY,
    SYNC_HIDDEN_TIERS_BY_SKIN_ID_KEY,
    LEGACY_ACTIVE_SKIN_ID_KEY,
    LEGACY_HIDDEN_TIERS_KEY,
    DEFAULT_STYLE_FAMILY,
    STYLE_FAMILIES,
    EFFECT_TOKENS,
    clamp,
    toSlug,
    capitalizeWords,
    normalizeHexColor,
    hexToRgb,
    deepClone,
    defaultTierShape,
    normalizeEffectTokens,
    normalizeTier,
    normalizeSkinStyle,
    normalizeSkin,
    normalizeCatalog,
    createBuiltInCatalog,
    getSkinIds,
    getSkinById,
    normalizeActiveSkinId,
    normalizeHiddenTiersBySkinId,
    getTopTierLabels,
    getTopTierRules,
    createPreviewRows,
    createTierFromTemplate,
    addTierToSkin,
    removeTierFromSkin,
    moveTierInSkin,
    upsertSkin,
    deleteSkin,
    renameSkinId,
    migrateLegacyState,
    sanitizeImportedCatalogPayload
  };

  globalThis.RaritySkinsShared = api;
})();

