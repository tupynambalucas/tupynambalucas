# Cortex Memory Subsystem

The `cortex/memory/` workspace provides the persistent memory architecture for AI agents in the %PROJECT_DOMAIN% monorepo, consolidating vector RAG retrieval, episodic chat persistence, associative knowledge graph modeling, and developer visualization.

---

## Technology Stack

- **Database**: MongoDB 7.0 (Replica Set `rs0`), Mongoose ODM, MongoDB `$vectorSearch`
- **Backend API**: Node.js 22, Fastify 5, TypeScript, Zod
- **Frontend Dashboard**: React 19, Vite, Tailwind CSS v4, Zustand, `react-force-graph-2d`
- **Core Library**: TypeScript, Zod

---

## Subsystem Architecture

- **[packages/core/](./packages/core/README.md)**: Single Source of Truth for TypeScript interfaces and Zod validation schemas (`@repo/cortex/memory-core`) ([packages/core/README.md](./packages/core/README.md)).
- **[services/api/](./services/api/README.md)**: Fastify REST API backend exposing vector search, graph queries, chat sessions, and docs sync ([services/api/README.md](./services/api/README.md)).
- **[services/mongodb/](./services/mongodb/README.md)**: MongoDB 7.0 container packaging and automated replica set initialization ([services/mongodb/README.md](./services/mongodb/README.md)).
- **[services/web/](./services/web/README.md)**: Feature-Sliced Design web dashboard for visual graph inspection and search testing ([services/web/README.md](./services/web/README.md)).

---

## Getting Started

Start the memory subsystem as part of the unified Cortex environment:

```bash
# Kubernetes development mode
pnpm cortex:dev

# Standalone Docker Compose mode
pnpm cortex:up
```

- Memory API: `http://localhost:3006`
- Memory Web Dashboard: `http://localhost:9006`
- MongoDB Port: `localhost:27018`
