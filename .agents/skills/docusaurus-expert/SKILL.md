---
name: docusaurus-expert
description: Use this skill to create, analyze, or update technical documentation in the docs/ workspace, ensuring MDX syntax compliance and strict adherence to the Diátaxis framework.
---

# Docusaurus Docs Expert

This skill defines the authoritative standards, directory structures, design patterns, and validation workflows for the **tupynambalucas** Docusaurus Docs Hub (`docs/`).

---

## 1. Directory Structure & Diátaxis Standards

The `docs/` workspace officially adopts the **Diátaxis** framework. All documentation must be structured around user needs into four distinct quadrants. Do not organize files merely by topic.

### A. The Four Quadrants

When creating or editing documentation, classify and place it in the appropriate quadrant (e.g., inside `docs/handbook/` or the appropriate workspace root):

- `tutorials/`: Learning-oriented, practical lessons for beginners to acquire skills.
- `guides/` (How-to guides): Goal-oriented, practical step-by-step directions to solve specific problems.
- `reference/`: Information-oriented, theoretical descriptions (codebase, APIs, configs).
- `explanation/`: Understanding-oriented discussions, theory, background, and architecture.

### B. Complex Hierarchies & Categorization

When documenting specific domains or features that require multiple files:

- **Sub-categorization**: Group the files inside a category subfolder within the appropriate quadrant (e.g., `docs/handbook/reference/<domain-name>/`).
- **Docusaurus Categories**: You MUST create a `_category_.json` file inside these subfolders to generate sidebar dropdowns automatically.
- **Single Files**: If a domain only requires a single document for a quadrant (e.g., one tutorial), place it directly at the root of the quadrant (e.g., `tutorials/<domain-name>-start.mdx`) without creating a dedicated subfolder.

---

## 2. Document & MDX Standards

All files placed inside the documentation directories MUST strictly adhere to the following rules:

### A. Extension Rule: All-MDX

- **Zero `.md` Files**: All technical documents and guides must use the `.mdx` file extension to support rich React components and strict MDX parsing. No `.md` files should be created or exist within these directories (the only exception is the repository-standard `README.md` at package and workspace roots).

### B. MDX Parser Compliance

- **No HTML Comments**: Standard HTML comments (`<!-- comment -->`) are completely forbidden in MDX and will break compilation. Always use JavaScript comments wrapped in curly braces: `{/* comment */}`.
- **Escaping Special Characters**: Raw curly braces (`{` and `}`) and less-than signs (`<`) will be intercepted by the MDX parser as JSX or expression start tokens. Always escape them when they are intended as raw text: `\{`, `\}`, and `\<`.
- **Self-Closing Tags**: All HTML or JSX elements must be well-formed. Self-closing tags MUST end with a trailing slash (e.g., `<br />`, `<img src="..." />`, `<hr />`).
- **Markdown inside HTML/JSX**: To render standard markdown formatting inside raw HTML/JSX block elements, isolate the markdown content with empty lines above and below the block tags.
- **Docusaurus Admonitions**: Use native colon admonitions with a bracketed title (`:::note[Title]`, `:::tip[Title]`, `:::info[Title]`, `:::caution[Title]`, `:::danger[Title]`) instead of standard GFM quote alerts (`> [!NOTE]`).

### C. Cross-linking and Content Preservation

- **Cross-linking**: Use Docusaurus absolute paths (e.g., `[Link Text]` followed by `(/docs/handbook/reference/...)`) for internal markdown links to prevent dead links caused by the deeply nested Diátaxis structure. Avoid relative paths like `../../`.
- **Content Integrity**: When migrating or converting existing `.md` documentation into MDX, you MUST migrate the content 1:1. Never summarize, truncate, or omit the original text. External web URLs (`http://` or `https://`) must be strictly preserved without modification.

### D. Formatting & Prettier Standards

All MDX files must align with the project Prettier configuration:

- Use exactly 2-space indentation.
- Use hyphens (`-`) for unordered list items; asterisks or pluses are forbidden.
- Code blocks embedded in MDX must feature semicolons, trailing commas, single quotes for strings (except double quotes in JSX props), and parentheses for arrow functions.

---

## 3. Localization Parity (pt-BR)

- When creating or editing an English document, you MUST keep its Brazilian Portuguese (`pt-BR`) translation synchronized under `docs/i18n/pt-BR/` in the corresponding plugin subdirectory.
- Never translate frontmatter keys, component tags, or code block variables.

---

## 4. Single-Pass Deferred Validation

- **No Intermediate Tests**: Do NOT run verification commands after each individual edit or file creation. Always batch all proposed modifications across all files first.
- **Final Validation Only**: Execute the validation suite exactly ONCE at the end of the entire documentation task to test the build, types, and links.
- **Strictly No Dev/Preview Servers**: Never start the development server (`pnpm docs:dev`) or preview server (`pnpm docs:preview`). The verification workflow consists solely of verifying successful compilation and error-free builds.

For the step-by-step validation pipeline instructions, refer to [references/workflow.md](references/workflow.md).
