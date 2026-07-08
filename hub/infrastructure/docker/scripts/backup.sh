#!/bin/bash
# =================================================================== #
# backup.sh — Database and Volume Archiving Script
# =================================================================== #
set -euo pipefail

BACKUP_DIR="../backups"
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
MONGO_BACKUP_NAME="mongo_dump_${TIMESTAMP}"

mkdir -p "$BACKUP_DIR"

echo "[backup] Initiating MongoDB database dump..."
docker exec tupynambalucas-hub-db-prod mongodump \
  --username="${MONGO_USER}" \
  --password="${MONGO_PASSWORD}" \
  --authenticationDatabase=admin \
  --archive | gzip > "${BACKUP_DIR}/${MONGO_BACKUP_NAME}.archive.gz"

echo "[backup] Archive compressed successfully: ${MONGO_BACKUP_NAME}.archive.gz"

# Retention policy: remove backups older than 30 days
find "$BACKUP_DIR" -type f -mtime +30 -name "mongo_dump_*" -delete
echo "[backup] Cleanup of expired backups complete."
