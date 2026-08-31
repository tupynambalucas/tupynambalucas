FROM node:22-alpine AS builder
WORKDIR /workspace
ENV CI=true

COPY pnpm-lock.yaml pnpm-workspace.yaml package.json ./
COPY shared/config/package.json ./shared/config/
COPY cortex/mcp/services/firecrawl/package.json ./cortex/mcp/services/firecrawl/

RUN npm install -g pnpm && pnpm install --frozen-lockfile

COPY shared/config ./shared/config
COPY cortex/mcp/services/firecrawl ./cortex/mcp/services/firecrawl

RUN pnpm --filter @tupynambalucas-cortex/mcp-firecrawl build
RUN pnpm --filter @tupynambalucas-cortex/mcp-firecrawl deploy --legacy --prod /out

FROM node:22-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=8080

COPY --from=builder /out ./

EXPOSE 8080

CMD ["node", "dist/index.js"]
