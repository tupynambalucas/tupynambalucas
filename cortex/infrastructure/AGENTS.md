<context-hierarchy>
  <parent src="../../AGENTS.md" type="global-rules" />
  <parent src="../AGENTS.md" type="bounded-context-rules" />
  <system-instruction>
    AGENT: If you have not read "../../AGENTS.md" and "../AGENTS.md" in this session, stop now
    and read both files using your file-reading tools before proceeding.
  </system-instruction>
</context-hierarchy>

# Local Context: AI Cortex Infrastructure & Deployment

This workspace directory ([infrastructure/](./)) contains orchestration configurations, container definitions, environment templates, and Kubernetes manifests for the AI Cortex subsystem.

---

## 1. Directory Layout

- **[docker/](./docker/)**: Docker Compose orchestration definitions ([compose.yaml](./docker/compose.yaml)).
- **[kubernetes/](./kubernetes/)**: Production and development Kubernetes manifests ([kustomization.yaml](./kubernetes/kustomization.yaml)):
  - **[namespace.yaml](./kubernetes/namespace.yaml)**: Defines the dedicated `cortex` Kubernetes namespace.
  - **[gateway.yaml](./kubernetes/gateway.yaml)**: `agentgateway` Deployment, Services (traffic, metrics), and Traefik Ingress route.
  - **[memory.yaml](./kubernetes/memory.yaml)**: `mongodb-db`, `memory-api`, and `memory-web` Deployments and Services.
  - **[mcp.yaml](./kubernetes/mcp.yaml)**: `mcp-guardrails`, `mcp-memory`, `mcp-github`, `mcp-firecrawl`, `mcp-grafana`, `mcp-inspector`, and `mcp-playwright` Deployments and Services.
  - **[certmanager.yaml](./kubernetes/certmanager.yaml)**: Wildcard TLS Certificate definition for `*.lan.tupynambalucas.dev`.
- **[.env.example](./.env.example)**: Central environment variable template for Cortex services.

---

## 2. Operational & Orchestration Guardrails

- **Kustomize Secret & ConfigMap Generation**: All Kubernetes deployments consume sensitive credentials from the `cortex-secrets` Secret (generated dynamically from [infrastructure/.env](./.env)) and gateway configuration from `agentgateway-config` (generated from [gateway/config.yaml](../gateway/config.yaml)).
- **Compose Profile Scoping**: Docker Compose services MUST be scoped using profile flags:
  - `core`: Ingress gateway, guardrails, and core services.
  - `memory`: MongoDB database, Fastify API, React web client, and MCP memory adapter.
  - `mcp`: Downstream MCP service containers (github, firecrawl, grafana, playwright, inspector).
- **Environment Parity**: Always mirror updates in [.env.example](./.env.example) whenever introducing new container environment variables.
- **Volume Mappings**: Persistent database data MUST be bound to named volumes (`tupynambalucas-cortex-mongodb-data` or Kubernetes PV/PVC).
