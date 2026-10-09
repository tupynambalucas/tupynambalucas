<context-hierarchy>
  <parent src="../AGENTS.md" type="global-rules" />
  <system-instruction>
    AGENT: You are operating in the Kubernetes Orchestration bounded context. If you have not read "../AGENTS.md" in this session, stop now and read it using your
    file-reading tools before proceeding. Global constraints are mandatory.
  </system-instruction>
</context-hierarchy>

# Bounded Context: Kubernetes Orchestration

This workspace (`k8s/`) manages the centralized Kubernetes orchestration, GitOps deployment manifests, and localized Skaffold environments for the `tupynambalucas.dev` monorepo.

## Architecture

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
- **`references/`**: Authoritative GitOps (Helm/Kustomize) documentation and technical references.

## Scoped Guardrails

The infrastructure is broken down into two isolated environments that deploy to separate k3d clusters in development, eliminating cross-cluster runtime dependencies and port contention:

- **Hub**: Deploys to `k3d-hub`. Contains observability, Traefik, Cloudflared tunnel, Cortex MCP, and Studio tools.
- **Corporate**: Deploys to `k3d-corporate`. Contains the main API, web frontend, and Docusaurus portal.

- Agents MUST NEVER recreate `docker-compose` files. All deployments are orchestrated purely via Kubernetes and Skaffold.
- Base manifests in `manifests/` MUST NOT contain environment-specific values. Ingress hosts, replicas, and resources are set via `overlays/`.
- Local development utilizes `k3d`, not `minikube`.
- Overlays MUST use `resources` and `patches` (not deprecated `bases` or `patchesStrategicMerge`).

## Required Skills

When interacting with, querying, or modifying infrastructure in this bounded context, agents MUST utilize the following skills from the `k8s-expert` plugin:

- **`k8s-docs-analyzer`**: MUST be used to analyze existing documentation in `references/` before making or proposing infrastructure changes to ensure compliance with our GitOps standards.
- **`k8s-docs-manager`**: MUST be used whenever new K8s insights are discovered or architectural changes occur (e.g., Separation of Deployers). The agent must use this skill to update the Diátaxis folders in `references/` to reflect the new state.
