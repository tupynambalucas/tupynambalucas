# Local Context: Studio Infrastructure & Orchestration

This infrastructure directory ([infrastructure/](./)) manages Docker Compose configurations, Kubernetes manifests, and environment templates for the Studio workspace.

---

## 1. Directory Layout

- **[docker/](./docker/)**: Declares container specifications ([compose.yaml](./docker/compose.yaml)) for local standalone execution over `penpot-net` and `memos-net`.
- **[kubernetes/](./kubernetes/)**: Kustomize deployment definitions ([kustomization.yaml](./kubernetes/kustomization.yaml)):
  - **[namespace.yaml](./kubernetes/namespace.yaml)**: Defines the dedicated `studio` Kubernetes namespace.
  - **[certmanager.yaml](./kubernetes/certmanager.yaml)**: Declares wildcard TLS certificate `wildcard-studio-tupynambalucas-dev` for `*.lan.tupynambalucas.dev`.
  - **[penpot.yaml](./kubernetes/penpot.yaml)**: Penpot design suite Deployments (Valkey, Backend, Exporter, Frontend, Aide MCP), Services, PVC (1Gi), and Ingress route.
  - **[memos.yaml](./kubernetes/memos.yaml)**: Memos notes Deployment, 1Gi PVC, Service (port 5230), and Ingress route.
- **[.env.example](./.env.example)**: Environment variable template for Studio secrets and database connections.

---

## 2. Guardrails & Architecture Rules

- **Secrets Isolation**: Local variables MUST be defined in [.env](./.env) and mapped through Kustomize `secretGenerator` under `studio-secrets` (namespace `studio`).
- **Kubernetes Variable References**: Kubernetes deployments MUST access variables using `valueFrom.secretKeyRef` referencing `studio-secrets`. Hardcoded database passwords and secret keys are strictly forbidden.
- **Platform Dependency**: The Studio Skaffold configuration requires `platform-dev` ([platform/skaffold.yaml](../../platform/skaffold.yaml)).
- **Volume Persistence**: State-dependent workloads (`penpot-valkey`, `memos`) MUST use PersistentVolumeClaims (`penpot-valkey-pvc`, `memos-pvc`).
