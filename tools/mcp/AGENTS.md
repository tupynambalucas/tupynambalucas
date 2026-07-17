# Local Context: MCP Ecosystem

This workspace (`@tupynambalucas-tools/mcp`) implements the containerized downstream backend
services for the Model Context Protocol (MCP) data plane.

---

## Local Architecture & Directory Map

- **[services/](./services)**: Downstream Model Context Protocol (MCP) server container definitions:
  - [context7/](./services/context7/): Downstream target serving context7 upstash CLI.
  - [dockerhub/](./services/dockerhub/): Downstream target serving Docker Hub CLI.
  - [firecrawl/](./services/firecrawl/): Downstream target serving firecrawl tool.
  - [github/](./services/github/): Downstream target serving GitHub CLI.
  - [grafana/](./services/grafana/): Downstream target serving Grafana integrations.
- **[infrastructure/docker/](./infrastructure/docker/)**: Docker compose configurations for local
  development, staging, and production profiles.
  - [compose.yaml](./infrastructure/docker/compose.yaml):
    Core Docker Compose file orchestrating the downstream servers.
  - [compose.override.yaml](./infrastructure/docker/compose.override.yaml):
    Local override settings.
  - [compose.prod.yaml](./infrastructure/docker/compose.prod.yaml):
    Production profile override.
  - [env.dev.example](./infrastructure/docker/.env.dev.example):
    Template for development environment variables.

> [!NOTE]
> The centralized federator proxy **AgentGateway** is located in the platform workspace at
> [platform/services/agentgateway/](../../platform/services/agentgateway/) and orchestrated under
> [platform/infrastructure/docker/](../../platform/infrastructure/docker/).

---

## MCP Guardrails

1. **Stdio Wrapping**: Downstream servers that natively communicate via standard I/O (stdio) MUST
   be wrapped using `mcp-proxy` inside their respective Dockerfile to expose them via HTTP/SSE.
2. **Docker Compose Profiles**: All MCP services MUST define compose profiles matching `dev`,
   `prod`, and `staging` to match environment orchestration patterns.
3. **Secrets Handling**: API keys, credentials, and OAuth tokens (e.g., GitHub tokens, Upstash keys)
   MUST be injected strictly from local environment variables at runtime, never hardcoded.
4. **Bridge Network Attachment**: All MCP services MUST connect to the `tupynambalucas-mcp-net`
   bridge network so they are reachable by the centralized `agentgateway`.

---

## Code Patterns

### Wrapping stdio MCP Servers with HTTP/SSE

Downstream servers that natively run as command-line tools communicating via `stdio` MUST be wrapped in Docker using `mcp-proxy` on port `8080`:

```dockerfile
FROM node:20-alpine

# Install the proxy and the target tool globally
RUN npm install -g mcp-proxy example-mcp-server

EXPOSE 8080

ENTRYPOINT ["mcp-proxy", "--port", "8080", "--", "example-mcp-server"]
```

---

## Scoped Operations

Run these scripts from the monorepo root:

- `pnpm mcp:dev:up`: Boots the development MCP Docker containers in the background.
- `pnpm mcp:dev:down`: Stops the development MCP containers.
- `pnpm mcp:dev:reset`: Stops, removes volumes, and restarts the development containers.
- `pnpm mcp:prod:up`: Boots the production MCP Docker containers in the background.
- `pnpm mcp:prod:down`: Stops the production MCP containers.
- `pnpm mcp:prod:reset`: Stops, removes volumes, and restarts the production containers.
- `pnpm mcp:staging:up`: Boots the staging MCP Docker containers in the background.
- `pnpm mcp:staging:down`: Stops the staging MCP containers.
- `pnpm mcp:staging:reset`: Stops, removes volumes, and restarts the staging containers.
