#!/bin/bash
# =================================================================== #
# healthcheck.sh — Deployment Verification Script
# =================================================================== #
set -euo pipefail

TARGET_URL="http://localhost/health"
RETRIES=10
DELAY=3

echo "[healthcheck] Pinging application endpoint..."
for ((i=1; i<=RETRIES; i++)); do
    STATUS_CODE=$(curl -s -o /dev/null -w "%{http_code}" "$TARGET_URL" || echo "000")
    if [ "$STATUS_CODE" -eq 200 ]; then
        echo "[healthcheck] Connection established. HTTP 200 OK."
        exit 0
    fi
    echo "[healthcheck] Attempt $i/$RETRIES failed (Status: $STATUS_CODE). Retrying in ${DELAY}s..."
    sleep $DELAY
done

echo "Error: Application health check timed out." >&2
exit 1
