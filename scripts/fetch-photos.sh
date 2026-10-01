#!/usr/bin/env bash
# Downloads the Unsplash photos listed in src/lib/photos.ts into public/photos/.
# Needs network access to unsplash.com and images.unsplash.com.
set -euo pipefail
cd "$(dirname "$0")/../public/photos"

fetch() {
  local id="$1" file="$2"
  if [[ -f "$file" ]]; then echo "skip $file (already there)"; return; fi
  echo "get  $file"
  # ?w= asks Unsplash for a web-sized copy instead of the full original.
  curl -fsSL "https://unsplash.com/photos/${id}/download?force=true&w=1600" -o "$file"
}

fetch hoIQtR0NoQE technician-under-sink.jpg
fetch qzJ_DjEs-5M glass-of-water-kitchen.jpg
fetch EOAy-v9Njbs columbus-skyline.jpg
