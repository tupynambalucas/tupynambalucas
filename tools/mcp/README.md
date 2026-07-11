# Model Context Protocol (MCP) Ecosystem

This workspace houses the containerized gateway and backend services for Model Context Protocol (MCP) tooling inside the tupynambalucas.dev infrastructure.

## Architecture Overview

The ecosystem operates on a modern AgentGateway proxy model using federation:

1.  **AgentGateway:** An official Go-based proxy service (`cr.agentgateway.dev/agentgateway`) that intercepts and federates MCP traffic. It exposes port `8080` for AI clients (like Google Antigravity) and port `15000` for its Web UI Playground.
2.  **Downstream MCP Servers:** Each MCP container either natively supports HTTP/SSE (like Grafana) or uses `mcp-proxy` to wrap stdio-based CLI binaries and expose them via HTTP/SSE.
3.  **Federation (Single Endpoint):** Clients don't need to connect to each server individually. The AgentGateway aggregates tools from all upstream servers (GitHub, Context7, Browser, DockerHub, Firecrawl, Grafana) and presents them as a single unified MCP endpoint.
4.  **Isolated Bridge Network:** Services communicate internally over the bridge network `tupynambalucas-mcp-net`. The Gateway also connects to `tupynambalucas-monitor-net` to push OpenTelemetry logs/traces.

```
                  +-----------------------------------------+
                  |              Host Machine               |
                  |     +-----------------------------+     |
                  |     |    Antigravity / Client     |     |
                  |     +--------------+--------------+     |
                  +--------------------|--------------------+
                                       | HTTP / SSE
                                       v Port 8080 (/mcp/http)
                  +--------------------|--------------------+
                  |            tupynambalucas-mcp Stack            |
                  |     +--------------v--------------+     |
                  |     |       AgentGateway          |     |
                  |     |     (tupynambalucas-mcp-gateway)  |     |
                  |     +--------------+--------------+     |
                  |                    |                    |
                  |                    | tupynambalucas-mcp-net    |
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

- `infrastructure/docker/`: Contains the orchestration file (`compose.yaml`) and environment configurations (`.env.*`).
- `gateway/`: Gateway server configuration (`config.yaml`).
- `services/`: Containerized setups and Dockerfiles for the downstream servers (GitHub, Browser, Context7, DockerHub, Firecrawl, Grafana).

---

## Configuration & Environment Files

Settings are managed via a global environment file in `infrastructure/docker/`.

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

- `pnpm mcp:dev:up`: Launches the gateway and all downstream MCP containers in dev mode.
- `pnpm mcp:dev:down`: Stops and removes the MCP stack.
- `pnpm mcp:dev:reset`: Prunes volumes, rebuilds the containers, and restarts the environment.

_(Equivalent commands exist for `prod` and `staging` profiles)._

---

## Client Connection Mapping

For standard IDE extensions or local command-line runners (e.g., Google Antigravity CLI on the host), map the single gateway path inside your `.agents/mcp_config.json`:

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
