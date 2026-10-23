# =================================================================== #
# studio/memos — memos (self-hosted note-taking)
# Wraps the official neosmemo/memos:stable image (Alpine-based Go binary).
# Build context: this directory (studio/memos/services/memos).
# Port 5230: HTTP API + web UI.
# Data volume: /var/opt/memos (SQLite DB and local assets).
# Postgres driver configured via MEMOS_DRIVER + MEMOS_DSN env vars.
# Runs as non-root UID 10001 (nonroot user, enforced by upstream).
# =================================================================== #

# --- Dev Profile ---
FROM neosmemo/memos:stable AS dev

EXPOSE 5230

# --- Prod Profile ---
FROM neosmemo/memos:stable AS prod

EXPOSE 5230
