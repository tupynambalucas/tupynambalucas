# Cortex Memory Fastify API Subsystem

The `cortex/memory/services/api` workspace contains the Fastify REST API backend service (`@repo/cortex/memory-api`) for vector search, knowledge graph traversal, document ingestion, and episodic memory persistence.

---

## Technology Stack

- **Runtime**: Node.js 22, TypeScript
- **Framework**: Fastify 5
- **Database**: MongoDB 7.0 (Replica Set `rs0`), Mongoose ODM
- **Validation**: Zod via `@repo/cortex/memory-core`
- **Port**: `3006`

---

## Service Architecture

```
services/api/src/
├── config/             # Environment configuration (PORT, HOST, MONGODB_URI)
├── domains/
│   ├── chat/          # Episodic chat history and session persistence
│   ├── graph/         # Knowledge graph nodes and relations
│   ├── ingestion/     # Document parser and auto-sync engine
│   └── search/        # MongoDB $vectorSearch RAG pipeline
├── models/            # Mongoose schemas (Entity, ChatHistory, Relation)
├── plugins/           # Fastify plugins (API routing, Mongoose, Service Registry)
└── types/             # Fastify type augmentations
```

---

## REST Endpoints

All endpoints are prefixed under `/api/memory`:

- `POST /api/memory/search`: Executes semantic vector search against indexed knowledge.
- `POST /api/memory/chat`: Stores episodic conversation turns and retrieves session history.
- `GET /api/memory/graph`: Returns graph nodes and relational links for visualization.
- `POST /api/memory/ingestion/sync`: Triggers manual synchronization of documentation files.

---

## Development Scripts

- `pnpm dev`: Runs Fastify API server with hot-reloading using `tsx`.
- `pnpm build`: Compiles TypeScript files into `dist/`.
- `pnpm start`: Starts production Node.js API server.
- `pnpm typecheck`: Validates TypeScript type compliance.
- `pnpm lint`: Runs ESLint validation.
