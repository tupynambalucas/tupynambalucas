# Model Context Protocol (MCP) Ecosystem

The `mcp/` directory houses the Model Context Protocol (MCP) data plane subsystem for the tupynambalucas.dev AI Cortex architecture. It consolidates policy guardrails and containerized downstream MCP server adapters.

---

## Domain Structure

- **[guardrails/](./guardrails/)**: Standalone gRPC ExtMCP policy processor for AgentGateway payload validation, URL mutation, and tool listing enrichment ([guardrails/README.md](./guardrails/README.md)).
- **[services/](./services/)**: Containerized downstream MCP tool service adapters:
  - **[context7/](./services/context7/)**: Context7 documentation and code search tools.
  - **[firecrawl/](./services/firecrawl/)**: Web scraping, crawling, and autonomous web research.
  - **[github/](./services/github/)**: GitHub REST/GraphQL API integration for repository and issue management.
  - **[grafana/](./services/grafana/)**: Observability tools for Prometheus metrics, Loki logs, Tempo traces, and Pyroscope profiles.
  - **[playwright/](./services/playwright/)**: Headless Chromium browser automation and accessibility snapshots.

---

## Operational Workflow

1. **Policy Enforcement**: Tool invocations pass through the ExtMCP guardrail server ([guardrails/](./guardrails/)) before reaching backend adapters.
2. **Container Networking**: MCP server containers run inside the `cortex-net` Docker network orchestrated via [compose.yaml](../infrastructure/docker/compose.yaml).
3. **Gateway Registration**: Services are exposed to AI agents via `agentgateway` endpoints configured in [config.yaml](../gateway/config.yaml).
