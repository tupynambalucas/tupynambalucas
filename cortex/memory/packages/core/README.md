# Cortex Memory Core Package

The `cortex/memory/packages/core` workspace contains the shared TypeScript types, interfaces, Data Transfer Objects (DTOs), and Zod validation schemas (`@repo/cortex/memory-core`) for the Cortex Memory Subsystem.

---

## Technology Stack

- **Language**: TypeScript
- **Validation**: Zod
- **Build Tool**: `tsc` (TypeScript Compiler)

---

## Package Structure

- **[src/types/](./src/types/)**: Domain interfaces for memory entities, search results, chat sessions, and graph relations.
- **[src/schemas/](./src/schemas/)**: Zod validation schemas for API request payloads and entity structures.
- **[src/index.ts](./src/index.ts)**: Barrel export module exporting all types and schemas.

---

## Development Scripts

- `pnpm build`: Compiles TypeScript source into JavaScript and type definitions in `dist/`.
- `pnpm clean`: Cleans build output and TypeScript caches.
- `pnpm typecheck`: Executes TypeScript type checking without emitting files.
- `pnpm lint`: Runs ESLint validation.
