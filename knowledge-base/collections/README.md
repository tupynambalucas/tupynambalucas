# @monorepo/kb-collections

Decoupled content repository and translation configuration for the %PROJECT_DOMAIN% knowledge base.

This workspace houses all markdown and MDX content structured by Feature-Sliced Design (FSD) namespaces, along with the decoupled translation architecture managed by the Crowdin GitHub App.

---

## Directory Architecture

- **[namespaces/portal/content/](./namespaces/portal/content/)**: Source documentation content for the portal service.
  - **[docs/](./namespaces/portal/content/docs/)**: Technical documentation structured under the Diátaxis framework (`tutorials/`, `guides/`, `reference/`, `explanation/`).
  - **[community/](./namespaces/portal/content/community/)**: Community guides, resources, maintainer profiles, contributing workflows, and workspace roadmaps.
  - **[blog/](./namespaces/portal/content/blog/)**: Engineering blog posts, version releases (`releases/`), author definitions (`authors.yml`), and tags taxonomy (`tags.yml`).
- **[namespaces/portal/locales/](./namespaces/portal/locales/)**: Target destination for L10n translation files (`pt-BR`, etc.) synced via GitHub App.

---

## Content Guidelines

1. **Diátaxis Compliance**: All architectural and developer guides in `docs/` MUST be classified into one of the four quadrants: Tutorials, How-To Guides, Reference, or Explanation.
2. **Blog Truncation Markers**: Every blog post and release announcement MUST contain the `{/* truncate */}` marker and reference registered author IDs from `authors.yml`.
3. **AST Agnostic Tokens**: Authors MUST NOT hardcode domain or project names; use `%PROJECT_DOMAIN%` and `%PROJECT_NAME%` tokens.
4. **Translation Isolation**: Files in `locales/` are managed programmatically by the Crowdin GitHub App. Do not edit them directly.

---

## Operations & Scripts

Run commands from the monorepo root:

```bash
# Lint collection configurations and JSON files
pnpm kb:collections:lint
```
