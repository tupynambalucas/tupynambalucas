# Turborepo Remote Cache (turbocache)

The `platform/services/turbocache` workspace provides a high-performance, containerized Remote Cache server for Turborepo builds across the %PROJECT_DOMAIN% monorepo.

---

## Technology Stack

- **Base Image**: `ducktors/turborepo-remote-cache:latest`
- **Port**: `3000` (Host `3008` in Compose)
- **Ingress Domain**: `turbocache-dev.%PROJECT_DOMAIN%`

---

## Service Overview

- **[Dockerfile](./Dockerfile)**: Packages the remote cache server with local directory `/data/cache` properly owned by the `app` user.
- **Persistent Storage**: Retains compiled package artifacts across local development runs and CI executions via `turbocache-pvc` (5Gi).

---

## Getting Started

Turbocache starts automatically with the platform stack:

```bash
# Kubernetes development mode
pnpm platform:dev

# Standalone Docker Compose mode
pnpm platform:up
```

To configure Turborepo to use the remote cache locally:

```bash
turbo run build --api="http://localhost:3008" --token="your_remote_cache_token"
```
