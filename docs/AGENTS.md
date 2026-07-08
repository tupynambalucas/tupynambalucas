# Local Context: Documentation Hub (Docs)

This workspace (`@tupynambalucas/docs`) is the central knowledge base for the tupynambalucas.dev monorepo, powered by Docusaurus v3.

---

## Local Architecture

- **[handbook/](./handbook/)**: High-level documentation pages, architecture specs, and style guides.
- **[roadmap/](./roadmap/)**: Versioned roadmaps and project timelines.
- **[releases/](./releases/)**: Official changelogs and release documentation.
- **[src/pages/](./src/pages/)**: MDX pages rendering custom React pages.

---

## Workspace Guardrails

1. **Strict Markdown Standards**: All documents MUST follow GitHub Flavored Markdown (GFM) standards, formatted using Prettier.
2. **MDX Syntax Compliance**: When using MDX components, you MUST ensure that all HTML tags are closed properly, attributes use JSX syntax (e.g. `style={{margin: 10}}` instead of HTML style string), and imports of React components are placed at the top of the file.
3. **No Dead Links**: Every link pointing to another markdown file MUST be a relative path (e.g. `[Architecture Guide](./handbook/architecture.md)`). Standard external links are only permitted for official external documentation or online pages.
4. **Zero Emojis**: Emojis are strictly prohibited in all documentation files.
5. **No Placeholders**: Never commit empty files or files containing TBD or TODO comments. If a document is incomplete, omit the section or the file.

---

## Scoped Operations

Run these scripts from the workspace directory or via pnpm filters:

- `pnpm start`: Runs the development server at `http://localhost:3002`.
- `pnpm build`: Executes the Docusaurus production build pipeline.
- `pnpm typecheck`: Validates TypeScript type safety across script wrappers.
- `pnpm docs:generate:changelog`: Compiles the official changelog page.
