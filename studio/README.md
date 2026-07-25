# Design Studio Workspace

The `studio/` directory houses brand identity management, design system assets, asset synchronization pipelines, and self-hosted collaborative design infrastructure.

---

## Directory Overview

- **[assets/](./assets/)**: Brand identity, design system tokens, React icons, and styling themes (`@tupynambalucas-studio/assets`) ([assets/README.md](./assets/README.md)).
- **[bucket/](./bucket/)**: Cloudflare R2 asset synchronization CLI package (`@tupynambalucas-studio/bucket`) ([bucket/README.md](./bucket/README.md)).
- **[creative/](./creative/)**: Raw creative design files, master graphics, and vector source assets.
- **[infrastructure/](./infrastructure/)**: Podman/Docker Compose orchestration for Penpot v2 design editor and Memos.
- **[AGENTS.md](./AGENTS.md)**: AI agent domain router context.

---

## Service Infrastructure

Penpot and Memos infrastructure services are defined in `studio/infrastructure/docker/compose.yaml`.

### Operations & Commands

Execute these scripts from the monorepo root:

- `pnpm penpot:up`: Launches Penpot collaborative design editor at `http://localhost:9005`.
- `pnpm penpot:down`: Stops Penpot containers.
- `pnpm penpot:reset`: Resets Penpot database volumes and containers.
- `pnpm memos:up`: Launches Memos note-taking service.
- `pnpm studio:bucket`: Runs the Cloudflare R2 asset synchronization CLI menu.
