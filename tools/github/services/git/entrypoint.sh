#!/usr/bin/env bash
set -euo pipefail

# Verify environment variables
if [[ -z "${GH_TOKEN:-}" ]]; then
  echo "[GIT ERROR] GH_TOKEN is not defined in the container environment." >&2
  exit 1
fi

exec "$@"
