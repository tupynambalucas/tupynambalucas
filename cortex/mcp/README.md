# Model Context Protocol (MCP) Ecosystem

The `cortex/mcp/` directory houses the Model Context Protocol (MCP) data plane subsystem for the %PROJECT_DOMAIN% AI Cortex architecture. It consolidates runtime policy guardrails, developer inspection tools, and containerized downstream MCP server adapters.

---

## Technology Stack

- **Protocol**: Model Context Protocol (MCP) over Streamable HTTP and SSE transports
- **Guardrails**: Node.js 22, gRPC (`@grpc/grpc-js`, `@grpc/proto-loader`), Protocol Buffers
- **Inspector**: `@modelcontextprotocol/inspector`
- **Adapters**: GitHub MCP Server, Firecrawl MCP, Grafana MCP, Playwright MCP, Custom Memory MCP

---

## Subsystem Structure

- **[guardrails/](./guardrails/README.md)**: Standalone gRPC ExtMCP policy processor for AgentGateway payload validation, URL mutation, and tool listing enrichment ([guardrails/README.md](./guardrails/README.md)).
- **[inspector/](./inspector/README.md)**: Containerized web UI for inspecting and testing MCP tool servers dynamically ([inspector/README.md](./inspector/README.md)).
- **[services/](./services/)**: Containerized downstream MCP tool server adapters:
  - **[context7/](./services/context7/README.md)**: Context7 framework documentation and code snippet retrieval tools ([context7/README.md](./services/context7/README.md)).
  - **[firecrawl/](./services/firecrawl/README.md)**: Web scraping, crawling, structured data extraction, and autonomous web research ([firecrawl/README.md](./services/firecrawl/README.md)).
  - **[github/](./services/github/README.md)**: GitHub REST/GraphQL API automation for repositories, issues, PRs, and Copilot ([github/README.md](./services/github/README.md)).
  - **[grafana/](./services/grafana/README.md)**: Observability tools for Prometheus metrics, Loki logs, Tempo traces, and Pyroscope flamegraphs ([grafana/README.md](./services/grafana/README.md)).
  - **[memory/](./services/memory/README.md)**: Semantic RAG vector retrieval, episodic chat persistence, and entity graph querying ([memory/README.md](./services/memory/README.md)).
  - **[playwright/](./services/playwright/README.md)**: Headless Chromium browser automation, accessibility snapshots, and form interactions ([playwright/README.md](./services/playwright/README.md)).

---

## Operational Workflow

1. **Policy Enforcement**: Tool invocations pass through the ExtMCP guardrail server ([guardrails/](./guardrails/README.md)) before reaching backend adapters.
2. **Container Networking**: MCP server containers execute inside the `cortex` namespace within the Kubernetes cluster (orchestrated via [skaffold.yaml](../skaffold.yaml)) or inside the `cortex-net` bridge network in Docker Compose (orchestrated via [compose.yaml](../infrastructure/docker/compose.yaml)).
3. **Gateway Registration**: Services are exposed to AI agents via `agentgateway` endpoints configured in [config.yaml](../gateway/config.yaml).
