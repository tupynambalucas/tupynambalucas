#!/bin/bash
# =================================================================== #
# init-db.sh — MongoDB Replica Set Initializer (Dev Only)
#
# Responsibility: Single concern — initialize the MongoDB Replica Set
# (rs0) for the local development environment.
#
# Admin user seeding is handled by the API itself via SeedPlugin,
# which runs on every application startup (dev, staging, prod) and is
# fully idempotent. Do NOT add seed logic here.
# =================================================================== #
set -e

echo "[db-init] Waiting for MongoDB to be ready..."
until mongosh --host db --port 27017 --quiet --eval "db.adminCommand('ping').ok" > /dev/null 2>&1; do
  sleep 2
done
echo "[db-init] MongoDB is up."

AUTH_ARGS="-u $MONGO_INITDB_ROOT_USERNAME -p $MONGO_INITDB_ROOT_PASSWORD --authenticationDatabase admin"

# Initialize Replica Set (idempotent — safe to re-run)
if ! mongosh --host db --port 27017 $AUTH_ARGS --quiet --eval "rs.status().ok" 2>/dev/null | grep -q "1"; then
    echo "[db-init] Initiating Replica Set (rs0)..."
    mongosh --host db --port 27017 $AUTH_ARGS --quiet --eval \
      "rs.initiate({_id: 'rs0', members: [{_id: 0, host: 'db:27017'}]})"

    echo "[db-init] Waiting for node to become PRIMARY..."
    until mongosh --host db --port 27017 $AUTH_ARGS --quiet --eval "rs.isMaster().ismaster" 2>/dev/null | grep -q "true"; do
        sleep 2
    done
    echo "[db-init] Node is now PRIMARY. Replica Set ready."
else
    echo "[db-init] Replica Set already initialized. Skipping."
fi

echo "[db-init] Infrastructure initialization complete."
echo "   → Admin user seed is handled by the API on startup (SeedPlugin)."
