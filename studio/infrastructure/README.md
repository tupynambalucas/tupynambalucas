# Studio Infrastructure & Deployment

The `studio/infrastructure/` directory contains orchestration configurations, container definitions, environment templates, and Kubernetes cluster manifests for the Studio workspace.

---

## Technology Stack

- **Orchestration**: Kubernetes v1.30+, Kustomize, Skaffold v4beta11, Podman / Docker Compose
- **Design Services**: Penpot v2 (Frontend, Backend, Exporter, Valkey, Aide AI Assistant)
- **Knowledge Capture**: Memos
- **Ingress**: Traefik v3.1 Ingress Controller (via `platform` namespace)
- **TLS**: cert-manager (Let's Encrypt DNS-01)
- **Secrets Management**: Kustomize SecretGenerator (`studio-secrets`) from `.env`

---

## Directory Structure

```
infrastructure/
├── .env.example          # Studio environment template
├── AGENTS.md             # Agent routing and infrastructure guardrails
├── README.md             # Infrastructure technical overview
├── docker/
│   └── compose.yaml      # Multi-service Docker Compose configuration
└── kubernetes/
    ├── certmanager.yaml  # Wildcard TLS certificate manifest
    ├── kustomization.yaml# Kustomize entry point and secret generator
    ├── memos.yaml        # Memos Deployment, PVC, Service, and Ingress
    ├── namespace.yaml    # Dedicated studio namespace manifest
    └── penpot.yaml       # Penpot Deployments, PVC, Services, and Ingress
```

---

## Deployment Modes

### 1. Kubernetes with Skaffold (Local Development)

Skaffold launches Studio resources in the `studio` namespace and automatically boots the required `platform-dev` module:

```bash
pnpm studio:dev
```

### 2. Standalone Containers with Docker Compose

For local standalone execution without Kubernetes:

```bash
pnpm studio:up
```

To stop containers:

```bash
pnpm studio:down
```
