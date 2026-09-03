<context-hierarchy>
  <parent src="../../AGENTS.md" type="global-rules" />
  <parent src="../AGENTS.md" type="bounded-context-rules" />
  <system-instruction>
    AGENT: If you have not read "../../AGENTS.md" and "../AGENTS.md" in this session, stop now
    and read both files using your file-reading tools before proceeding.
  </system-instruction>
</context-hierarchy>

# Local Context: Model Context Protocol (MCP) Ecosystem

This bounded context ([mcp/](./)) orchestrates the Model Context Protocol (MCP) data plane
subsystem within the AI Cortex architecture, containing the ExtMCP policy guardrails server,
developer inspector, and containerized downstream tool server adapters.

---

## 1. Directory Layout

- [guardrails/](./guardrails/): Standalone gRPC ExtMCP policy processor for AgentGateway
  payload validation and transparent network mutation.
- [inspector/](./inspector/): MCP Inspector web UI available at `http://localhost:6274` during
  development. Use exclusively for debugging tool schema definitions and live request inspection.
  MUST NOT be exposed in production environments.
- [services/](./services/): Containerized downstream MCP tool server adapters:
  - [context7](./services/context7/): Real-time framework documentation and code snippet search
    tools.
  - [firecrawl](./services/firecrawl/): Web scraping, crawling, searching, document parsing, and
    autonomous research tools (`scrape`, `crawl`, `search`, `map`, `extract`, `batch_scrape`).
  - [github](./services/github/): GitHub REST/GraphQL API integration for repository, PR, issue,
    commit, and Copilot management.
  - [grafana](./services/grafana/): Observability tools for Prometheus metrics, Loki logs, Tempo
    traces, and Pyroscope profiles.
  - [memory](./services/memory/): RAG vector search, episodic chat history, knowledge graph
    traversal, and document ingestion tools (`search_knowledge`, `store_episodic`, `query_graph`,
    `ingest_document`).
  - [playwright](./services/playwright/): Headless browser automation and accessibility snapshot
    tools using Chromium.

---

## 2. Architecture & Policy Pipeline

1. **Ingress Routing**: Client tool calls entering via `agentgateway` ([config.yaml](../gateway/config.yaml))
   pass through the gRPC ExtMCP guardrail processor ([guardrails/](./guardrails/)).
2. **Payload Mutation**: The guardrail layer acts as a Transparent Network Proxy, automatically
   recursively traversing JSON arguments in any tool call and transforming `localhost` references
   to `host.docker.internal` to resolve container-to-host networking.
3. **Downstream Dispatch**: Validated requests are routed to specific containerized MCP service
   adapters under [services/](./services/).
4. **Docs Ingestion Flow**: The `mcp-memory` `ingest_document` tool triggers
   `POST /api/memory/ingest/docs` on `memory-api`, which re-scans the bundled `/app/docs`
   directory and re-embeds changed files into the MongoDB vector store.

---

## 3. Operational & Security Guardrails

- **Host Application Resolution**: Containerized tools accessing developer applications running on
  the host machine will have their payloads automatically mutated by the Guardrails. Agents can
  just send `localhost` naturally.
- **Credential Separation**: API keys and tokens MUST be configured via container environment
  files ([.env](../infrastructure/.env)) and MUST NOT be hardcoded.
- **Fail-Safe Fallbacks**: ExtMCP guardrail handlers MUST catch parsing exceptions and return
  pass-through policies (`{ pass: {} }`) to prevent service interruption.
- **Relative Linking**: All references MUST use relative Markdown links without enclosing
  backticks.

### Guardrails Service Rules

- The `mcp-guardrails` gRPC server MUST implement the `tools/call` ExtMCP handler for request
  mutation and the `tools/list` ExtMCP handler for passthrough.
- All handler functions MUST be wrapped in try/catch and return `{ pass: {} }` on any parsing
  exception to enforce the fail-open high-availability contract.
- Transparent proxying MUST recursively traverse object properties, arrays, and strings in the
  request arguments to ensure complete `localhost` URL translation.
