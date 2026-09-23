# @%PROJECT_NAME%-hub/core - Community Contract Library

This package plays the fundamental role of **Single Source of Truth (SSOT)** for the community-based instances of the Tupynambá Lucas architecture. It centralizes data contracts, validation logic, and shared constants used exclusively by the **Instance-based** applications (`@%PROJECT_NAME%-hub/api` and `@%PROJECT_NAME%-hub/web`).

## Architectural Role: Library (SSOT)

The shared library ensures architectural consistency within each community instance:

- **Unified Validation**: Provides Zod schemas specifically for the `@%PROJECT_NAME%-hub/api` and `@%PROJECT_NAME%-hub/web` applications of a community instance.
- **Type Safety**: Inferred TypeScript types prevent model drift between the community's API (`@%PROJECT_NAME%-hub/api`) and its management/shop portal (`@%PROJECT_NAME%-hub/web`).
- **Logical Separation**: This package is **not** shared with the global portal (`www`). Any shared logic required by the portal or future global services will be housed in dedicated packages to ensure strict separation of concerns.

---

## Directory Layout

- **[src/schemas/](./src/schemas/)**: Central Zod schema definitions for request validation and type safety.
- **[src/types/](./src/types/)**: Shared static TypeScript type mappings and configurations.

---

### Documentation

Detailed technical documentation is available in our [Knowledge Base](https://docs.%PROJECT_DOMAIN%):

- [Architecture Overview](https://docs.%PROJECT_DOMAIN%/docs/explanation/architecture-overview): SSOT principles and monorepo structure.
- [Style Guide](https://docs.%PROJECT_DOMAIN%/docs/reference/styleguide): Coding standards and naming conventions.

---

## Core Responsibilities

The library provides centralized resources used by community-instance modules:

1.  **Validation Schemas (Zod)**:
    - Definitions for `User`, `Product`, `Cycle`, and `Auth` entities within a community.
    - Ensures unified validation for instance-specific API Payloads and Frontend Forms.

2.  **TypeScript Typing**:
    - Static types inferred from Zod Schemas (`z.infer<>`).
    - Prevents data model drift between `@%PROJECT_NAME%-hub/api` and `@%PROJECT_NAME%-hub/web`.

3.  **Global Constants**:
    - Shared configurations and fixed values (e.g., Cycle status codes).

---

## Development Flow

To update data contracts:

1.  **Modify**: Edit schemas in `src/schemas`.
2.  **Build**: Run compilation to propagate types:
    ```bash
    pnpm build
    ```
3.  **Refactor**: TypeScript will automatically identify drift in the `@%PROJECT_NAME%-hub/api` or `@%PROJECT_NAME%-hub/web` packages.

---

## Operations & Commands

- `pnpm build`: Compiles TS and generates declarations.
- `pnpm dev`: Watch mode for real-time propagation.
- `pnpm lint`: Source code standardization.
