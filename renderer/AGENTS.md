# Local Context: Renderer Workspace

This workspace (`@tupynambalucas/renderer`) manages the generic dynamic asset generator and document compilation engine, responsible for generating custom visual SVG cards and compiling markdown templates into production-grade documents across the monorepo.

---

## Local Architecture

- **[src/index.ts](./src/index.ts)**: Main CLI entry point executing registered active pipelines.
- **[src/pipelines/](./src/pipelines/)**: Pipelines Layer containing decoupled, single-responsibility configuration files.
  - **[src/pipelines/types.ts](./src/pipelines/types.ts)**: Shared schemas and pipeline target definitions.
  - **[src/pipelines/github-profile.pipeline.ts](./src/pipelines/github-profile.pipeline.ts)**: Profile README target configuration.
- **[src/templates/](./src/templates/)**: Root folder for static source template documents:
  - **[src/templates/cards/stats/](./src/templates/cards/stats/)**: Dynamic statistics-based card templates (e.g., [languages.template.svg](./src/templates/cards/stats/languages.template.svg), [overview.template.svg](./src/templates/cards/stats/overview.template.svg)).
  - **[src/templates/cards/static/](./src/templates/cards/static/)**: Static graphic layouts (e.g., [header.template.svg](./src/templates/cards/static/header.template.svg)).
  - **[src/templates/docs/](./src/templates/docs/)**: Textual markdown layout templates (e.g., [README.template.md](./src/templates/docs/README.template.md)).
- **[src/renderers/](./src/renderers/)**: Dedicated compilation and layout components:
  - **[src/renderers/stats-card.ts](./src/renderers/stats-card.ts)**: Compiles metrics into overview and language SVGs.
  - **[src/renderers/header-card.ts](./src/renderers/header-card.ts)**: Inlines fonts and parses brand tokens into dark and light SVG headers.
- **[src/utils/font-encoder.ts](./src/utils/font-encoder.ts)**: Locates and base64-encodes the local variable Nunito font binary from studio assets.

---

## Local Previews Output Layout

When executing `pnpm generate` locally, the compiler creates a unified sandbox for previewing both themes with absolute fidelity:

- **`generated/cards/`**: Unified directory containing physical `-light.svg` and `-dark.svg` copies of all generated cards (including statistics overview, languages, and headers).
- **`generated/docs/`**: Subdivided theme directories to view compiled markdown files:
  - **`generated/docs/light/`**: Light-themed `.md` documents, referencing light-themed cards from `../../cards/`.
  - **`generated/docs/dark/`**: Dark-themed `.md` documents, referencing dark-themed cards from `../../cards/`.

---

## Workspace Guardrails

1. **TypeScript Implementation**: The rendering and pipeline compilation engine MUST be implemented in TypeScript/Node.js to maintain a cohesive, full-type codebase.
2. **Modular Pipelines**: All document generation targets MUST be implemented as independent modules inside the pipelines layer to satisfy the Open/Closed Principle. Adding a compilation routine MUST NOT modify existing pipelines or core execution logic.
3. **Template Consistent Naming**: All source files under the templates directory MUST use the `*.template.*` suffix pattern to distinguish static templates from compiled output.
4. **Design Token Consumption**: Text style and layout colors MUST be bound directly to the central brand design system tokens from `@tupynambalucas-studio/design`.
5. **Base64 Font Inlining**: To guarantee rendering consistency under GitHub's SVG image sandbox, the variable Nunito brand font file MUST be encoded and inlined directly inside the generated SVGs using base64 data URIs.
6. **Robust API Connection**: The engine MUST connect directly to the GitHub GraphQL API, employing up to 10 automated retries with exponential backoff on network failures. Local git-clone fallbacks are prohibited.

---

## Scoped Operations

Run these scripts from the workspace directory or via pnpm filters:

- `pnpm clean`: Removes all compiled files and cache files.
- `pnpm generate`: Runs the document compilation pipeline locally, generating previews.
- `pnpm typecheck`: Executes TypeScript compiler verification with zero emit.
- `pnpm lint`: Runs ESLint analysis on the workspace codebase.
