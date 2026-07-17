# Model Context Protocol (MCP) Ecosystem

This workspace houses the containerized downstream backend services for Model Context Protocol
(MCP) tooling inside the tupynambalucas.dev infrastructure.

## Architecture Overview

The ecosystem operates on a federated AgentGateway proxy model:

1.  **AgentGateway:** A Go-based proxy service (`cr.agentgateway.dev/agentgateway`) located in the
    platform workspace at `[platform/services/agentgateway/](../../platform/services/agentgateway/)`
    that intercepts and federates MCP traffic. It exposes port `8080` for AI clients (like Google
    Antigravity) and port `15000` for its Web UI Playground.
2.  **Downstream MCP Servers:** Each MCP container either natively supports HTTP/SSE (like Grafana)
    or uses `mcp-proxy` to wrap stdio-based CLI binaries and expose them via HTTP/SSE on port `8080`.
3.  **Federation (Single Endpoint):** Clients connect to the AgentGateway endpoint, which aggregates
    tools from all downstream backend servers (GitHub, Context7, DockerHub, Firecrawl, Grafana)
    and presents them as a single unified MCP endpoint.
4.  **Isolated Bridge Network:** Services communicate internally over the bridge network
    `tupynambalucas-mcp-net`. The Gateway (orchestrated under `@tupynambalucas/platform`) connects to
    this network to route request traffic.

```
                  +-----------------------------------------+
                  |              Host Machine               |
                  |     +-----------------------------+     |
                  |     |    Antigravity / Client     |     |
                  |     +--------------+--------------+     |
                  +--------------------|--------------------+
                                       | HTTP / SSE
                                       v Port 8080 (/mcp/http)
                  +-----------------------------------------+
                  |             Platform Stack              |
                  |     +--------------v--------------+     |
                  |     |         AgentGateway        |     |
                  |     |  (tupynambalucas-agentgateway)|    |
                  |     +--------------+--------------+     |
                  +--------------------|--------------------+
                                       | tupynambalucas-mcp-net
                  +--------------------v--------------------+
                  |            tools/mcp Stack              |
                  |      +-------------+-------------+      |
                  |      |                           |      |
                  |      v Port 8080                 v Port 8080
                  | +----+----+                  +----+----+
                  | | github  |                  | grafana | ... etc
                  | +---------+                  +---------+
                  +-----------------------------------------+
```

---

## Directory Layout

- **[infrastructure/docker/](./infrastructure/docker/)**: Contains the Docker Compose file
  ([compose.yaml](./infrastructure/docker/compose.yaml)) and environment profiles (`.env.*`).
- **[services/](./services)**: Containerized setups and Dockerfiles for the downstream servers
  (GitHub, Context7, DockerHub, Firecrawl, Grafana).

> [!NOTE]
> The gateway orchestration and configuration are managed inside the platform workspace under
> [platform/services/agentgateway/](../../platform/services/agentgateway/) and
> [platform/infrastructure/docker/](../../platform/infrastructure/docker/).

---

## Configuration & Environment Files

Settings are managed via env files located in [infrastructure/docker/](./infrastructure/docker/).

### Reference Variables

- `GITHUB_PERSONAL_ACCESS_TOKEN`: GitHub operations (permissions: `repo`, `read:org`, `gist`, `workflow`)
- `CONTEXT7_API_KEY`: Technical dependency documentation lookup key
- `DOCKERHUB_PAT_TOKEN` & `DOCKERHUB_USERNAME`: Docker Hub queries
- `FIRECRAWL_API_KEY`: Web scraping and crawling operations
- `GRAFANA_CLOUD_URL` & `GRAFANA_SERVICE_ACCOUNT_TOKEN`: Grafana dashboards, logs, and prometheus queries
- `OTEL_EXPORTER_OTLP_ENDPOINT`: AgentGateway telemetry target

---

## Operations & Orchestration Commands

Run these scripts from the monorepo root:

- `pnpm mcp:dev:up`: Launches the downstream MCP containers in dev mode.
- `pnpm mcp:dev:down`: Stops and removes the MCP stack.
- `pnpm mcp:dev:reset`: Prunes volumes, rebuilds the containers, and restarts the environment.
- `pnpm mcp:prod:up`: Launches the downstream MCP containers in prod mode.
- `pnpm mcp:prod:down`: Stops and removes the prod MCP stack.
- `pnpm mcp:prod:reset`: Prunes volumes, rebuilds, and restarts the prod environment.
- `pnpm mcp:staging:up`: Launches the downstream MCP containers in staging mode.
- `pnpm mcp:staging:down`: Stops and removes the staging MCP stack.
- `pnpm mcp:staging:reset`: Prunes volumes, rebuilds, and restarts the staging environment.

---

## Client Connection Mapping

For standard IDE extensions or local command-line runners (e.g., Google Antigravity CLI on the host),
map the single gateway path inside your `.agents/mcp_config.json`:

```json
{
  "mcpServers": {
    "agentgateway": {
      "url": "http://localhost:8080/mcp/http",
      "lifecycle": "eager"
    }
  }
}
```
