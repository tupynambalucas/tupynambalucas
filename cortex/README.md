# Unified AI Cortex Workspace

Cortex is the unified Bounded Context for the tupynambalucas.dev artificial intelligence architecture, consolidating the gateway ingress, persistent memory databases, Model Context Protocol (MCP) data plane integrations, control plane agent runtimes, and deployment infrastructure.

---

## Bounded Context Architecture

Cortex organizes the AI ecosystem into modular sub-domains following Domain-Driven Design (DDD):

1. **[gateway/](./gateway/)**: System API Ingress Gateway configuration, proxy routing, and dashboard telemetry ([gateway/README.md](./gateway/README.md)).
2. **[memory/](./memory/)**: Self-hosted MongoDB Vector RAG memory subsystem ([memory/README.md](./memory/README.md)).
3. **[mcp/](./mcp/)**: Model Context Protocol (MCP) data plane, policy guardrails, and service adapters ([mcp/README.md](./mcp/README.md)).
4. **[agents/](./agents/)**: Control plane containerized agent CLI runtimes ([agents/README.md](./agents/README.md)).
5. **[infrastructure/](./infrastructure/)**: Docker compose orchestration profiles and Kubernetes manifests ([infrastructure/README.md](./infrastructure/README.md)).

---

## Development Setup & Operations

Cortex services can be orchestrated using either Docker Compose (via Podman/Docker) for local standalone execution or Kubernetes (via Minikube and Skaffold) for developer environments. Centralized configuration parameters are managed inside the [cortex/infrastructure/.env](./infrastructure/.env) file.

### 1. Kubernetes & Skaffold (Hot-Reload Dev Cycle)

To build, deploy, and automatically sync changes (hot-reload) to the local Kubernetes cluster:

```bash
pnpm cortex:dev
```

This commands spins up all gatekeepers, databases, memory services, and MCP server adapters in the `cortex` namespace.

### 2. Standalone Containers (Docker Compose / Podman)

To build and start the standalone container ecosystem:

```bash
pnpm cortex:up
```

To view logs or stop the environment:

- View active logs: `pnpm cortex:logs`
- Tear down the stack: `pnpm cortex:down`
