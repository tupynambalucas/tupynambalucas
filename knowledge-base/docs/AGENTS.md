<context-hierarchy>
  <parent src="../AGENTS.md" type="bounded-context-rules" />
  <system-instruction>
    AGENT: If you have not read "../AGENTS.md" in this session, stop now and read it using your
    file-reading tools before proceeding. Local constraints are mandatory.
  </system-instruction>
</context-hierarchy>

# Sub-Domain: Docs Content

This sub-domain serves as a static, engine-agnostic markdown repository. It stores the content for the monorepo's handbook, roadmap, workspaces, and generic GitHub documents.

---

## Content Organization

- **monorepo/**: Content strictly used by the global `monorepo` service instance.
- **github/**: READMEs and GitHub community files.
- **templates/**: Templates ingested by the `renderer` workspace.

No JavaScript, TypeScript, or Node build files belong in this sub-domain.
