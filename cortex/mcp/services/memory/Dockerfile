FROM node:22-alpine AS builder
WORKDIR /workspace
ENV CI=true

COPY pnpm-lock.yaml pnpm-workspace.yaml package.json ./
COPY shared/config/package.json ./shared/config/
COPY cortex/memory/packages/core/package.json ./cortex/memory/packages/core/
COPY cortex/mcp/services/memory/package.json ./cortex/mcp/services/memory/

RUN npm install -g pnpm && pnpm install --frozen-lockfile

COPY shared/config ./shared/config
COPY cortex/memory/packages/core ./cortex/memory/packages/core
COPY cortex/mcp/services/memory ./cortex/mcp/services/memory

RUN pnpm --filter @tupynambalucas-cortex/memory-core build
RUN pnpm --filter @tupynambalucas-cortex/mcp-memory build
RUN pnpm --filter @tupynambalucas-cortex/mcp-memory deploy --legacy --prod /out

FROM node:22-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=8080

COPY --from=builder /out ./

EXPOSE 8080

CMD ["node", "dist/index.js"]
