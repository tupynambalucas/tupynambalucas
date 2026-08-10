# Local Context: Platform Infrastructure & Orchestration

This infrastructure directory ([infrastructure/](./)) manages Docker Compose configurations, Kubernetes manifests, and environment templates for the always-on platform utilities.

---

## 1. Directory Layout

- **[docker/](./docker/)**: Declares container specifications ([compose.yaml](./docker/compose.yaml)) for local standalone execution over `platform-net`.
- **[kubernetes/](./kubernetes/)**: Kustomize deployment definitions ([kustomization.yaml](./kubernetes/kustomization.yaml)):
  - **[namespace.yaml](./kubernetes/namespace.yaml)**: Defines the dedicated `platform` Kubernetes namespace.
  - **[certmanager.yaml](./kubernetes/certmanager.yaml)**: ClusterIssuer `letsencrypt-cloudflare-dns` using ACME DNS-01 validation.
  - **[traefik.yaml](./kubernetes/traefik.yaml)**: Traefik v3.1 Ingress Controller, IngressClass, RBAC rules, LoadBalancer Service, and dashboard Ingress.
  - **[cloudflared.yaml](./kubernetes/cloudflared.yaml)**: Cloudflare Tunnel runtime routing cluster services securely.
  - **[grafana.yaml](./kubernetes/grafana.yaml)**: Grafana Deployment, 1Gi PVC, Service (port 3000), and Ingress route.
  - **[headlamp.yaml](./kubernetes/headlamp.yaml)**: Headlamp Kubernetes UI Deployment, ServiceAccount, `cluster-admin` RBAC, Service (port 80), and Ingress route.
  - **[kubestatemetrics.yaml](./kubernetes/kubestatemetrics.yaml)**: `kube-state-metrics` cluster object state exporter.
  - **[loki.yaml](./kubernetes/loki.yaml)**: Grafana Loki log aggregation Deployment, 1Gi PVC, and Service (port 3100).
  - **[otelcol.yaml](./kubernetes/otelcol.yaml)**: OpenTelemetry Collector Deployment, RBAC metrics collector, and Service (ports 4317, 4318, 24224).
  - **[prometheus.yaml](./kubernetes/prometheus.yaml)**: Prometheus time-series metrics Deployment, 1Gi PVC, and Service (port 9090).
  - **[tempo.yaml](./kubernetes/tempo.yaml)**: Grafana Tempo trace storage Deployment, 1Gi PVC, and Service (ports 3200, 4317, 4318).
  - **[turbocache.yaml](./kubernetes/turbocache.yaml)**: Turborepo Remote Cache Deployment, 5Gi PVC, Service (port 3000), and Ingress route.
- **[.env.example](./.env.example)**: Environment variable template for platform secrets and tokens.

---

## 2. Guardrails & Architecture Rules

- **Secrets Isolation**: Local variables MUST be declared in [.env](./.env) and mapped through Kustomize `secretGenerator` under `platform-secrets` (namespace `platform`) and `cloudflare-api-token-secret` (namespace `cert-manager`).
- **Kubernetes Variable References**: Kubernetes deployments MUST access variables using `valueFrom.secretKeyRef` referencing `platform-secrets`. Hardcoded credentials are strictly forbidden.
- **Skaffold Hook Parity**: Skaffold pre-deploy hooks in [skaffold.yaml](../skaffold.yaml) automatically apply and verify cert-manager CRDs (`crd/certificates.cert-manager.io`, `crd/clusterissuers.cert-manager.io`) before deploying resources.
- **Volume Claims**: Deployments requiring state persistence (`grafana`, `prometheus`, `loki`, `tempo`, `turbocache`) MUST declare and bind dedicated PersistentVolumeClaims.
