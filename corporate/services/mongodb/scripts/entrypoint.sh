#!/bin/bash
set -e

# --- Keyfile Generation for Replica Set ---
KEYFILE=/data/mongo-keyfile
if [ ! -f "$KEYFILE" ]; then
    echo "[db] Generating mongo-keyfile..."
    openssl rand -base64 756 > "$KEYFILE"
    chmod 400 "$KEYFILE"
    chown 999:999 "$KEYFILE"
fi

echo "[db] Starting MongoDB with Replica Set..."
# Pass all arguments
exec docker-entrypoint.sh "$@"
