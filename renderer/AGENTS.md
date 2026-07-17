# Local Context: Renderer Workspace

This workspace (`@tupynambalucas/renderer`) manages the generic dynamic asset generator and
document compilation engine, responsible for generating custom visual SVG cards and compiling
markdown templates into production-grade documents across the monorepo.

---

## Local Architecture

- **[src/clients/](./src/clients/)**: API client integrations (e.g.,
  [github.ts](./src/clients/github.ts)) to query the GitHub GraphQL API.
- **[src/config/](./src/config/)**: Environment variable configurations and target constants
  loaded in [env.config.ts](./src/config/env.config.ts).
- **[src/pipelines/](./src/pipelines/)**: Pipeline modules executing single-responsibility asset
  compilation processes.
  - [index.ts](./src/pipelines/index.ts): Registry of all active document generation pipelines.
  - [types.ts](./src/pipelines/types.ts): Type declarations for pipelines and targets.
- **[src/renderers/](./src/renderers/)**: Engines compiling metadata into layout templates.
  - [header-card.ts](./src/renderers/header-card.ts): Generates themed brand header SVG cards.
  - [stats-card.ts](./src/renderers/stats-card.ts): Renders user profile metrics into SVG stats
    cards.
- **[src/schemas/](./src/schemas/)**: Zod validation schemas enforcing configuration and API
  payload shape.
  - [env.schema.ts](./src/schemas/env.schema.ts): Environment variable validation schema.
  - [githubstats.schema.ts](./src/schemas/githubstats.schema.ts):
    GitHub API user stats response validation.
  - [language.schema.ts](./src/schemas/language.schema.ts): Language payload validation.
  - [repository.schema.ts](./src/schemas/repository.schema.ts): Repository metrics validation.
- **[src/templates/](./src/templates/)**: Domain-organized visual templates (SVG cards and Markdown docs).
  - [cards/static/](./src/templates/cards/static/): Contains static brand SVG templates (e.g.,
    [header.template.svg](./src/templates/cards/static/header.template.svg)).
  - [cards/stats/](./src/templates/cards/stats/): Contains dynamic stats templates (e.g.,
    [languages.template.svg](./src/templates/cards/stats/languages.template.svg)).
  - [docs/](./src/templates/docs/): Markdown templates for generated documents (e.g.,
    [README.template.md](./src/templates/docs/README.template.md)).
- **[src/utils/](./src/utils/)**: Common helpers for compilation and formatting.
  - [font-encoder.ts](./src/utils/font-encoder.ts): Font loader that inlines Nunito variable fonts
    as base64 strings.
  - [glob.ts](./src/utils/glob.ts): Simple glob matcher helper for filtering items.
  - [template-fill.ts](./src/utils/template-fill.ts):
    Custom string interpolation parser for injecting stats into templates.
- **[src/index.ts](./src/index.ts)**: Central coordination entrypoint coordinating data fetching,
  rendering, and pipeline writes.

---

## Active Pipelines

- **[github-profile.pipeline.ts](./src/pipelines/github-profile.pipeline.ts)**:
  Compiles the root-level developer profile [README.md](../README.md) using the statistics cards
  generated from the GitHub API.

---

## Local Previews Output Layout

When executing `pnpm generate` locally, the compiler creates a unified sandbox for previewing both
themes with absolute fidelity:

- **[generated/cards/](./generated/cards/)**: Unified directory containing physical `-light.svg`
  and `-dark.svg` copies of all generated cards (including statistics overview, languages, and headers).
- **[generated/docs/](./generated/docs/)**: Subdivided theme directories to view compiled markdown files:
  - **[generated/docs/light/](./generated/docs/light/)**: Light-themed `.md` documents, referencing light-themed
    cards from `../../cards/`.
  - **[generated/docs/dark/](./generated/docs/dark/)**: Dark-themed `.md` documents, referencing dark-themed
    cards from `../../cards/`.

---

## Code Patterns

### Registering a New Pipeline

All pipelines MUST satisfy the `Pipeline` type schema and be registered inside
[src/pipelines/index.ts](./src/pipelines/index.ts):

```typescript
import type { Pipeline } from './types.js';

export const customPipeline: Pipeline = {
  id: 'handbook-docs',
  name: 'Handbook Documents',
  description: 'Compiles project manuals and handbooks.',
  targets: [
    {
      name: 'User Guide',
      templatePath: 'src/templates/docs/guide.template.md',
      outputPath: '../docs/GUIDE.md',
      ciPath: 'docs/GUIDE.md',
      ciBranches: ['main'],
    },
  ],
};
```

---

## Workspace Guardrails

1. **TypeScript Implementation**: The rendering and pipeline compilation engine MUST be implemented
   in TypeScript/Node.js to maintain a cohesive, full-type codebase.
2. **Modular Pipelines**: All document generation targets MUST be implemented as independent
   modules inside the pipelines layer to satisfy the Open/Closed Principle. Adding a compilation
   routine MUST NOT modify existing pipelines or core execution logic.
3. **Template Consistent Naming**: All source files under the templates directory MUST use the
   `*.template.*` suffix pattern to distinguish static templates from compiled output.
4. **Design Token Consumption**: Text style and layout colors MUST be bound directly to the central
   brand design system tokens from `@tupynambalucas-studio/design`.
5. **Base64 Font Inlining**: To guarantee rendering consistency under GitHub's SVG image sandbox,
   the variable Nunito brand font file MUST be encoded and inlined directly inside the generated
   SVGs using base64 data URIs.
6. **Robust API Connection**: The engine MUST connect directly to the GitHub GraphQL API, employing
   up to 10 automated retries with exponential backoff on network failures. Local git-clone
   fallbacks are prohibited.

---

## Scoped Operations

Run these scripts from the workspace directory or via pnpm filters:

- `pnpm clean`: Removes all compiled files and cache files.
- `pnpm generate`: Runs the document compilation pipeline locally, generating previews.
- `pnpm typecheck`: Executes TypeScript compiler verification with zero emit.
- `pnpm lint`: Runs ESLint analysis on the workspace codebase.
