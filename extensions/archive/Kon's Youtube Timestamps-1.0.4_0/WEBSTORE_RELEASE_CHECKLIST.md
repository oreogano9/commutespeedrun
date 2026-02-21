## Chrome Web Store Release Checklist

### Package
- Use the clean zip:
  - `/Users/konradparada/Documents/Misc/extensions/timestamp-chatter-webstore-1.0.4-20260219-131352.zip`
- Confirm package does not include `_metadata/`.
- Confirm `manifest.json` in the zip does not include `key` or `update_url`.

### Listing
- Title: `Timestamp Chatter`
- Category: choose a productivity/utilities category that matches behavior.
- Add screenshots and promotional assets required by CWS.
- Clearly describe:
  - overlays for timestamped comments
  - marker bar + heatmap
  - local settings and visibility toggle

### Privacy + Data Disclosure
- In CWS Privacy section, disclose that the extension reads YouTube page data and comment metadata needed for functionality.
- State whether any data is transmitted off-device (this extension fetches YouTube comments from YouTube endpoints; no custom backend).
- Include a privacy policy URL in listing if required by your disclosure answers.

### Permissions Justification
- `storage`: save user settings.
- `tabs`: find active YouTube watch tabs and message content scripts.
- `declarativeNetRequestWithHostAccess`: apply static request header rule used by comment fetch flow.
- Host permission: `https://*.youtube.com/*` only.

### Final QA
- Test on multiple videos:
  - normal playback
  - scrubbing
  - fullscreen
  - ad transitions
- Verify eye toggle icon visibility and placement with/without SponsorBlock.
- Verify settings open/close and minimal toggle behavior.
- Verify no console errors on watch pages.
