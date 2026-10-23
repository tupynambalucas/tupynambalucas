# =================================================================== #
# studio/penpot — valkey (Redis-compatible cache)
# Wraps the official valkey/valkey Alpine image (lightweight, ~30MB).
# Build context: this directory (studio/penpot/services/valkey).
# Port 6379: Redis-compatible TCP protocol.
# Used by penpot-backend and penpot-exporter for WebSocket pub/sub.
# =================================================================== #

# --- Dev Profile ---
FROM valkey/valkey:8.1-alpine AS dev

EXPOSE 6379

# --- Prod Profile ---
FROM valkey/valkey:8.1-alpine AS prod

EXPOSE 6379
