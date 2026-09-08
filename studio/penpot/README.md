# Penpot Design Platform

The `studio/penpot` workspace contains container build definitions for all Penpot v2 services
running in the `studio` Kubernetes namespace of the %PROJECT_DOMAIN% monorepo.

---

## Technology Stack

- **Frontend**: `penpotapp/frontend:2.17` (nginx, serves the React SPA)
- **Backend**: `penpotapp/backend:2.17` (Clojure/JVM, REST API + WebSocket)
- **Exporter**: `penpotapp/exporter:2.17` (Node.js + Playwright, PDF/PNG rendering)
- **Aide (MCP)**: `penpotapp/mcp:2.17` (AI assistant and MCP server)
- **Cache**: `valkey/valkey:8.1-alpine` (Redis-compatible pub/sub)
- **Database**: Neon Serverless Postgres (external, via `PENPOT_DATABASE_URI`)
- **Ingress Domain**: `penpot-dev.%PROJECT_DOMAIN%`

---

## Service Overview

| Service           | Dockerfile                                                     | Port        |
| :---------------- | :------------------------------------------------------------- | :---------- |
| `penpot-frontend` | [services/frontend/Dockerfile](./services/frontend/Dockerfile) | `8080`      |
| `penpot-backend`  | [services/backend/Dockerfile](./services/backend/Dockerfile)   | `6060`      |
| `penpot-exporter` | [services/exporter/Dockerfile](./services/exporter/Dockerfile) | `6061`      |
| `penpot-aide`     | [services/aide/Dockerfile](./services/aide/Dockerfile)         | `4400-4403` |
| `valkey`          | [services/valkey/Dockerfile](./services/valkey/Dockerfile)     | `6379`      |

---

## Getting Started

Penpot starts automatically with the studio stack:

```bash
# Kubernetes development mode
pnpm studio:dev

# Standalone Docker Compose mode
pnpm studio:up
```

Access the Penpot UI at `http://localhost:9005` or `http://penpot-dev.%PROJECT_DOMAIN%`.

---

## Kubernetes Manifests

Deployment manifests are maintained in
[infrastructure/manifests/studio-penpot.yaml](../../infrastructure/manifests/studio-penpot.yaml).
Image names in that manifest are substituted by Skaffold using artifacts defined in
[infrastructure/skaffold.yaml](../../infrastructure/skaffold.yaml).
