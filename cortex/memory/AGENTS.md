# Local Context: Cortex Memory Subsystem

This workspace (`cortex/memory`) contains the self-hosted MongoDB Vector RAG memory subsystem, providing episodic chat history, documentation knowledge RAG, and relational associative memory planes for AI agents.

---

## Local Architecture

- **[packages/core/](./packages/core/)**: Shared models, TypeScript interfaces, and Zod schemas (`@tupynambalucas-cortex-memory/core`).
- **[services/api/](./services/api/)**: Fastify API backend service executing MongoDB 7.0 `$vectorSearch` and REST endpoints (`@tupynambalucas-cortex-memory/api`).
- **[services/web/](./services/web/)**: Vite + React + Tailwind CSS dashboard built using Feature-Sliced Design (`@tupynambalucas-cortex-memory/web`).

---

## Architectural Principles

1. **Domain-Driven Design (DDD)**: Logic is partitioned into Bounded Contexts.
2. **Feature-Sliced Design (FSD)**: Frontend layers strictly enforce `Features` -> `Domains` -> `Shared` unidirectional imports.
3. **SOLID Principles**: Controllers handle routing, Services execute business rules, Repositories mutate MongoDB models.
4. **Single Source of Truth (SSOT)**: Data types and schemas are centralized in [packages/core/](./packages/core/).
5. **Centralized Container Orchestration**: Integrated directly into the central [compose.yaml](../infrastructure/docker/compose.yaml) under the `core` profile.

---

## Scoped Operations

Run these scripts from root or workspace filters:

- `pnpm --filter @tupynambalucas-cortex-memory/core build`: Compiles shared TypeScript types.
- `pnpm --filter @tupynambalucas-cortex-memory/api dev`: Runs Fastify API in development mode.
- `pnpm --filter @tupynambalucas-cortex-memory/web dev`: Starts Vite dev server for the memory dashboard at `http://localhost:9006`.
- `pnpm cortex:core:up`: Boots central control plane including `agentgateway`, `mcp-guardrails`, `mongodb-db`, `memory-api`, and `memory-web`.
