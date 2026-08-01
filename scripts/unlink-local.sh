#!/usr/bin/env bash
set -euo pipefail

if [ "$#" -lt 1 ]; then
  echo "Usage: npm run unlink:local -- <consumer-path> [consumer-path-2 ...]"
  echo "Tip: this script restores normal dependency resolution in each consumer."
  exit 1
fi

for target in "$@"; do
  consumer_dir="$(cd "$target" && pwd)"
  echo "Unlinking in $consumer_dir"
  cd "$consumer_dir"

  npm unlink @wintermuted/ui-theme || true
  npm install --no-audit --no-fund

done

echo "Done. Consumers reverted to declared package resolution."
