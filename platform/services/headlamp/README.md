# Kubernetes Web UI Dashboard (Headlamp)

The `platform/services/headlamp` workspace provides an extensible, developer-friendly web UI for visual monitoring, pod logs, and administration of Kubernetes clusters.

---

## Technology Stack

- **Base Image**: `ghcr.io/headlamp-k8s/headlamp:v0.41.0`
- **Internal Port**: `4466`
- **Service Port**: `80`
- **Ingress Domain**: `headlamp-dev.%PROJECT_DOMAIN%`

---

## Service Overview

- **[src/.kube/config/config.yaml](./src/.kube/config/config.yaml)**: In-cluster kubeconfig configured to dynamically read the mounted Pod ServiceAccount token (`tokenFile`), enabling seamless login-free access.
- **[Dockerfile](./Dockerfile)**: Multi-stage container packaging setting up permissions and placing kubeconfig under `/home/headlamp/.kube/config`.

---

## Getting Started

Headlamp starts automatically when running platform services on Kubernetes:

```bash
pnpm platform:dev
```

Access the dashboard at `http://localhost:80` (or `http://headlamp-dev.%PROJECT_DOMAIN%`).
