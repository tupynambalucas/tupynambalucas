# Cortex Memory Core Package

The `packages/core` directory contains the shared TypeScript types, interfaces, and Zod schemas (`@tupynambalucas-cortex/memory-core`) for the Cortex Memory Subsystem.

---

## Package Overview

- **[src/types/](./src/types/)**: Domain data structures for entities, search DTOs, chat sessions, and graph relations.
- **[src/schemas/](./src/schemas/)**: Zod schemas for HTTP payload validation and entity constraints.
- **[src/index.ts](./src/index.ts)**: Barrel export module.

---

## Development Scripts

- `pnpm build`: Compiles TypeScript source into JavaScript and type definitions in `dist/`.
- `pnpm clean`: Removes build output and TypeScript build caches.
- `pnpm typecheck`: Executes TypeScript type checking without emitting files.
