<context-hierarchy>
  <parent src="../AGENTS.md" type="global-rules" />
  <system-instruction>
    AGENT: If you have not read "../AGENTS.md" in this session, stop now and read it using your
    file-reading tools before proceeding. Global constraints are mandatory.
  </system-instruction>
</context-hierarchy>

# Bounded Context: Developer Automation Tools Router

This bounded context ([tools/](./)) orchestrates developer helper tools, git automation configurations, and GitHub CLI containerized workspaces.

---

## 1. Directory Layout

- **[github/](./github/)**: Git and GitHub CLI containerized workspaces and repository automation. Setup Reference: [github/README.md](./github/README.md).
- **[provisioner/](./provisioner/)**: Workstation bootstrapping, WSL2 configuration and local dev environment setup. Setup Reference: [provisioner/README.md](./provisioner/README.md).

---

## 1.5. Ubiquitous Language

| Term          | Definition                                                              | Forbidden Synonyms |
| :------------ | :---------------------------------------------------------------------- | :----------------- |
| `Provisioner` | The workstation bootstrapping CLI script configuring WSL2 and dev tools | setup, installer   |
| `Workspace`   | The bind-mounted `/workspace` volume inside GitHub CLI containers       | volume, directory  |

---

## 2. Shared Development Boundaries and Rules

When modifying configurations or scripts inside this bounded context, the following rules apply:

- **Credential Separation**: Never hardcode API keys, access tokens, or personal identifiers. All configuration parameters must be loaded via local environment files (`.env.*`) and bind-mounted into container environments.
- **Path Mount Parity**: When configuring volumes in docker compose, the monorepo root must be mapped to `/workspace` inside the container. Scripts must resolve relative file mappings based on this path.
- **Strict Execution Rules**: Shell scripts must include execution options like `set -euo pipefail` to abort execution immediately on secondary errors.

---

## 3. Sub-Domain Rules

### GitHub CLI Rules

- The monorepo root MUST be bind-mounted to `/workspace` inside all GitHub CLI containers. All automation scripts MUST resolve relative paths from this mount point.
- GitHub Personal Access Tokens MUST be provided via the `GITHUB_TOKEN` environment variable passed through Docker `--env-file`. Tokens MUST NOT be embedded in Dockerfiles or scripts.

### Provisioner Rules

- All shell provisioning scripts MUST begin with `set -euo pipefail` to enforce immediate exit on error, undefined variable access, or pipe failures.
- WSL2 configuration changes MUST be documented in the provisioner README before being applied.

---

## 4. Operations Commands Summary

Manage the tool environments using the mapped root execution scripts:

| Context Subsystem           | Up Command                | Down Command                | Reset Command                |
| :-------------------------- | :------------------------ | :-------------------------- | :--------------------------- |
| **GitHub CLI Tooling**      | `pnpm github:services:up` | `pnpm github:services:down` | `pnpm github:services:reset` |
| **Workstation Provisioner** | `pnpm provision`          | -                           | -                            |
