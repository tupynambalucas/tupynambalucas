# Local Context: Instance Core Package

This package (`@tupynambalucas-hub/core`) is the Single Source of Truth (SSOT) for data contracts, validation schemas, and TypeScript interfaces shared across the community instance stack.

---

## Local Architecture & Directory Map

- **[src/schemas/](./src/schemas/)**: Central Zod schema definitions for request validation and type safety.
- **[src/types/](./src/types/)**: Shared static TypeScript type mappings and configurations.

All codebase symbols and schemas in this library are organized under `src/`:

- **[src/schemas/](./src/schemas/)**: Central Zod schema definitions for requests, responses, and validation rules (e.g. `user.schema.ts`, `product.schema.ts`, `cycle.schema.ts`).
- **[src/types/](./src/types/)**: TypeScript type definitions and interfaces, both derived from Zod schemas (using `z.infer<typeof schema>`) and declared manually.
- **[src/index.ts](./src/index.ts)**: Main entry point exporting all public interfaces, schemas, and constants.

---

## Core Package Guardrails

1. **Schemas Naming**: All Zod validation schemas MUST end with the suffix `Schema` (e.g., `UserDTOSchema`, `RegisterDTOSchema`).
2. **Core First**: You MUST declare new schemas, parameters, and contract types in this core library before using or referencing them in `@tupynambalucas-hub/api` or `@tupynambalucas-hub/web`.
3. **Strict Return Types**: All exported functions or public APIs in this package must feature explicit return types.
4. **No Runtime Dependencies**: Never import database drivers, server modules (like Fastify), or environment configuration variables into this package. It must remain a lightweight, platform-agnostic library.
5. **Separated Type Imports**: When importing types from this package in downstream code, always use the `import type` statement separate from value imports.

---

## Scoped Operations

Run these scripts from the package directory or via pnpm filters:

- `pnpm build` (or `pnpm --filter @tupynambalucas-hub/core build`): Compiles TypeScript source files into `dist/`.
- `pnpm dev`: Runs compilation in watch mode for development.
- `pnpm clean`: Deletes build folders and compilation caches.
- `pnpm typecheck`: Validates TypeScript type-safety in this package.
