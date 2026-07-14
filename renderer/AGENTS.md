# Local Context: Renderer Workspace

This workspace (`@tupynambalucas/renderer`) manages the generic dynamic asset generator and document compilation engine, responsible for generating visual SVG cards and custom README.md files styled with Tailwind CSS design tokens.

---

## Local Architecture

- **[src/](./src/)**: Root source directory for the TypeScript-based compilation and rendering engine.

---

## Workspace Guardrails

1. **TypeScript Implementation**: The production statistics collector, image generation, and template rendering engine MUST be implemented in TypeScript/Node.js to ensure the project remains a full-type codebase.
2. **Dynamic README Compilation**: The generated output MUST dynamically overwrite or inject the visual assets and text into target README files (e.g. root [README.md](../README.md)).
3. **Design Tokens & Tailwind CSS**: The compiler MUST consume design tokens from `@tupynambalucas-studio/design` (from [studio/design/assets/tokens/](../studio/design/assets/tokens/)). Texts inside Markdown templates MUST utilize Strategy 1 (Programmatic Token Injection) to inject colors as variables to preserve GitHub visual safety.
4. **API Access Control**: The engine MUST query the GitHub GraphQL API using authenticated headers. API keys and private tokens MUST be loaded strictly via environment configurations and NEVER hardcoded in the codebase.
5. **Visual Theme Support**: All SVG generators MUST output styles that support both GitHub light and dark mode contexts via media queries or query parameters (e.g. `#gh-dark-mode-only` and `#gh-light-mode-only`).

---

## Scoped Operations

Run these tasks from the workspace directory or via pnpm filters:

- `pnpm build`: Compiles the TypeScript generator code.
- `pnpm dev`: Runs compilation in watch mode.
- `pnpm typecheck`: Validates workspace config types.
