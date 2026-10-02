# Docusaurus Ecosystem

This directory houses the Docusaurus presets, themes, and deployable documentation services responsible for rendering the static site generation platform for %PROJECT_DOMAIN%.

---

## Directory Architecture

- **[packages/](./packages/)**: Shared internal Docusaurus libraries, presets, and presentation layers.
  - **[preset/](./packages/preset/README.md)**: Custom preset (`@monorepo/kb-docusaurus-preset`) configuring Docusaurus plugins, remark AST transformations, sidebars, and L10n synchronization.
  - **[theme/](./packages/theme/README.md)**: Custom theme (`@monorepo/kb-docusaurus-theme`) implementing the Thin Orchestrator component-shadowing pattern.
- **[services/](./services/)**: Deployable documentation applications and portal servers.
  - **[portal/](./services/portal/README.md)**: Primary documentation portal (`@monorepo/kb-docusaurus-portal`) consuming content dynamically from sibling collections.

---

## Design Principles

1. **Content Externalization**: No raw documentation or blog articles reside in this sub-domain. Content is maintained in `knowledge-base/collections/`.
2. **Thin Orchestrator UI**: UI components and themes avoid forking upstream packages; customizations dynamically shadow `@docusaurus/theme-classic`.
3. **Reusable Preset**: Global configurations, remark transformers, and multi-instance docs setups are encapsulated in `packages/preset/` to allow multiple documentation portals.
