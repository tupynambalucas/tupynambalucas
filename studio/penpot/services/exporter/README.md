# Penpot Exporter Service

The `studio/penpot/services/exporter` workspace provides the container build definition for the
Penpot PDF and PNG export service powered by Node.js and Playwright.

---

## Technology Stack

- **Base Image**: `penpotapp/exporter:2.17`
- **Runtime**: Node.js + Playwright (Chromium headless)
- **Port**: `6061`
- **Internal URI**: `http://frontend:8080` (connects to the Penpot frontend for rendering)
- **Cache**: Valkey at `redis://valkey:6379/0`

---

## Service Overview

- **[Dockerfile](./Dockerfile)**: Wraps the official `penpotapp/exporter` image with `dev` and
  `prod` build targets for Skaffold integration.

---

## Getting Started

The exporter starts with the studio stack:

```bash
pnpm studio:dev
```

The exporter is accessible internally at `http://exporter:6061` within the `studio` namespace.
It is not exposed via ingress; the backend delegates rendering tasks to it directly.
