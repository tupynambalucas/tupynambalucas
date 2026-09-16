# Unified AI Cortex Workspace

The `cortex/` workspace is the bounded context for the %PROJECT_DOMAIN% artificial intelligence architecture, consolidating API ingress gateway routing, persistent vector memory, Model Context Protocol (MCP) tool adapters, policy guardrails, and cloud-native Kubernetes deployment configurations.

---

## Technology Stack

- **Ingress Gateway**: AgentGateway (Envoy-based AI Gateway), Traefik Ingress Controller
- **Protocol & Policies**: Model Context Protocol (MCP), gRPC (ExtMCP), Protocol Buffers
- **Memory & Storage**: MongoDB 7.0 (Replica Set `rs0`), Mongoose ODM, MongoDB Vector Search
- **API Runtime**: Node.js 22, Fastify 5, Zod
- **Frontend Dashboard**: React 19, Vite, Tailwind CSS v4, Zustand, `react-force-graph-2d`
- **Orchestration**: Kubernetes, Kustomize, Skaffold

---

## Bounded Context Architecture

Cortex organizes the AI ecosystem into four modular sub-domains following Domain-Driven Design (DDD):

1. **[gateway/](./gateway/README.md)**: AgentGateway configuration, upstream MCP target routing, CORS policies, and administrative telemetry ([gateway/README.md](./gateway/README.md)).
2. **[infrastructure/](./infrastructure/README.md)**: Kubernetes deployment manifests, Kustomize overlays, and cert-manager certificates ([infrastructure/README.md](./infrastructure/README.md)).
3. **[mcp/](./mcp/README.md)**: Model Context Protocol (MCP) data plane, standalone gRPC ExtMCP policy guardrails, MCP Inspector, and tool server adapters ([mcp/README.md](./mcp/README.md)).
4. **[memory/](./memory/README.md)**: Self-hosted MongoDB Vector RAG memory subsystem, Fastify REST API, and React Web visualization dashboard ([memory/README.md](./memory/README.md)).

---

## Getting Started

All environment variables for this context are centralized in [`infrastructure/.env`](../infrastructure/.env) at the monorepo root.

Set any required API keys (e.g. `FIRECRAWL_API_KEY`, `GITHUB_PERSONAL_ACCESS_TOKEN`, `CONTEXT7_API_KEY`) inside [`infrastructure/.env`](../infrastructure/.env).

### Kubernetes Dev Mode (Hot-Reload)

Cortex is deployed as part of the unified infrastructure stack. To build, deploy, and
stream logs with hot-reloading in the local Kubernetes cluster:

```bash
pnpm infra:dev
```

This command deploys all deployments, services, ingress routes, and config maps in the
`cortex` namespace using Skaffold. To tear down all resources:

```bash
pnpm infra:delete
```

---

## Key Scripts

| Command                 | Description                                                     |
| :---------------------- | :-------------------------------------------------------------- |
| `pnpm infra:dev`        | Deploys the full stack including Cortex services via Skaffold.  |
| `pnpm infra:delete`     | Tears down all cluster resources including Cortex deployments.  |
| `pnpm cortex:typecheck` | Executes TypeScript type validation across all Cortex packages. |
| `pnpm cortex:lint`      | Runs ESLint validation across all Cortex workspaces.            |
