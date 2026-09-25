# @monorepo/docs-docusaurus

This is the central, authoritative documentation hub for the %PROJECT_DOMAIN% project monorepo. Built with Docusaurus v3, it provides a high-performance, strictly-typed technical and product knowledge base.

---

## Structure & Content

The documentation workspace is organized as follows:

- **[handbook/](./handbook/)**: Central project documentation structured using the Diataxis framework.
  - **[tutorials/](./handbook/tutorials/)**: Learning-oriented guides to get started.
  - **[guides/](./handbook/guides/)**: Goal-oriented directions to solve specific tasks.
  - **[reference/](./handbook/reference/)**: Information-oriented technical specs and APIs.
  - **[explanation/](./handbook/explanation/)**: Understanding-oriented concept explanations.
- **[workspaces/](./workspaces/)**: Structural and technical specifications for each monorepo workspace.
- **[roadmap/](./roadmap/)**: Project roadmap and timeline milestones.
- **[releases/](./releases/)**: Official changelogs and release notes (Changelog blog posts).
- **[i18n/](./i18n/)**: Translation catalogs for localized content (English and Brazilian Portuguese).
- **[src/](./src/)**: Custom React components, page templates, and site-level CSS.
- **[scripts/](./scripts/)**: Task scripts orchestrating documentation dev/build pipelines.
- **[tooling/](./tooling/)**: Utility scripts compiling raw git history into changelogs and roadmaps.
- **[docusaurus.config.ts](./docusaurus.config.ts)**: Primary Docusaurus entrypoint (consumes the custom preset).

---

## Diataxis Framework

All documentation under [handbook/](./handbook/) strictly adheres to the Diataxis framework to classify and separate content by user intent:

- **Tutorials**: Learning-oriented guides that help developers get started.
- **How-to Guides**: Goal-oriented recipes that solve specific problems.
- **Reference**: Information-oriented technical descriptions, APIs, and configuration schemas.
- **Explanation**: Understanding-oriented discussions on architecture and concepts.

For more details on applying Diataxis to this workspace, please refer to the introductory guide in [handbook/intro.mdx](./handbook/intro.mdx) or the local agent guidelines in [AGENTS.md](./AGENTS.md).

---

## AST Variables Plugin

This workspace utilizes a custom `remark-project-variables` plugin (via `@monorepo/docs-preset`) to prevent hardcoded brand names.

- You MUST write agnostic tokens like `%PROJECT_DOMAIN%` in all `.mdx` files.
- The plugin intercepts the AST (Abstract Syntax Tree) during build time and resolves the tokens using `project.config.json`.
- This ensures the raw markdown remains copy-pasteable and generic for AI agents and template reuse.

---

## Local Development

Execute commands from the monorepo root using pnpm filtering:

```bash
pnpm docs:dev     # Start in English (default) - http://localhost:3002
pnpm docs:dev:pt  # Start in Brazilian Portuguese (pt-BR)
```

---

## Build Pipelines

```bash
pnpm docs:build
```

The static site will be generated in the `build/` directory using an optimized SSG pipeline.

---

## Deployment

The documentation is automatically deployed to Cloudflare Pages via GitHub Actions.

- **Workflow:** `.github/workflows/deploy-docs.yaml`
- **Authoritative URL:** [https://docs.%PROJECT_DOMAIN%](https://docs.%PROJECT_DOMAIN%)
