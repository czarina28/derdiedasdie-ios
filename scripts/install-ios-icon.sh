#!/bin/bash
set -euo pipefail
ICON_SOURCE="assets/derdiedasdie-app-icon-1024.png"
ICON_SET="ios/App/App/Assets.xcassets/AppIcon.appiconset"
test -f "$ICON_SOURCE" || { echo "Missing $ICON_SOURCE"; exit 1; }
mkdir -p "$ICON_SET"
cp "$ICON_SOURCE" "$ICON_SET/AppIcon-1024.png"
cat > "$ICON_SET/Contents.json" <<'JSON'
{
  "images": [
    {
      "filename": "AppIcon-1024.png",
      "idiom": "universal",
      "platform": "ios",
      "size": "1024x1024"
    }
  ],
  "info": { "author": "xcode", "version": 1 }
}
JSON
echo "Installed iOS app icon."
