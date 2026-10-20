# =================================================================== #
# hub/cortex/memory/services/mongodb — MongoDB database service
# =================================================================== #

# ---- Stage 1: Base ----
FROM mongo:7.0 AS base

# Install openssl for keyfile generation and dos2unix for script normalization
RUN apt-get update && apt-get install -y --no-install-recommends openssl dos2unix \
 && rm -rf /var/lib/apt/lists/*

WORKDIR /infrastructure

# Copy scripts
COPY scripts/entrypoint.sh ./entrypoint.sh
COPY init-scripts/init-db.sh ./init-db.sh

# Normalize line endings and set execution permissions
RUN dos2unix ./entrypoint.sh ./init-db.sh \
 && chmod +x ./entrypoint.sh ./init-db.sh

# ---- Stage 2: Dev Profile ----
FROM base AS dev
EXPOSE 27017
ENTRYPOINT ["./entrypoint.sh"]

# ---- Stage 3: Prod Profile ----
FROM base AS prod
EXPOSE 27017
ENTRYPOINT ["./entrypoint.sh"]
