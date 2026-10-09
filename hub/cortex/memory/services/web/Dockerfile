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

FROM nginx:alpine AS runner
COPY --from=builder /app/cortex/memory/services/web/dist /usr/share/nginx/html
# context is root
COPY cortex/memory/services/web/nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 9006
CMD ["nginx", "-g", "daemon off;"]
