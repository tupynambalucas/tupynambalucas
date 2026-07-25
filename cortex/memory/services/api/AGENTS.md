# Local Context: Cortex Memory Fastify API

This workspace directory ([api/](./)) contains the Fastify REST API backend service (`@tupynambalucas-cortex/memory-api`) for the Cortex Memory Subsystem.

---

## 1. Domain Architecture

- **[src/domains/chat/](./src/domains/chat/)**: Episodic chat session persistence and message history ([chat.repository.ts](./src/domains/chat/chat.repository.ts), [chat.service.ts](./src/domains/chat/chat.service.ts)).
- **[src/domains/graph/](./src/domains/graph/)**: Relational associative graph memory querying ([graph.repository.ts](./src/domains/graph/graph.repository.ts), [graph.service.ts](./src/domains/graph/graph.service.ts)).
- **[src/domains/ingestion/](./src/domains/ingestion/)**: Document chunking, text embedding generation, and MongoDB vector indexing.
- **[src/domains/search/](./src/domains/search/)**: Vector RAG search controller and pipeline ([search.controller.ts](./src/domains/search/search.controller.ts), [search.service.ts](./src/domains/search/search.service.ts)).
- **[src/models/](./src/models/)**: Mongoose database schemas ([entity.model.ts](./src/models/entity.model.ts), [chat-history.model.ts](./src/models/chat-history.model.ts), [relation.model.ts](./src/models/relation.model.ts)).

---

## 2. Operational & Database Guardrails

- **MongoDB Replica Set**: Connecting to MongoDB requires replica set mode (`rs0`) for transaction support (`MONGODB_URI`).
- **Vector Search Indexing**: Vector search queries depend on MongoDB `$vectorSearch` indexes. Search handlers MUST catch missing index exceptions and return fallback matches gracefully.
- **Environment Configuration**: Container environment settings are declared in [Dockerfile](./Dockerfile).
