# Local Context: Cortex Memory Subsystem

This workspace context ([memory/](./)) orchestrates the self-hosted MongoDB Vector RAG memory subsystem, providing episodic chat history, documentation knowledge RAG, and relational associative memory planes for AI agents.

---

## 1. Local Architecture

- **[packages/core/](./packages/core/)**: Shared models, TypeScript interfaces, and Zod schemas (`@tupynambalucas-cortex/memory-core`) router context ([core/AGENTS.md](./packages/core/AGENTS.md)).
- **[services/api/](./services/api/)**: Fastify API backend service executing MongoDB 7.0 `$vectorSearch` and REST endpoints (`@tupynambalucas-cortex/memory-api`) router context ([api/AGENTS.md](./services/api/AGENTS.md)).
- **[services/web/](./services/web/)**: Vite + React + Tailwind CSS dashboard built using Feature-Sliced Design (`@tupynambalucas-cortex/memory-web`) router context ([web/AGENTS.md](./services/web/AGENTS.md)).

---

## 2. Architectural Principles

1. **Domain-Driven Design (DDD)**: Logic is partitioned into Bounded Contexts.
2. **Feature-Sliced Design (FSD)**: Frontend layers strictly enforce `Features` -> `Domains` -> `Shared` unidirectional imports.
3. **SOLID Principles**: Controllers handle routing, Services execute business rules, Repositories mutate MongoDB models.
4. **Single Source of Truth (SSOT)**: Data types and schemas are centralized in [packages/core/](./packages/core/).
5. **Centralized Container Orchestration**: Handled via Docker Compose
   ([compose.yaml](../infrastructure/docker/compose.yaml)) or Kubernetes deployment manifests
   ([kubernetes/](../infrastructure/kubernetes/)) using Skaffold.

---

## 3. Scoped Operations

Run these scripts from root or workspace filters:

- `pnpm --filter @tupynambalucas-cortex/memory-core build`: Compiles shared TypeScript types.
- `pnpm cortex:dev`: Starts the entire Cortex development suite (including memory services) inside
  the local Kubernetes cluster.
- `pnpm cortex:up`: Boots central control plane standalone containers using Docker Compose/Podman.
