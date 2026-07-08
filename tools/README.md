# @tupynambalucas-tools - Project Automation, MCP & AI Agents

This workspace manages the infrastructure for development automation, specialized workflows, and containerized AI-native environments within the monorepo.

---

## Structure Overview

The tools workspace is divided into three primary sub-stacks:

### 1. [MCP Ecosystem (Model Context Protocol)](./mcp/README.md)

Contains the containerized gateway proxy and downstream adapters translating CLI tools (GitHub, Playwright Browser, Context7, Docker Hub) into Server-Sent Events (SSE).

- **Purpose:** Exposes rich codebase contexts and environment utilities to AI clients.
- **Detailed Guide:** Refer to the [MCP README](./mcp/README.md) for network specifications, config parameters, and routing.

### 2. [AI Agents Workspace](./agents/README.md)

Deploys long-running Docker services containing terminal-based AI client sessions (Google Antigravity CLI and GitHub Copilot CLI).

- **Purpose:** Eliminates manual per-developer CLI installations and guarantees environment parity.
- **Detailed Guide:** Refer to the [Agents README](./agents/README.md) for Docker-out-of-Docker (DooD) settings, mounting specifications, and OAuth authentication flows.

### 3. [Turborepo Infrastructure](./turborepo/README.md)

Deploys the self-hosted Turborepo Remote Cache server.

- **Purpose:** Centralizes build caches to drastically speed up local and CI builds using local or cloud volumes.
- **Detailed Guide:** Refer to the [Turborepo README](./turborepo/README.md) for caching setup and configuration.

### 4. [GitHub Automation & Hooks](./github/README.md)

Local git hooks, branch protection checks, and automated validation scripts.

---

## Mapped Lifecycle Commands

Execute these commands from the monorepo root:

| Command               | Action                                                | Scope        |
| :-------------------- | :---------------------------------------------------- | :----------- |
| `pnpm mcp:dev:up`     | Starts gateway and downstream MCP dev containers      | MCP Stack    |
| `pnpm mcp:dev:down`   | Stops the MCP dev containers                          | MCP Stack    |
| `pnpm mcp:dev:reset`  | Prunes volumes, builds Fastify adapters, and restarts | MCP Stack    |
| `pnpm agents:up`      | Boots Copilot and Antigravity containers              | Agents Stack |
| `pnpm agents:down`    | Stops the agent containers                            | Agents Stack |
| `pnpm agents:reset`   | Resets agent volumes and mounts                       | Agents Stack |
| `pnpm turborepo:up`   | Boots the Turborepo remote cache container            | Turbo Cache  |
| `pnpm turborepo:down` | Stops the Turborepo remote cache container            | Turbo Cache  |

---

## Diagnostics & Code Quality

- **`pnpm typecheck`**: Validates TypeScript type safety across the scripts and gateway tools.
- **`pnpm lint`**: Enforces strict formatting and linting guidelines on the tools source code.
