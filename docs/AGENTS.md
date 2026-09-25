<context-hierarchy>
  <parent src="../AGENTS.md" type="global-rules" />
  <system-instruction>
    AGENT: If you have not read "../AGENTS.md" in this session, stop now and read it using your
    file-reading tools before proceeding. Global constraints are mandatory.
  </system-instruction>
</context-hierarchy>

# Bounded Context: Documentation

This bounded context orchestrates the developer knowledge base, custom Docusaurus presets, and custom themes for the %PROJECT_DOMAIN% monorepo.

---

## 1. Local Architecture

- [packages/](./packages/AGENTS.md): Sub-domain containing all reusable libraries and themes.
- [services/](./services/AGENTS.md): Sub-domain containing the documentation application instance.

---

## 2. Required Skill

When creating, updating, or reviewing any `.mdx` file within the documentation workspaces, agents MUST activate the `docusaurus-expert` skill by name before beginning.
