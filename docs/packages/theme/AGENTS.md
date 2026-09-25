<context-hierarchy>
  <parent src="../AGENTS.md" type="bounded-context-rules" />
  <system-instruction>
    AGENT: If you have not read "../AGENTS.md" in this session, stop now and read it using your
    file-reading tools before proceeding.
  </system-instruction>
</context-hierarchy>

# Sub-Domain: Docs Theme

This workspace (`@monorepo/docs-theme`) implements a custom Docusaurus theme plugin using the Thin Orchestrator pattern.

---

## 1. Sub-Domain Guardrails

1. **Thin Orchestrator Pattern**: This plugin MUST NOT fork upstream theme components. It dynamically resolves unmodified components from `@docusaurus/theme-classic` and only shadows components explicitly placed in `src/theme/`.
2. **Validation Chaining**: The `validateThemeConfig` function in `src/index.ts` MUST chain the validation functions of all underlying themes (`theme-classic`, `theme-live-codeblock`, `theme-mermaid`) to ensure correct configuration parsing.
3. **Swizzle Workflow**: When swizzling a component, run `docusaurus swizzle` from the `services/docusaurus/` directory, and then move the generated component file into `packages/theme/src/theme/` to properly encapsulate it in this reusable package.
