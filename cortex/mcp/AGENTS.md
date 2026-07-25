# Local Context: Model Context Protocol (MCP) Ecosystem

This workspace context ([mcp/](./)) orchestrates the Model Context Protocol (MCP) data plane subsystem within the AI Cortex architecture, containing ExtMCP policy guardrails and containerized downstream tool server adapters.

---

## 1. Directory Layout

- **[guardrails/](./guardrails/)**: Standalone gRPC ExtMCP policy processor for AgentGateway payload validation, tool description enrichment, and host URL mutation ([guardrails/AGENTS.md](./guardrails/AGENTS.md)).
- **[services/](./services/)**: Containerized downstream MCP tool server adapters:
  - **[Context7 MCP](./services/context7/AGENTS.md)**: Real-time framework documentation and code snippet search tools.
  - **[Firecrawl MCP](./services/firecrawl/AGENTS.md)**: Web scraping, search, document parsing, and autonomous research tools.
  - **[GitHub MCP](./services/github/AGENTS.md)**: Repository, pull request, issue, branch, commit, and Copilot management tools.
  - **[Grafana MCP](./services/grafana/AGENTS.md)**: Observability, metrics (Prometheus), logs (Loki), traces (Tempo), and continuous profiling (Pyroscope) tools.
  - **[Playwright MCP](./services/playwright/AGENTS.md)**: Headless browser automation and accessibility snapshot tools using Chromium.

---

## 2. Architecture & Policy Pipeline

1. **Ingress Gating**: Client tool calls entering via `agentgateway` ([config.yaml](../gateway/config.yaml)) pass through the gRPC ExtMCP guardrail processor ([guardrails/](./guardrails/)).
2. **Payload Mutation**: The guardrail layer automatically transforms `localhost` references to `host.docker.internal` for containerized browser tools and enriches tool listing metadata.
3. **Downstream Execution**: Validated requests are routed to specific containerized MCP service adapters under [services/](./services/).

---

## 3. Operational & Security Guardrails

- **Host Resolution**: Tools executing network requests against host applications MUST use `http://host.docker.internal:<port>` inside containerized environments.
- **Credential Separation**: API keys and tokens MUST be configured via container environment files ([.env](../infrastructure/docker/.env)) and MUST NOT be hardcoded.
- **Fail-Safe Fallbacks**: ExtMCP guardrail handlers MUST catch parsing exceptions and return pass-through policies to prevent service interruption.
