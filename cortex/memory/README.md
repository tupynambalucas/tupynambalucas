# Cortex Memory Subsystem

The `memory/` directory houses the self-hosted MongoDB Vector RAG memory subsystem for the AI Cortex ecosystem.

---

## Architecture Overview

- **[packages/core/](./packages/core/)**: Shared TypeScript models, interfaces, and Zod schemas (`@tupynambalucas-cortex/memory-core`).
- **[services/api/](./services/api/)**: Fastify backend service executing MongoDB `$vectorSearch` and REST endpoints (`@tupynambalucas-cortex/memory-api`).
- **[services/web/](./services/web/)**: React + Vite dashboard built with Feature-Sliced Design (`@tupynambalucas-cortex/memory-web`).
- **[AGENTS.md](./AGENTS.md)**: Scoped AI agent router context.
