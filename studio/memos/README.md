# Memos Notes Platform

The `studio/memos` workspace contains the container build definition for the Memos self-hosted
note-taking service running in the `studio` Kubernetes namespace of the %PROJECT_DOMAIN% monorepo.

---

## Technology Stack

- **Base Image**: `neosmemo/memos:stable` (Alpine-based Go binary)
- **Database**: Neon Serverless Postgres (external, via `MEMOS_DRIVER` + `MEMOS_DSN`)
- **Port**: `5230`
- **Ingress Domain**: `memos-dev.%PROJECT_DOMAIN%`

---

## Service Overview

| Service | Dockerfile                                               | Port   |
| :------ | :------------------------------------------------------- | :----- |
| `memos` | [services/memos/Dockerfile](./services/memos/Dockerfile) | `5230` |

---

## Getting Started

Memos starts automatically with the studio stack:

```bash
# Kubernetes development mode
pnpm studio:dev

# Standalone Docker Compose mode
pnpm studio:up
```

Access the Memos UI at `http://localhost:5230` or `http://memos-dev.%PROJECT_DOMAIN%`.

---

## Kubernetes Manifests

Deployment manifests are maintained in
[infrastructure/manifests/studio-memos.yaml](../../infrastructure/manifests/studio-memos.yaml).
Image names in that manifest are substituted by Skaffold using artifacts defined in
[infrastructure/skaffold.yaml](../../infrastructure/skaffold.yaml).
