# Monorepo Developer Tools Workspace

This workspace centralizes the development utilities, git automation scripts, and GitHub CLI containerized workspaces.

---

## 1. Directory Structure and Reference Maps

The tools folder contains the following child workspaces:

| Subspace           | Domain Purpose                                                       | Documentation Entry Points           | Scoped Agent Instructions            |
| :----------------- | :------------------------------------------------------------------- | :----------------------------------- | :----------------------------------- |
| **`github/`**      | Git version control CLI containers and repo-wide automation scripts. | [README.md](./github/README.md)      | [AGENTS.md](./github/AGENTS.md)      |
| **`provisioner/`** | Workstation bootstrapping, WSL2 configuration and setup automation.  | [README.md](./provisioner/README.md) | [AGENTS.md](./provisioner/AGENTS.md) |

---

## 2. Directory Layout

- **[github/](./github/)**: Git and GitHub CLI containerized workspaces and repository automation.
- **[provisioner/](./provisioner/)**: Workstation bootstrapping, WSL2 configuration and local dev environment setup.

---

## 3. Global Orchestration Scripts

All operations are run from the monorepo root folder using workspace-scoped package managers:

- **Launch GitHub Tools**: `pnpm github:services:up` (Stops: `pnpm github:services:down`, Reset: `pnpm github:services:reset`)
- **Launch Workstation Provisioner**: `pnpm provision` (Launches interactive setup CLI)
