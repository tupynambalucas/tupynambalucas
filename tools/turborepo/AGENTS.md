# Local Context: Turborepo Infrastructure

This workspace ([tools/turborepo/](./)) implements the containerized infrastructure for Turborepo's Remote Cache.

---

## Local Architecture & Directory Map

- **[services/cache/](./services/cache/)**: Containerized Turborepo Remote Cache server Dockerfile.
- **[architecture/docker/compose.yaml](./architecture/docker/compose.yaml)**: Docker Compose orchestration defining volumes and service configurations for the remote cache.
- **[architecture/docker/.env](./architecture/docker/.env)**: Environment configuration file defining `TURBO_TOKEN` and port mappings.

---

## Turborepo Guardrails

1. **Isolation**: This folder only contains the infrastructure definition for the remote cache. It does not contain application code.
2. **Persistent Storage**: Always ensure that Docker volumes (`turbo-cache-data`) are correctly mapped in the `compose.yaml` to prevent cache loss on container restart.
3. **Secrets Handling**: Tokens (`TURBO_TOKEN`) should be securely provided through `.env` files and environment variables, avoiding hardcoding in the Dockerfile.

---

## Scoped Commands

Run these scripts from the monorepo root:

- `pnpm turbo:cache:up`: Boots the Turborepo remote cache container in the background.
- `pnpm turbo:cache:down`: Stops the Turborepo remote cache container.
- `pnpm turbo:cache:logs`: Views the live logs from the Turborepo remote cache container.
