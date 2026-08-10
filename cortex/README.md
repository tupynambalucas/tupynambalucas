# Unified AI Cortex Workspace

The `cortex/` workspace is the bounded context for the tupynambalucas.dev artificial intelligence architecture, consolidating API ingress gateway routing, persistent vector memory, Model Context Protocol (MCP) tool adapters, policy guardrails, and cloud-native Kubernetes deployment configurations.

---

## Technology Stack

- **Ingress Gateway**: AgentGateway (Envoy-based AI Gateway), Traefik Ingress Controller
- **Protocol & Policies**: Model Context Protocol (MCP), gRPC (ExtMCP), Protocol Buffers
- **Memory & Storage**: MongoDB 7.0 (Replica Set `rs0`), Mongoose ODM, MongoDB Vector Search
- **API Runtime**: Node.js 22, Fastify 5, Zod
- **Frontend Dashboard**: React 19, Vite, Tailwind CSS v4, Zustand, `react-force-graph-2d`
- **Orchestration**: Kubernetes, Kustomize, Skaffold, Podman / Docker Compose

---

## Bounded Context Architecture

Cortex organizes the AI ecosystem into four modular sub-domains following Domain-Driven Design (DDD):

1. **[gateway/](./gateway/README.md)**: AgentGateway configuration, upstream MCP target routing, CORS policies, and administrative telemetry ([gateway/README.md](./gateway/README.md)).
2. **[infrastructure/](./infrastructure/README.md)**: Kubernetes deployment manifests, Kustomize overlays, cert-manager certificates, and Docker Compose files ([infrastructure/README.md](./infrastructure/README.md)).
3. **[mcp/](./mcp/README.md)**: Model Context Protocol (MCP) data plane, standalone gRPC ExtMCP policy guardrails, MCP Inspector, and tool server adapters ([mcp/README.md](./mcp/README.md)).
4. **[memory/](./memory/README.md)**: Self-hosted MongoDB Vector RAG memory subsystem, Fastify REST API, and React Web visualization dashboard ([memory/README.md](./memory/README.md)).

---

## Getting Started

### 1. Configure Environment Variables

Create the `.env` configuration file in `cortex/infrastructure/` from the provided template:

```bash
cp cortex/infrastructure/.env.example cortex/infrastructure/.env
```

Set any required API keys (e.g. `FIRECRAWL_API_KEY`, `GITHUB_PERSONAL_ACCESS_TOKEN`, `CONTEXT7_API_KEY`) inside [cortex/infrastructure/.env](./infrastructure/.env).

### 2. Kubernetes Dev Mode (Hot-Reload)

To build, deploy, and stream logs with hot-reloading in the local Kubernetes cluster:

```bash
pnpm cortex:dev
```

This command deploys all deployments, services, ingress routes, and config maps in the `cortex` namespace using Skaffold.

### 3. Standalone Containers (Docker Compose / Podman)

To run the container stack without Kubernetes:

```bash
pnpm cortex:up
```

To monitor logs or stop the environment:

- View active logs: `pnpm cortex:logs`
- Stop containers: `pnpm cortex:down`
- Reset environment: `pnpm cortex:reset`

---

## Key Scripts

| Command                 | Description                                                                  |
| :---------------------- | :--------------------------------------------------------------------------- |
| `pnpm cortex:dev`       | Starts local Kubernetes development cluster with hot-reloading via Skaffold. |
| `pnpm cortex:clean`     | Deletes deployed Kubernetes resources and prunes container build caches.     |
| `pnpm cortex:stop`      | Tears down active Kubernetes and Docker Compose resources.                   |
| `pnpm cortex:up`        | Boots standalone Docker Compose container ecosystem with core profiles.      |
| `pnpm cortex:down`      | Stops and removes all Docker Compose containers and networks.                |
| `pnpm cortex:logs`      | Streams live container logs across all Cortex services.                      |
| `pnpm cortex:reset`     | Restarts the Docker Compose stack cleanly.                                   |
| `pnpm cortex:typecheck` | Executes TypeScript type validation across all Cortex packages.              |
| `pnpm cortex:lint`      | Runs ESLint validation across all Cortex workspaces.                         |
