# GitHub Tooling Ecosystem

This workspace houses the containerized GitHub CLI (`gh`) and Git environments, alongside TypeScript automation scripts for repository management in the tupynambalucas.dev infrastructure.

## Architecture Overview

The ecosystem provides standardized, isolated tooling for version control and project management:

1.  **Interactive CLI Containers:** Docker containers (`gh` and `git`) that mount the monorepo root to `/workspace`. This ensures all developers and CI/CD pipelines use the exact same versions of Git, GitHub CLI, and associated extensions.
2.  **TypeScript Automation:** Scripts to parse commits, manage releases, and generate documentation (like changelogs and roadmaps).
3.  **Bash Extensions:** Custom shell scripts injected into the `gh` container entrypoint to automate complex workflows (e.g., synchronizing secrets across repositories).

---

## Directory Layout

- **[infrastructure/docker/](./infrastructure/docker/)**: Contains the orchestration file ([compose.yaml](./infrastructure/docker/compose.yaml)) and global environment configurations for the containers.
- **[services/gh/](./services/gh/)**: Contains the Dockerfile, entrypoint, and bash extensions for the GitHub CLI container.
- **[services/git/](./services/git/)**: Contains the Dockerfile and entrypoint for the Git CLI container (includes `git-flow`).

> [!NOTE]
> Repository automation scripts for generating changelogs and roadmaps are part of the `@tupynambalucas/docs` package context.

---

## Configuration & Environment Files

Settings are managed via environment files in the docker infrastructure directory and specific service directories.

### Setup

Copy the example files and configure your tokens and user information:

```bash
cp infrastructure/docker/.env.example infrastructure/docker/.env
cp services/gh/.env.gh.example services/gh/.env.gh
cp services/git/.env.git.example services/git/.env.git
```

### Reference Variables

- `GH_TOKEN`: Personal Access Token for GitHub CLI authentication.
- `GIT_AUTHOR_NAME` / `GIT_AUTHOR_EMAIL`: Identity used for commits.
- `GH_REPO`: Target repository for operations.

---

## Operations & Orchestration Commands

Run these scripts from the monorepo root:

- `pnpm github:services:up`: Launches the `gh` and `git` long-running background containers.
- `pnpm github:services:down`: Stops and removes the tooling containers.
- `pnpm github:services:reset`: Removes volumes, rebuilds the containers, and restarts the environment.
- `pnpm docs:generate:changelog`: Executes the script to update the repository changelog.
- `pnpm docs:generate:roadmap`: Executes the script to generate or update the roadmap documentation.
