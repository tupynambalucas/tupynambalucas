# =================================================================== #
# @tupynambalucas-dev/corporate-portal — Multi-Stage Dockerfile
# Stages:
# - base: Shared Node.js runtime and Corepack/pnpm setup
# - builder: Workspace dependencies compilation and static build
# - dev: Live development profile with polling and hot reload
# - prod: Production profile serving static bundle via Nginx
# =================================================================== #

# ---- Stage 1: Base Runtime ----
FROM node:22-alpine AS base
WORKDIR /app
RUN corepack enable pnpm

# ---- Stage 2: Builder ----
FROM base AS builder
COPY package.json pnpm-workspace.yaml pnpm-lock.yaml turbo.json CHANGELOG*.md ROADMAP.md ./
COPY corporate/ corporate/
COPY shared/ shared/
COPY hub/studio/assets/ hub/studio/assets/
RUN pnpm install --filter=@tupynambalucas-dev/corporate-portal...
RUN pnpm --filter @tupynambalucas-dev/corporate-portal... build

# ---- Stage 3: Dev Profile (Build & Run) ----
FROM base AS dev
COPY --from=builder /app /app
WORKDIR /app/corporate/services/portal
ENV NODE_ENV=development
EXPOSE 3002
CMD ["pnpm", "exec", "docusaurus", "start", "--host", "0.0.0.0", "--port", "3002", "--poll", "1000"]

# ---- Stage 4: Prod Profile (Run) ----
FROM nginx:alpine AS prod
COPY --from=builder /app/corporate/services/portal/build /usr/share/nginx/html
RUN sed -i 's/listen       80;/listen       3002;/g' /etc/nginx/conf.d/default.conf
EXPOSE 3002
CMD ["nginx", "-g", "daemon off;"]


