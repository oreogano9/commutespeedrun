# Changelog

All notable changes to **Timestamp Chatter** (custom fork of CommentSync `1.0.4`).

This timeline is listed in chronological order (oldest -> newest).

## Release tags

- `1.1.0` - current working release baseline (starting semantic versioning flow)

## Timeline

1. Forked from CommentSync `1.0.4` and rebranded as **Timestamp Chatter** (name/description updates).
2. Added overlay controls for size, on-screen duration, and corner roundness.
3. Extended control ranges so settings can exceed original max caps.
4. Fixed overlay anchoring so notifications stay bound to the video player (including non-fullscreen cases).
5. Improved simultaneous comment handling with stacked notifications and deterministic ordering.
6. Added persistent settings behavior so UI changes are reflected directly in extension storage/config.
7. Set custom defaults from target profile: overlay size `105%`, on-screen time `15.0s`, corner roundness `14px`.
8. Split visual tuning into separate controls: glass effect + darkness.
9. Added hidden debug mode support (kept functional even when UI exposure changed).
10. Added long-message controls: `Allow long messages` toggle + numeric `Max chars` input.
11. Iterated defaults for long-message behavior and max length (final default: allow long messages OFF, max chars `300`).
12. Integrated marker-bar functionality from the auxiliary extension into this fork.
13. Tied timeline marker visibility to the exact same notification filters in real time (allow long, max chars, etc.).
14. Improved settings popup look and UX, including dark mode styling (default ON).
15. Kept corner-position selector cards bright in dark mode to avoid visual glitching.
16. Added Advanced Settings block and grouped advanced controls there.
17. Added Early Notification mode with:
    - toggle enable/disable
    - configurable lead time (seconds before timestamp)
    - at-timestamp animation/effect dropdown
18. Set default at-timestamp effect to `rubberband`.
19. Synced notification lifetime with video playback state (pause/resume behavior).
20. Removed promo blocks from settings (`Rate us`, `Check out our extensions`, Amazon tracker card).
21. Added stack-direction logic for top corners and then a global toggle to reverse order for all corners.
22. Added avatar-size slider and dynamic card-height response (default avatar size `25px`).
23. Added red pre-notification indicator dot ("comment coming" signal) near the active lane.
24. Iterated red-dot behavior:
    - glassy styling tied to overlay style settings
    - persistent pulse until notification appears
    - smooth "breathing" pulse
    - more saturated default
    - only shown when no notification is currently visible
25. Added visibility eye control to mute/unmute notifications.
26. Updated eye-control behavior over time:
    - hover-based appearance
    - repositioned for less interference
    - later changed to non-hover-only availability while active
27. Improved seek/scrub consistency so visible notifications represent the current playback moment (no stale stacked leftovers after jumps).
28. Added Priority Scoring features and settings.
29. Added mini timeline heatmap with multiple design passes and smoothing improvements.
30. Added heatmap intensity control and expanded intensity range; later set default intensity to `500%`.
31. Added multi-corner routing with per-length routing settings; final default set to OFF.
32. Added optional likes visibility inside notifications and tuned likes text size.
33. Added gold/top-liked tier styling + threshold controls.
34. Added diamond tier styling/effects for highest-priority comments.
35. Unified gold/diamond threshold behavior under the same top-liked slider logic.
36. Added dynamic threshold preview text in settings for current video, including likes cutoff values.
37. Ensured threshold preview displays likes-based values (not percentages) for both gold and diamond cutoffs.
38. Enhanced timeline tier dots:
    - gold/diamond sizing
    - stronger prominence
    - centered vertical positioning
    - tier-matched badges on markers
39. Added click-to-context behavior: clicking notification seeks to `timestamp - 2s`.
40. Updated hover preview text for timeline markers to show comment text without redundant time prefix.
41. Added support for comments containing multiple timestamps:
    - emit notification entries for each timestamp
    - emit marker badges for each timestamp
    - click handling targets closest timestamp context
42. Fixed like parsing for compact values (`1K`, `1.6K`, `2M`) so score math and tiering are accurate.
43. Added compact like formatting in cards (e.g., `1600` -> `1.6K`).
44. Added tier-specific display multipliers:
    - gold stays ~20% longer
    - diamond stays ~30% longer
    - base display duration offset by -1s for overall balance
45. Added optional playback-speed-aware timing so durations scale naturally at 1.5x/2x.
46. Added `requestAnimationFrame` batching/throttling for marker rendering and reconcile loops.
47. Added high-volume runtime safeguards to prevent crashes on very large-comment videos:
    - runtime cap on total comment entries
    - per-second cap before send-to-content
48. Added staged fast-start loading pipeline to reduce startup interruption risk:
    - fetch small initial comment pages first
    - render quickly
    - lazy-fetch remaining pages after playback stabilizes
49. Applied multiple anti-flicker stabilization passes for horizontal line artifacts.
50. Latest anti-flicker pass moved normal cards to stable glass-tint rendering (no live card backdrop sampling) and less artifact-prone overlay scaling.
51. Packaged distribution snapshots as zip archives for backup/release handoff.

## Current Defaults Snapshot

- Extension name: `Timestamp Chatter`
- Allow long messages: `OFF`
- Max chars (when long messages OFF): `300`
- Overlay glass effect: `24%`
- Overlay darkness: `31%`
- Avatar size: `25px`
- Top-liked threshold: `12%`
- Heatmap intensity: `500%`
- Multi-corner routing: `OFF`
- Settings dark mode: `ON`
- Default at-timestamp effect: `rubberband`
