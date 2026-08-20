# Rancher Desktop and Docker Compose Workflow

This guide details the local container development environment using Rancher Desktop and Docker Compose for the workspaces in the `tupynambalucas.dev` monorepo.

---

## 1. Development Role and Purpose

The Docker Compose configuration is designed for high-velocity local development. It allows engineers to spin up dependent backing services (databases, caches, mock APIs, and tools) quickly without the compute overhead and configuration complexity of a full Kubernetes scheduler.

### Key Advantages

- **Resource Efficiency**: Consumes significantly less CPU and memory compared to starting a local Kubernetes control plane.
- **Fast Cycles**: Avoids container registry build-and-push cycles by executing direct source-mounting and hot-reloading configurations.
- **Granular Execution**: Allows launching isolated packages (e.g., launching only the MCP tools or only the Hub backend database) using targeted NPM scripts.

---

## 2. Rancher Desktop Configuration

To ensure compatibility with Docker Compose and standard Docker CLI tools, Rancher Desktop must be configured with the standard Docker Engine:

1. Open **Rancher Desktop Settings**.
2. Navigate to **Virtual Machine > Container Engine**.
3. Select **moby (dockerd)**. Do not select `containerd` unless you are executing raw Kubernetes integration tests directly inside K3s.
4. Go to **Application Settings > Path Management** and ensure **Automatic** (or manual symlinks) is enabled to allow the `docker` and `docker compose` commands to execute from your terminal shell.

---

## 3. Workspace Compose Architecture

The monorepo segments backing services into distinct Compose stacks. Each stack is managed by environment-specific files and Docker Compose Profiles.

### Stack Definitions

- **MCP Tools Stack** (`tools/mcp/infrastructure/docker/`): Exposes Model Context Protocol tool integrations (GitHub, Firecrawl, Grafana, Context7, and DockerHub).
- **Platform Stack** (`tools/platform/infrastructure/docker/`): Manages control plane helper utilities like telemetry routing and development caching.
- **Hub Stack** (`hub/infrastructure/docker/`): Exposes databases (PostgreSQL, Redis) and backend service configurations for the developer portal client.

### Environment Segregation (Profiles and Files)

Each stack utilizes a three-tier override system:

1. **Base Configuration** (`compose.yaml`): Declares service definitions, network boundaries, and volume bindings.
2. **Environment Overrides** (`compose.override.yaml` or `compose.prod.yaml`): Appends development-specific settings (like debug ports or source mapping) or production-specific options.
3. **Environment Secrets** (`.env.dev`, `.env.prod`, `.env.staging`): Houses localized environment variables and API tokens.

---

## 4. Operational Commands (NPM Script Map)

Rather than executing verbose Docker Compose commands manually, the root `package.json` provides scripts mapped to each workspace context.

### Command Syntax Patterns

| Command Suite          | Action          | Underlying Command Execution                                              |
| :--------------------- | :-------------- | :------------------------------------------------------------------------ |
| `pnpm mcp:dev:up`      | Start MCP dev   | `docker compose -f ... -f ... --env-file ... --profile dev up -d --build` |
| `pnpm mcp:dev:down`    | Stop MCP dev    | `docker compose -f ... -f ... --env-file ... --profile dev down`          |
| `pnpm mcp:dev:reset`   | Reset MCP state | `docker compose -f ... down --volumes && docker compose -f ... up`        |
| `pnpm platform:dev:up` | Start platform  | `docker compose -f ... -f ... --env-file ... --profile dev up -d --build` |
| `pnpm hub:up`          | Start Hub stack | `docker compose -f ... -f ... --env-file ... --profile dev up -d --build` |

> [!NOTE]
> The `--volumes` flag in the reset script deletes local volumes (e.g., local database states). Use it when schema changes or migrations require a completely clean state.

---

## 5. Summary Developer Rules

- **Use Compose first**: For coding, running local tests, and UI styling. Only switch to Kubernetes when testing infrastructure, service discovery, or security policies.
- **Never commit `.env` overrides**: Always use the provided `.env.dev.example` templates and create a local `.env.dev` (git-ignored) to customize personal API keys.
