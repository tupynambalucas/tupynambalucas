<context-hierarchy>
  <parent src="../AGENTS.md" type="bounded-context-rules" />
  <system-instruction>
    AGENT: If you have not read "../AGENTS.md" in this session, stop now and read it using your
    file-reading tools before proceeding.
  </system-instruction>
</context-hierarchy>

# Docusaurus Service Context

This workspace ([monorepo/](./)) manages the main Docusaurus build engine for the %PROJECT_DOMAIN% knowledge base.

---

## 1. Local Architecture

This workspace is strictly an engine and DOES NOT contain raw markdown documentation. All content is dynamically consumed from the `../../../docs/monorepo/` workspace.

- [src/](./src/): Custom React components, page templates, and layouts.
  - [src/pages/](./src/pages/): MDX landing pages and custom layout files.
- [scripts/](./scripts/): Task scripts orchestrating documentation dev/build pipelines.
- [tooling/](./tooling/): Utility scripts compiling raw git history into changelogs, roadmaps, and syncing i18n translations.
- [docusaurus.config.ts](./docusaurus.config.ts): Primary Docusaurus configuration.

---

## 2. Workspace Guardrails

1. **AST Variable Transformer**: The workspace uses the `remark-project-variables` AST plugin (provided by the preset). Agents MUST write agnostic tokens like `%PROJECT_DOMAIN%` instead of hardcoded brand names.
2. **Translation Synchronization**: Docusaurus requires the `i18n` directory to be present locally. The `tooling/sync-i18n.ts` script automatically injects the translations from `../../../docs/monorepo/i18n` into this workspace at build/dev time. Agents MUST NOT permanently edit translation files inside this workspace; edits must be made in the `docs` workspace.
3. **No Content Creation**: Agents MUST NOT create `handbook/`, `workspaces/`, or `roadmap/` directories inside this workspace. All documentation authoring must happen in the `knowledge-base/docs/monorepo/` sub-domain.

---

## 3. Required Skill

When creating, updating, or reviewing any configuration or `.mdx` file within this workspace, agents MUST activate the `docusaurus-expert` skill by name before beginning.

---

## 4. Scoped Operations

Run these scripts via pnpm filters from the monorepo root:

- `pnpm kb:docusaurus:monorepo:dev`: Runs the development server.
- `pnpm kb:docusaurus:monorepo:build`: Executes the Docusaurus production build pipeline.
- `pnpm kb:docusaurus:monorepo:typecheck`: Validates TypeScript type safety.
- `pnpm kb:docusaurus:monorepo:generate:changelog`: Compiles the official changelog page.
- `pnpm kb:docusaurus:monorepo:generate:roadmap`: Compiles the official roadmap page.
