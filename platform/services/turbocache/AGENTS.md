# Local Context: Turborepo Remote Cache (turbocache)

This service directory ([turbocache/](./)) manages the containerized Turborepo Remote Cache server accelerating monorepo builds.

---

## 1. Directory Layout

- **[Dockerfile](./Dockerfile)**: Sets up the cache server using `ducktors/turborepo-remote-cache:latest`, creating `/data/cache` under `app` user ownership.

---

## 2. Guardrails & Architecture Rules

- **Execution Port**: Turbocache internally exposes port `3000`. In Kubernetes, it is routed via Service `turbocache` (port `3000`) and exposed via Ingress at `turbocache-dev.tupynambalucas.dev`. In Docker Compose, it maps to host port `3008`.
- **Cache Storage Persistence**: Cached build artifacts MUST be persisted via PersistentVolumeClaim `turbocache-pvc` (5Gi) mapped to `/data`.
- **Authentication**: Turborepo clients authenticate using `TURBO_TOKEN` and `AUTH_MODE=static` (or `secret`). Credentials MUST be provided dynamically via `platform-secrets`.
- **Non-Root Execution**: Container processes MUST run as `USER app` to prevent privilege escalation.
