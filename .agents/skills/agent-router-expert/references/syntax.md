# AI Agents Context Syntax Reference

This reference defines the structural syntax and formatting standards for `AGENTS.md` files across the monorepo to ensure high-fidelity parsing by LLMs.

---

## 1. Document Structure

All `AGENTS.md` files must follow a rigid, hierarchical layout to help AI agents parse context immediately.

### A. Headings Hierarchy

- **H1 (`#`)**: Workspace or package name identifying the context scope.
- **H2 (`##`)**: Major instruction categories:
  - `## Navigation`: Mappings to sub-workspaces or source entrypoints.
  - `## Architecture`: Directory map or system topologies.
  - `## Scoped Guardrails`: Strict coding rules specific to this folder.
  - `## Scoped Commands`: CLI scripts execution commands.

### B. List Formatting

- **Unordered Lists**: Always use hyphens (`-`) for list items to conform to the monorepo Prettier configuration. Do not use asterisks (`*`) or plus signs (`+`).
- **Ordered Lists**: Use lazy numbering (`1.`) for sequential verification steps.

---

## 2. Interactive Navigation (Links)

To prevent LLMs from executing multiple directory search tools, `AGENTS.md` files must feature direct relative markdown links.

### A. Clickable Relative Directory Links

- Use standard relative path links to point to child directories or source directories:
  - Example: `[src/domains/](./src/domains/)`
- Ensure the trailing slash `/` is present for directory links.

### B. Clickable File Links

- Point to configuration files, tsconfig files, or main package manifests:
  - Example: `[package.json](./package.json)`

---

## 3. LLM-Optimized Design Patterns

To ensure high-fidelity parsing by LLMs, all `AGENTS.md` files must adhere to these design patterns:

### A. Explicit Relative Links

- Every referenced file, schema, or configuration directory MUST use clickable relative markdown links (e.g. `[tsconfig.json](./tsconfig.json)` or `[src/domains/](./src/domains/)`) to facilitate rapid tool-based navigation.
- Absolute file system paths (e.g., `D:\projects\...`, `/projects/...`) and external production web URLs (e.g., `https://github.com/...`, `https://docusaurus.io/...`) MUST NEVER be included inside `AGENTS.md` files. Only local localhost-based development urls are permitted inside orchestration command execution examples.

### B. Imperative, Rule-Based Phrasing

- Write using clear, absolute constraints ("NEVER", "MUST", "ALWAYS") rather than conversational prose. This removes ambiguity and makes the instruction context directly actionable for LLMs.

### C. No Redundancy

- Do not duplicate global rules. Global rules (English-First, Zero Emojis, Zero Placeholders) exist solely in the root `AGENTS.md` and are inherited across all workspaces. Sub-workspace context files must only define rules specific to their scope.

### D. Concrete Snippets

- Provide explicit, copy-pasteable code blocks (TypeScript, Docker, CSS) demonstrating correct implementation patterns (e.g., Mapped Repository injection, state selectors, relative CSS units, and compose service declarations) rather than abstract explanations.

---

## 4. Prettier Formatting Standards

All `AGENTS.md` files must comply with the Prettier rules in [.prettierrc.json](../../../../.prettierrc.json):

- **Indentation**: Standard 2-space indentation for list nesting, blockquotes, and HTML tags.
- **Line Width**: Word wrap prose to keep lines under 100 characters where possible.
- **Unordered Lists**: Always use hyphens (`-`) for unordered lists. Asterisks (`*`) and plus signs (`+`) are strictly forbidden.
- **Code Block Formatting**: JavaScript/TypeScript code snippets inside fenced code blocks must comply with:
  - `semi: true` (always use semicolons)
  - `singleQuote: true` (use single quotes for strings)
  - `trailingComma: "all"` (enforce trailing commas)
  - `arrowParens: "always"` (parentheses around arrow function arguments)
