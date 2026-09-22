# Execution Plan: Optimize Monorepo Docker Builds

## Objective

Standardize all Node.js/PNPM Dockerfiles to use Turborepo prune and a globally shared BuildKit cache mount (id=pnpm-store-shared). This aligns with the community best practice for Skaffold + Turborepo + pnpm to achieve maximum build caching.

## Diagnosis

- hub services use urbo prune but isolate the pnpm cache (id=pnpm-instance-api).
- cortex services use manual package.json copying and no urbo prune, leading to cache invalidation and slow builds.

## Strategy (The "Pulo do Gato")

By utilizing --mount=type=cache,id=pnpm-store-shared,target=/pnpm/store, concurrent Skaffold builds will lock and share the pnpm virtual store on the host machine. This satisfies the requirement of installing dependencies only once across all concurrent builds.

## Action Items

1. **Hub Workspaces**: Update hub/services/api/Dockerfile and hub/services/web/Dockerfile.
   - Change id=pnpm-instance-api (and web) to id=pnpm-store-shared.
2. **Cortex Workspaces**: Refactor the following Dockerfiles to use the multi-stage urbo prune and shared cache mount:
   - cortex/mcp/guardrails/Dockerfile
   - cortex/mcp/services/firecrawl/Dockerfile
   - cortex/mcp/services/memory/Dockerfile
   - cortex/memory/services/api/Dockerfile
   - cortex/memory/services/web/Dockerfile

## Example Dockerfile Pattern

``dockerfile
FROM node:22-alpine AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable pnpm

FROM base AS pruner
WORKDIR /app
RUN pnpm add -g turbo@latest
COPY . .
RUN turbo prune @monorepo/app-name --docker

FROM base AS builder
WORKDIR /app
COPY --from=pruner /app/out/json/ .
COPY --from=pruner /app/out/pnpm-lock.yaml ./pnpm-lock.yaml
RUN --mount=type=cache,id=pnpm-store-shared,target=/pnpm/store \
 pnpm install --frozen-lockfile

COPY --from=pruner /app/out/full/ .
RUN pnpm --filter @monorepo/app-name... build

FROM base AS deployer
WORKDIR /app
COPY --from=builder /app .
RUN --mount=type=cache,id=pnpm-store-shared,target=/pnpm/store \
 pnpm --filter @monorepo/app-name --prod deploy --legacy /prod/app

FROM node:22-alpine AS runner
WORKDIR /app
COPY --from=deployer /prod/app .
CMD ["node", "dist/index.js"]
``
