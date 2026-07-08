#!/usr/bin/env bash
set -euo pipefail

# Verify environment variables
if [[ -z "${GH_TOKEN:-}" ]]; then
  echo "[GH-CLI ERROR] GH_TOKEN is not defined in the container environment." >&2
  exit 1
fi

# Ensure all scripts are executable inside the container recursively (resolving Windows filesystem mapping limits)
find /workspace/tools/github/services/gh/src -name "*.sh" -exec chmod +x {} + 2>/dev/null || true
if [[ -d "/workspace/tools/github/services/gh/extensions" ]]; then
  find /workspace/tools/github/services/gh/extensions -name "*.sh" -exec chmod +x {} + 2>/dev/null || true
fi

# Dynamically link and register gh menu as a native GitHub CLI extension
ln -sf /workspace/tools/github/services/gh/src/menu.sh /usr/local/bin/gh-menu
chmod +x /usr/local/bin/gh-menu

# Register the alias so that 'gh menu' maps directly to the executable on PATH
gh alias delete menu 2>/dev/null || true
gh alias set menu '!/usr/local/bin/gh-menu' 2>/dev/null || true

exec "$@"

