# Timestamp Chatter Regression Checklist

Use this after each cleanup phase that changes runtime logic.

## Overlay / notifications
- [ ] Notifications appear at timestamps
- [ ] Notifications hide after configured duration
- [ ] Clicking a notification seeks and shows landing/context behavior
- [ ] Global quick-menu toggle hides/shows without clearing loaded timestamps
- [ ] This-tab quick-menu toggle hides/shows without clearing loaded timestamps

## Timeline / heatmap
- [ ] Timeline markers render
- [ ] Marker click seek works
- [ ] Marker hover preview works
- [ ] Warning dot toggle works
- [ ] Heatmap renders after scan completion

## Quick menu (on-video)
- [ ] Gear stays in right controls (before autoplay when present)
- [ ] Menu opens/closes reliably
- [ ] Gear spins only while loading
- [ ] Click spin works only when not loading
- [ ] Loading text wraps correctly
- [ ] Heatmap helper note shows only while loading + heatmap enabled

## Scan / progress
- [ ] Progress shows actual scanned pages (not fixed requested max)
- [ ] Loaded status shows final actual pages scanned
- [ ] Timeout failsafe stops a stuck page fetch
- [ ] Rescan works from quick menu and popup

## Popup / settings
- [ ] Popup opens without sync quota spam
- [ ] Overlay settings broadcast updates live
- [ ] Advanced comment filters (timestamp-only / multi-timestamp) still apply
- [ ] Rarity skin selection still updates content

## Skins / rarity
- [ ] Default skin visuals and labels render
- [ ] Borderlands / Borderlands 2 / Minecraft / Animal Crossing skins render
- [ ] Hidden tiers are respected
- [ ] Current rarity assignment logic behavior remains unchanged

