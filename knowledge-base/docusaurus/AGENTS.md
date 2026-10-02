<context-hierarchy>
  <parent src="../AGENTS.md" type="bounded-context-rules" />
  <system-instruction>
    AGENT: If you have not read "../AGENTS.md" in this session, stop now and read it using your
    file-reading tools before proceeding. Local constraints are mandatory.
  </system-instruction>
</context-hierarchy>

# Sub-Domain: Docusaurus Ecosystem

This sub-domain contains the build infrastructure, preset abstractions, themed UI components, and deployable documentation services for %PROJECT_DOMAIN%.

---

## 1. Local Architecture

- [packages/](./packages/): Reusable internal Docusaurus libraries, presets, and UI themes.
  - [preset/](./packages/preset/AGENTS.md): Unified preset bundling classic plugins, remark variables, sidebars, and L10n synchronization.
  - [theme/](./packages/theme/AGENTS.md): Custom presentation layer implementing the Thin Orchestrator component-shadowing pattern.
- [services/](./services/): Deployable documentation services and web applications.
  - [portal/](./services/portal/AGENTS.md): Primary Docusaurus documentation service consuming content from sibling collections.

No raw documentation content (`.mdx` files) is stored in this sub-domain; all source content is externalized to the [collections/](../collections/AGENTS.md) workspace.

---

## 2. Sub-Domain Guardrails

1. **Content Externalization**: Documentation content, blog posts, and community pages MUST be authored in `knowledge-base/collections/` and never directly committed to `services/portal/`.
2. **Thin Orchestrator UI**: Custom styling and UI overrides belong in `packages/theme/` rather than hardcoded in services.
3. **Preset Ownership**: Docusaurus plugins and remark transformers MUST be encapsulated in `packages/preset/` to ensure reusability across future documentation services.
