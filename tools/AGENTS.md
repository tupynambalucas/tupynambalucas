# Local Context: Developer Automation Tools Router

This workspace context ([tools/](./)) orchestrates developer helper tools, git automation configurations, and GitHub CLI containerized workspaces.

---

## 1. Directory Layout

- **[github/](./github/)**: Git and GitHub CLI containerized workspaces and
  repository automation.

---

## 2. Scoped Workspaces and Entry Points

AI agents operating within the tools directory must consult the localized specifications of each child workspace before performing modifications:

- **Git and GitHub Automation CLI (`tools/github/`)**:
  - Context & Setup Reference: [README.md](./github/README.md)
  - Scoped Developer Rules: [AGENTS.md](./github/AGENTS.md)

---

## 2. Shared Development Boundaries and Rules

When modifying configurations or scripts inside this bounded context, the following rules apply:

- **Credential Separation**: Never hardcode API keys, access tokens, or personal identifiers. All configuration parameters must be loaded via local environment files (`.env.*`) and bind-mounted into container environments.
- **Path Mount Parity**: When configuring volumes in docker compose, the monorepo root must be mapped to `/workspace` inside the container. Scripts must resolve relative file mappings based on this path.
- **Strict Execution Rules**: Shell scripts must include execution options like `set -euo pipefail` to abort execution immediately on secondary errors.

---

## 3. Operations Commands Summary

Manage the tool environments using the mapped root execution scripts:

| Context Subsystem      | Up Command                | Down Command                | Reset Command                |
| :--------------------- | :------------------------ | :-------------------------- | :--------------------------- |
| **GitHub CLI Tooling** | `pnpm github:services:up` | `pnpm github:services:down` | `pnpm github:services:reset` |
