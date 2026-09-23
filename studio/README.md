# Design Studio Workspace

The `studio/` directory houses brand identity management, design system tokens, asset synchronization pipelines, and self-hosted collaborative design infrastructure for the %PROJECT_DOMAIN% monorepo.

---

## Technology Stack

- **Design System & Tokens**: CSS variables, TypeScript token definitions, React SVG icons (`@repo/studio/assets`)
- **Asset Storage & Sync**: Cloudflare R2, `@repo/studio/bucket`
- **Collaborative Design Engine**: Penpot v2 (Frontend, Backend, Exporter, Valkey, Aide AI Assistant)
- **Collaborative Notes**: Memos
- **Orchestration**: Kubernetes, Kustomize, Skaffold

---

## Directory Overview

- **[assets/](./assets/README.md)**: Brand identity, design system tokens, React icons, and styling themes (`@repo/studio/assets`) ([assets/README.md](./assets/README.md)).
- **[bucket/](./bucket/README.md)**: Cloudflare R2 asset synchronization CLI package (`@repo/studio/bucket`) ([bucket/README.md](./bucket/README.md)).
- **[creative/](./creative/)**: Raw creative design files, master graphics, and vector source assets.
- **[infrastructure/](./infrastructure/README.md)**: Container orchestration and Kubernetes deployment manifests ([infrastructure/README.md](./infrastructure/README.md)).
- **[penpot/](./penpot/README.md)**: Container build definitions for all Penpot v2 services (`frontend`, `backend`, `exporter`, `aide`, `valkey`).
- **[memos/](./memos/README.md)**: Container build definition for the Memos self-hosted note-taking service.
- **[AGENTS.md](./AGENTS.md)**: AI agent domain router context.

---

## Service Infrastructure

Studio services (Penpot and Memos) run exclusively on Kubernetes via Skaffold, deployed
as part of the unified infrastructure stack.

### Kubernetes Dev Mode (Hot-Reload)

Studio integrates with the cluster via the `studio-dev` Skaffold module and is included
in the full stack deployment:

```bash
pnpm infra:dev
```

This automatically deploys the `platform-dev` module as a prerequisite and launches all
Studio services into the `studio` namespace with live sync enabled.

---

## Key Scripts

| Command                 | Description                                                        |
| :---------------------- | :----------------------------------------------------------------- |
| `pnpm infra:dev`        | Deploys the full stack including Studio services via Skaffold.     |
| `pnpm infra:delete`     | Tears down all cluster resources including Studio deployments.     |
| `pnpm studio:bucket`    | Runs the Cloudflare R2 asset synchronization CLI.                  |
| `pnpm studio:typecheck` | Validates TypeScript compilation across studio packages.           |
| `pnpm studio:lint`      | Validates code standards and linting rules across studio packages. |
