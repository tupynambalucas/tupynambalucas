# Monorepo Platform Services Workspace

The `platform/` workspace provides always-on operational infrastructure, observability pipelines, cluster administration dashboards, and Turborepo remote build caching for the tupynambalucas.dev monorepo.

---

## Technology Stack

- **Ingress & Networking**: Traefik v3.1 Ingress Controller, Cloudflare Tunnel (`cloudflared`), cert-manager (Let's Encrypt DNS-01)
- **Telemetry Ingestion**: OpenTelemetry Collector Contrib (`otelcol-contrib`)
- **Metrics**: Prometheus Server, Kube State Metrics (`kube-state-metrics:v2.12.0`), cAdvisor
- **Logs**: Grafana Loki
- **Distributed Traces**: Grafana Tempo
- **Visualization**: Grafana, Headlamp Kubernetes Web UI
- **Build Optimization**: Ducktors Turborepo Remote Cache (`turbocache`)
- **Orchestration**: Kubernetes, Kustomize, Skaffold, Podman / Docker Compose

---

## Bounded Context Architecture

Platform organizes the core infrastructure into modular service directories:

1. **[infrastructure/](./infrastructure/README.md)**: Centralized Docker Compose profiles, Kubernetes deployment manifests, cert-manager resources, and Ingress routing rules ([infrastructure/README.md](./infrastructure/README.md)).
2. **[services/grafana/](./services/grafana/README.md)**: Grafana visualization server, pre-configured datasources, and provisioned telemetry dashboards ([services/grafana/README.md](./services/grafana/README.md)).
3. **[services/headlamp/](./services/headlamp/README.md)**: Extensible, tokenless Kubernetes Web UI dashboard for cluster administration ([services/headlamp/README.md](./services/headlamp/README.md)).
4. **[services/otelcol/](./services/otelcol/README.md)**: Edge OpenTelemetry Collector pipelines for log, metric, and trace aggregation ([services/otelcol/README.md](./services/otelcol/README.md)).
5. **[services/prometheus/](./services/prometheus/README.md)**: Prometheus time-series metric storage and PromQL query server ([services/prometheus/README.md](./services/prometheus/README.md)).
6. **[services/loki/](./services/loki/README.md)**: Grafana Loki log aggregation and LogQL query service ([services/loki/README.md](./services/loki/README.md)).
7. **[services/tempo/](./services/tempo/README.md)**: Grafana Tempo distributed trace storage and TraceQL query service ([services/tempo/README.md](./services/tempo/README.md)).
8. **[services/turbocache/](./services/turbocache/README.md)**: High-performance containerized Turborepo Remote Cache server ([services/turbocache/README.md](./services/turbocache/README.md)).

---

## Getting Started

### 1. Configure Environment Variables

Create the `.env` configuration file in `platform/infrastructure/` from the provided template:

```bash
cp platform/infrastructure/.env.example platform/infrastructure/.env
```

Configure sensitive tokens (e.g. `CLOUDFLARE_API_TOKEN`, `CLOUDFLARE_TUNNEL_TOKEN`, `TURBO_TOKEN`, `GRAFANA_ADMIN_PASSWORD`) inside [platform/infrastructure/.env](./infrastructure/.env).

### 2. Kubernetes Dev Mode (Hot-Reload)

To build, deploy, and automatically sync telemetry and dashboard changes inside the local Kubernetes cluster:

```bash
pnpm platform:dev
```

This command deploys all services into the `platform` namespace and handles cert-manager CRD provisioning hooks via Skaffold.

### 3. Standalone Containers (Docker Compose / Podman)

To run the platform services using standalone container profiles:

```bash
pnpm platform:up
```

To monitor logs or stop the environment:

- View active logs: `pnpm platform:logs`
- Stop containers: `pnpm platform:down`
- Reset environment: `pnpm platform:reset`

---

## Key Scripts

| Command               | Description                                                            |
| :-------------------- | :--------------------------------------------------------------------- |
| `pnpm platform:dev`   | Starts local Kubernetes cluster with live sync via Skaffold.           |
| `pnpm platform:clean` | Deletes deployed platform resources and prunes container build caches. |
| `pnpm platform:stop`  | Tears down Kubernetes deployments and standalone containers.           |
| `pnpm platform:up`    | Boots standalone Docker Compose platform services.                     |
| `pnpm platform:down`  | Stops and removes all Docker Compose platform containers.              |
| `pnpm platform:logs`  | Streams live container logs across platform services.                  |
| `pnpm platform:reset` | Restarts the Docker Compose stack cleanly.                             |
