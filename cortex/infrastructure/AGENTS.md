# Local Context: Infrastructure & Orchestration

This workspace directory ([infrastructure/](./)) contains system orchestration assets, container definitions, and deployment manifests for the AI Cortex subsystem.

---

## 1. Subsystem Layout

- **[docker/](./docker/)**: Central Docker Compose files ([compose.yaml](./docker/compose.yaml)) and environment variable definitions ([.env](./docker/.env)).
- **[kubernetes/](./kubernetes/)**: Kubernetes manifests and Skaffold deployment definitions for cluster environments.

---

## 2. Operational Rules

- **Compose Profiles**: Always scope container operations using Docker Compose profiles (`core`, `memory`, `agents`).
- **Environment Management**: Environment variables MUST be declared in `.env` files and referenced via variable substitution in `compose.yaml`.
