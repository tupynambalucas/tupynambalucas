#!/bin/bash
# =================================================================== #
# deploy.sh — Automation Deployment Script
# =================================================================== #
set -euo pipefail

export APP_ENV=${1:-prod}
export TAG=${2:-latest}

echo "[deploy] Executing setup validation..."
./setup.sh

echo "[deploy] Pulling latest images (tag: $TAG)..."
docker compose -f ../compose.yaml -f ../compose.prod.yaml --profile $APP_ENV pull

echo "[deploy] Launching stack..."
docker compose -f ../compose.yaml -f ../compose.prod.yaml --env-file ../.env.$APP_ENV --profile $APP_ENV up -d --build

echo "[deploy] Running post-deployment health check..."
./utils/healthcheck.sh

echo "[deploy] Pruning obsolete dangling docker objects..."
docker image prune -f
docker builder prune -f || true

echo "[deploy] Release completed successfully."
