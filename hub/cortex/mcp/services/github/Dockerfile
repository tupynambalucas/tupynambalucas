# =================================================================== #
# hub/cortex/mcp/services/github — GitHub MCP service
# =================================================================== #

# ---- Stage 1: Base ----
FROM ghcr.io/github/github-mcp-server:latest AS base
EXPOSE 8080

# ---- Stage 2: Dev Profile ----
FROM base AS dev
ENTRYPOINT ["/server/github-mcp-server", "http", "--listen-host", "0.0.0.0", "--port", "8080"]

# ---- Stage 3: Prod Profile ----
FROM base AS prod
ENTRYPOINT ["/server/github-mcp-server", "http", "--listen-host", "0.0.0.0", "--port", "8080"]
