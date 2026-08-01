#!/usr/bin/env bash
set -euo pipefail

if [ "$#" -lt 1 ]; then
  echo "Usage: npm run link:local -- <consumer-path> [consumer-path-2 ...]"
  exit 1
fi

repo_root="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

echo "Linking @wintermuted/ui-theme from $repo_root"
cd "$repo_root"
npm link

for target in "$@"; do
  consumer_dir="$(cd "$target" && pwd)"
  echo "Linking into $consumer_dir"
  cd "$consumer_dir"
  npm link @wintermuted/ui-theme

done

echo "Done. Local consumers now symlink to your working copy of @wintermuted/ui-theme."
