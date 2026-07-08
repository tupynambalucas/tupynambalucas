---
name: docusaurus-kb-expert
description: Use this skill to create, analyze, or update technical documentation, guides, and configs in the docs/ workspace, ensuring MDX syntax compliance.
---

# Docusaurus Knowledge Base Expert

This skill defines the authoritative standards, directory structures, design patterns, and validation workflows for the **CodeCanvas** Docusaurus Docs Hub (`docs/`).

---

## 1. Directory Structure Standards

All documentation inside the `docs/` workspace is organized into logical directories based on content scope. When editing or creating pages, place them in the correct location:

- `docs/handbook/`: High-level handbook guides (Architecture, Style Guide, Master Plan, Orchestration Reference).
- `docs/roadmap/`: Multi-phase core, extension, studio, and tools roadmaps (e.g., `01-core.mdx`, `02-extension.mdx`).
- `docs/workspaces/`: Deep-dives into workspace-specific architecture and engineering documentation.
- `docs/releases/`: Official project changelog and release notes.
- `docs/src/pages/`: Custom interactive landing pages and React-based workspace routes.
- `docs/i18n/`: Internationalization directories mirroring English files for Brazilian Portuguese (`pt-BR`) translation.

---

## 2. Document & MDX Standards

All files placed inside the documentation directories (`handbook/`, `roadmap/`, `workspaces/`, and `releases/`) MUST strictly adhere to the following rules:

### A. Extension Rule: All-MDX

- **Zero `.md` Files**: All technical documents, guides, and roadmap files must use the `.mdx` file extension to support rich React components and strict MDX parsing. No `.md` files should be created or exist within these directories (the only exception is the repository-standard `README.md` at package and workspace roots).

### B. MDX Parser Compliance

MDX compiles markdown files directly into React components. Follow these strict parsing rules to avoid compilation crashes:

- **No HTML Comments**: Standard HTML comments (`<!-- comment -->`) are completely forbidden in MDX and will break compilation. Always use JavaScript comments wrapped in curly braces: `{/* comment */}`.
- **Escaping Special Characters**: Raw curly braces (`{` and `}`) and less-than signs (`<`) will be intercepted by the MDX parser as JSX or expression start tokens. Always escape them when they are intended as raw text: `\{`, `\}`, and `\<`.
- **Self-Closing Tags**: All HTML or JSX elements must be well-formed. Self-closing tags MUST end with a trailing slash (e.g., `<br />`, `<img src="..." />`, `<hr />`).
- **Markdown inside HTML/JSX**: To render standard markdown formatting inside raw HTML/JSX block elements (such as `<div>` or `<section>`), you must isolate the markdown content with empty lines above and below the block tags.
- **Docusaurus Admonitions**: Use native colon admonitions with a bracketed title (`:::note[Title]`, `:::tip[Title]`, `:::info[Title]`, `:::caution[Title]`, `:::danger[Title]`) instead of standard GFM quote alerts (`> [!NOTE]`).

### C. Formatting & Prettier Standards

All MDX files must align with the project Prettier configuration:

- Use exactly 2-space indentation.
- Use hyphens (`-`) for unordered list items; asterisks or pluses are forbidden.
- Code blocks embedded in MDX must feature semicolons, trailing commas, single quotes for strings (except double quotes in JSX props), and parentheses for arrow functions.

---

## 3. Localization Parity (pt-BR)

- When creating or editing an English document, you MUST keep its Brazilian Portuguese (`pt-BR`) translation synchronized under `docs/i18n/pt-BR/` in the corresponding plugin subdirectory:
  - Files under `docs/handbook/` -> `docs/i18n/pt-BR/docusaurus-plugin-content-docs/current/...`
  - Files under `docs/roadmap/` -> `docs/i18n/pt-BR/docusaurus-plugin-content-docs-roadmap/current/...`
  - Files under `docs/workspaces/` -> `docs/i18n/pt-BR/docusaurus-plugin-content-docs-workspaces/current/...`
- Never translate frontmatter keys, component tags, or code block variables.

---

## 4. Single-Pass Deferred Validation

- **No Intermediate Tests**: Do NOT run verification commands after each individual edit or file creation. Always batch all proposed modifications across all files first.
- **Final Validation Only**: Execute the validation suite exactly ONCE at the end of the entire documentation task to test the build, types, and links.
- **Strictly No Dev/Preview Servers**: Never start the development server (`pnpm docs:dev`) or preview server (`pnpm docs:preview`). The verification workflow consists solely of verifying successful compilation and error-free builds.

For the step-by-step validation pipeline instructions, refer to [references/workflow.md](references/workflow.md).
