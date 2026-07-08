# Local Context: Penpot Collaborative Design Hub

This workspace (`[studio/penpot/](./)`) configures and deploys the self-hosted collaborative design services (Penpot).

---

## Local Architecture & Directory Map

- **[compose.yaml](./compose.yaml)**: Compose orchestration for Penpot main backend, frontend wrapper, redis cache, postgres database, and Penpot AI service (aide).
- **[config/](./config/)**: Local configuration files for SMTP servers and database initializations.

---

## Penpot Guardrails

1. **Volume Mappings**: AI agents MUST ALWAYS ensure that database assets (PostgreSQL) and session volumes are correctly bound to avoid design data loss during container updates.
2. **S3 Assets Persistence**: The Penpot application uses S3-compatible object storage to persist assets and uploads. AI agents MUST verify that S3 configurations (`PENPOT_BUCKET_NAME`, credentials) are loaded correctly from local env properties.
3. **Port Collisions**: Penpot services run on host port `9005` by default. AI agents MUST NEVER change this port in dev compose files to ensure smooth routing.

---

## Scoped Commands

Run these scripts from the monorepo root:

- `pnpm penpot:up`: Builds and runs Penpot local containers.
- `pnpm penpot:down`: Stops local Penpot containers.
- `pnpm penpot:reset`: Recreates compose containers.
- `pnpm penpot:aide:up`: Boots Penpot AI assistant.
