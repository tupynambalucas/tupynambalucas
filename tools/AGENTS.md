# Workspace Context: Tools & Automation

This file defines the domain rules, containerized services, and directory structure for the **Tools and AI Agents Workspace** (`tools/`).

---

## Tools Navigation

Before editing or analyzing code in this tools context, read the local rules for the specific sub-stack:

- **MCP Ecosystem**: [mcp/AGENTS.md](./mcp/AGENTS.md) — Fastify SSE adapters, Model Context Protocol routing, and browser/git wrappers.
- **AI Agents**: [agents/AGENTS.md](./agents/AGENTS.md) — Docker-out-of-Docker containerized terminals and shell environments.
- **Turborepo**: [turborepo/AGENTS.md](./turborepo/AGENTS.md) — Self-hosted Remote Cache server.
- **Workspace Documentation**: Refer to the tools documentation in [docs/README.md](../docs/README.md).

---

## Workspace Architecture

The Tools workspace manages the infrastructure for development automation, AI integration layers, and developer shell environments.

- **MCP Gateway**: Containerized gateway translating command-line integrations (Context7, GitHub, Playwright) into Model Context Protocol Server-Sent Events (SSE).
- **Session Containers**: Local developer workspaces mounted with shell agents (Google Antigravity CLI and GitHub Copilot) to ensure environment parity and OAuth persistence.
- **Turborepo Remote Cache**: Dockerized server storing Turborepo build artifacts to accelerate continuous integration and local builds.

---

## Tools Guardrails

1. **Isolation Policy**: Code in this directory represents automation utilities. Do not import business domain models or schemas from other workspaces.
2. **DooD Safety**: When executing commands or mapping volumes for Docker-out-of-Docker (DooD), ensure `/var/run/docker.sock` is mounted securely, and container user permissions are aligned to prevent file ownership issues on the host.

---

## Scoped Commands

Run these scripts from the monorepo root to manage the tools:

- `pnpm mcp:dev:up`: Launches the development MCP gateway and downstream tools adapters in detached Docker containers.
- `pnpm mcp:dev:down`: Stops the development MCP stack containers.
- `pnpm mcp:dev:reset`: Prunes development volumes, rebuilds adapters, and restarts the gateway.
- `pnpm mcp:prod:up`: Launches the production MCP stack with detached containers.
- `pnpm mcp:prod:down`: Stops the production MCP stack containers.
- `pnpm mcp:prod:reset`: Prunes production volumes and restarts.
- `pnpm mcp:staging:up`: Launches the staging MCP stack with detached containers.
- `pnpm mcp:staging:down`: Stops the staging MCP stack containers.
- `pnpm mcp:staging:reset`: Prunes staging volumes and restarts.
- `pnpm agents:up`: Launches development containerized AI terminals.
- `pnpm agents:down`: Stops the development agent containers.
- `pnpm agents:reset`: Wipes development agent session caches and rebuilds the containers.
- `pnpm turborepo:up` / `pnpm turborepo:down`: Manages the development self-hosted remote cache containers.
- `pnpm antigravity:auth` / `pnpm copilot:auth`: Runs OAuth authorization inside development containers.
- `pnpm typecheck`: Validates TypeScript type safety across scripts and adapters.
