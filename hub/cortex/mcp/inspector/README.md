# Cortex MCP Inspector Service

The `cortex/mcp/inspector` workspace provides a containerized web interface powered by `@modelcontextprotocol/inspector` for inspecting, debugging, and testing Model Context Protocol (MCP) tool servers within the AI Cortex ecosystem.

---

## Technology Stack

- **Tool**: `@modelcontextprotocol/inspector`
- **Runtime**: Node.js 22 Alpine
- **Ports**: `6274` (Web Interface), `6277` (Proxy Server)

---

## Features

- **Centralized UI**: Visual developer interface accessible at `http://localhost:6274`.
- **Gateway Integration**: Configured via `mcp.json` to route through AgentGateway (`http://agentgateway:8080/mcp/http`), providing visibility into all registered tools (`memory`, `github`, `firecrawl`, `grafana`, `playwright`, `context7`).
- **Live Tool Testing**: Interactive execution of tool schemas, prompts, resources, and live response payloads.

---

## Getting Started

The MCP Inspector starts automatically when running Cortex:

```bash
# Kubernetes development
pnpm cortex:dev

# Docker Compose development
pnpm cortex:up
```

Open `http://localhost:6274` in your browser to inspect available MCP tools and test invocations.
