# @monorepo/kb-docusaurus-monorepo

This is the central, authoritative Docusaurus build engine for the %PROJECT_DOMAIN% project monorepo. Built with Docusaurus v3, it provides a high-performance, strictly-typed technical and product knowledge base.

---

## Structure & Content

This workspace strictly acts as a rendering engine. All raw documentation content is stored in the sibling `knowledge-base/docs/monorepo` workspace.

- **[src/](./src/)**: Custom React components, page templates, and site-level CSS.
- **[scripts/](./scripts/)**: Task scripts orchestrating documentation dev/build pipelines.
- **[tooling/](./tooling/)**: Utility scripts compiling raw git history into changelogs, roadmaps, and i18n synchronization.
- **[docusaurus.config.ts](./docusaurus.config.ts)**: Primary Docusaurus entrypoint (consumes the custom preset).

---

## AST Variables Plugin

This workspace utilizes a custom `remark-project-variables` plugin (via `@monorepo/kb-docusaurus-preset`) to prevent hardcoded brand names.

- You MUST write agnostic tokens like `%PROJECT_DOMAIN%` in all `.mdx` files.
- The plugin intercepts the AST (Abstract Syntax Tree) during build time and resolves the tokens using `project.config.json`.
- This ensures the raw markdown remains copy-pasteable and generic for AI agents and template reuse.

---

## Local Development

Execute commands from the monorepo root using pnpm filtering:

```bash
pnpm kb:docusaurus:monorepo:dev     # Start in English (default) - http://localhost:3002
pnpm kb:docusaurus:monorepo:dev:pt  # Start in Brazilian Portuguese (pt-BR)
```

---

## Build Pipelines

```bash
pnpm kb:docusaurus:monorepo:build
```

The static site will be generated in the `build/` directory using an optimized SSG pipeline.

---

## Deployment

The documentation is automatically deployed to Cloudflare Pages via GitHub Actions.

- **Workflow:** `.github/workflows/deploy-docs.yaml`
- **Authoritative URL:** [https://docs.%PROJECT_DOMAIN%](https://docs.%PROJECT_DOMAIN%)
