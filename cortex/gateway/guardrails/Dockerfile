FROM node:22-alpine AS builder
WORKDIR /workspace
ENV CI=true

COPY pnpm-lock.yaml pnpm-workspace.yaml package.json .npmrc ./
COPY shared/config/package.json ./shared/config/
COPY cortex/gateway/guardrails/package.json ./cortex/gateway/guardrails/

RUN npm install -g pnpm && pnpm install --frozen-lockfile

COPY shared/config ./shared/config
COPY cortex/gateway/guardrails ./cortex/gateway/guardrails

RUN pnpm --filter @tupynambalucas/cortex-mcp-guardrails build
RUN pnpm --filter @tupynambalucas/cortex-mcp-guardrails deploy --legacy --prod /out

FROM node:22-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production

COPY --from=builder /out ./

EXPOSE 9001

CMD ["node", "dist/index.js"]
