# Local Context: Developer Automation Tools and Agents Router

This workspace context ([tools/](./)) orchestrates developer helper tools, Model Context Protocol (MCP) integrations, git automation configurations, and containerized AI agent development platforms.

---

## 1. Directory Layout

- **[agents/](./agents/)**: Containerized terminal workspaces (Google Antigravity CLI and GitHub Copilot CLI).
- **[github/](./github/)**: Git and GitHub CLI containerized workspaces and repository automation.
- **[mcp/](./mcp/)**: Model Context Protocol (MCP) server-sent event (SSE) gateways and downstream adapters.

---

## 2. Scoped Workspaces and Entry Points

AI agents operating within the tools directory must consult the localized specifications of each child workspace before performing modifications:

- **Model Context Protocol Ecosystem (`tools/mcp/`)**:
  - Context & Setup Reference: [README.md](./mcp/README.md)
  - Scoped Developer Rules: [AGENTS.md](./mcp/AGENTS.md)
- **Git and GitHub Automation CLI (`tools/github/`)**:
  - Context & Setup Reference: [README.md](./github/README.md)
  - Scoped Developer Rules: [AGENTS.md](./github/AGENTS.md)
- **AI Agent Terminal Containers (`tools/agents/`)**:
  - Context & Setup Reference: [README.md](./agents/README.md)
  - Scoped Developer Rules: [AGENTS.md](./agents/AGENTS.md)

---

## 2. Shared Development Boundaries and Rules

When modifying configurations or scripts inside this bounded context, the following rules apply:

- **Credential Separation**: Never hardcode API keys, access tokens, or personal identifiers. All configuration parameters must be loaded via local environment files (`.env.*`) and bind-mounted into container environments.
- **Path Mount Parity**: When configuring volumes in docker compose, the monorepo root must be mapped to `/workspace` inside the container. Scripts must resolve relative file mappings based on this path.
- **Bypassing Build Overhead**: Image layers inside `tools/agents` and `tools/mcp` should remain clean. Dynamic code syncing tools (like Skaffold) or direct terminal bindings should be utilized to test code changes without rebuild latency.
- **Strict Execution Rules**: Shell scripts must include execution options like `set -euo pipefail` to abort execution immediately on secondary errors.

---

## 3. Operations Commands Summary

Manage the tool environments using the mapped root execution scripts:

| Context Subsystem          | Up Command                | Down Command                | Reset Command                |
| :------------------------- | :------------------------ | :-------------------------- | :--------------------------- |
| **Model Context Protocol** | `pnpm mcp:dev:up`         | `pnpm mcp:dev:down`         | `pnpm mcp:dev:reset`         |
| **GitHub CLI Tooling**     | `pnpm github:services:up` | `pnpm github:services:down` | `pnpm github:services:reset` |
| **AI Agent Containers**    | `pnpm agents:up`          | `pnpm agents:down`          | `pnpm agents:reset`          |
