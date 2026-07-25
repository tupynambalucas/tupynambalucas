# Local Context: AI Agent Runtimes

This workspace directory ([agents/](./)) configures containerized control plane terminal workspaces for AI agents.

---

## 1. Subsystem Layout

- **[antigravity/](./antigravity/)**: Google Antigravity CLI agent runtime installation scripts and container definitions.
- **[copilot/](./copilot/)**: GitHub Copilot CLI agent runtime installation scripts and container definitions.
- **[shared/](./shared/)**: Shared agent configuration templates, including default MCP configuration files (`mcp.config.json`).

---

## 2. Operational Rules

- **Workspace Mapping**: Agent containers MUST mount the monorepo root directory to `/workspace`.
- **MCP Configuration**: Shared MCP configs MUST be synced from `shared/mcp.config.json` into container user home directories during startup.
