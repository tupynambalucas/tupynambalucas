# @monorepo/kb-collections

Decoupled content repository and translation configuration for the %PROJECT_DOMAIN% knowledge base.

This workspace houses all markdown and MDX content structured by Feature-Sliced Design (FSD) namespaces, along with `crowdin.yml` configurations for managing automated translation synchronization via the Crowdin CLI.

---

## Directory Architecture

- **[namespaces/portal/content/](./namespaces/portal/content/)**: Source documentation content for the portal service.
  - **[docs/](./namespaces/portal/content/docs/)**: Technical documentation structured under the Diátaxis framework (`tutorials/`, `guides/`, `reference/`, `explanation/`).
  - **[community/](./namespaces/portal/content/community/)**: Community guides, resources, maintainer profiles, contributing workflows, and workspace roadmaps.
  - **[blog/](./namespaces/portal/content/blog/)**: Engineering blog posts, version releases (`releases/`), author definitions (`authors.yml`), and tags taxonomy (`tags.yml`).
- **[namespaces/portal/translations/](./namespaces/portal/translations/)**: Target destination for Crowdin translation files (`pt-BR`, etc.).
- **[namespaces/portal/crowdin.yml](./namespaces/portal/crowdin.yml)**: Configuration mappings utilized by the Crowdin CLI for bidirectional translation sync.

---

## Content Guidelines

1. **Diátaxis Compliance**: All architectural and developer guides in `docs/` MUST be classified into one of the four quadrants: Tutorials, How-To Guides, Reference, or Explanation.
2. **Blog Truncation Markers**: Every blog post and release announcement MUST contain the `{/* truncate */}` marker and reference registered author IDs from `authors.yml`.
3. **AST Agnostic Tokens**: Authors MUST NOT hardcode domain or project names; use `%PROJECT_DOMAIN%` and `%PROJECT_NAME%` tokens.
4. **Translation Isolation**: Files in `translations/` are managed programmatically by the Crowdin CLI. Do not edit them directly.

---

## Operations & Scripts

Run commands from the monorepo root:

```bash
# Lint collection configurations and JSON files
pnpm kb:collections:lint
```
