# Local Context: AI Agents Workspace

This workspace ([tools/agents/](./)) deploys containerized AI development terminals (Google Antigravity CLI and GitHub Copilot CLI) to guarantee environment parity.

---

## Local Architecture & Directory Map

- **[infrastructure/docker/compose.yaml](./infrastructure/docker/compose.yaml)**: Docker Compose orchestration defining the `antigravity` and `copilot` containers.
- **[infrastructure/docker/.env.example](./infrastructure/docker/.env.example)**: Environment template file.
- **[infrastructure/config/mcp.config.json](./infrastructure/config/mcp.config.json)**: Shared Model Context Protocol client configuration mapped to the agent workspaces.
- **[services/antigravity/Dockerfile](./services/antigravity/Dockerfile)**: Dockerfile baking in the custom Google Antigravity CLI binary and dependencies.
- **[services/copilot/Dockerfile](./services/copilot/Dockerfile)**: Dockerfile baking in Node 22, PNPM 11, and GitHub Copilot CLI.

---

## Agents Guardrails

1. **Docker-out-of-Docker (DooD)**: The docker socket (`/var/run/docker.sock`) is mounted inside the container. Verify that any docker execution from within the agent container targets host resources safely.
2. **Mount Parity**: Ensure that directory mappings between the host and the container are fully aligned (using identical paths) to prevent file-link resolving failures during task compilation.
3. **Session Cache Integrity**: OAuth authentication tokens and configurations for Copilot and Antigravity MUST write directly to `/root/.copilot` and `/root/.gemini` mapped volumes (under `data/copilot` and `data/antigravity`) to avoid logging out when restarting containers.

---

## Scoped Commands

Run these scripts from the monorepo root:

- `pnpm agents:up`: Builds and starts the containerized AI terminals.
- `pnpm agents:down`: Stops the agent session containers.
- `pnpm agents:reset`: Wipes authorization caches and recreates containers.
- `pnpm antigravity:up` / `pnpm antigravity:down` / `pnpm antigravity:reset`: Manages the Antigravity container specifically.
- `pnpm copilot:up` / `pnpm copilot:down` / `pnpm copilot:reset`: Manages the Copilot container specifically.
- `pnpm antigravity:auth` / `pnpm copilot:auth`: Authenticates the respective agent inside its container.
