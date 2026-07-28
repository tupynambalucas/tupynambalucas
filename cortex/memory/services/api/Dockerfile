FROM node:22-alpine AS builder
WORKDIR /workspace
ENV CI=true

COPY pnpm-lock.yaml pnpm-workspace.yaml package.json ./
COPY shared/config/package.json ./shared/config/
COPY cortex/memory/packages/core/package.json ./cortex/memory/packages/core/
COPY cortex/memory/services/api/package.json ./cortex/memory/services/api/

RUN npm install -g pnpm && pnpm install --frozen-lockfile

COPY shared/config ./shared/config
COPY cortex/memory/packages/core ./cortex/memory/packages/core
COPY cortex/memory/services/api ./cortex/memory/services/api

RUN pnpm --filter @tupynambalucas-cortex/memory-core build
RUN pnpm --filter @tupynambalucas-cortex/memory-api build
RUN pnpm --filter @tupynambalucas-cortex/memory-api deploy --legacy --prod /out

FROM node:22-alpine AS runner
WORKDIR /app

ENV NODE_ENV=development
ENV PORT=3006
ENV HOST=0.0.0.0
ENV MONGODB_URI=mongodb://cortex_admin:cortex_password_dev@mongodb-db:27017/cortex_memory?authSource=admin

COPY --from=builder /out ./
COPY docs ./docs

EXPOSE 3006
CMD ["node", "dist/index.js"]
