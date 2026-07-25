# Cortex Memory Fastify API Subsystem

The `services/api` directory contains the Fastify REST API backend (`@tupynambalucas-cortex/memory-api`) for vector search, document ingestion, and episodic memory persistence.

---

## Service Components

- **[src/domains/chat/](./src/domains/chat/)**: Episodic chat session storage and history retrieval endpoints.
- **[src/domains/graph/](./src/domains/graph/)**: Knowledge graph entity and relationship endpoints.
- **[src/domains/ingestion/](./src/domains/ingestion/)**: Document parser and vector embedding ingestion service.
- **[src/domains/search/](./src/domains/search/)**: MongoDB `$vectorSearch` RAG query controller and service.

---

## Development Scripts

- `pnpm dev`: Runs Fastify API server with automatic hot-reloading.
- `pnpm build`: Compiles TypeScript files into `dist/`.
- `pnpm start`: Starts production Node.js API server.
- `pnpm typecheck`: Validates TypeScript type compliance without outputting files.
