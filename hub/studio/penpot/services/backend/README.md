# Penpot Backend Service

The `studio/penpot/services/backend` workspace provides the container build definition for the
Penpot Clojure/JVM REST API and WebSocket notification server.

---

## Technology Stack

- **Base Image**: `penpotapp/backend:2.17`
- **Runtime**: JVM (Clojure)
- **Port**: `6060` (REST API + WebSocket)
- **Database**: Neon Serverless Postgres (external)
- **Cache**: Valkey at `redis://valkey:6379/0`

---

## Service Overview

- **[Dockerfile](./Dockerfile)**: Wraps the official `penpotapp/backend` image with `dev` and
  `prod` build targets for Skaffold integration.

---

## Getting Started

The backend starts with the studio stack:

```bash
pnpm studio:dev
```

The backend is accessible internally at `http://backend:6060` within the `studio` namespace.
