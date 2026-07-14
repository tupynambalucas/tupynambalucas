# Local Context: Documentation Hub (Docs)

This workspace (`@tupynambalucas/docs`) is the central knowledge base for the tupynambalucas.dev monorepo, powered by Docusaurus v3.

---

## Local Architecture

- **[handbook/](./handbook/)**: Central project documentation structured using the Diátaxis framework:
  - **[tutorials/](./handbook/tutorials/)**: Learning-oriented guides to get started.
  - **[guides/](./handbook/guides/)**: Goal-oriented directions to solve specific tasks.
  - **[reference/](./handbook/reference/)**: Information-oriented technical specs and APIs.
  - **[explanation/](./handbook/explanation/)**: Understanding-oriented concept explanations.
- **[workspaces/](./workspaces/)**: Structural and technical specifications for each monorepo workspace.
- **[roadmap/](./roadmap/)**: Project roadmap and timeline milestones.
- **[releases/](./releases/)**: Official changelogs and release notes (Changelog blog posts).
- **[i18n/](./i18n/)**: Translation catalogs for localized content (English and Brazilian Portuguese).
- **[src/](./src/)**: Custom React components, theme styles, page templates, and layouts.
  - **[src/pages/](./src/pages/)**: MDX landing pages and custom layout files.
- **[preset/](./preset/)**: Custom Docusaurus preset options and design tokens theme configurations.
- **[loaders/](./loaders/)**: Webpack asset loaders for dynamic, bucket-stored Studio design resources.
- **[scripts/](./scripts/)**: Task scripts orchestrating documentation dev/build pipelines.
- **[tooling/](./tooling/)**: Utility scripts compiling raw git history into changelogs and roadmaps.
- **[docusaurus.config.ts](./docusaurus.config.ts)**: Primary Docusaurus configuration for plugins, headers, footers, and localization.
- **[sidebars.ts](./sidebars.ts)** / **[sidebarsRoadmap.ts](./sidebarsRoadmap.ts)** / **[sidebarsWorkspaces.ts](./sidebarsWorkspaces.ts)**: Navigation structures for sidebars mapping.

---

## Workspace Guardrails

1. **Diátaxis Framework Standard**: All technical and user documentation under [handbook/](./handbook/) MUST adhere strictly to the Diátaxis quadrants. No content should conflate tutorials with how-to guides or reference with explanation.
2. **MDX Extension Rule**: All documentation files under the [docs/](./) workspace (including [handbook/](./handbook/), [workspaces/](./workspaces/), [releases/](./releases/), [roadmap/](./roadmap/), and translations in [i18n/](./i18n/)) MUST use the `.mdx` extension. Standard `.md` files are strictly prohibited without exception (except the workspace-root [README.md](./README.md) and [AGENTS.md](./AGENTS.md)).
3. **MDX Syntax Compliance**: All HTML tags MUST be closed. Attributes MUST use JSX syntax, and React component imports MUST be placed at the top of the file.
4. **No Dead Links**: Every link pointing to another document within the docs workspace MUST be a valid relative path pointing to the target `.mdx` file, or a Docusaurus absolute path (e.g., `(/docs/...)`). Standard external links are only permitted for official external documentation or online pages.
5. **Localization Parity (pt-BR)**: Every English document addition or change MUST have a synchronized Brazilian Portuguese (`pt-BR`) translation under [i18n/](./i18n/).

---

## Scoped Operations

Run these scripts from the workspace directory or via pnpm filters:

- `pnpm start`: Runs the development server at `http://localhost:3002`.
- `pnpm build`: Executes the Docusaurus production build pipeline.
- `pnpm typecheck`: Validates TypeScript type safety across script wrappers.
- `pnpm docs:generate:changelog`: Compiles the official changelog page.
