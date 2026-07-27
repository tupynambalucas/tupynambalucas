FROM node:22-alpine AS base
RUN corepack enable && corepack prepare pnpm@latest --activate

FROM base AS builder
WORKDIR /app
COPY package.json pnpm-workspace.yaml pnpm-lock.yaml ./
COPY cortex/mcp/services/memory/package.json ./cortex/mcp/services/memory/
COPY cortex/memory/packages/core/package.json ./cortex/memory/packages/core/
RUN pnpm install --frozen-lockfile

COPY cortex/tsconfig.json ./cortex/
COPY shared/config/ ./shared/config/
COPY cortex/memory/packages/core/ ./cortex/memory/packages/core/
COPY cortex/mcp/services/memory/ ./cortex/mcp/services/memory/

RUN pnpm --filter @tupynambalucas-cortex/memory-core build
RUN pnpm --filter @tupynambalucas-cortex/mcp-memory build

FROM base AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=8080

COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/cortex/mcp/services/memory/dist ./dist
COPY --from=builder /app/cortex/mcp/services/memory/package.json ./package.json

EXPOSE 8080
CMD ["node", "dist/index.js"]
