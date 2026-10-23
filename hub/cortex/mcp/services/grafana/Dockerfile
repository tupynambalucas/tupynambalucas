# =================================================================== #
# hub/cortex/mcp/services/grafana — Grafana MCP service
# =================================================================== #

# ---- Stage 1: Base ----
FROM grafana/mcp-grafana:latest AS base

# AgentGateway expects the MCP services to run on port 8080.
EXPOSE 8080

# ---- Stage 2: Dev Profile ----
FROM base AS dev
CMD ["-t", "streamable-http", "--address", "0.0.0.0:8080", "-allowed-hosts", "*", "-allowed-origins", "*"]

# ---- Stage 3: Prod Profile ----
FROM base AS prod
CMD ["-t", "streamable-http", "--address", "0.0.0.0:8080", "-allowed-hosts", "*", "-allowed-origins", "*"]
