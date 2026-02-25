# Chrome Web Store Disclosure Notes (Draft)

Use this text when filling out the Chrome Web Store listing/disclosure forms.

## Permissions Justification

### `storage`
Stores user preferences and extension settings (overlay display, filters, skin/theme settings, toggles, and local editor/theme catalog data).

### `tabs`
Used to find active YouTube watch tabs and send messages between the popup/background/content script so settings and overlay state update on the correct tab.

### `declarativeNetRequestWithHostAccess`
Used for a static request-header rule required by the YouTube comment-fetch flow.

### Host Permission: `https://*.youtube.com/*`
Needed so the extension can run on YouTube pages, read player/page context, and render timeline markers and timestamp notification overlays on YouTube videos.

## Data Use / Disclosure (Suggested Wording)

Timestamp Chatter reads YouTube page/player state and public YouTube comment metadata (comment text, author display name, avatar URL, likes, timestamps) to provide on-video timestamp notifications, timeline markers, and heatmap visualizations.

The extension fetches comment data from YouTube endpoints only. It does not use a custom developer-operated backend for analytics or user tracking.

User preferences/settings are stored locally in Chrome extension storage.

## Listing Description Points (Suggested)
- Syncs timestamped YouTube comments to video playback
- Shows on-video notification overlays at comment timestamps
- Adds timeline markers and an optional timestamp heatmap
- Highly customizable skins/themes and display settings
- No separate backend required (YouTube-only data fetches for functionality)
