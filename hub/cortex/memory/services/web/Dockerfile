FROM node:22-alpine AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PNPM_HOME/bin:$PATH"
RUN corepack enable pnpm

FROM base AS pruner
WORKDIR /app
RUN pnpm add -g turbo@latest
COPY . .
RUN turbo prune @monorepo/cortex-memory-web --docker

FROM base AS builder
WORKDIR /app
COPY --from=pruner /app/out/json/ .
COPY --from=pruner /app/out/pnpm-lock.yaml ./pnpm-lock.yaml
RUN --mount=type=cache,id=pnpm-store-shared,target=/pnpm/store \
    pnpm install --frozen-lockfile

COPY --from=pruner /app/out/full/ .
RUN pnpm --filter @monorepo/cortex-memory-web... build

# ---- Stage 4: Dev Profile (Build & Run) ----
FROM base AS dev
WORKDIR /app
ENV NODE_ENV=development
COPY --from=pruner /app/out/json/ .
COPY --from=pruner /app/out/pnpm-lock.yaml ./pnpm-lock.yaml
RUN --mount=type=cache,id=pnpm-store-shared,target=/pnpm/store \
    pnpm install --frozen-lockfile
COPY --from=pruner /app/out/full/ .
RUN pnpm --filter @monorepo/cortex-memory-web... build
WORKDIR /app/hub/cortex/memory/services/web
EXPOSE 9006
CMD ["pnpm", "dev", "--host", "0.0.0.0", "--port", "9006"]

# ---- Stage 5: Prod Profile (Run) ----
FROM nginx:alpine AS prod
COPY --from=builder /app/hub/cortex/memory/services/web/dist /usr/share/nginx/html
# context is root
COPY hub/cortex/memory/services/web/nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 9006
CMD ["nginx", "-g", "daemon off;"]
