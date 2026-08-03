# Platform Infrastructure & Deployment

The `infrastructure/` directory contains orchestration templates and environment configurations for platform deployments.

---

## Directory Layout

- **[docker/](./docker/)**: Docker Compose configuration profiles ([compose.yaml](./docker/compose.yaml)) for local standalone execution.
- **[kubernetes/](./kubernetes/)**: Kustomize manifests and service routing settings ([kustomization.yaml](./kubernetes/kustomization.yaml)) for local cluster execution.
- **[.env](./.env)**: Centralized local environment keys for the platform services.
- **[.env.example](./.env.example)**: Environment key templates for developer onboarding.
