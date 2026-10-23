# =================================================================== #
# hub/cortex/mcp/services/context7 — Context7 MCP service
# =================================================================== #

# ---- Stage 1: Base ----
FROM node:22-slim AS base
WORKDIR /app

RUN npm install -g @upstash/context7-mcp@latest

EXPOSE 8080

# ---- Stage 2: Dev Profile ----
FROM base AS dev
ENV NODE_ENV=development
ENV PORT=8080
CMD ["context7-mcp", "--transport", "http", "--port", "8080"]

# ---- Stage 3: Prod Profile ----
FROM base AS prod
ENV NODE_ENV=production
ENV PORT=8080
CMD ["context7-mcp", "--transport", "http", "--port", "8080"]
