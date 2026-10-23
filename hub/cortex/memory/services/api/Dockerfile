FROM node:22-alpine AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PNPM_HOME/bin:$PATH"
RUN corepack enable pnpm

FROM base AS pruner
WORKDIR /app
RUN pnpm add -g turbo@latest
COPY . .
RUN turbo prune @tupynambalucas-dev/cortex-memory-api --docker

FROM base AS builder
WORKDIR /app
COPY --from=pruner /app/out/json/ .
COPY --from=pruner /app/out/pnpm-lock.yaml ./pnpm-lock.yaml
RUN --mount=type=cache,id=pnpm-store-shared,target=/pnpm/store \
    pnpm install --frozen-lockfile

COPY --from=pruner /app/out/full/ .
RUN pnpm --filter @tupynambalucas-dev/cortex-memory-api... build

FROM base AS deployer
WORKDIR /app
COPY --from=builder /app .
RUN --mount=type=cache,id=pnpm-store-shared,target=/pnpm/store \
    pnpm --filter @tupynambalucas-dev/cortex-memory-api --prod deploy --legacy /prod/app

# ---- Stage 5: Dev Profile (Build & Run) ----
FROM base AS dev
WORKDIR /app
ENV NODE_ENV=development
ENV PORT=3006
ENV HOST=0.0.0.0
ENV MONGODB_URI=mongodb://cortex_admin:cortex_password_dev@mongodb-db:27017/cortex_memory?authSource=admin
ENV DOCS_DIR=/app/docs
COPY --from=pruner /app/out/json/ .
COPY --from=pruner /app/out/pnpm-lock.yaml ./pnpm-lock.yaml
RUN --mount=type=cache,id=pnpm-store-shared,target=/pnpm/store \
    pnpm install --frozen-lockfile
COPY --from=pruner /app/out/full/ .
RUN pnpm --filter @tupynambalucas-dev/cortex-memory-api... build
COPY corporate/collections/namespaces/portal/content ./docs
WORKDIR /app/hub/cortex/memory/services/api
EXPOSE 3006
CMD ["node", "dist/index.js"]

# ---- Stage 6: Prod Profile (Run) ----
FROM node:22-alpine AS prod
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=3006
ENV HOST=0.0.0.0
ENV DOCS_DIR=/app/docs

COPY --from=deployer /prod/app ./
COPY --from=builder /app/hub/cortex/memory/services/api/dist ./dist
# Use root context to copy docs since skaffold context is ..
COPY corporate/collections/namespaces/portal/content ./docs

EXPOSE 3006
CMD ["node", "dist/index.js"]

