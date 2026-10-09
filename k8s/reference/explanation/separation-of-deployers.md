# GitOps Orchestration: Separation of Deployers

## The Anti-Pattern: `--enable-helm`

Historically, `kustomize` offered the `--enable-helm` flag to allow Kustomize to inflate and render Helm charts internally. While this seemed convenient, it is now considered an anti-pattern in modern GitOps (e.g., ArgoCD 2.8+).

**Why it's problematic:**

- **Security & RBAC:** Allowing Kustomize to execute Helm binaries dynamically introduces security risks and requires complex Config Management Plugin (CMP) configurations in ArgoCD.
- **Debugging:** When Kustomize wraps Helm, tracing the exact origin of a manifest property (whether it came from a Helm value or a Kustomize patch) becomes extremely difficult.
- **Coupling:** It couples first-party workload orchestration with third-party software packaging.

## The Enterprise Standard: Separation of Deployers

To adhere to senior GitOps standards, we strictly separate the deployers:

1. **Helm for Third-Party:** We use Helm exclusively to deploy third-party open-source dependencies (e.g., Traefik, Grafana, PostgreSQL). Helm is treated as a package manager. We avoid writing custom Helm charts for our own microservices due to templating complexity.
2. **Kustomize for First-Party:** We use Kustomize exclusively for our own code (e.g., Memory API, Hub Portal). It keeps YAML declarative and clean, using overlays and patches to handle environment-specific variations (like injecting `-dev` domains for local Ingresses).
3. **Orchestrator Decoupling:** In our local environment (Skaffold) and production environment (ArgoCD), we define Helm and Kustomize as parallel, distinct renderers.

### Traefik RBAC Example

Instead of using Kustomize JSON patches to alter Helm-generated resources (like we previously did with Traefik's `endpointslices` and `nodes` permissions), we inject these permissions natively via Helm's `extraObjects` block in `traefik-values.yaml`. This completely decouples Kustomize from Traefik.
