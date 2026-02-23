#!/bin/zsh
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"

echo "[smoke] syntax checks"
node --check "$ROOT/background/background.js"
node --check "$ROOT/content/content.js"
node --check "$ROOT/popup/popup.js"
node --check "$ROOT/shared/rarity-skins.js"
node --check "$ROOT/shared/settings-schema.js"

echo "[smoke] manifest references"
test -f "$ROOT/manifest.json"
test -f "$ROOT/content/content.css"
test -f "$ROOT/content/content.js"
test -f "$ROOT/background/background.js"
test -f "$ROOT/popup/popup.html"
test -f "$ROOT/popup/popup.js"
test -f "$ROOT/shared/rarity-skins.js"
test -f "$ROOT/shared/settings-schema.js"

echo "[smoke] ok"

