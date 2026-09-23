<context-hierarchy>
  <parent src="../AGENTS.md" type="global-rules" />
</context-hierarchy>

# Bounded Context: Centralized Infrastructure

This workspace (`infrastructure/`) manages the centralized Kubernetes orchestration, GitOps deployment pipeline, and localized Skaffold environments for the `%PROJECT_DOMAIN%` monorepo.

## 1. Directory Architecture

- **`skaffold.yaml`**: The master orchestration manifest defining all container build contexts (using relative paths) and modular execution profiles (Platform, Cortex, Studio).
- **`manifests/`**: Base Kubernetes manifests (Namespaces, Deployments, Services, ConfigMaps, Ingresses) used across all environments.
- **`environments/`**: Kustomize overlays.
  - **`local/`**: Configured for local `minikube` development (uses `.dev` domains via tunnel, unencrypted HTTP internal routing, hot-reload configurations).
  - **`prod/`**: Configured for production deployment (uses proper domains, TLS enforcement, production replica sets).
- **`charts/`**: Local cache of essential Helm charts (e.g., Traefik) required for bootstrapping before external Helm repositories are available.

## 2. Infrastructure Modularity

The infrastructure is broken down into modules that can be executed independently or as a whole:

- **`platform-dev`**: Always-on cluster infrastructure (Traefik, Cloudflare Tunnel, Cert-Manager, OpenTelemetry, Grafana, Loki, Prometheus, Tempo, Turbocache, Headlamp).
- **`cortex-dev`**: AI processing hub (AgentGateway, MCP Services, Memory Vectors). _Automatically requires `platform-dev`._
- **`studio-dev`**: Collaborative design tools (Penpot, Memos). _Automatically requires `platform-dev`._

## 3. Operational Constraints

- Agents MUST NEVER recreate `docker-compose` files. All deployments are orchestrated purely via Kubernetes and Skaffold.
- Agents MUST use `pnpm --filter @monorepo/infrastructure ...` for all infrastructure operations.
- Modifications to Traefik routing MUST be done through `IngressRoute` CRDs or Helm values, avoiding standard `Ingress` mappings to internal Traefik APIs.
- PIDs limit constraint: When deploying locally on Windows Podman, keep heavy observability stacks scaled down or modular if the machine is low on resources.
