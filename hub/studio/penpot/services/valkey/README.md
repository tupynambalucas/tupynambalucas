# Valkey Cache Service

The `studio/penpot/services/valkey` workspace provides the container build definition for the
Valkey Redis-compatible cache used by Penpot for WebSocket pub/sub and session management.

---

## Technology Stack

- **Base Image**: `valkey/valkey:8.1-alpine` (~30 MB)
- **Protocol**: Redis-compatible TCP
- **Port**: `6379`

---

## Service Overview

- **[Dockerfile](./Dockerfile)**: Wraps the official `valkey/valkey:8.1-alpine` image with `dev`
  and `prod` build targets for Skaffold integration.

---

## Getting Started

Valkey starts automatically with the studio stack:

```bash
pnpm studio:dev
```

Valkey is accessible internally at `redis://valkey:6379/0` within the `studio` namespace.
It is not exposed via ingress.
