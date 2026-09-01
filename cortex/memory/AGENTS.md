<context-hierarchy>
  <parent src="../../AGENTS.md" type="global-rules" />
  <parent src="../AGENTS.md" type="bounded-context-rules" />
  <system-instruction>
    AGENT: If you have not read "../../AGENTS.md" and "../AGENTS.md" in this session, stop now
    and read both files using your file-reading tools before proceeding.
  </system-instruction>
</context-hierarchy>

# Local Context: Cortex Memory Subsystem

This bounded context ([memory/](./)) orchestrates the self-hosted MongoDB Vector RAG memory
subsystem, providing episodic chat history, documentation knowledge RAG, and relational
associative memory planes for AI agents.

---

## 1. Local Architecture

- [packages/core/](./packages/core/): Shared data models, TypeScript interfaces, and Zod schemas
  (`@repo/cortex/memory-core`).
- [services/api/](./services/api/): Fastify REST API backend executing MongoDB 7.0 `$vectorSearch`,
  auto docs sync, and data persistence (`@repo/cortex/memory-api`).
- [services/mongodb/](./services/mongodb/): MongoDB 7.0 Replica Set (`rs0`) container
  configuration and initialization scripts.
- [services/web/](./services/web/): Vite + React 19 + Tailwind CSS dashboard built with
  Feature-Sliced Design (`@repo/cortex/memory-web`).

---

## 2. Architectural Principles

1. **Domain-Driven Design (DDD)**: Logic is partitioned into distinct bounded domains (`chat`,
   `graph`, `ingestion`, `search`).
2. **Feature-Sliced Design (FSD)**: Frontend layers strictly enforce unidirectional imports
   (`features` -> `domains` -> `components`).
3. **Single Source of Truth (SSOT)**: Data types, DTOs, and runtime validation schemas are
   centralized in [packages/core/](./packages/core/).
4. **MongoDB Replica Set**: MongoDB MUST execute as a single-node replica set (`rs0`) to support
   ACID transactions and vector indexes.
5. **Startup Auto-Sync**: The Fastify API automatically scans and ingests markdown documents from
   `/app/docs` on startup. The sync is idempotent (content hash check before re-embedding).
6. **Build-Time Docs Bundling**: The `docs/` directory is copied into the `memory-api` Docker
   image at build time (`COPY docs ./docs`). The `.dockerignore` MUST NOT exclude `docs/` itself;
   only transient artifacts (`docs/node_modules/`, `docs/.docusaurus/`, `docs/build/`) are
   excluded.
7. **MCP Ingestion Trigger**: The `mcp-memory` service accesses `memory-api` internally via
   `MemoryApiClient`. The MCP tool `ingest_document` triggers the full
   `POST /api/memory/ingest/docs` pipeline, which re-walks `/app/docs` and re-embeds changed
   files.

---

## 3. Scoped Operations

- `pnpm --filter @repo/cortex/memory-core build`: Compiles shared TypeScript types.
- `pnpm --filter @repo/cortex/memory-api dev`: Starts Fastify API in development mode.
- `pnpm --filter @repo/cortex/memory-web dev`: Starts React web dashboard on port
  `9006`.
- `pnpm cortex:dev`: Starts memory services alongside the Cortex stack in Kubernetes.
- `pnpm cortex:up`: Starts memory containers via Docker Compose.

---

## 4. Service-Level Rules

### Core Package Rules

- All data models MUST be defined exclusively in [packages/core/](./packages/core/) as the SSOT.
- Schema files MUST use the `.schema.ts` suffix.
- DTOs MUST extend Zod schemas using `.pick()` or `.omit()` transforms; manual field duplication
  is forbidden.
- `packages/core/` MUST NOT import from any service package within this subsystem.

### API Service Rules

- The Fastify API MUST use the Repository Pattern with Mongoose model injection.
- `$vectorSearch` aggregation pipelines MUST always include `numCandidates` at minimum 10x the
  `limit` value to guarantee result quality.
- Startup document auto-sync MUST be idempotent: calculate content hashes before ingesting to
  avoid re-embedding unchanged documents.

### MongoDB Service Rules

- MongoDB MUST run as a single-node Replica Set (`rs0`) to support transactions and vector
  indexes.
- The `rs.initiate()` script in `init-replica.js` MUST be idempotent (check `rs.status()` before
  initiating).
- Vector indexes MUST be created through the initialization script, not programmatically from the
  API service.

### Web Dashboard Rules

- Feature-Sliced Design import direction is strictly enforced: `pages` -> `widgets` -> `features`
  -> `entities` -> `shared`. Cross-layer imports are forbidden.
- State management MUST use TanStack Query for server state. Zustand is permitted only for local
  UI state with no API dependency.

---

## 3. Docs Ingestion & Vector Agnosticism

The memory API synchronizes documentation by directly ingesting raw .mdx files from the docs/ workspace. It intentionally embeds unresolved templating tokens (such as %PROJECT_DOMAIN% and %PROJECT_NAME%) into the MongoDB Vector space. This architectural decision ensures the semantic knowledge base remains strictly brand-agnostic and perfectly generic for enterprise template reuse.
