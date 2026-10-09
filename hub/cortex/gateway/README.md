# AgentGateway Ingress Subsystem

The `cortex/gateway/` directory contains configuration assets and container definitions for `agentgateway`, which serves as the unified API Ingress Gateway and proxy for all AI Cortex tools and Model Context Protocol (MCP) servers.

---

## Technology Stack

- **Gateway Engine**: AgentGateway (`cr.agentgateway.dev/agentgateway:latest`)
- **Protocol Support**: Model Context Protocol (MCP) over Streamable HTTP and Server-Sent Events (SSE)
- **Policy Processing**: gRPC ExtMCP Guardrails
- **Telemetry**: OpenTelemetry (OTLP gRPC) on port `4317`

---

## Components

- **[config.yaml](./config.yaml)**: Declarative gateway configuration specifying MCP targets, CORS headers, ExtMCP policy processors, and telemetry endpoints.
- **[Dockerfile](./Dockerfile)**: Container packaging bundling the configuration into the runtime image.

---

## Architecture & Upstream Targets

AgentGateway exposes unified HTTP endpoints for AI agent clients, routing incoming tool calls through gRPC policy guardrails before forwarding them to downstream MCP services:

| Target Name  | Endpoint URL                     | Description                                    |
| :----------- | :------------------------------- | :--------------------------------------------- |
| `github`     | `http://mcp-github:8080/mcp`     | GitHub REST/GraphQL automation adapter         |
| `context7`   | `https://mcp.context7.com/mcp`   | Context7 framework documentation search        |
| `firecrawl`  | `http://mcp-firecrawl:8080/mcp`  | Web scraping, crawling, and research tools     |
| `grafana`    | `http://mcp-grafana:8080/mcp`    | Observability metrics, logs, and trace queries |
| `playwright` | `http://mcp-playwright:8080/mcp` | Headless Chromium browser automation           |
| `memory`     | `http://mcp-memory:8080/mcp`     | Vector RAG memory and graph persistence        |

---

## Getting Started

AgentGateway is launched automatically when starting the AI Cortex ecosystem:

```bash
# Kubernetes development mode
pnpm cortex:dev

# Standalone Docker Compose mode
pnpm cortex:up
```

- Ingress Traffic: `http://localhost:8080`
- Web Administration UI: `http://localhost:15000`
- Prometheus Stats: `http://localhost:15001/stats/prometheus`
