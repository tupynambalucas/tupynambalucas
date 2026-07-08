# GitHub MCP Context - Tupynambá Lucas

This file provides the necessary context for version control and repository management within the **Tupynambá Lucas** monorepo.

## 🏗️ Project Structure

Refer to the **[Architecture Overview](../../../docs/ARCHITECTURE.md)** for the detailed monorepo organization and package responsibilities.

## 🛠️ Development Conventions

- **Commits**: Follow the [Conventional Commits](https://www.conventionalcommits.org/) standard.
- **Branching Strategy**:
  - New features: `feature/feature-name`
  - Bug fixes: `fix/bug-name`
  - Documentation: `docs/doc-name`
- **Pull Requests**: Always include a summary of changes and reference the corresponding task or issue.

## 🚀 Workflow Principles

### Domain Core First

Any change affecting data models or shared schemas must originate in the respective core package (`@tupynambalucas-hub/core`) before being propagated to the associated applications.

### Automated Verification

Before merging, ensure that `npm run lint:all` and `npm run build:all` (in respective packages) pass successfully.
