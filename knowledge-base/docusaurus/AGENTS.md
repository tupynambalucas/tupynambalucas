<context-hierarchy>
  <parent src="../AGENTS.md" type="bounded-context-rules" />
  <system-instruction>
    AGENT: If you have not read "../AGENTS.md" in this session, stop now and read it using your
    file-reading tools before proceeding. Local constraints are mandatory.
  </system-instruction>
</context-hierarchy>

# Sub-Domain: Docusaurus Ecosystem

This sub-domain contains the build infrastructure, React components, themes, and configuration required to compile the static site generation using Docusaurus.

---

## 1. Local Architecture

- **packages/**: Contains the Docusaurus presets and themes.
- **services/monorepo/**: The main Docusaurus service. Consumes files dynamically from the sibling `../docs` workspace.

No raw documentation content (`.mdx` files representing tutorials or guides) should be stored here; all content must be externalized to the `knowledge-base/docs/` sub-domain.
