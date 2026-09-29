FROM node:22-alpine AS base
WORKDIR /app
RUN corepack enable pnpm

# Dependências (Builder)
FROM base AS builder
COPY package.json pnpm-workspace.yaml pnpm-lock.yaml turbo.json ./
COPY knowledge-base/ knowledge-base/
COPY shared/ shared/
COPY knowledge-base/collections/domains/portal/translations/ knowledge-base/docusaurus/services/portal/i18n/
COPY studio/assets/ studio/assets/
RUN pnpm install --filter=@monorepo/kb-docusaurus-portal...
RUN pnpm --filter=@monorepo/kb-docusaurus-preset build && pnpm --filter=@monorepo/kb-docusaurus-theme build

# Execução (Runner)
FROM base AS runner
COPY --from=builder /app /app
WORKDIR /app/knowledge-base/docusaurus/services/portal

EXPOSE 3002
# Run the dev server with polling enabled for container compatibility
CMD ["pnpm", "exec", "docusaurus", "start", "--host", "0.0.0.0", "--port", "3002", "--poll", "1000"]
