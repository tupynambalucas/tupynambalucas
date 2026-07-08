# Local Context: MCP Ecosystem

This workspace ([tools/mcp/](./)) implements the Server-Sent Events (SSE) adapters and Model Context Protocol (MCP) gateways.

---

## Local Architecture & Directory Map

- **[gateway/](./gateway)**: Orchestration proxy ([server.ts](./gateway/server.ts)) mapping client connections to downstream tools.
- **[services/](./services)**: Containerized Model Context Protocol (MCP) servers (GitHub, Playwright Browser, Context7, Docker Hub) and their shared SSE adapter ([sse-adapter.ts](./services/common/sse-adapter.ts)).
- **[infrastructure/docker/compose.yaml](./infrastructure/docker/compose.yaml)**: Docker Compose orchestration defining internal networks, volumes, and service constraints.
- **[infrastructure/docker/.env.example](./infrastructure/docker/.env.example)**: Environment template file.

---

## MCP Guardrails

1. **Fastify 5 SSE Routing**: Custom adapters must leverage native Fastify v5 hooks for connection handling, keeping request times low.
2. **Schema Contracts**: All exposed tools and prompts MUST declare explicit input schemas (using JSON Schema formats) to prevent LLM tool execution errors.
3. **Connection Lifecycle**: Implement clean reconnection logic and timeout hooks on SSE events to prevent orphaned terminal subprocesses on client drop.
4. **Secrets Handling**: API keys, credentials, and OAuth tokens for external tools (GitHub token, Turnstile secrets) must be injected strictly from local environment variables, never hardcoded or logged.

---

## Scoped Commands

Run these scripts from the monorepo root:

- `pnpm mcp:up`: Boots the development MCP Docker containers in the background.
- `pnpm mcp:down`: Stops the development MCP containers.
- `pnpm mcp:reset`: Stops, removes volumes, and restarts the environment with fresh builds.
