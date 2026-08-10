# Local Context: Cortex Memory Fastify API

This workspace directory ([api/](./)) contains the Fastify REST API backend service (`@tupynambalucas-cortex/memory-api`) for the Cortex Memory Subsystem.

---

## 1. Domain Architecture & Directory Map

- **[src/index.ts](./src/index.ts)**: Fastify application bootstrap, plugin registration, and automatic documentation sync on startup.
- **[src/domains/chat/](./src/domains/chat/)**: Episodic chat session persistence and message history ([chat.controller.ts](./src/domains/chat/chat.controller.ts), [chat.service.ts](./src/domains/chat/chat.service.ts), [chat.repository.ts](./src/domains/chat/chat.repository.ts), [chat.routes.ts](./src/domains/chat/chat.routes.ts)).
- **[src/domains/graph/](./src/domains/graph/)**: Relational associative graph memory querying ([graph.controller.ts](./src/domains/graph/graph.controller.ts), [graph.service.ts](./src/domains/graph/graph.service.ts), [graph.repository.ts](./src/domains/graph/graph.repository.ts), [graph.routes.ts](./src/domains/graph/graph.routes.ts)).
- **[src/domains/ingestion/](./src/domains/ingestion/)**: Document chunking, text embedding generation, and vector indexing ([ingestion.controller.ts](./src/domains/ingestion/ingestion.controller.ts), [ingestion.service.ts](./src/domains/ingestion/ingestion.service.ts), [ingestion.routes.ts](./src/domains/ingestion/ingestion.routes.ts)).
- **[src/domains/search/](./src/domains/search/)**: Vector RAG search pipeline ([search.controller.ts](./src/domains/search/search.controller.ts), [search.service.ts](./src/domains/search/search.service.ts), [search.repository.ts](./src/domains/search/search.repository.ts), [search.routes.ts](./src/domains/search/search.routes.ts)).
- **[src/models/](./src/models/)**: Mongoose database schemas:
  - **[entity.model.ts](./src/models/entity.model.ts)**: Knowledge entities, text chunks, and embedding vectors.
  - **[chat-history.model.ts](./src/models/chat-history.model.ts)**: Episodic conversation sessions and turns.
  - **[relation.model.ts](./src/models/relation.model.ts)**: Graph relations between knowledge entities.
- **[src/plugins/](./src/plugins/)**: Fastify ecosystem plugins:
  - **[mongoosePlugin.ts](./src/plugins/mongoosePlugin.ts)**: MongoDB connection lifecycle and schema registration.
  - **[registryPlugin.ts](./src/plugins/registryPlugin.ts)**: Dependency injection container registering domain services and repositories into Fastify instance.
  - **[apiPlugin.ts](./src/plugins/apiPlugin.ts)**: Route mounting under `/api/memory`.
- **[Dockerfile](./Dockerfile)**: Production container image build definition.

---

## 2. API Coding & Operational Guardrails

- **Layered Architecture**: Controllers MUST delegate business logic to Services; Services MUST access database models exclusively through Repositories.
- **MongoDB Replica Set**: Connecting to MongoDB requires replica set mode (`rs0`) for transaction support (`MONGODB_URI`).
- **Vector Search Indexing**: Vector search queries use MongoDB `$vectorSearch` indexes. Search handlers MUST catch missing index exceptions and return fallback matches gracefully.
- **Startup Auto-Sync**: Ingestion service automatically scans `/app/docs` (or monorepo `docs/`) upon startup to sync documentation into the vector store.

---

## 3. Scoped Operations

- `pnpm --filter @tupynambalucas-cortex/memory-api dev`: Starts Fastify API with hot-reloading using `tsx`.
- `pnpm --filter @tupynambalucas-cortex/memory-api build`: Compiles production build into `dist/`.
- `pnpm --filter @tupynambalucas-cortex/memory-api start`: Runs compiled production server.
- `pnpm --filter @tupynambalucas-cortex/memory-api typecheck`: Validates TypeScript type compliance.
- `pnpm --filter @tupynambalucas-cortex/memory-api lint`: Runs ESLint validation.
