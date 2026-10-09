# Grafana Visualization Service

The `platform/services/grafana` workspace contains container build definitions and declarative provisioning configurations for hosting Grafana within the platform cluster.

---

## Technology Stack

- **Base Image**: `grafana/grafana:latest`
- **Provisioned Datasources**: Prometheus (Metrics), Grafana Loki (Logs), Grafana Tempo (Traces)
- **Port**: `3000`
- **Ingress Domain**: `grafana-dev.tupynambalucas.dev`

---

## Service Overview

- **[Dockerfile](./Dockerfile)**: Multi-stage container packaging provisioning configurations and JSON dashboards into the image.
- **[src/provisioning/datasources/datasources.yaml](./src/provisioning/datasources/datasources.yaml)**: Connects Grafana to local Prometheus, Loki, and Tempo service endpoints.
- **[src/provisioning/dashboards/dashboards.yaml](./src/provisioning/dashboards/dashboards.yaml)**: Loads pre-configured dashboards automatically from disk.
- **[src/provisioning/dashboards/sources/agentgateway-dashboard.json](./src/provisioning/dashboards/sources/agentgateway-dashboard.json)**: Core dashboard for inspecting AgentGateway ingress traffic, latency percentiles, and tool invocation stats.

---

## Getting Started

Grafana starts automatically with the platform stack:

```bash
# Kubernetes development mode
pnpm platform:dev

# Standalone Docker Compose mode
pnpm platform:up
```

Access the UI at `http://localhost:3000` or `http://grafana-dev.tupynambalucas.dev`.
