# @tupynambalucas/docs - Documentation Hub

This is the central, authoritative documentation hub for the tupynambalucas.dev project monorepo. Built with Docusaurus v3, it provides a high-performance, strictly-typed technical and product knowledge base.

---

## Structure & Content

The documentation workspace is organized as follows:

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

## Diátaxis Framework

All documentation under [handbook/](./handbook/) strictly adheres to the Diátaxis framework to classify and separate content by user intent:

- **Tutorials**: Learning-oriented guides that help developers get started.
- **How-to Guides**: Goal-oriented recipes that solve specific problems.
- **Reference**: Information-oriented technical descriptions, APIs, and configuration schemas.
- **Explanation**: Understanding-oriented discussions on architecture and concepts.

For more details on applying Diátaxis to this workspace, please refer to the introductory guide in [handbook/intro.mdx](./handbook/intro.mdx) or the local agent guidelines in [AGENTS.md](./AGENTS.md).

---

## Local Development

Manage the documentation from the project root or this directory:

### From Monorepo Root

```bash
pnpm docs:dev     # Start in English (default) - http://localhost:3002
pnpm docs:dev:pt  # Start in Brazilian Portuguese (pt-BR)
```

### Within this Workspace

```bash
pnpm start     # Start in English
pnpm start:pt  # Start in Brazilian Portuguese (pt-BR)
```

---

## Build Pipelines

```bash
pnpm build
```

The static site will be generated in the `build/` directory using an optimized SSG pipeline.

---

## Deployment

The documentation is automatically deployed to Cloudflare Pages via GitHub Actions.

- **Workflow:** `.github/workflows/deploy-docs.yaml`
- **Authoritative URL:** [https://docs.tupynambalucas.dev](https://docs.tupynambalucas.dev)
