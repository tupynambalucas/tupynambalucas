FROM node:22-alpine AS builder
WORKDIR /workspace
ENV CI=true
ARG VITE_API_URL
ENV VITE_API_URL=$VITE_API_URL

COPY pnpm-lock.yaml pnpm-workspace.yaml package.json .npmrc ./
COPY shared/config/package.json ./shared/config/
COPY studio/design/package.json ./studio/design/
COPY cortex/memory/packages/core/package.json ./cortex/memory/packages/core/
COPY cortex/memory/services/web/package.json ./cortex/memory/services/web/

RUN npm install -g pnpm && pnpm install --frozen-lockfile

COPY shared/config ./shared/config
COPY studio/design ./studio/design
COPY cortex/memory/packages/core ./cortex/memory/packages/core
COPY cortex/memory/services/web ./cortex/memory/services/web

RUN pnpm --filter @tupynambalucas-cortex-memory/core build
RUN pnpm --filter @tupynambalucas-cortex-memory/web build

FROM nginx:alpine
COPY --from=builder /workspace/cortex/memory/services/web/dist /usr/share/nginx/html
COPY cortex/memory/services/web/nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 9006
CMD ["nginx", "-g", "daemon off;"]
