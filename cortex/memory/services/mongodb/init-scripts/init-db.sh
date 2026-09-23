#!/bin/bash
# =================================================================== #
# init-db.sh — Cortex Memory MongoDB Replica Set Initializer
#
# Single responsibility: initialize the MongoDB Replica Set (rs0) for
# the cortex/memory subsystem.
# =================================================================== #
set -e

echo "[memory-db-init] Waiting for MongoDB to be ready..."
until mongosh --host mongodb-db --port 27017 --quiet --eval "db.adminCommand('ping').ok" > /dev/null 2>&1; do
  sleep 2
done
echo "[memory-db-init] MongoDB is up."

AUTH_ARGS=""
if [ -n "$MONGO_INITDB_ROOT_USERNAME" ] && [ -n "$MONGO_INITDB_ROOT_PASSWORD" ]; then
  AUTH_ARGS="-u $MONGO_INITDB_ROOT_USERNAME -p $MONGO_INITDB_ROOT_PASSWORD --authenticationDatabase admin"
fi

# Initialize Replica Set (idempotent — safe to re-run)
if ! mongosh --host mongodb-db --port 27017 $AUTH_ARGS --quiet --eval "rs.status().ok" 2>/dev/null | grep -q "1"; then
    echo "[memory-db-init] Initiating Replica Set (rs0)..."
    mongosh --host mongodb-db --port 27017 $AUTH_ARGS --quiet --eval \
      "rs.initiate({_id: 'rs0', members: [{_id: 0, host: 'mongodb-db:27017'}]})"

    echo "[memory-db-init] Waiting for node to become PRIMARY..."
    until mongosh --host mongodb-db --port 27017 $AUTH_ARGS --quiet --eval "rs.isMaster().ismaster" 2>/dev/null | grep -q "true"; do
        sleep 2
    done
    echo "[memory-db-init] Node is now PRIMARY. Replica Set rs0 ready."
else
    echo "[memory-db-init] Replica Set rs0 already initialized. Skipping."
fi

echo "[memory-db-init] Cortex Memory infrastructure initialization complete."
