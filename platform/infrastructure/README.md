# Platform Infrastructure & Deployment

The `platform/infrastructure/` directory contains orchestration configurations, container definitions, environment templates, and Kubernetes cluster manifests for the platform layer.

---

## Technology Stack

- **Orchestration**: Kubernetes v1.30+, Kustomize, Skaffold v4beta11, Podman / Docker Compose
- **Ingress & TLS**: Traefik v3.1 Ingress Controller, cert-manager (Let's Encrypt DNS-01 via Cloudflare)
- **Tunnels & Edge**: Cloudflare Tunnel (`cloudflared`)
- **Networking**: `platform-net` bridge network, Kubernetes cluster networking
- **Secrets Management**: Kustomize SecretGenerator (`platform-secrets`, `cloudflare-api-token-secret`) from `.env`

---

## Directory Structure

```
infrastructure/
├── .env.example              # Central platform environment template
├── AGENTS.md                 # Agent routing and infrastructure guardrails
├── README.md                 # Infrastructure technical overview
├── docker/
│   └── compose.yaml          # Multi-service Docker Compose configuration
└── kubernetes/
    ├── certmanager.yaml      # ClusterIssuer DNS-01 ACME manifest
    ├── cloudflared.yaml      # Cloudflare Tunnel deployment manifest
    ├── grafana.yaml          # Grafana Deployment, PVC, Service, and Ingress
    ├── headlamp.yaml         # Headlamp Deployment, RBAC, Service, and Ingress
    ├── kubestatemetrics.yaml # Kube State Metrics exporter manifest
    ├── kustomization.yaml    # Kustomize entry point and secret generators
    ├── loki.yaml             # Grafana Loki Deployment, PVC, and Service
    ├── namespace.yaml        # Dedicated platform namespace manifest
    ├── otelcol.yaml          # OpenTelemetry Collector Deployment and RBAC
    ├── prometheus.yaml       # Prometheus Deployment, PVC, and Service
    ├── tempo.yaml            # Grafana Tempo Deployment, PVC, and Service
    ├── traefik.yaml          # Traefik Ingress Controller, RBAC, and LoadBalancer
    └── turbocache.yaml       # Turbocache Deployment, 5Gi PVC, and Ingress
```

---

## Deployment Modes

### 1. Kubernetes with Skaffold (Local Development)

Skaffold synchronizes code changes and builds container images dynamically inside the local Kubernetes cluster:

```bash
pnpm platform:dev
```

Key features in Kubernetes mode:

- Deployed into namespace `platform`.
- Traefik Ingress Controller routes traffic to Grafana, Headlamp, and Turbocache.
- Pre-deploy hooks automatically install and verify cert-manager CRDs.
- Live file syncing for Prometheus configurations, OtelCol pipelines, Grafana dashboards, and Headlamp kubeconfig.

### 2. Standalone Containers with Docker Compose

For local standalone execution without Kubernetes:

```bash
pnpm platform:up
```

To stop containers:

```bash
pnpm platform:down
```
