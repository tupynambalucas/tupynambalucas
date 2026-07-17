# @tupynambalucas/renderer

This workspace manages the generic dynamic asset generator and document compilation engine,
responsible for generating custom visual SVG cards and compiling markdown templates into
production-grade documents across the monorepo.

---

## Directory Layout

- **[src/clients/](./src/clients/)**: API client integrations (such as
  [github.ts](./src/clients/github.ts)) for retrieving user stats and repository metrics via
  GitHub's GraphQL API.
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
  - [githubstats.schema.ts](./src/schemas/githubstats.schema.ts): GitHub API user stats response
    validation.
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
  - [template-fill.ts](./src/utils/template-fill.ts): Custom string interpolation parser for
    injecting stats into templates.
- **[src/index.ts](./src/index.ts)**: Central coordination entrypoint coordinating data fetching,
  rendering, and pipeline writes.
- **[generated/cards/](./generated/cards/)**: Vector SVG card outputs generated for light and dark
  themes.
- **[generated/docs/](./generated/docs/)**: Markdown preview files generated for light and dark
  themes.

---

## Active Pipelines

- **[github-profile.pipeline.ts](./src/pipelines/github-profile.pipeline.ts)**:
  Compiles the root-level developer profile [README.md](../README.md) using the statistics cards
  generated from the GitHub API.

---

## Technical Features

### 1. Extensible Pipeline Architecture

The system supports registering multiple independent pipelines inside
[src/pipelines/index.ts](./src/pipelines/index.ts). Each pipeline defines template sources,
output locations (both locally and in remote CI/CD branches), allowing the renderer to compile
completely different document suites (e.g., GitHub developer profiles, handbook manuals, or design
systems) concurrently.

### 2. Sandbox-Proof Vector Branding

By base64-encoding our local variable **Nunito** font file and embedding it as an inlined
`@font-face` within our SVG templates, we bypass GitHub's strict HTML image sandbox restrictions.
This ensures that custom text styles render with pixel-perfect brand fidelity on all screens.

### 3. Native Design System Binding

Colors and font primitives are resolved directly from `@tupynambalucas-studio/design` tokens. This
makes our SVGs completely responsive to design system changes.

---

## Scripts

Run these scripts from the workspace directory or via pnpm filters:

- `pnpm clean`: Removes all compiled files, caches, and output build directories.
- `pnpm generate`: Runs the document compilation pipeline locally, writing files to the monorepo
  root or package previews.
- `pnpm typecheck`: Executes TypeScript compiler validation.
- `pnpm lint`: Performs static ESLint checks.
