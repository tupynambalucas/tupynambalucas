# =================================================================== #
# hub/tools/turbocache — Turborepo Remote Cache
# =================================================================== #

# ---- Stage 1: Base ----
FROM ducktors/turborepo-remote-cache:latest AS base

EXPOSE 3000

USER root
RUN mkdir -p /data/cache && chown -R app:app /data/cache
USER app

# ---- Stage 2: Dev Profile ----
FROM base AS dev
EXPOSE 3000

# ---- Stage 3: Prod Profile ----
FROM base AS prod
EXPOSE 3000