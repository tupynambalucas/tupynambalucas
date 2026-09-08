# Penpot Frontend Service

The `studio/penpot/services/frontend` workspace provides the container build definition for the
Penpot web client, served by nginx.

---

## Technology Stack

- **Base Image**: `penpotapp/frontend:2.17`
- **Runtime**: nginx (embedded in upstream image)
- **Port**: `8080`
- **Ingress Domain**: `penpot-dev.%PROJECT_DOMAIN%`

---

## Service Overview

- **[Dockerfile](./Dockerfile)**: Wraps the official `penpotapp/frontend` image with `dev` and
  `prod` build targets for Skaffold integration.

---

## Getting Started

The frontend starts with the studio stack. Access the Penpot UI:

```bash
pnpm studio:dev
```

Navigate to `http://localhost:9005` or `http://penpot-dev.%PROJECT_DOMAIN%`.
