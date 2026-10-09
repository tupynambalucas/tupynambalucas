# Execution Plan: Project Variables Elimination and Namespace Config Refactoring

## 1. Goal

Eliminate the global `@monorepo/shared-config/project.config.ts` and stop using variables like `Tupynambalucas` across the monorepo's documentation (`AGENTS.md`, `README.md`, `.agents/skills/`), replacing them with their actual values. The exception is `knowledge-base/collections` (e.g., `portal`), which will instead use localized namespace configurations dynamically injected into Docusaurus.

## 2. Refactoring Docusaurus and AST Transformers

- **Move configuration**: Move `shared\config\src\project.config.ts` to `knowledge-base\collections\namespaces\portal\portal.config.ts`.
- **Delete old package**: After migrating usages, remove the `@monorepo/shared-config` workspace completely (if it was solely used for this configuration).
- **Update AST Transformers (`knowledge-base/docusaurus/packages/preset/src/plugins/ast-transformers/remark-project-variables.ts`)**:
  - Remove the static import `import ProjectConfig from '@monorepo/shared-config/project.config';`.
  - Change the plugin initialization so that it receives the variables mapping dynamically via its options.
  - Update `projectVariablesParseFrontMatter` similarly to accept variables dynamically, potentially loaded from the specific instance's `docusaurus.config.ts`.
- **Update Docusaurus Config (`knowledge-base/docusaurus/services/portal/docusaurus.config.ts`)**:
  - Change the import to load variables from `../../../../collections/namespaces/portal/portal.config.ts`.
  - Pass these variables into the presets and AST transformer plugins.

## 3. Updating AI Skills & Root Constraints

- **`AGENTS.md` (Root)**: Update the "Global Constraints" section to enforce the use of real values instead of `tupynambalucas.dev` / `Tupynambalucas`.
- **`.agents/AGENTS.md`**: Ensure it has the updated constraint (e.g., Section 2 item 5 on generic nomenclature).
- **`.agents/skills/agent-router-expert/SKILL.md`**: Update Section 1.G to **forbid** agnostic tokens (`tupynambalucas.dev`) and instruct the agent to write concrete names.
- **`.agents/skills/markdown-expert/SKILL.md`**: Update Section 1.H similarly.

## 4. Widespread Variable Replacement

- Search for all occurrences of `Tupynambalucas`, `tupynambalucas.dev`, `https://docs.tupynambalucas.dev`, `tupynambalucas`, etc., across all files in the monorepo.
- **Exclude**: Any Markdown file inside `knowledge-base/collections/*`.
- **Execute replacement**: Inject real values (e.g., `Tupynambalucas`, `tupynambalucas.dev`, `https://docs.tupynambalucas.dev`, etc.) directly into the text.
- Check source code (like `hub/` or `renderer/` where `@monorepo/shared-config` is imported) and replace the imports with direct values or create localized constants if needed.

## 5. Validation

- Ensure that Docusaurus builds successfully using the new `portal.config.ts`.
- Validate that all `.agents/skills/*` pass their internal AST/linter checks (running `.agents/skills/skill-expert/scripts/validate-skill.ts`).
- Ensure that no generic tokens (`%...%`) remain outside of `knowledge-base/collections`.
