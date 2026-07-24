FROM node:22-alpine AS builder
WORKDIR /workspace

COPY pnpm-lock.yaml pnpm-workspace.yaml package.json ./
COPY shared/config/package.json ./shared/config/
COPY cortex/gateway/guardrails/package.json ./cortex/gateway/guardrails/

RUN npm install -g pnpm && pnpm install --frozen-lockfile

COPY shared/config ./shared/config
COPY cortex/gateway/guardrails ./cortex/gateway/guardrails

RUN pnpm --filter @tupynambalucas/cortex-mcp-guardrails build

FROM node:22-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production

COPY --from=builder /workspace/cortex/gateway/guardrails/dist ./dist
COPY --from=builder /workspace/cortex/gateway/guardrails/node_modules ./node_modules
COPY --from=builder /workspace/cortex/gateway/guardrails/proto ./proto

EXPOSE 9001

CMD ["node", "dist/index.js"]
