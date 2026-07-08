#!/bin/bash
# =================================================================== #
# setup.sh — Host VM Preparation Script
# =================================================================== #
set -euo pipefail

echo "[setup] Verifying docker installation..."
if ! command -v docker &> /dev/null; then
    echo "Error: docker is not installed." >&2
    exit 1
fi

echo "[setup] Setting up directory structures..."
mkdir -p logs backups

echo "[setup] Configuring kernel virtual memory map limits (required for databases)..."
sudo sysctl -w vm.max_map_count=262144 || true

echo "[setup] Host preparation complete."
