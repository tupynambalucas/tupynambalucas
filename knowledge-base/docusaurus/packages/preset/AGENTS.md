<context-hierarchy>
  <parent src="../../AGENTS.md" type="bounded-context-rules" />
  <system-instruction>
    AGENT: If you have not read "../../AGENTS.md" in this session, stop now and read it using your
    file-reading tools before proceeding.
  </system-instruction>
</context-hierarchy>

# Sub-Domain: Docs Preset

This workspace (`@monorepo/kb-docusaurus-preset`) is a reusable Docusaurus preset that encapsulates all plugins, sidebars, AST transformers, and Crowdin synchronization for the %PROJECT_DOMAIN% documentation.

---

## 1. Sub-Domain Guardrails

1. **Dependency Ownership**: This package MUST own all `@docusaurus/plugin-*` and `@docusaurus/theme-*` dependencies. Consuming Docusaurus services MUST NOT declare them directly.
2. **Sidebars Resolution**: Because `sidebarPath` in `plugin-content-docs` resolves relative to the consuming service root, `sidebarPath` MUST use `require.resolve()` pointing to the exported `sidebars/index.ts`.
3. **Crowdin Plugin Integration**: The preset embeds `plugins/crowdin/index.ts`, automatically copying downloaded translations from the collections domain into the service `i18n` target directory during build.
4. **No Service Coupling**: The preset MUST NOT assume the existence of specific files in consuming services unless exposed via `MonorepoPresetOptions`.

---

## 2. Scoped Operations

Run these scripts from the monorepo root:

- `pnpm kb:docusaurus:preset:typecheck`: Validates TypeScript type safety.
- `pnpm kb:docusaurus:preset:lint`: Lints preset source code.
