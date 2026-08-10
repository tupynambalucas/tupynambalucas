# Local Context: Cortex Memory Core Package

This workspace directory ([core/](./)) contains shared TypeScript interface definitions, Data Transfer Objects (DTOs), and Zod validation schemas (`@tupynambalucas-cortex/memory-core`) for the Cortex Memory Subsystem.

---

## 1. Local Architecture & Directory Map

- **[src/types/](./src/types/)**: Domain TypeScript type definitions:
  - **[entity.ts](./src/types/entity.ts)**: Memory entity interfaces (`MemoryEntity`, `SearchResultDTO`, `GraphNode`, `GraphDataDTO`).
  - **[chat-history.ts](./src/types/chat-history.ts)**: Episodic chat memory types (`ChatHistorySession`, `StoreChatMessageDTO`).
  - **[relation.ts](./src/types/relation.ts)**: Associative graph relation interfaces (`MemoryRelation`, `RelationType`).
- **[src/schemas/](./src/schemas/)**: Runtime Zod validation schemas:
  - **[entity.schema.ts](./src/schemas/entity.schema.ts)**: Schema validation for entities, vector searches, and graph queries.
- **[src/index.ts](./src/index.ts)**: Main package barrel export entry point.

---

## 2. Core Package Guardrails

- **Single Source of Truth (SSOT)**: All domain types and schemas shared between the Fastify API backend ([api/](../../services/api/AGENTS.md)) and React Web dashboard ([web/](../../services/web/AGENTS.md)) MUST be centralized here.
- **No Circular Imports**: Interfaces and schemas in this package MUST NOT import from `services/api` or `services/web`.
- **Compilation Requirement**: After updating types or schemas, execute `pnpm --filter @tupynambalucas-cortex/memory-core build` to recompile types for dependent services.

---

## 3. Scoped Operations

- `pnpm --filter @tupynambalucas-cortex/memory-core build`: Compiles TypeScript source to `dist/`.
- `pnpm --filter @tupynambalucas-cortex/memory-core clean`: Cleans build artifacts and `tsbuildinfo`.
- `pnpm --filter @tupynambalucas-cortex/memory-core typecheck`: Validates TypeScript type compliance.
- `pnpm --filter @tupynambalucas-cortex/memory-core lint`: Runs ESLint validation.
