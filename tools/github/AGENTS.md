# Local Context: GitHub Tooling Ecosystem

This workspace ([tools/github/](./)) implements isolated Git and GitHub CLI containerized environments and repository automation scripts.

---

## Local Architecture & Directory Map

- **[infrastructure/docker/](./infrastructure/docker/)**: Contains Docker Compose configuration files and environment templates for launching tooling containers.
- **[services/gh/](./services/gh/)**: Contains the GitHub CLI container setup, bash extensions, and custom tools.
- **[services/git/](./services/git/)**: Contains the Git CLI container setup and configurations (including git-flow).

> [!NOTE]
> Repository automation scripts for generating changelogs and roadmaps are part of the `@tupynambalucas/docs` package context.

---

## GitHub Tooling Guardrails

1. **Volume Mount Integrity**: Container entrypoints MUST assume the monorepo root is mounted at `/workspace`. All internal paths MUST be absolute starting with `/workspace/tools/github/`.
2. **Environment Variable Injection**: Authentication tokens (e.g., `GH_TOKEN`) MUST be provided exclusively through local `.env` files. NEVER hardcode credentials in bash extensions or TypeScript scripts.
3. **Bash Strict Mode**: All bash scripts and extensions MUST declare `set -euo pipefail` to ensure robust error handling and prevent silent failures.
4. **TypeScript Execution**: Scripts MUST be executed using `tsx` to handle TypeScript compilation on-the-fly without emitting artifacts.

---

## Scoped Commands

Run these scripts from the monorepo root:

- `pnpm github:services:up`: Boots the `gh` and `git` interactive containers in the background.
- `pnpm github:services:down`: Stops the running containers.
- `pnpm github:services:reset`: Stops, removes volumes, and restarts the environment with fresh builds.
- `pnpm docs:generate:changelog`: Runs the changelog generation script.
- `pnpm docs:generate:roadmap`: Runs the roadmap generation script.
