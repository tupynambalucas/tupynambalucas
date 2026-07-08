# =================================================================== #
# @tupynambalucas-hub/api — Production Dockerfile
# Multi-stage build using Turborepo pruning + pnpm deploy.
# Build context: MONOREPO ROOT (../../ relative to this file).
# =================================================================== #

# ---- Stage 1: Base ----
# Slim Node.js image with pnpm enabled via corepack.
FROM node:22-slim AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PNPM_HOME/bin:$PATH"
RUN corepack enable pnpm

# ---- Stage 2: Pruner ----
# Uses Turborepo to extract ONLY the files needed by @tupynambalucas-hub/api
# and its workspace dependencies (@tupynambalucas-hub/core).
# This optimizes Docker layer caching: re-runs only when relevant source changes.
FROM base AS pruner
WORKDIR /app
RUN pnpm add -g turbo@latest
COPY . .
RUN turbo prune @tupynambalucas-hub/api --docker

# ---- Stage 3: Builder ----
# Installs dependencies from the pruned lockfile, then builds the TypeScript source.
FROM base AS builder
WORKDIR /app
# Install deps first (cached layer — only invalidated when lockfile changes)
COPY --from=pruner /app/out/json/ .
COPY --from=pruner /app/out/pnpm-lock.yaml ./pnpm-lock.yaml
RUN --mount=type=cache,id=pnpm-instance-api,target=/pnpm/store \
    pnpm install --frozen-lockfile
# Copy full source and build
COPY --from=pruner /app/out/full/ .
RUN pnpm --filter @tupynambalucas-hub/api... build

# ---- Stage 4: Deployer ----
# Uses `pnpm deploy` to create a self-contained production directory:
# resolves pnpm symlinks, includes ONLY production dependencies.
# No source code or devDependencies in the final image.
FROM base AS deployer
WORKDIR /app
COPY --from=builder /app .
RUN --mount=type=cache,id=pnpm-instance-api,target=/pnpm/store \
    pnpm --filter @tupynambalucas-hub/api --prod deploy --legacy /prod/api

# ---- Stage 5: Runner ----
# Minimal production image with non-root user for security.
FROM node:22-slim AS runner
WORKDIR /app

# Create non-root system user
RUN addgroup --system --gid 1001 nodejs \
 && adduser --system --uid 1001 fastify

USER fastify

# Copy only the isolated production package
COPY --from=deployer --chown=fastify:nodejs /prod/api .

EXPOSE 3000

CMD ["node", "dist/index.js"]
