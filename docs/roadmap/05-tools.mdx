---
title: Tools (Infrastructure & MCP)
sidebar_label: Tools (MCP & Infra)
---

This section outlines the gateway proxy infrastructure, containerized MCP servers, and agent sandboxes.

## Completed Milestones

### Gateway Proxy & Networking

- **Fastify HTTP Proxy Gateway**: Deployed a containerized gateway (`elo-mcp-gateway`) running on Fastify v5 that proxies and routes incoming local client requests (e.g. from the Antigravity CLI on port `3005`) to downstream context containers.
- **CORS & SSE Stream Handling**: Configured network-level CORS headers and disabled proxy timeouts to guarantee stable, persistent Server-Sent Events (SSE) connections.

### Containerized MCP Ecosystem

- **Playwright Headless Browser Sandbox**: Deployed a Debian-based container running Playwright Google Chrome, with automatic rewrite rules routing loopback/localhost requests back to the host machine bridge (`host.docker.internal`).
- **Structured MCP Servers**: Created Alpine/Debian-based containerized setups for:
  - `GitHub MCP`: Version control execution, issue tracking, and repository queries.
  - `Context7 MCP`: Documentation search targeting dependencies (React 19, Fastify 5, Three.js).
  - `Docker Hub MCP`: Container registry tracking.

### Automation Scripts

- **TypeScript Root Compilation Scripts**: Programmed TypeScript scripts (`generate-changelog.ts` and `generate-roadmap.ts`) running natively via `tsx` to compile workspace metrics and changes directly to root Markdown files.

### Containerized AI Agents (`tools/agents`)

- **Docker-based CLI Provisioning**: Architected and implemented a new `tools/agents` workspace that provisions GitHub Copilot and Google Antigravity CLIs as long-running Docker services, eliminating manual host-level CLI installations.
- **Unified Configuration Injection**: Both CLIs share a single `mcp_config.json` and a unified `skills/` directory, injected via bind mounts at container startup. No configuration is baked into image layers.
- **Persistent Session & Brain Storage**: OAuth tokens, conversation histories, and runtime data are persisted on the host machine via Git-ignored bind-mounted volumes, surviving container rebuilds.
- **Version-Controlled TUI Settings**: Antigravity CLI `settings.json`, `statusline.sh`, and `title.sh` are tracked in the repository and mounted over the container's runtime directory, giving the team direct control over CLI behavior without manual per-machine configuration.
- **Internal Network Routing**: Agent containers resolve all MCP services via the `elo.internal.tools.mcp:3005` custom host alias, allowing the stacks to start and stop completely independently without network configuration errors.
- **Docker-out-of-Docker (DooD)**: Both containers mount the host Docker socket, enabling containerized agents to orchestrate other monorepo stacks (e.g., `pnpm mcp:up`, `pnpm instance:up`) from within the container.
- **VS Code Task Integration**: Tasks registered in `.vscode/tasks.json` using `[Docker]` and `[Host]` prefixes to clearly distinguish container-based from host-global CLI execution during the migration transition period.

## Planned Focus

- **Agent Stack Validation**: End-to-end testing of MCP connectivity, OAuth persistence, and workspace bind mount integrity from within containerized agent sessions.
- **Host CLI Decommission**: After full agent stack validation, remove host-global CLI installations and delete legacy `.agents/` and `.github/copilot/` configuration directories.
- **CI/CD Integrations**: Build context validators and check scripts.
- **Automated Sandbox Reporting**: Expose runtime test and coverage dashboards to local agent environments.
