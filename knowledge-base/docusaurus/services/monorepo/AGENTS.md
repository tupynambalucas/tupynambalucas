<context-hierarchy>
  <parent src="../AGENTS.md" type="bounded-context-rules" />
  <system-instruction>
    AGENT: If you have not read "../AGENTS.md" in this session, stop now and read it using your
    file-reading tools before proceeding.
  </system-instruction>
</context-hierarchy>

# Docusaurus Service Context

This workspace ([docusaurus/](./)) manages the main Docusaurus documentation hub for the %PROJECT_DOMAIN% project.

---

## 1. Local Architecture

- [handbook/](./handbook/): Central project documentation structured using the Diataxis framework.
  - [tutorials/](./handbook/tutorials/): Learning-oriented guides to get started.
  - [guides/](./handbook/guides/): Goal-oriented directions to solve specific tasks.
  - [reference/](./handbook/reference/): Information-oriented technical specs and APIs.
  - [explanation/](./handbook/explanation/): Understanding-oriented concept explanations.
- [workspaces/](./workspaces/): Structural and technical specifications for each monorepo workspace.
- [roadmap/](./roadmap/): Project roadmap and timeline milestones.
- [releases/](./releases/): Official changelogs and release notes (Changelog blog posts).
- [i18n/](./i18n/): Translation catalogs for localized content (English and Brazilian Portuguese).
- [src/](./src/): Custom React components, theme styles, page templates, and layouts.
  - [src/pages/](./src/pages/): MDX landing pages and custom layout files.
- [scripts/](./scripts/): Task scripts orchestrating documentation dev/build pipelines.
- [tooling/](./tooling/): Utility scripts compiling raw git history into changelogs and roadmaps.
- [docusaurus.config.ts](./docusaurus.config.ts): Primary Docusaurus configuration.

---

## 2. Workspace Guardrails

1. **Diataxis Framework Standard**: All technical and user documentation under [handbook/](./handbook/) MUST adhere strictly to the Diataxis quadrants. No content should conflate tutorials with how-to guides or reference with explanation.
2. **AST Variable Transformer**: The workspace uses the `remark-project-variables` AST plugin (provided by the preset). Agents MUST write agnostic tokens like `%PROJECT_DOMAIN%` instead of hardcoded brand names. The plugin compiles them at build time based on `@monorepo/shared-config/project.config.json` (located in `shared/config/`).
3. **MDX Extension Rule**: All documentation files under the service workspace (including [handbook/](./handbook/), [workspaces/](./workspaces/), [releases/](./releases/), [roadmap/](./roadmap/), and translations in [i18n/](./i18n/)) MUST use the `.mdx` extension. Standard `.md` files are strictly prohibited without exception (except the workspace-root [README.md](./README.md) and [AGENTS.md](./AGENTS.md)).
4. **MDX Syntax Compliance**: All HTML tags MUST be closed. Attributes MUST use JSX syntax, and React component imports MUST be placed at the top of the file.
5. **No Dead Links**: Every link pointing to another document within the docs workspace MUST be a valid relative path pointing to the target `.mdx` file, or a Docusaurus absolute path (e.g., `(/docs/...)`). Standard external links are only permitted for official external documentation or online pages.
6. **Localization Parity (pt-BR)**: Every English document addition or change MUST have a synchronized Brazilian Portuguese (`pt-BR`) translation under [i18n/](./i18n/).

---

## 3. Required Skill

When creating, updating, or reviewing any `.mdx` file within this workspace, agents MUST activate
the `docusaurus-expert` skill by name before beginning. This skill defines the Diataxis framework
application rules, MDX syntax compliance standards, and the documentation validation workflow.

---

## 4. Scoped Operations

Run these scripts via pnpm filters from the monorepo root:

- `pnpm docs:dev`: Runs the development server.
- `pnpm docs:build`: Executes the Docusaurus production build pipeline.
- `pnpm docs:typecheck`: Validates TypeScript type safety across script wrappers.
- `pnpm docs:generate:changelog`: Compiles the official changelog page.

---

## 5. RAG Memory Integration

The documentation source files (.mdx) are directly volume-mounted and ingested by the cortex/memory subsystem. The vector embeddings intentionally index the raw generic tokens (e.g., `%PROJECT_DOMAIN%`) rather than the build-time resolved values. This guarantees the RAG vector space remains completely brand-agnostic and fully copy-pasteable across different enterprise deployments.
