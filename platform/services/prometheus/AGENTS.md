# Local Context: Prometheus Metrics Storage Service

This service directory ([prometheus/](./)) manages metric ingestion, PromQL resolution, and time-series storage for the tupynambalucas.dev platform.

---

## 1. Directory Layout

- **[src/prometheus.yml](./src/prometheus.yml)**: Scrape configuration targeting local Prometheus metrics and AgentGateway telemetry (`agentgateway-metrics.cortex.svc.cluster.local:15001`).
- **[Dockerfile](./Dockerfile)**: Prometheus container packaging enabling `--web.enable-remote-write-receiver` and 30-day TSDB retention.

---

## 2. Guardrails & Architecture Rules

- **Execution Port**: Prometheus internally listens on port `9090`. Inside Kubernetes, it is mapped via Service `prometheus` on port `9090`.
- **Remote Write Receiver**: Configured with `--web.enable-remote-write-receiver` to accept batched metric pushes from `otelcol` at `/api/v1/write`.
- **Storage Persistence**: Time-series metric data is persisted via PersistentVolumeClaim `prometheus-pvc` (1Gi) mapped to `/prometheus`.
- **Live Syncing**: In Skaffold development mode, changes inside `src/` are synced directly into `/etc/prometheus` inside the container.
