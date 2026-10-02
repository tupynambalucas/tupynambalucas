<context-hierarchy>
  <parent src="../AGENTS.md" type="bounded-context-rules" />
  <system-instruction>
    AGENT: If you have not read "../AGENTS.md" in this session, stop now and read it using your
    file-reading tools before proceeding. Local constraints are mandatory.
  </system-instruction>
</context-hierarchy>

# Sub-Domain: Knowledge Base Collections

This workspace (`@monorepo/kb-collections`) provides decoupled content collections organized by Feature-Sliced Design (FSD) namespaces, along with Crowdin configurations for automated translation synchronization.

---

## 1. Directory Architecture

- [namespaces/portal/content/](./namespaces/portal/content/): Source content for the portal service.
  - [docs/](./namespaces/portal/content/docs/): Technical documentation structured under the Diátaxis framework.
  - [community/](./namespaces/portal/content/community/): Community resources, team, contributing guides, and roadmaps.
  - [blog/](./namespaces/portal/content/blog/): Engineering blog, release notes, [authors.yml](./namespaces/portal/content/blog/authors.yml), and [tags.yml](./namespaces/portal/content/blog/tags.yml).
- [namespaces/portal/locales/](./namespaces/portal/locales/): Target directory for L10n translations synced via GitHub App.

---

## 2. Workspace Guardrails

1. **Diátaxis Compliance**: All documents in `docs/` MUST be filed into one of the four Diátaxis quadrants (`tutorials`, `guides`, `reference`, `explanation`).
2. **Blog Truncation Markers**: All blog posts and release notes MUST include the `{/* truncate */}` marker to avoid build warnings and ensure clean feed generation.
3. **AST Agnostic Tokens**: Authors MUST NOT hardcode project names or domains; use `%PROJECT_DOMAIN%` and `%PROJECT_NAME%` tokens.
4. **Translation Isolation**: Files in `locales/` are managed exclusively by the Crowdin GitHub App via automated PRs. Do NOT edit them manually.
5. **Translation Configuration**: The `crowdin.yml` is centralized at the monorepo root to govern all workspaces via GitHub App.

---

## 3. Scoped Operations

Run these scripts from the monorepo root:

- `pnpm kb:collections:lint`: Lints package.json and Markdown files using root rules.
