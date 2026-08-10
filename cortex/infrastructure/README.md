# AI Cortex Infrastructure & Orchestration

The `cortex/infrastructure/` directory manages deployment definitions, container orchestration, environment variable templates, and Kubernetes cluster manifests for the AI Cortex subsystem.

---

## Technology Stack

- **Orchestration**: Kubernetes v1.30+, Kustomize, Skaffold v4beta11, Podman / Docker Compose
- **Ingress & TLS**: Traefik Ingress Controller, cert-manager (Let's Encrypt Cloudflare DNS)
- **Container Networking**: `cortex-net` bridge network, Kubernetes cluster networking
- **Secrets Management**: Kustomize SecretGenerator (`cortex-secrets`) from `.env`

---

## Directory Structure

```
infrastructure/
├── .env.example              # Environment variables template
├── AGENTS.md                 # Agent routing and infrastructure guardrails
├── README.md                 # Infrastructure technical overview
├── docker/
│   └── compose.yaml          # Multi-profile Docker Compose configuration
└── kubernetes/
    ├── certmanager.yaml      # Wildcard TLS certificate manifest
    ├── gateway.yaml          # AgentGateway Deployment, Services, and Ingress
    ├── kustomization.yaml    # Kustomize entry point, SecretGenerator, ConfigMaps
    ├── mcp.yaml              # Downstream MCP tool adapters and Guardrails
    ├── memory.yaml           # MongoDB, Memory API, and Memory Web manifests
    └── namespace.yaml        # Dedicated cortex namespace manifest
```

---

## Deployment Modes

### 1. Kubernetes with Skaffold (Local Development)

Skaffold synchronizes code changes and rebuilds container images dynamically inside the local Kubernetes cluster:

```bash
pnpm cortex:dev
```

Key features in Kubernetes mode:

- Deployed to namespace `cortex`.
- Integrated with `agentgateway-ingress` for HTTP and MCP traffic.
- Automatic secret injection from `cortex/infrastructure/.env`.
- Live file syncing for `gateway/config.yaml` and `mcp.json`.

### 2. Standalone Containers with Docker Compose

For environments without Kubernetes, execute:

```bash
pnpm cortex:up
```

Profiles enabled by default: `core`, `mcp`, `memory`.

To stop the containers:

```bash
pnpm cortex:down
```
