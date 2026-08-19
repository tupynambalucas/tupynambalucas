<context-hierarchy>
  <parent src="../../AGENTS.md" type="global-rules" />
  <parent src="../AGENTS.md" type="bounded-context-rules" />
  <system-instruction>
    AGENT: If you have not read "../../AGENTS.md" and "../AGENTS.md" in this session, stop now
    and read both files using your file-reading tools before proceeding.
  </system-instruction>
</context-hierarchy>

# Local Context: Model Context Protocol (MCP) Ecosystem

This workspace context ([mcp/](./)) orchestrates the Model Context Protocol (MCP) data plane subsystem within the AI Cortex architecture, containing the ExtMCP policy guardrails server, developer inspector, and containerized downstream tool server adapters.

---

## 1. Directory Layout

- **[guardrails/](./guardrails/)**: Standalone gRPC ExtMCP policy processor for AgentGateway payload validation, tool description enrichment, and host URL mutation.
- **[inspector/](./inspector/)**: MCP Inspector web UI available at `http://localhost:6274` during development. Use exclusively for debugging tool schema definitions and live request inspection. MUST NOT be exposed in production environments.
- **[services/](./services/)**: Containerized downstream MCP tool server adapters:
  - **[context7](./services/context7/)**: Real-time framework documentation and code snippet search tools.
  - **[firecrawl](./services/firecrawl/)**: Web scraping, crawling, searching, document parsing, and autonomous research tools.
  - **[github](./services/github/)**: GitHub REST/GraphQL API integration for repository, PR, issue, commit, and Copilot management.
  - **[grafana](./services/grafana/)**: Observability tools for Prometheus metrics, Loki logs, Tempo traces, and Pyroscope profiles.
  - **[memory](./services/memory/)**: RAG vector search, episodic chat history, entity graph, and document ingestion tools.
  - **[playwright](./services/playwright/)**: Headless browser automation and accessibility snapshot tools using Chromium.

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

### Guardrails Service Rules

- The `mcp-guardrails` gRPC server MUST implement `tools/call` and `tools/list` ExtMCP handlers.
- All handler functions MUST be wrapped in try/catch and return `{ pass: {} }` on any parsing exception to enforce the fail-open high-availability contract.
- Tool description enrichment MUST add the configured `system_instruction` field to each tool metadata object before returning to AgentGateway.
- `localhost` URL mutation MUST rewrite all tool argument URLs matching `localhost` patterns to `host.docker.internal` equivalents for containerized browser tools.
- Asynchronous file reads for instruction enrichment MUST be cached in memory (`instructionsCache`) to minimize latency during tool discovery phases.
