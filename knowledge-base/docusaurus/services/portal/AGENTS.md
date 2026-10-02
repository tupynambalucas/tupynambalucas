<context-hierarchy>
  <parent src="../../AGENTS.md" type="bounded-context-rules" />
  <system-instruction>
    AGENT: If you have not read "../../AGENTS.md" in this session, stop now and read it using your
    file-reading tools before proceeding. Local constraints are mandatory.
  </system-instruction>
</context-hierarchy>

# Sub-Domain: Portal Documentation Service

This workspace ([portal/](./)) manages the primary Docusaurus documentation portal for the %PROJECT_DOMAIN% knowledge base.

---

## 1. Local Architecture

This workspace is strictly a presentation and compilation engine. All documentation, community pages, and blog posts are dynamically consumed from the sibling collections workspace (`../../../collections/namespaces/portal/content/`).

- [src/](./src/): Custom React components, page templates, and layouts.
  - [src/pages/](./src/pages/): MDX landing pages and custom layout files.
- [scripts/](./scripts/): Scripts orchestrating documentation dev/build pipelines.
- [docusaurus.config.ts](./docusaurus.config.ts): Primary Docusaurus configuration wiring presets, collections, and plugins.

---

## 2. Workspace Guardrails

1. **AST Variable Transformer**: The workspace uses the `remark-project-variables` AST plugin (provided by the preset). Agents MUST write agnostic tokens like `%PROJECT_DOMAIN%` instead of hardcoded brand names.
2. **Translation Synchronization**: Docusaurus requires the `i18n/` directory to be present locally during build. The preset plugin acts as a bridge, copying L10n translations from `../../../collections/namespaces/portal/locales/` into `i18n/` before build. Agents MUST NOT edit files in `i18n/` manually.
3. **No Direct Content Creation**: Agents MUST NOT create `docs/`, `community/`, or `blog/` content directories inside this workspace. All documentation authoring must happen in the `knowledge-base/collections/namespaces/portal/content/` workspace.

---

## 3. Required Skill

When creating, updating, or reviewing any configuration or `.mdx` file within this workspace, agents MUST activate the `docusaurus-expert` skill by name before beginning.

---

## 4. Scoped Operations

Run these scripts via pnpm filters from the monorepo root:

- `pnpm kb:docusaurus:portal:dev`: Runs the development server on port 3002.
- `pnpm kb:docusaurus:portal:dev:pt`: Runs development server for Portuguese locale.
- `pnpm kb:docusaurus:portal:build`: Executes the Docusaurus production build for all locales (`en`, `pt-BR`).
- `pnpm kb:docusaurus:portal:preview`: Builds and serves the static production output.
- `pnpm kb:docusaurus:portal:typecheck`: Validates TypeScript type safety.
- `pnpm kb:docusaurus:portal:lint`: Runs ESLint quality checks.
- `pnpm kb:docusaurus:portal:clear`: Clears Docusaurus build caches.
