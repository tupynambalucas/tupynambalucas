<context-hierarchy>
  <parent src="../AGENTS.md" type="global-rules" />
  <system-instruction>
    AGENT: If you have not read "../AGENTS.md" in this session, stop now and read it using your
    file-reading tools before proceeding. Global constraints are mandatory.
  </system-instruction>
</context-hierarchy>

# Bounded Context: Knowledge Base

This bounded context orchestrates the developer knowledge base, centralizing both the agnostic markdown documentation and the Docusaurus ecosystem for the %PROJECT_DOMAIN% monorepo.

---

## 1. Local Architecture

- [docs/](./docs/AGENTS.md): Sub-domain containing agnostic markdown files (handbook, roadmap, etc.).
- [docusaurus/](./docusaurus/AGENTS.md): Sub-domain containing the Docusaurus build engine, presets, and themes.

---

## 2. Required Skill

When creating, updating, or reviewing any `.mdx` or `.md` file within the documentation workspaces, agents MUST activate the `docusaurus-expert` skill by name before beginning.
