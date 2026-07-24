FROM node:22-alpine AS builder
WORKDIR /workspace

COPY pnpm-lock.yaml pnpm-workspace.yaml package.json ./
COPY shared/config/package.json ./shared/config/
COPY cortex/memory/packages/core/package.json ./cortex/memory/packages/core/
COPY cortex/memory/services/api/package.json ./cortex/memory/services/api/

RUN npm install -g pnpm && pnpm install --frozen-lockfile

COPY shared/config ./shared/config
COPY cortex/memory/packages/core ./cortex/memory/packages/core
COPY cortex/memory/services/api ./cortex/memory/services/api

RUN pnpm --filter @tupynambalucas-cortex-memory/core build
RUN pnpm --filter @tupynambalucas-cortex-memory/api build

FROM node:22-alpine
WORKDIR /app
COPY --from=builder /workspace/cortex/memory/services/api/dist ./dist
COPY --from=builder /workspace/cortex/memory/services/api/node_modules ./node_modules
COPY --from=builder /workspace/cortex/memory/packages/core ./cortex/memory/packages/core
COPY docs ./docs

EXPOSE 3006
CMD ["node", "dist/index.js"]
