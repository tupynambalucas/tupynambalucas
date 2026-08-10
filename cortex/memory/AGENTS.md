# Local Context: Cortex Memory Subsystem

This workspace context ([memory/](./)) orchestrates the self-hosted MongoDB Vector RAG memory subsystem, providing episodic chat history, documentation knowledge RAG, and relational associative memory planes for AI agents.

---

## 1. Local Architecture

- **[packages/core/](./packages/core/AGENTS.md)**: Shared data models, TypeScript interfaces, and Zod schemas (`@tupynambalucas-cortex/memory-core`) ([packages/core/AGENTS.md](./packages/core/AGENTS.md)).
- **[services/api/](./services/api/AGENTS.md)**: Fastify REST API backend executing MongoDB 7.0 `$vectorSearch`, auto docs sync, and data persistence (`@tupynambalucas-cortex/memory-api`) ([services/api/AGENTS.md](./services/api/AGENTS.md)).
- **[services/mongodb/](./services/mongodb/AGENTS.md)**: MongoDB 7.0 Replica Set (`rs0`) container configuration and initialization scripts ([services/mongodb/AGENTS.md](./services/mongodb/AGENTS.md)).
- **[services/web/](./services/web/AGENTS.md)**: Vite + React 19 + Tailwind CSS dashboard built with Feature-Sliced Design (`@tupynambalucas-cortex/memory-web`) ([services/web/AGENTS.md](./services/web/AGENTS.md)).

---

## 2. Architectural Principles

1. **Domain-Driven Design (DDD)**: Logic is partitioned into distinct bounded domains (`chat`, `graph`, `ingestion`, `search`).
2. **Feature-Sliced Design (FSD)**: Frontend layers strictly enforce unidirectional imports (`features` -> `domains` -> `components`).
3. **Single Source of Truth (SSOT)**: Data types, DTOs, and runtime validation schemas are centralized in [packages/core/](./packages/core/AGENTS.md).
4. **MongoDB Replica Set**: MongoDB MUST execute as a single-node replica set (`rs0`) to support ACID transactions and vector indexes.
5. **Startup Auto-Sync**: The Fastify API automatically scans and ingests markdown documents from `/app/docs` on startup.

---

## 3. Scoped Operations

- `pnpm --filter @tupynambalucas-cortex/memory-core build`: Compiles shared TypeScript types.
- `pnpm --filter @tupynambalucas-cortex/memory-api dev`: Starts Fastify API in development mode.
- `pnpm --filter @tupynambalucas-cortex/memory-web dev`: Starts React web dashboard on port `9006`.
- `pnpm cortex:dev`: Starts memory services alongside the Cortex stack in Kubernetes.
- `pnpm cortex:up`: Starts memory containers via Docker Compose.
