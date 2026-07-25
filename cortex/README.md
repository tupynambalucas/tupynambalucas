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

All services are orchestrated via Docker Compose profiles. Centralized configuration parameters are managed inside the [infrastructure/docker/.env](./infrastructure/docker/.env) file.

### 1. Core Services

To build and start the core services (gateway and memory database):

```bash
pnpm cortex:core:up
```

### 2. Model Context Protocol Services

To start all MCP adapters:

```bash
pnpm cortex:mcp:up
```

### 3. Agent Runtime Environment

To run the containerized agent CLI runtimes:

```bash
pnpm cortex:agents:up
```

For authentication, run:

- Antigravity CLI: `pnpm cortex:antigravity:auth`
- Copilot CLI: `pnpm cortex:copilot:auth`
