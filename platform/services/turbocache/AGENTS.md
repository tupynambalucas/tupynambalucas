# Local Context: Turborepo Remote Cache (turbocache)

This service directory ([turbocache/](./)) manages cache storage configurations for accelerating Monorepo pipelines.

---

## 1. Directory Layout

- **[Dockerfile](./Dockerfile)**: Sets up the cache server using `ducktors/turborepo-remote-cache`.

---

## 2. Guardrails & Architecture Rules

- **Execution Port**: The server internally exposes port `3000`. Inside Kubernetes, this must be mapped to port `3000` on the Service definition.
- **Cache Persistence**: Cached artifacts MUST be persisted. Map volume mounting configurations inside compose or deployments to save data to `/data/cache`.
- **Permissions**: The Dockerfile MUST create `/data/cache` under `root` user context, adjust file ownership to the `app` user (`chown -R app:app`), and switch back to `USER app` to prevent execution with escalated privileges.
- **Authentication**: Turborepo authentication requires setting `TURBO_TOKEN` and `AUTH_MODE=secret` (or `static`). All authentication configurations MUST be resolved dynamically from system environment variables. Never hardcode tokens in manifests.
