# Local Context: AI Cortex Bounded Context Router

This workspace context ([cortex/](./)) orchestrates the unified artificial intelligence infrastructure, including the ingress API gateway, persistent graph database layers, Model Context Protocol (MCP) data plane integrations, and containerized AI agent runtimes.

---

## 1. Directory Layout

- **[gateway/](./gateway/)**: The API ingress gateway.
- **[memory/](./memory/)**: Self-hosted MongoDB Vector RAG memory subsystem (core, api, web).
- **[mcp/](./mcp/)**: Model Context Protocol (MCP) server-sent event (SSE) gateways and downstream tool adapters (e.g., [github/](./mcp/github/)).
- **[agents/](./agents/)**: Containerized control plane agent terminal workspaces (Google Antigravity CLI and GitHub Copilot CLI).
- **[infrastructure/](./infrastructure/)**: System orchestration config folders containing [docker/](./infrastructure/docker/) compose and local settings templates.

---

## 2. Shared Development Boundaries and Rules

When modifying configurations or scripts inside this bounded context, the following rules apply:

- **Credential Separation**: Never hardcode API keys, access tokens, or personal identifiers.
  All configuration parameters must be loaded via local environment files
  ([.env](./infrastructure/docker/.env)) and bind-mounted or mapped into container
  environments.
- **Path Mount Parity**: When configuring volumes in docker compose, the monorepo root must be mapped to `/workspace` inside the agent containers. Scripts must resolve relative file mappings based on this path.
- **No Direct Folder Deletion**: During the side-by-side transition phase, legacy folders under `tools/mcp`, `tools/agents`, and `platform/services/agentgateway` must not be deleted. Changes must be validated in `cortex` in isolation.
- **Strict Execution Rules**: Shell scripts must include execution options like `set -euo pipefail` to abort execution immediately on errors.

---

## 3. Operations Commands Summary

Manage the Cortex environments using the mapped root execution scripts:

| Context Subsystem          | Up Command              | Down Command              | Reset Command              |
| :------------------------- | :---------------------- | :------------------------ | :------------------------- |
| **Core Services**          | `pnpm cortex:core:up`   | `pnpm cortex:core:down`   | `pnpm cortex:core:reset`   |
| **Model Context Protocol** | `pnpm cortex:mcp:up`    | `pnpm cortex:mcp:down`    | `pnpm cortex:mcp:reset`    |
| **AI Agent Containers**    | `pnpm cortex:agents:up` | `pnpm cortex:agents:down` | `pnpm cortex:agents:reset` |
