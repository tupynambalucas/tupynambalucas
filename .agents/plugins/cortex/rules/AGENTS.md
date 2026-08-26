# Cortex Plugin - MCP Service Instructions

All services below are accessed through the single AgentGateway ingress at
`agentgateway-mcp-dev.tupynambalucas.dev`. Do not pass credentials directly to any
individual service tool.

---

## AgentGateway Routing

When multiple tools could satisfy a request, select the most specific one:

- **Web content extraction**: prefer `firecrawl_scrape` over Playwright for static pages.
- **Browser interaction or visual inspection**: use Playwright when JavaScript rendering or UI
  interaction is required.
- **Observability data**: use Grafana tools. Never query Prometheus or Loki directly.
- **Documentation lookup**: use Context7 before falling back to web search.
- **Memory and knowledge retrieval**: use Memory tools for persistent entity graphs and RAG search.

---

## Firecrawl

The Firecrawl MCP server provides web scraping, crawling, searching, document parsing, and
autonomous research capabilities.

### Environment and Network Routing

- When scraping or interacting with local development applications running on the developer's host
  machine, ALWAYS substitute `localhost` or `127.0.0.1` with `host.docker.internal`.
- Automatic target URL mapping for local applications (do not query the user for URLs):
  - **docs** (Docusaurus dev server): `http://host.docker.internal:3002`
  - **hub-web** (Vite/React dev server): `http://host.docker.internal:5173`
  - **hub-api** (Fastify REST API): `http://host.docker.internal:3000`

### Tool Execution Best Practices

- **Scrape vs. Crawl**: Prefer `firecrawl_scrape` for single-page text extraction. Use
  `firecrawl_crawl` only when full multi-page site discovery is required.
- **Structured Data**: Use `firecrawl_extract` when schema-conforming JSON entity extraction is
  required from web sources.
- **Academic Research**: Use `firecrawl_research_search_papers` and `firecrawl_research_read_paper`
  for querying academic literature.

---

## GitHub

The GitHub MCP server provides repository, issue, pull request, commit, and Copilot management
tools.

### Operational Rules

- **Branch Safety**: Always create a dedicated branch (`github_create_branch`) before committing
  changes or opening pull requests. Never push directly to `main` or `master`.
- **Search Before Create**: Run `github_search_issues` or `github_list_pull_requests` before
  opening new issues or PRs to prevent duplicate entries.
- **Pull Request Format**: Use Conventional Commits formatting (`feat:`, `fix:`, `docs:`) for PR
  titles and include comprehensive descriptions.

---

## Grafana

The Grafana MCP server provides observability, metrics (Prometheus), logs (Loki), traces (Tempo),
and profiling (Pyroscope) tools.

### Operational Rules

- **Read-Only First**: Always perform read operations (`grafana_query_prometheus`,
  `grafana_query_loki_logs`, `grafana_tempo_get-trace`) to diagnose system state before making any
  configuration changes.
- **Log Range Boundaries**: Always specify explicit time ranges and line limits for
  `grafana_query_loki_logs` queries to prevent memory spikes.

---

## Playwright

The Playwright MCP server provides headless browser automation using Chromium. Use these tools to
inspect web pages, evaluate UI layouts, and extract structural accessibility trees.

### Environment and Network Routing

- When navigating to local development applications running on the developer's host machine, ALWAYS
  substitute `localhost` or `127.0.0.1` with `host.docker.internal`.
- Automatic target URL mapping for local applications (do not query the user for URLs):
  - **docs** (Docusaurus dev server): `http://host.docker.internal:3002`
  - **hub-web** (Vite/React dev server): `http://host.docker.internal:5173`
  - **hub-api** (Fastify REST API): `http://host.docker.internal:3000`

### Tool Execution Best Practices

- **Snapshot vs. Screenshot**: Prefer `browser_snapshot` for inspecting text, DOM elements, and
  structural accessibility trees to conserve tokens. Use `browser_take_screenshot` only when visual
  layout evaluation is strictly necessary.
- **Form Filling**: Prefer `browser_fill_form` to fill multiple form inputs in a single operation
  rather than invoking `browser_type` repeatedly.
- **Resource Cleanup**: ALWAYS call `browser_close` when completing a browser testing session to
  release memory resources inside the container.

---

## Context7

The Context7 MCP server provides up-to-date documentation, API references, and code snippets for
software libraries and frameworks.

### Tool Execution Best Practices

- **Library ID Resolution**: ALWAYS resolve the library ID using `context7_resolve-library-id`
  before querying documentation with `context7_query-docs`.
- **Targeted Queries**: Provide clear, specific search queries to retrieve relevant code snippets
  and official documentation.

---

## Memory

The Memory MCP server provides RAG vector search, episodic chat history, entity graph management,
and document ingestion tools for persistent knowledge across sessions.

### Operational Rules

- Use Memory tools to store and retrieve entities, relationships, and session context that must
  persist across conversations.
- Always search Memory before creating new entities to avoid duplicates.
