# Containerized AI Agents Stack

This directory manages the orchestration and configuration for containerized AI development agents (Google Antigravity and GitHub Copilot CLI) running inside Docker.

## Architecture Overview

The agent containers run as long-running Docker services in the private bridge network `tupynambalucas-agents-net` alongside the MCP gateway. They mount the host's Docker socket to orchestrate monorepo workflows directly from inside the containers.

```
+-------------------------------------------------------------+
|                        Host Machine                         |
|  +--------------------+             +--------------------+  |
|  |     Developer      |             |   SSH Keys / Git   |  |
|  |     (VS Code)      |             |     Identity       |  |
|  +---------+----------+             +----------+---------+  |
+------------|-----------------------------------|------------+
             | docker exec                       | mount (read-only)
             v                                   v
+------------|-----------------------------------|------------+
|            |         tupynambalucas-agents Stack      |            |
|  +---------v----------+             +----------v---------+  |
|  | agent-antigravity  |             |   agent-copilot    |  |
|  | (Google Gemini)    |             |  (GitHub Copilot)  |  |
|  +---------+----------+             +----------+---------+  |
+------------|-----------------------------------|------------+
             |                                   |
             +-----------------+-----------------+
                               | host loopback
                               v
             +-----------------+-----------------+
             |     Fastify Unified MCP Gateway   |
             |  (tupynambalucas.internal.tools.mcp:3005) |
             +-----------------------------------+
```

---

## Directory Layout

- `infrastructure/docker/`: Contains the orchestration file ([compose.yaml](./infrastructure/docker/compose.yaml)) and environment configuration.
- `infrastructure/config/`: Shared configurations, including the Model Context Protocol endpoints ([mcp.config.json](./infrastructure/config/mcp.config.json)).
- `services/antigravity/`: Dockerfile baking in the custom Google Antigravity CLI binary and dependencies.
- `services/copilot/`: Dockerfile baking in Node 22, PNPM 11, and GitHub Copilot CLI.
- `data/`: Auto-generated host persistence folder for session tokens and cache.
- `skills/`: Auto-generated or shared specialized markdown skills injected into the containers.

---

## Configuration & Persistence

All agent configuration is injected at container boot using read-only or read-write **bind mounts**. No settings are hard-coded into the image layers, ensuring instant sync with host configurations.

| Mount Source                                  | Container Destination                  | Access     | Purpose                                       |
| :-------------------------------------------- | :------------------------------------- | :--------- | :-------------------------------------------- |
| `../../../../`                                | `/workspace`                           | Read-Write | Access to the monorepo root                   |
| `../../skills/`                               | `/workspace/.agents/skills`            | Read-Only  | Inject shared agent skills                    |
| `../../infrastructure/config/mcp.config.json` | `/root/.gemini/config/mcp_config.json` | Read-Only  | Configuration endpoint mapping (Antigravity)  |
| `../../data/antigravity/`                     | `/root/.gemini/`                       | Read-Write | Persist agent conversation logs & cache       |
| `../../data/copilot/`                         | `/root/.copilot/`                      | Read-Write | Persist Copilot session credentials           |
| `/var/run/docker.sock`                        | `/var/run/docker.sock`                 | Read-Write | Docker-out-of-Docker (DooD) command execution |

---

## Authentication Workflow

Both CLI clients utilize standard OAuth device-auth flows. Authenticate them directly in your active terminal by running the mapped scripts:

- **Google Antigravity:**
  ```bash
  pnpm antigravity:auth
  ```
- **GitHub Copilot CLI:**
  ```bash
  pnpm copilot:auth
  ```
  These scripts run `docker exec` in interactive mode. Open the returned URL, input the verification code, and authorize. The tokens are saved directly to the bind-mounted volumes on your host and persist across container restarts.

---

## Operations

Manage the agent services using the mapped scripts in the root `package.json`:

- `pnpm agents:up`: Starts both agent containers in detached mode.
- `pnpm agents:down`: Tears down the agent containers.
- `pnpm agents:reset`: Forces a full volume teardown and container rebuild.
- Commands are also available scoped to individual agents (e.g. `pnpm antigravity:up` or `pnpm copilot:reset`).
