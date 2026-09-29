# @monorepo/kb-collections

Decoupled content repository and translation synchronization SDK for the %PROJECT_DOMAIN% knowledge base.

This workspace houses all markdown and MDX content structured by Feature-Sliced Design (FSD) domains, along with a TypeScript SDK for managing Crowdin translation builds and downloads.

---

## Directory Architecture

- **[domains/portal/content/](./domains/portal/content/)**: Source documentation content for the portal service.
  - **[docs/](./domains/portal/content/docs/)**: Technical documentation structured under the Diátaxis framework (`tutorials/`, `guides/`, `reference/`, `explanation/`).
  - **[community/](./domains/portal/content/community/)**: Community guides, resources, maintainer profiles, contributing workflows, and workspace roadmaps.
  - **[blog/](./domains/portal/content/blog/)**: Engineering blog posts, version releases (`releases/`), author definitions (`authors.yml`), and tags taxonomy (`tags.yml`).
- **[domains/portal/translations/](./domains/portal/translations/)**: Target destination for Crowdin translation archives (`pt-BR`, etc.).
- **[src/](./src/)**: Crowdin API client SDK and CLI synchronization scripts.
  - **[crowdin.ts](./src/crowdin.ts)**: Interacts with the Crowdin API client, triggers project builds, downloads ZIP archives, and unpacks them into domain translation directories.
  - **[cli.ts](./src/cli.ts)**: Command-line interface invoked by CI pipelines and local build operations.

---

## Content Guidelines

1. **Diátaxis Compliance**: All architectural and developer guides in `docs/` MUST be classified into one of the four quadrants: Tutorials, How-To Guides, Reference, or Explanation.
2. **Blog Truncation Markers**: Every blog post and release announcement MUST contain the `{/* truncate */}` marker and reference registered author IDs from `authors.yml`.
3. **AST Agnostic Tokens**: Authors MUST NOT hardcode domain or project names; use `%PROJECT_DOMAIN%` and `%PROJECT_NAME%` tokens.
4. **Translation Isolation**: Files in `translations/` are managed programmatically by the Crowdin SDK. Do not edit them directly.

---

## Operations & Scripts

Run commands from the monorepo root:

```bash
# Typecheck collection SDK
pnpm kb:collections:typecheck

# Lint collection SDK scripts
pnpm kb:collections:lint

# Synchronize translations from Crowdin API for the portal domain
pnpm --filter @monorepo/kb-collections run sync-translations --collection portal
```
