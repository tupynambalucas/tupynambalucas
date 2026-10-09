<context-hierarchy>
  <parent src="../AGENTS.md" type="global-rules" />
</context-hierarchy>

# Bounded Context: Kubernetes Orchestration

This workspace (`k8s/`) manages the centralized Kubernetes orchestration, GitOps deployment manifests, and localized Skaffold environments for the `tupynambalucas.dev` monorepo.

## 1. Directory Architecture

- **`skaffold.yaml`**: The root orchestration manifest that includes the hub and corporate modules.
- **`skaffold.hub.yaml`**: Orchestration for the hub stack (tools, observability, cortex, studio).
- **`skaffold.corporate.yaml`**: Orchestration for the corporate stack (portal, api, web).
- **`manifests/`**: Base Kubernetes manifests.
  - **`namespaces/`**: Namespace definitions.
  - **`hub/`**: Manifests for internal observability, networking, AI cortex, and design studio.
  - **`corporate/`**: Manifests for public-facing products.
- **`charts/`**: Vendored Helm charts (e.g., Traefik, AgentGateway).
- **`overlays/`**: Kustomize overlays.
  - **`dev/`**: Overlays for local development targeting `k3d-hub` and `k3d-corporate`.
  - **`staging/`**: Cloud staging configurations.
  - **`prod/`**: Cloud production configurations.
- **`references/`**: Technical references and setup guides.

## 2. Infrastructure Modularity

The infrastructure is broken down into two isolated environments that deploy to separate k3d clusters in development, eliminating cross-cluster runtime dependencies and port contention:

- **Hub**: Deploys to `k3d-hub`. Contains observability, Traefik, Cloudflared tunnel, Cortex MCP, and Studio tools.
- **Corporate**: Deploys to `k3d-corporate`. Contains the main API, web frontend, and Docusaurus portal.

## 3. Operational Constraints

- Agents MUST NEVER recreate `docker-compose` files. All deployments are orchestrated purely via Kubernetes and Skaffold.
- Base manifests in `manifests/` MUST NOT contain environment-specific values. Ingress hosts, replicas, and resources are set via `overlays/`.
- Local development utilizes `k3d`, not `minikube`.
- Overlays MUST use `resources` and `patches` (not deprecated `bases` or `patchesStrategicMerge`).
