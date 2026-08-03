# Local Context: Cortex MCP Inspector Subsystem

This workspace directory ([inspector/](./)) configures the containerized Model Context Protocol (MCP) Inspector developer interface (`mcp-inspector`) for interactive testing of Cortex MCP tool services.

---

## 1. Directory Layout

- **[Dockerfile](./Dockerfile)**: Container build definition running `@modelcontextprotocol/inspector` on Alpine Node.js.
- **[mcp.json](./mcp.json)**: Configuration manifest defining target MCP servers over `cortex-net` (`http://mcp-memory:8080/mcp`).

---

## 2. Operational Guardrails

- **Centralized Inspection**: Provides unified UI access on port `6274` and proxy port `6277` for
  registered Cortex MCP services.
- **Service Execution**: Started alongside core infrastructure (via `pnpm cortex:up` or
  `pnpm cortex:dev`). Connects to `mcp-memory` inside the container network.
- **Container Hot-Reloading**: In Docker Compose, services run with volume mounts mapping code
  changes dynamically.
