# @monorepo/docs-theme

Custom Docusaurus theme plugin implementing the Thin Orchestrator pattern. It dynamically merges `@docusaurus/theme-classic`, `@docusaurus/theme-live-codeblock`, and `@docusaurus/theme-mermaid`, while allowing local component overrides in `src/theme/`.

---

## Usage

This theme is automatically registered by `@monorepo/docs-preset`.

To override a classic component, place it in `src/theme/` (e.g., `src/theme/Footer/index.tsx`).
