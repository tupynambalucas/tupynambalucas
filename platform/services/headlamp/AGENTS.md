# Local Context: Kubernetes Web UI Dashboard (Headlamp)

This service directory ([headlamp/](./)) manages the custom, login-free (tokenless) Kubernetes Web UI dashboard configuration.

---

## 1. Directory Layout

- **[src/.kube/config/config.yaml](./src/.kube/config/config.yaml)**: Kubeconfig pointing to the local cluster API using the ServiceAccount token at `/var/run/secrets/kubernetes.io/serviceaccount/token`.
- **[Dockerfile](./Dockerfile)**: Multi-stage Docker instructions setting up the container home directory and copying the local kubeconfig.

---

## 2. Guardrails & Architecture Rules

- **Autologin Authentication**: The kubeconfig MUST use the `tokenFile` pointer to read the ServiceAccount token dynamically from `/var/run/secrets/kubernetes.io/serviceaccount/token`. Raw tokens MUST NEVER be hardcoded.
- **Port Allocation**: Headlamp internally listens on port `4466`. In Kubernetes, it is exposed via Service `headlamp` on port `80` and routed via Ingress at `headlamp-dev.tupynambalucas.dev`.
- **Service Account Permissions**: The pod running this image MUST be associated with a ServiceAccount bound to `cluster-admin` (for full development cluster capability) via `ClusterRoleBinding`.
- **Live Configuration Sync**: In Skaffold development mode, changes inside `src/` are synced directly to `/home/headlamp` inside the container.
