# Local Context: Cortex MCP Inspector Subsystem

This workspace directory ([inspector/](./)) configures the containerized Model Context Protocol (MCP) Inspector developer interface (`mcp-inspector`) for interactive testing of Cortex MCP tool services.

---

## 1. Directory Layout

- **[Dockerfile](./Dockerfile)**: Container build definition running `@modelcontextprotocol/inspector` on Alpine Node.js.
- **[mcp.json](./mcp.json)**: Dynamic configuration manifest defining target custom MCP servers (`memory`).

---

## 2. Operational Guardrails

- **Centralized Inspection**: Provides unified UI access on port `6274` and proxy port `6277` for registered Cortex MCP services.
- **Host Resolution**: Targets point to host development applications via `host.docker.internal` (`http://host.docker.internal:9007/mcp`) enabled by `extra_hosts` in [compose.yaml](../../infrastructure/docker/compose.yaml).
- **Development Profile**: Assigned to profile `core` in [compose.yaml](../../infrastructure/docker/compose.yaml).
