# Shared Context

This bounded context provides foundational utilities, configuration definitions, and Git lifecycle scripts that are shared across all workspaces within the %PROJECT_DOMAIN% monorepo.

## Workspaces

- **[config](./config/README.md)**: Centralized project metadata (project.config.json), Prettier definitions, and base TypeScript configurations.
- **[git](./git/README.md)**: Shared Git lifecycle hooks (Husky) and commit validation scripts.

## Usage

Packages in this context are strictly foundational. They do not depend on any other bounded contexts in the monorepo, ensuring a unidirectional dependency flow.
