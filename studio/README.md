# Design Studio Workspace

The `studio/` directory houses brand identity management, design system tokens, asset synchronization pipelines, and self-hosted collaborative design infrastructure for the %PROJECT_DOMAIN% monorepo.

---

## Technology Stack

- **Design System & Tokens**: CSS variables, TypeScript token definitions, React SVG icons (`@repo/studio/assets`)
- **Asset Storage & Sync**: Cloudflare R2, `@repo/studio/bucket`
- **Collaborative Design Engine**: Penpot v2 (Frontend, Backend, Exporter, Valkey, Aide AI Assistant)
- **Collaborative Notes**: Memos
- **Orchestration**: Kubernetes, Kustomize, Skaffold, Podman / Docker Compose

---

## Directory Overview

- **[assets/](./assets/README.md)**: Brand identity, design system tokens, React icons, and styling themes (`@repo/studio/assets`) ([assets/README.md](./assets/README.md)).
- **[bucket/](./bucket/README.md)**: Cloudflare R2 asset synchronization CLI package (`@repo/studio/bucket`) ([bucket/README.md](./bucket/README.md)).
- **[creative/](./creative/)**: Raw creative design files, master graphics, and vector source assets.
- **[infrastructure/](./infrastructure/README.md)**: Container orchestration and Kubernetes deployment manifests ([infrastructure/README.md](./infrastructure/README.md)).
- **[AGENTS.md](./AGENTS.md)**: AI agent domain router context.

---

## Service Infrastructure

Studio services (Penpot and Memos) can be run on Kubernetes via Skaffold or in standalone containers via Docker Compose.

### 1. Kubernetes Dev Mode (Hot-Reload)

Studio integrates with the cluster via Skaffold and automatically boots the `platform-dev` module:

```bash
pnpm studio:dev
```

### 2. Standalone Containers (Docker Compose / Podman)

To run Studio services standalone:

```bash
# Start containers
pnpm studio:up

# View live logs
pnpm studio:logs

# Stop containers
pnpm studio:down
```

---

## Key Scripts

| Command                 | Description                                                        |
| :---------------------- | :----------------------------------------------------------------- |
| `pnpm studio:dev`       | Starts Studio with Platform on Kubernetes via Skaffold.            |
| `pnpm studio:clean`     | Deletes deployed Studio cluster resources.                         |
| `pnpm studio:stop`      | Tears down Kubernetes deployments and standalone containers.       |
| `pnpm studio:up`        | Boots standalone Studio containers with Docker Compose.            |
| `pnpm studio:down`      | Stops and removes Studio containers.                               |
| `pnpm studio:logs`      | Streams live container logs across Studio services.                |
| `pnpm studio:reset`     | Restarts Studio containers cleanly.                                |
| `pnpm studio:bucket`    | Runs the Cloudflare R2 asset synchronization CLI.                  |
| `pnpm studio:typecheck` | Validates TypeScript compilation across studio packages.           |
| `pnpm studio:lint`      | Validates code standards and linting rules across studio packages. |
