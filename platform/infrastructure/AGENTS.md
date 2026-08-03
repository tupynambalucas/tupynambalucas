# Local Context: Platform Infrastructure & Orchestration

This infrastructure directory ([infrastructure/](./)) manages Docker Compose and Kubernetes configurations for always-on utilities.

---

## 1. Directory Layout

- **[docker/](./docker/)**: Declares container specs ([compose.yaml](./docker/compose.yaml)) for local bridge networking.
- **[kubernetes/](./kubernetes/)**: Kustomize deployment definitions ([kustomization.yaml](./kubernetes/kustomization.yaml)) for cluster environments.
- **[.env](./.env)**: Developer secret configuration template for runtime variables.

---

## 2. Guardrails & Architecture Rules

- **Secrets Isolation**: Local variables MUST be defined in the local environment file ([.env](./.env)) and mapped via Kustomize `secretGenerator` under `platform-secrets`.
- **Kubernetes Variable Reference**: Kubernetes deployments MUST access variables using `valueFrom.secretKeyRef` pointing to `platform-secrets`. Hardcoded variables are strictly forbidden.
- **Compose CLI Variables**: When invoking docker compose, always specify the `--env-file` parameter pointing to the root-level platform env file ([.env](./.env)).
