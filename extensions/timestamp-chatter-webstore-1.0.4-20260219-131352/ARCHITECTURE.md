# Timestamp Chatter Architecture (Baseline)

This document is the cleanup anchor for the modularization effort.

## Runtime surfaces

- `content/content.js`
  - YouTube page integration (overlay cards, timeline markers/heatmap, quick menu, runtime gating)
- `background/background.js`
  - Comment fetch/cache/filter/progress/broadcast flow
- `popup/popup.js`
  - Settings UI, storage sync/local, runtime broadcasts
- `shared/rarity-skins.js`
  - Rarity skin schema + normalization
- `shared/settings-schema.js`
  - Shared settings defaults/limits + normalization helpers (new cleanup foundation)

## Key data flows

### 1) Comment scan flow
- Content script requests scan (`comments`)
- Background fetches pages (startup + lazy)
- Background filters/reduces
- Background sends:
  - `comments_replace`
  - `comments_update`
  - progress payload (`pagesFetched`, `pagesTarget`, `timestampsCount`)
- Content stores comments/progress and rerenders markers/overlay

### 2) Settings flow
- Popup writes to `chrome.storage.sync` / `chrome.storage.local`
- Popup broadcasts `overlaySettings` + other runtime messages
- Background caches certain filter/fetch settings in-memory
- Content updates runtime flags and visuals

### 3) Rarity/skin flow
- Shared rarity schema normalizes catalog
- Popup edits and persists catalog
- Content consumes normalized catalog and derives runtime skin map
- Rarity runtime computes tier/rank assignments
- Renderer applies tier/skin visuals

## Current cleanup targets (high risk areas)

1. `content/content.js` monolith (mixed responsibilities)
2. `popup/popup.js` monolith (UI + storage + rarity editor remnants)
3. Duplicated settings defaults/limits (now partially centralized in `shared/settings-schema.js`)
4. Background fetch/progress/caching coupling

## Cleanup execution rule (important)

- Prefer extraction without logic changes first.
- After extraction, add targeted optimizations with regression checks.
- Preserve storage keys and user-visible behavior unless explicitly approved.

