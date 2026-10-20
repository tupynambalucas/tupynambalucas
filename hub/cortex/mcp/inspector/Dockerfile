# =================================================================== #
# hub/cortex/mcp/inspector — Model Context Protocol Inspector
# =================================================================== #

# ---- Stage 1: Base ----
FROM node:22-alpine AS base

WORKDIR /app

RUN npm install -g @modelcontextprotocol/inspector@latest

COPY hub/cortex/mcp/inspector/mcp.json /app/mcp.json

ENV HOST=0.0.0.0
ENV MCP_AUTO_OPEN_ENABLED=false
ENV DANGEROUSLY_OMIT_AUTH=true
ENV DANGEROUSLY_BIND_ALL_INTERFACES=true

EXPOSE 6274 6277

# ---- Stage 2: Dev Profile ----
FROM base AS dev
ENTRYPOINT ["npx", "@modelcontextprotocol/inspector", "--config", "/app/mcp.json"]

# ---- Stage 3: Prod Profile ----
FROM base AS prod
ENTRYPOINT ["npx", "@modelcontextprotocol/inspector", "--config", "/app/mcp.json"]
