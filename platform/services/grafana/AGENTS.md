# Local Context: Grafana Visualization Service

This service directory ([grafana/](./)) manages visualization, dashboard provisioning, and datasource configurations for the tupynambalucas.dev platform.

---

## 1. Directory Layout

- **[Dockerfile](./Dockerfile)**: Sets up Grafana runtime based on `grafana/grafana` with multi-stage targets (`dev` and `prod`).
- **[src/provisioning/datasources/datasources.yaml](./src/provisioning/datasources/datasources.yaml)**: Declarative datasource definitions for Prometheus (`http://prometheus:9090`), Loki (`http://loki:3100`), and Tempo (`http://tempo:3200`).
- **[src/provisioning/dashboards/dashboards.yaml](./src/provisioning/dashboards/dashboards.yaml)**: Automated dashboard provider settings scanning `/etc/grafana/provisioning/dashboards/sources`.
- **[src/provisioning/dashboards/sources/agentgateway-dashboard.json](./src/provisioning/dashboards/sources/agentgateway-dashboard.json)**: Provisioned telemetry dashboard for AgentGateway latency, request counts, and error rates.

---

## 2. Guardrails & Architecture Rules

- **Execution Port**: Grafana internally exposes port `3000`. Inside Kubernetes, this is routed via `grafana` Service (port `3000`) and exposed via Ingress at `grafana-dev.tupynambalucas.dev`.
- **Declarative Provisioning**: Dashboards and datasources MUST be maintained in code under [src/provisioning/](./src/provisioning/). Never configure datasources manually in the UI.
- **Permissions**: The Dockerfile MUST copy provisioning configurations using `grafana` user ownership (`--chown=grafana:grafana`).
- **Anonymous Authentication**: Configured with `GF_AUTH_ANONYMOUS_ENABLED=true` and `GF_AUTH_ANONYMOUS_ORG_ROLE=Admin` for friction-free local developer access.
- **Storage Persistence**: State and user customizations are persisted via PersistentVolumeClaim `grafana-pvc` mapped to `/var/lib/grafana`.
