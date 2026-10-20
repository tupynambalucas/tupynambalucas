# =================================================================== #
# @monorepo/hub-web — Production Dockerfile
# Multi-stage build: Turborepo prune → Vite build → Nginx serve.
# Build context: MONOREPO ROOT (../../ relative to this file).
# VITE_* variables are injected at build time via Docker ARG.
# =================================================================== #

# ---- Stage 1: Base ----
FROM node:22-slim AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PNPM_HOME/bin:$PATH"
RUN corepack enable pnpm

# ---- Stage 2: Pruner ----
# Extracts ONLY files needed by @monorepo/hub-web and its workspace deps
# (@monorepo/hub-core, @monorepo/studio-assets).
FROM base AS pruner
WORKDIR /app
RUN pnpm add -g turbo@latest
COPY . .
RUN turbo prune @monorepo/hub-web --docker

# ---- Stage 3: Builder ----
# Injects VITE_* variables as build-time ARGs — they are statically
# replaced inside the JS bundle by Vite. These are PUBLIC keys only
# (site keys, not secret keys).
FROM base AS builder
WORKDIR /app

# Declare and expose Vite build-time variables
ARG VITE_TURNSTILE_SITE_KEY
ENV VITE_TURNSTILE_SITE_KEY=$VITE_TURNSTILE_SITE_KEY

# Install dependencies (cached layer)
COPY --from=pruner /app/out/json/ .
COPY --from=pruner /app/out/pnpm-lock.yaml ./pnpm-lock.yaml
RUN --mount=type=cache,id=pnpm-store-shared,target=/pnpm/store \
    pnpm install --frozen-lockfile

# Copy full source and build
COPY --from=pruner /app/out/full/ .
RUN pnpm --filter @monorepo/hub-web... build

# ---- Stage 4: Dev Profile (Build & Run) ----
FROM base AS dev
WORKDIR /app
ENV NODE_ENV=development
ARG VITE_TURNSTILE_SITE_KEY
ENV VITE_TURNSTILE_SITE_KEY=$VITE_TURNSTILE_SITE_KEY
COPY --from=pruner /app/out/json/ .
COPY --from=pruner /app/out/pnpm-lock.yaml ./pnpm-lock.yaml
RUN --mount=type=cache,id=pnpm-store-shared,target=/pnpm/store \
    pnpm install --frozen-lockfile
COPY --from=pruner /app/out/full/ .
RUN pnpm --filter @monorepo/hub-web... build
WORKDIR /app/corporate/services/web
EXPOSE 5173
CMD ["pnpm", "dev", "--host", "0.0.0.0", "--port", "5173"]

# ---- Stage 5: Prod Profile (Run) ----
# Serves the built static files. Final image is ~25MB.
FROM nginx:alpine AS prod

# Copy built React app from builder stage
COPY --from=builder /app/corporate/services/web/dist /usr/share/nginx/html

# Copy Nginx configuration
COPY --from=builder /app/corporate/services/web/nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
