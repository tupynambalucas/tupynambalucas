<context-hierarchy>
  <parent src="../AGENTS.md" type="bounded-context-rules" />
  <system-instruction>
    AGENT: If you have not read "../AGENTS.md" in this session, stop now and read it using your
    file-reading tools before proceeding. Local constraints are mandatory.
  </system-instruction>
</context-hierarchy>

# Sub-Domain: Knowledge Base Collections

This workspace (`@monorepo/kb-collections`) provides decoupled content collections organized by Feature-Sliced Design (FSD) domains, along with an automated Crowdin translation synchronization SDK.

---

## 1. Directory Architecture

- [domains/portal/content/](./domains/portal/content/): Source content for the portal service.
  - [docs/](./domains/portal/content/docs/): Technical documentation structured under the Diátaxis framework.
  - [community/](./domains/portal/content/community/): Community resources, team, contributing guides, and roadmaps.
  - [blog/](./domains/portal/content/blog/): Engineering blog, release notes, [authors.yml](./domains/portal/content/blog/authors.yml), and [tags.yml](./domains/portal/content/blog/tags.yml).
- [domains/portal/translations/](./domains/portal/translations/): Target directory for Crowdin translation archives.
- [src/](./src/): Crowdin API SDK client and translation CLI tooling.
  - [crowdin.ts](./src/crowdin.ts): Orchestrates Crowdin project builds, ZIP downloads, and extractions.
  - [cli.ts](./src/cli.ts): CLI runner invoked by CI workflows and local build scripts.

---

## 2. Workspace Guardrails

1. **Diátaxis Compliance**: All documents in `docs/` MUST be filed into one of the four Diátaxis quadrants (`tutorials`, `guides`, `reference`, `explanation`).
2. **Blog Truncation Markers**: All blog posts and release notes MUST include the `{/* truncate */}` marker to avoid build warnings and ensure clean feed generation.
3. **AST Agnostic Tokens**: Authors MUST NOT hardcode project names or domains; use `%PROJECT_DOMAIN%` and `%PROJECT_NAME%` tokens.
4. **Translation Isolation**: Files in `translations/` are managed exclusively by the Crowdin SDK. Do NOT edit them manually.
5. **Environment Configuration**: The Crowdin SDK loads `.env` for local operations while consuming standard CI environment variables in GitHub Actions.

---

## 3. Scoped Operations

Run these scripts from the monorepo root:

- `pnpm kb:collections:typecheck`: Validates TypeScript type safety for SDK scripts.
- `pnpm kb:collections:lint`: Lints SDK code using root TypeScript rules.
- `pnpm --filter @monorepo/kb-collections run sync-translations --collection portal`: Downloads and extracts latest translations from Crowdin.
