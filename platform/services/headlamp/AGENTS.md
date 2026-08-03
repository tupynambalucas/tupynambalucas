# Local Context: Kubernetes Web UI Dashboard (Headlamp)

This service directory ([headlamp/](./)) manages the custom, login-free (tokenless) Kubernetes Web UI dashboard configuration.

---

## 1. Directory Layout

- **[config.yaml](./config.yaml)**: Kubeconfig pointing to the local cluster API using `/var/run/secrets/kubernetes.io/serviceaccount/token`.
- **[Dockerfile](./Dockerfile)**: Docker instructions setting up the container home directory and copying the local kubeconfig.

---

## 2. Guardrails & Architecture Rules

- **Autologin Authentication**: The kubeconfig MUST use the `tokenFile` pointer to read the ServiceAccount token dynamically. Do not hardcode raw tokens.
- **Root Permissions to chown**: During Docker build, the user MUST be switched to `root` to execute the folder permission updates (`chown`) on the home directory `/home/headlamp/.kube`, and then switched back to the non-root user `headlamp` before execution.
- **Service Account Permissions**: The pod running this image MUST be associated with a ServiceAccount that has a corresponding `ClusterRoleBinding` mapped to `cluster-admin` (for full dev dashboard capability) or `view` (for read-only dashboard access).
