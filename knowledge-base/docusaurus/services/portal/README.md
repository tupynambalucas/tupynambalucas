# @monorepo/kb-docusaurus-portal

Central Docusaurus documentation portal for %PROJECT_DOMAIN%. Built with Docusaurus v3 and Rspack, providing high-performance static site generation for technical documentation, community guides, and engineering releases.

---

## Architecture & Content Ingestion

This workspace acts purely as a presentation and compilation engine. All raw documentation, community guides, and blog articles are consumed dynamically from the sibling collections workspace (`knowledge-base/collections/namespaces/portal/content/`).

- **[src/pages/](./src/pages/)**: Interactive landing pages, custom layouts, and MDX entrypoints.
- **[scripts/](./scripts/)**: Scripts managing dev server execution and production build routines.
- **[docusaurus.config.ts](./docusaurus.config.ts)**: Primary configuration module configuring presets, content instances, and webpack aliases.

---

## AST Project Variables

This workspace utilizes the `remark-project-variables` plugin (injected by `@monorepo/kb-docusaurus-preset`) to avoid hardcoded brand names.

- Authors MUST use agnostic tokens like `%PROJECT_DOMAIN%` and `%PROJECT_NAME%` in all `.mdx` files.
- The plugin intercepts the AST during compilation and resolves tokens against `@monorepo/shared-config/project.config.json`.
- This preserves content portability across environments and repositories.

---

## Localization & Crowdin Integration

Localization is managed through Crowdin:

1. **Source Content**: Authored in English (`en`) inside `collections/namespaces/portal/content/`.
2. **Translation Sync**: The preset Crowdin plugin utilizes the Crowdin CLI to upload new English strings and download translated archives into `collections/namespaces/portal/translations/`, before safely copying them directly into `i18n/` at build time.
3. **CI/CD Workflow**: The environment variable `SYNC_TRANSLATIONS=true` triggers this bidirectional sync automatically during production builds.

---

## Local Development

Execute commands from the monorepo root using pnpm:

```bash
# Start development server on port 3002 (English)
pnpm kb:docusaurus:portal:dev

# Start development server in Brazilian Portuguese (pt-BR)
pnpm kb:docusaurus:portal:dev:pt

# Clear Docusaurus cache
pnpm kb:docusaurus:portal:clear
```

---

## Build & Preview

```bash
# Production static site compilation for all locales (en, pt-BR)
pnpm kb:docusaurus:portal:build

# Build and preview production output locally
pnpm kb:docusaurus:portal:preview

# TypeScript type safety check
pnpm kb:docusaurus:portal:typecheck

# ESLint quality checks
pnpm kb:docusaurus:portal:lint
```

---

## Deployment

The portal documentation is compiled and deployed via GitHub Actions:

- **Workflow**: `.github/workflows/deploy-docs.yaml`
- **Public Domain**: `https://docs.%PROJECT_DOMAIN%`
