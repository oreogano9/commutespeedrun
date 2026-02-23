(function () {
  const rarityShared = globalThis.RaritySkinsShared || null;

  const THEME_CATALOG_V2_KEY = "themeCatalogV2";
  const THEME_CATALOG_V2_REVISION_KEY = "themeCatalogV2Revision";
  const THEME_CATALOG_V2_SCHEMA_VERSION_KEY = "themeCatalogV2SchemaVersion";
  const THEME_CATALOG_V2_SCHEMA_VERSION = 1;

  const seedThemes = [
    {
      id: "default",
      name: "Default",
      description: "Classic medal-tier progression.",
      tiers: [
        { id: "1", name: "Bronze", body: "#3d2315", border: "#CD7F32", text: "#ffffff", radius: 8, borderWidth: 2, opacity: 90, textOpacity: 100, effect: "none" },
        { id: "2", name: "Silver", body: "#2b2b2b", border: "#C0C0C0", text: "#ffffff", radius: 8, borderWidth: 2, opacity: 90, textOpacity: 100, effect: "none" },
        { id: "3", name: "Gold", body: "#332b00", border: "#FFD700", text: "#ffffff", radius: 8, borderWidth: 2, opacity: 90, textOpacity: 100, effect: "none" },
        { id: "4", name: "Diamond", body: "#002d35", border: "#B9F2FF", text: "#ffffff", radius: 8, borderWidth: 2, opacity: 90, textOpacity: 100, effect: "galaxy" },
        { id: "5", name: "Platinum", body: "#262626", border: "#E5E4E2", text: "#ffffff", radius: 8, borderWidth: 2, opacity: 90, textOpacity: 100, effect: "aurora" }
      ]
    },
    {
      id: "cyberpunk",
      name: "Cyberpunk",
      description: "High-contrast neon HUD style.",
      tiers: [
        { id: "cp1", name: "Street-Rat", body: "#1A1A1A", border: "#4A4A4A", text: "#B0B0B0", radius: 2, borderWidth: 1, opacity: 100, textOpacity: 100, effect: "none" },
        { id: "cp2", name: "Runner", body: "#16213E", border: "#00D2FF", text: "#E0E0E0", radius: 2, borderWidth: 1, opacity: 95, textOpacity: 100, effect: "none" },
        { id: "cp3", name: "Augmented", body: "#1B1212", border: "#FFD700", text: "#FFFFFF", radius: 2, borderWidth: 2, opacity: 90, textOpacity: 100, effect: "none" },
        { id: "cp4", name: "Net-Ghost", body: "#0D1117", border: "#00FFC3", text: "#FFFFFF", radius: 2, borderWidth: 2, opacity: 90, textOpacity: 100, effect: "galaxy" },
        { id: "cp5", name: "Glitch-Walker", body: "#1A1A1A", border: "#E0E0E0", text: "#FFFFFF", radius: 2, borderWidth: 3, opacity: 85, textOpacity: 100, effect: "galaxy" },
        { id: "cp6", name: "Neon-Legend", body: "#1B1212", border: "#BC13FE", text: "#FFFFFF", radius: 2, borderWidth: 2, opacity: 90, textOpacity: 100, effect: "aurora" },
        { id: "cp7", name: "Apex-Chrome", body: "#0A0A0A", border: "#FF0055", text: "#FFFFFF", radius: 2, borderWidth: 3, opacity: 95, textOpacity: 100, effect: "aurora" }
      ]
    },
    {
      id: "borderlands2",
      name: "Borderlands 2",
      description: "Loot rarity colors from Pandora.",
      tiers: [
        { id: "bl1", name: "Common", body: "#1A1A1A", border: "#FFFFFF", text: "#FFFFFF", radius: 4, borderWidth: 2, opacity: 90, textOpacity: 100, effect: "none" },
        { id: "bl2", name: "Uncommon", body: "#0A2400", border: "#1EFF00", text: "#FFFFFF", radius: 4, borderWidth: 2, opacity: 90, textOpacity: 100, effect: "none" },
        { id: "bl3", name: "Rare", body: "#001B35", border: "#0070DD", text: "#FFFFFF", radius: 4, borderWidth: 2, opacity: 90, textOpacity: 100, effect: "none" },
        { id: "bl4", name: "Cursed", body: "#140024", border: "#4B0082", text: "#FFFFFF", radius: 4, borderWidth: 2, opacity: 90, textOpacity: 100, effect: "none" },
        { id: "bl5", name: "Epic", body: "#200033", border: "#A335EE", text: "#FFFFFF", radius: 4, borderWidth: 2, opacity: 90, textOpacity: 100, effect: "none" },
        { id: "bl6", name: "E-tech", body: "#330029", border: "#FF33CC", text: "#FFFFFF", radius: 4, borderWidth: 2, opacity: 90, textOpacity: 100, effect: "none" },
        { id: "bl7", name: "Gemstone", body: "#00241E", border: "#00FFD5", text: "#FFFFFF", radius: 4, borderWidth: 2, opacity: 90, textOpacity: 100, effect: "none" },
        { id: "bl8", name: "Legendary", body: "#2E1700", border: "#FF8000", text: "#FFFFFF", radius: 4, borderWidth: 2, opacity: 90, textOpacity: 100, effect: "none" },
        { id: "bl9", name: "Effervescent", body: "#330026", border: "#FF4FD8", text: "#FFFFFF", radius: 4, borderWidth: 2, opacity: 90, textOpacity: 100, effect: "aurora" },
        { id: "bl10", name: "Seraph", body: "#33001C", border: "#f00060", text: "#FFFFFF", radius: 4, borderWidth: 2, opacity: 90, textOpacity: 100, effect: "none" },
        { id: "bl11", name: "Pearlescent", body: "#002424", border: "#66FFFF", text: "#FFFFFF", radius: 4, borderWidth: 2, opacity: 90, textOpacity: 100, effect: "galaxy" }
      ]
    },
    {
      id: "animalcrossing",
      name: "Animal Crossing",
      description: "Soft rounded villagers-style palette.",
      tiers: [
        { id: "ac1", name: "Stone", body: "#D1D5DB", border: "#9CA3AF", text: "#374151", radius: 30, borderWidth: 2, opacity: 100, textOpacity: 100, effect: "none" },
        { id: "ac2", name: "Coconut", body: "#D2B48C", border: "#8B4513", text: "#3E2723", radius: 30, borderWidth: 2, opacity: 100, textOpacity: 100, effect: "none" },
        { id: "ac3", name: "Pear", body: "#C5E1A5", border: "#7CB342", text: "#33691E", radius: 30, borderWidth: 2, opacity: 100, textOpacity: 100, effect: "none" },
        { id: "ac4", name: "Peach", body: "#FFD1DC", border: "#FF8FAB", text: "#8A2E44", radius: 30, borderWidth: 2, opacity: 100, textOpacity: 100, effect: "none" },
        { id: "ac5", name: "Orange", body: "#FFB347", border: "#E67E22", text: "#5E3008", radius: 30, borderWidth: 2, opacity: 100, textOpacity: 100, effect: "none" },
        { id: "ac6", name: "Cherry", body: "#FF9AA2", border: "#D81B60", text: "#4A001F", radius: 30, borderWidth: 2, opacity: 100, textOpacity: 100, effect: "none" },
        { id: "ac7", name: "Apple", body: "#FF6B6B", border: "#C0392B", text: "#4A0000", radius: 30, borderWidth: 2, opacity: 100, textOpacity: 100, effect: "none" }
      ]
    }
  ];

  function clone(value) {
    return JSON.parse(JSON.stringify(value));
  }

  function normalizeHex(input, fallback) {
    if (rarityShared && typeof rarityShared.normalizeHexColor === "function") {
      return rarityShared.normalizeHexColor(input, fallback);
    }
    const value = String(input || "").trim();
    return /^#[0-9a-fA-F]{6}$/.test(value) ? value.toUpperCase() : fallback;
  }

  function slugifyLabel(value, fallback) {
    const text = String(value || "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
    return text || fallback;
  }

  function effectToRuntimeTokens(effect) {
    const key = String(effect || "none");
    if (["galaxy", "comet-trail", "crystal-shift", "ac-night-cricket"].includes(key)) return ["glow", "pulse"];
    if (["aurora", "plasma", "rainbow", "prism-sheen", "holo-grid", "ac-museum-glow"].includes(key)) return ["rainbow-cycle", "glow"];
    if (["neon-pulse", "ember-glow", "velvet-bloom", "ac-sunbeam", "ac-bell-shimmer"].includes(key)) return ["glow"];
    if (["scanlines", "ac-woodgrain", "ac-paper-fiber"].includes(key)) return ["sheen"];
    return ["none"];
  }

  function inferStyleFamily(theme) {
    const id = String(theme?.id || "").toLowerCase();
    const name = String(theme?.name || "").toLowerCase();
    if (id.includes("animal") || name.includes("animal crossing")) return "flat";
    if (id.includes("borderlands") || name.includes("borderlands")) return "glass";
    if (id.includes("cyber") || name.includes("cyber")) return "solid";
    return "glass";
  }

  function defaultMarkerMetrics(rank, total) {
    const normalized = total > 1 ? rank / (total - 1) : 0;
    return {
      markerWidthPx: Math.round(5 + normalized * 8),
      markerHeightPct: Math.round(118 + normalized * 132),
      markerOffsetTopPct: Math.round(-9 - normalized * 66)
    };
  }

  function mapThemeTierToRuntimeTier(themeTier, tierIndex, totalTiers) {
    const rank = Math.max(0, Number(tierIndex || 0));
    const metrics = defaultMarkerMetrics(rank, totalTiers);
    const pctFactor = Number((Math.max(0.15, 2.5 - rank * 0.32))).toFixed(2);
    return {
      key: slugifyLabel(themeTier.name, `tier-${rank + 1}`),
      label: String(themeTier.name || `Tier ${rank + 1}`),
      bodyColor: normalizeHex(themeTier.body, "#FFFFFF"),
      textColor: normalizeHex(themeTier.text, "#111111"),
      borderColor: normalizeHex(themeTier.border, "#DDDDDD"),
      markerColor: normalizeHex(themeTier.border || themeTier.body, "#FFFFFF"),
      markerWidthPx: metrics.markerWidthPx,
      markerHeightPct: metrics.markerHeightPct,
      markerOffsetTopPct: metrics.markerOffsetTopPct,
      percentileFactor: Number(pctFactor),
      minLikes: rank === 0 ? 0 : Math.max(1, Math.round(Math.pow(rank + 1, 1.8) * 2)),
      minGapFromPrevious: rank === 0 ? 0 : Math.max(1, Math.round(rank * 1.2)),
      minGapFromPrimary: rank >= 2 ? Math.max(4, rank * 2) : undefined,
      heatmapWeight: Number((1 + rank * 0.45).toFixed(2)),
      durationMultiplier: Number((1 + rank * 0.05).toFixed(2)),
      effects: effectToRuntimeTokens(themeTier.effect)
    };
  }

  function convertThemeV2ToRuntimeSkin(theme) {
    const tiers = (theme?.tiers || []).map((tier, index, arr) => mapThemeTierToRuntimeTier(tier, index, arr.length));
    const styleFamily = inferStyleFamily(theme);
    const firstTier = theme?.tiers?.[0] || null;
    const radius = Math.round(Number(firstTier?.radius || 8));
    const borderWidth = Math.max(0, Number(firstTier?.borderWidth || 2));
    const opacity = Math.max(8, Math.min(100, Number(firstTier?.opacity || 90)));
    return {
      id: String(theme.id || slugifyLabel(theme.name, "theme")),
      name: String(theme.name || "Theme"),
      builtIn: false,
      styleFamily,
      style: {
        borderEnabled: borderWidth > 0,
        borderWidth,
        radius,
        packOpacity: opacity / 100,
        timelineMarkerStyle: "dots"
      },
      nonPopularityPrimaryTierKey: tiers[Math.max(0, Math.floor(tiers.length / 2))]?.key || tiers[0]?.key,
      nonPopularityEliteTierKey: tiers[tiers.length - 1]?.key || tiers[0]?.key,
      tiers
    };
  }

  function normalizeThemeTier(tier, idx) {
    return {
      id: String(tier?.id || `tier-${idx + 1}`),
      name: String(tier?.name || `Tier ${idx + 1}`),
      body: normalizeHex(tier?.body, "#FFFFFF"),
      border: normalizeHex(tier?.border, "#DDDDDD"),
      text: normalizeHex(tier?.text, "#111111"),
      radius: Math.max(0, Math.min(40, Number(tier?.radius ?? 8))),
      borderWidth: Math.max(0, Math.min(10, Number(tier?.borderWidth ?? 2))),
      opacity: Math.max(0, Math.min(100, Number(tier?.opacity ?? 90))),
      textOpacity: Math.max(0, Math.min(100, Number(tier?.textOpacity ?? 100))),
      effect: [
        "none","galaxy","aurora","shader","neon-pulse","scanlines","frost","plasma","rainbow",
        "prism-sheen","holo-grid","ember-glow","comet-trail","velvet-bloom","crystal-shift",
        "ac-leaf-drift","ac-petal-breeze","ac-bell-shimmer","ac-river-ripple","ac-sunbeam",
        "ac-cloud-soft","ac-woodgrain","ac-paper-fiber","ac-night-cricket","ac-museum-glow"
      ].includes(String(tier?.effect)) ? String(tier.effect) : "none"
    };
  }

  function normalizeTheme(theme, idx) {
    const id = String(theme?.id || slugifyLabel(theme?.name, `theme-${idx + 1}`));
    const tiers = Array.isArray(theme?.tiers) ? theme.tiers.map(normalizeThemeTier) : [];
    return {
      id,
      name: String(theme?.name || `Theme ${idx + 1}`),
      description: theme?.description ? String(theme.description) : "",
      tiers: tiers.length > 0 ? tiers : [normalizeThemeTier({}, 0)]
    };
  }

  function normalizeThemeCatalog(catalog) {
    const inputThemes = Array.isArray(catalog?.themes) ? catalog.themes : seedThemes;
    return {
      schemaVersion: THEME_CATALOG_V2_SCHEMA_VERSION,
      themes: inputThemes.map(normalizeTheme)
    };
  }

  function buildRuntimeRarityCatalogFromThemeCatalog(themeCatalog) {
    const normalized = normalizeThemeCatalog(themeCatalog);
    const runtimeSkins = normalized.themes.map(convertThemeV2ToRuntimeSkin);
    if (rarityShared && typeof rarityShared.normalizeCatalog === "function") {
      return rarityShared.normalizeCatalog({ skins: runtimeSkins });
    }
    return { skins: runtimeSkins };
  }

  function getThemeById(catalog, themeId) {
    const normalized = normalizeThemeCatalog(catalog);
    return normalized.themes.find((theme) => theme.id === themeId) || normalized.themes[0] || null;
  }

  async function ensureThemeCatalogV2Storage() {
    if (!chrome?.storage?.local) return null;
    const stored = await chrome.storage.local.get([
      THEME_CATALOG_V2_KEY,
      THEME_CATALOG_V2_REVISION_KEY,
      THEME_CATALOG_V2_SCHEMA_VERSION_KEY
    ]);
    let catalog = stored[THEME_CATALOG_V2_KEY] || null;
    if (!catalog) {
      catalog = normalizeThemeCatalog({ themes: seedThemes });
      await chrome.storage.local.set({
        [THEME_CATALOG_V2_KEY]: catalog,
        [THEME_CATALOG_V2_REVISION_KEY]: Date.now(),
        [THEME_CATALOG_V2_SCHEMA_VERSION_KEY]: THEME_CATALOG_V2_SCHEMA_VERSION
      });
    }
    return {
      catalog: normalizeThemeCatalog(catalog),
      revision: Number(stored[THEME_CATALOG_V2_REVISION_KEY] || Date.now()),
      schemaVersion: Number(stored[THEME_CATALOG_V2_SCHEMA_VERSION_KEY] || THEME_CATALOG_V2_SCHEMA_VERSION)
    };
  }

  globalThis.TimestampChatterThemeCatalogV2 = {
    THEME_CATALOG_V2_KEY,
    THEME_CATALOG_V2_REVISION_KEY,
    THEME_CATALOG_V2_SCHEMA_VERSION_KEY,
    THEME_CATALOG_V2_SCHEMA_VERSION,
    seedThemes: clone(seedThemes),
    normalizeThemeCatalog,
    buildRuntimeRarityCatalogFromThemeCatalog,
    convertThemeV2ToRuntimeSkin,
    mapThemeTierToRuntimeTier,
    getThemeById,
    ensureThemeCatalogV2Storage
  };
})();
