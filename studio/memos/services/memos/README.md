# Memos Service

The `studio/memos/services/memos` workspace provides the container build definition for the Memos
self-hosted note-taking and knowledge base service.

---

## Technology Stack

- **Base Image**: `neosmemo/memos:stable` (Alpine-based Go binary, ~40 MB)
- **Runtime**: Go static binary
- **Port**: `5230`
- **Database**: Neon Serverless Postgres (via `MEMOS_DRIVER=postgres` + `MEMOS_DSN`)
- **Data Volume**: `/var/opt/memos` (local assets and attachments)
- **User**: non-root UID `10001` (`nonroot`, enforced by upstream image)
- **Ingress Domain**: `memos-dev.%PROJECT_DOMAIN%`

---

## Service Overview

- **[Dockerfile](./Dockerfile)**: Wraps the official `neosmemo/memos:stable` image with `dev`
  and `prod` build targets for Skaffold integration.

---

## Getting Started

Memos starts with the studio stack:

```bash
pnpm studio:dev
```

Access the Memos UI at `http://localhost:5230` or `http://memos-dev.%PROJECT_DOMAIN%`.
