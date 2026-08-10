# Local Context: Model Context Protocol (MCP) Ecosystem

This workspace context ([mcp/](./)) orchestrates the Model Context Protocol (MCP) data plane subsystem within the AI Cortex architecture, containing the ExtMCP policy guardrails server, developer inspector, and containerized downstream tool server adapters.

---

## 1. Directory Layout

- **[guardrails/](./guardrails/AGENTS.md)**: Standalone gRPC ExtMCP policy processor for AgentGateway payload validation, tool description enrichment, and host URL mutation ([guardrails/AGENTS.md](./guardrails/AGENTS.md)).
- **[inspector/](./inspector/AGENTS.md)**: Containerized developer interface for dynamic MCP tool server inspection and debugging ([inspector/AGENTS.md](./inspector/AGENTS.md)).
- **[services/](./services/)**: Containerized downstream MCP tool server adapters:
  - **[context7](./services/context7/AGENTS.md)**: Real-time framework documentation and code snippet search tools ([context7/AGENTS.md](./services/context7/AGENTS.md)).
  - **[firecrawl](./services/firecrawl/AGENTS.md)**: Web scraping, crawling, searching, document parsing, and autonomous research tools ([firecrawl/AGENTS.md](./services/firecrawl/AGENTS.md)).
  - **[github](./services/github/AGENTS.md)**: GitHub REST/GraphQL API integration for repository, PR, issue, commit, and Copilot management ([github/AGENTS.md](./services/github/AGENTS.md)).
  - **[grafana](./services/grafana/AGENTS.md)**: Observability tools for Prometheus metrics, Loki logs, Tempo traces, and Pyroscope profiles ([grafana/AGENTS.md](./services/grafana/AGENTS.md)).
  - **[memory](./services/memory/AGENTS.md)**: RAG vector search, episodic chat history, entity graph, and document ingestion tools ([memory/AGENTS.md](./services/memory/AGENTS.md)).
  - **[playwright](./services/playwright/AGENTS.md)**: Headless browser automation and accessibility snapshot tools using Chromium ([playwright/AGENTS.md](./services/playwright/AGENTS.md)).

---

## 2. Architecture & Policy Pipeline

1. **Ingress Routing**: Client tool calls entering via `agentgateway` ([config.yaml](../gateway/config.yaml)) pass through the gRPC ExtMCP guardrail processor ([guardrails/](./guardrails/)).
2. **Payload Mutation**: The guardrail layer automatically transforms `localhost` references to `host.docker.internal` for containerized browser tools and enriches tool listing metadata with service instructions.
3. **Downstream Dispatch**: Validated requests are routed to specific containerized MCP service adapters under [services/](./services/).

---

## 3. Operational & Security Guardrails

- **Host Application Resolution**: Containerized tools executing network calls against developer applications running on the host machine MUST use `http://host.docker.internal:<port>`.
- **Credential Separation**: API keys and tokens MUST be configured via container environment files ([.env](../infrastructure/.env)) and MUST NOT be hardcoded.
- **Fail-Safe Fallbacks**: ExtMCP guardrail handlers MUST catch parsing exceptions and return pass-through policies (`{ pass: {} }`) to prevent service interruption.
- **Relative Linking**: All references MUST use relative Markdown links without enclosing backticks.
