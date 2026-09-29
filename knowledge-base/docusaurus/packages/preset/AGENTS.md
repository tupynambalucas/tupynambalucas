<context-hierarchy>
  <parent src="../AGENTS.md" type="bounded-context-rules" />
  <system-instruction>
    AGENT: If you have not read "../AGENTS.md" in this session, stop now and read it using your
    file-reading tools before proceeding.
  </system-instruction>
</context-hierarchy>

# Sub-Domain: Docs Preset

This workspace (`@monorepo/docs-preset`) is a reusable Docusaurus preset that encapsulates all plugins, sidebars, and theme configurations for the monorepo documentation.

---

## 1. Sub-Domain Guardrails

1. **Dependency Ownership**: This package MUST own all `@docusaurus/plugin-*` and `@docusaurus/theme-*` dependencies. The consuming Docusaurus service MUST NOT declare them directly.
2. **Sidebars Resolution**: Because `sidebarPath` in `plugin-content-docs` resolves relative to the consuming service's root (not this package), `sidebarPath` MUST use `require.resolve()` pointing to the absolute path of the local `sidebars/index.ts` file.
3. **No Service Coupling**: The preset MUST NOT assume the existence of specific files in the consuming service (e.g., hardcoded paths to `src/css/custom.css`), unless exposed via the `MonorepoPresetOptions` API.
