# Local Context: GitHub Tooling Ecosystem

This workspace ([tools/github/](./)) implements isolated Git and GitHub CLI containerized environments and repository automation scripts.

---

## Local Architecture & Directory Map

- **[infrastructure/docker/compose.yaml](./infrastructure/docker/compose.yaml)**: Docker Compose orchestration defining the `gh` and `git` interactive service containers.
- **[services/gh/](./services/gh)**: GitHub CLI container definition, including its [entrypoint.sh](./services/gh/entrypoint.sh) and bash extensions.
- **[services/git/](./services/git)**: Git CLI container definition and its [entrypoint.sh](./services/git/entrypoint.sh).
- **[scripts/](./scripts)**: TypeScript scripts for repository management, such as changelog generation.

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
- `pnpm github:generate:changelog`: Runs the changelog generation script.
- `pnpm github:generate:roadmap`: Runs the roadmap generation script.
