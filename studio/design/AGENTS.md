# Local Context: Studio Design & Penpot Hub

This workspace (`[studio/design/](./)`) configures, hosts, and deploys the self-hosted collaborative design services (Penpot) and manages the shared design assets (icons, brand logos, three.js vectors, and design tokens) under `@tupynambalucas-studio/design`.

---

## Local Architecture & Directory Map

- **`[assets/](./assets/)`**: Centralized design system components, icons, theme configurations, and tokens.
  - `assets/tokens/`: Color systems, tokens, and CSS properties.
  - `assets/icons/`: Shared icon components.
  - `assets/brand/logos/`: Canonical brand logo assets.
- **`[infrastructure/docker/compose.yaml](./infrastructure/docker/compose.yaml)`**: Docker Compose orchestration for Penpot backend, frontend wrapper, Valkey cache, Postgres database, and Penpot AI service (aide).
- **`[services/](./services/)`**: Custom service configurations and environment properties for `frontend`, `backend`, `exporter`, `valkey`, and `aide`.

---

## Design Assets & CSS Guardrails

1. **Relative CSS Units**:
   - The use of raw `px` units is strictly forbidden in layout definitions.
   - AI agents MUST use relative units (`rem`, `em`, `vh`, `vw`, `clamp`) for scalable fluid typography and layouts.
2. **ESM Exports**:
   - Verify that all newly created assets (icons, vectors, images) are registered correctly in `[package.json](./package.json)` under the exports map to make them importable across the monorepo workspaces.

---

## Penpot Infrastructure Guardrails

1. **Volume Mappings**:
   - AI agents MUST ALWAYS ensure that database assets (PostgreSQL) and session volumes are correctly bound to avoid design data loss during container restarts or updates.
2. **S3 Assets Persistence**:
   - The Penpot application uses S3-compatible object storage to persist assets and uploads. AI agents MUST verify that S3 configurations (`PENPOT_BUCKET_NAME`, credentials) are loaded correctly from local env properties.
3. **Port Collisions**:
   - Penpot services run on host port `9005` by default. AI agents MUST NEVER change this port in dev compose files to ensure smooth routing.

---

## Scoped Commands

Run these scripts from the monorepo root:

- `pnpm penpot:up`: Builds and runs Penpot local containers.
- `pnpm penpot:down`: Stops local Penpot containers.
- `pnpm penpot:reset`: Recreates compose containers.
- `pnpm penpot:aide:up`: Boots Penpot AI assistant.
- `pnpm studio:typecheck`: Validates TypeScript type safety across the studio packages.
- `pnpm studio:lint`: Runs ESLint verification.
