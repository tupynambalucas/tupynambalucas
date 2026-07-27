# Local Context: Cortex MCP Inspector Subsystem

This workspace directory ([inspector/](./)) configures the containerized Model Context Protocol (MCP) Inspector developer interface (`mcp-inspector`) for interactive testing of Cortex MCP tool services.

---

## 1. Directory Layout

- **[Dockerfile](./Dockerfile)**: Container build definition running `@modelcontextprotocol/inspector` on Alpine Node.js.
- **[mcp.json](./mcp.json)**: Configuration manifest defining target MCP servers over `cortex-net` (`http://mcp-memory:8080/mcp`).

---

## 2. Operational Guardrails

- **Centralized Inspection**: Provides unified UI access on port `6274` and proxy port `6277` for registered Cortex MCP services.
- **Unified Docker Compose Execution**: Started alongside core infrastructure (`pnpm cortex:core:up`). Connects directly to `mcp-memory` over container network `cortex-net` (`http://mcp-memory:8080/mcp`).
- **Container Hot-Reloading**: `mcp-memory` runs with target `builder` and volume-mounted `src/` directory in [compose.yaml](../../infrastructure/docker/compose.yaml), hot-reloading code changes instantly in container.
