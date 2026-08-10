# Local Context: Cortex MCP Inspector Subsystem

This workspace directory ([inspector/](./)) configures the containerized Model Context Protocol (MCP) Inspector developer interface (`mcp-inspector`) for interactive testing of Cortex MCP tool services.

---

## 1. Directory Layout

- **[Dockerfile](./Dockerfile)**: Container build definition running `@modelcontextprotocol/inspector` on Alpine Node.js.
- **[mcp.json](./mcp.json)**: Server configuration manifest mapping target MCP endpoints (`http://agentgateway:8080/mcp/http`).

---

## 2. Operational Guardrails

- **Centralized Gateway Connection**: The inspector connects directly to AgentGateway (`http://agentgateway:8080/mcp/http`) over the container network, giving unified access to all downstream MCP services.
- **Port Allocation**: Client web UI listens on port `6274`, and proxy server listens on port `6277`.
- **Authentication Bypass in Dev**: Runs with `DANGEROUSLY_OMIT_AUTH=true` and `DANGEROUSLY_BIND_ALL_INTERFACES=true` for local development.
- **Live Syncing**: In Kubernetes development with Skaffold, [mcp.json](./mcp.json) is automatically synced into `/app/mcp.json` inside the running pod.
