# Local Context: Profile Workspace

This workspace (`@tupynambalucas/profile`) manages the automation engine responsible for generating and rendering GitHub profile statistics and visual SVG cards.

---

## Local Architecture

- **[src/](./src/)**: Root source directory for the TypeScript-based generator.

---

## Workspace Guardrails

1. **TypeScript Implementation**: The production statistics collector and image generation engine MUST be implemented in TypeScript/Node.js to ensure the project remains a full-type codebase.
2. **Dynamic README Compilation**: The generated output MUST directly overwrite or inject the visual assets into the root [README.md](../README.md).
3. **API Access Control**: The generator MUST query the GitHub GraphQL API using authenticated headers. API keys and private tokens MUST be loaded strictly via environment configurations and NEVER hardcoded in the codebase.
4. **Visual Theme Support**: All SVG generators MUST output styles that support both GitHub light and dark mode contexts via media queries or query parameters (e.g. `#gh-dark-mode-only` and `#gh-light-mode-only`).

---

## Scoped Operations

Run these tasks from the workspace directory or via pnpm filters:

- `pnpm build`: Compiles the TypeScript generator code.
- `pnpm dev`: Runs compilation in watch mode.
- `pnpm typecheck`: Validates workspace config types.
