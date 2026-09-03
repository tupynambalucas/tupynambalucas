FROM node:22-alpine AS builder
WORKDIR /workspace
ENV CI=true

COPY pnpm-lock.yaml pnpm-workspace.yaml package.json ./
COPY shared/config/package.json ./shared/config/
COPY studio/assets/package.json ./studio/assets/
COPY cortex/memory/packages/core/package.json ./cortex/memory/packages/core/
COPY cortex/memory/services/web/package.json ./cortex/memory/services/web/

RUN npm install -g pnpm && pnpm install --frozen-lockfile

COPY shared/config ./shared/config
COPY studio/assets ./studio/assets
COPY cortex/memory/packages/core ./cortex/memory/packages/core
RUN echo "clean_web_build_final_2" > /workspace/.build_version
COPY cortex/memory/services/web ./cortex/memory/services/web

RUN pnpm --filter @monorepo/cortex-memory-core build
RUN pnpm --filter @monorepo/cortex-memory-web build

FROM nginx:alpine
RUN echo "clean_nginx_runner_final_2" > /etc/build_version
COPY --from=builder /workspace/cortex/memory/services/web/dist /usr/share/nginx/html
COPY cortex/memory/services/web/nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 9006
CMD ["nginx", "-g", "daemon off;"]
