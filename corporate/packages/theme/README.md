# @monorepo/kb-docusaurus-theme

Custom Docusaurus theme plugin implementing the Thin Orchestrator pattern. It dynamically merges `@docusaurus/theme-classic`, `@docusaurus/theme-live-codeblock`, and `@docusaurus/theme-mermaid`, while allowing targeted component shadowing in `src/theme/`.

---

## Architectural Principles

1. **Thin Orchestrator**: Unmodified components are resolved directly from `@docusaurus/theme-classic`. We avoid cloning or maintaining full upstream theme forks.
2. **Component Shadowing**: To customize a component, place the replacement in `src/theme/` (e.g., `src/theme/Footer/index.tsx`).
3. **Swizzle Workflow**: Execute `docusaurus swizzle` from the consuming service directory (`knowledge-base/docusaurus/services/portal/`), then relocate the generated file to `src/theme/` to centralize UI changes.
4. **Validation Chaining**: The theme entrypoint chains configuration validators across all underlying sub-themes.

---

## Usage

This theme is automatically registered and configured by `@monorepo/kb-docusaurus-preset`.

---

## Operations & Scripts

Run commands from the monorepo root:

```bash
# Validate TypeScript type safety
pnpm kb:docusaurus:theme:typecheck

# Lint theme component source code
pnpm kb:docusaurus:theme:lint
```
