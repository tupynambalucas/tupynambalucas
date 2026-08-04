# Local Context: OpenTelemetry Collector Monitoring Service

This service directory ([otpl/](./)) aggregates metrics, logs, and distributed traces from all monorepo applications.

---

## 1. Directory Layout

- **[config.yaml](./config.yaml)**: Configures OTLP receivers, batch processors, and exporters to Grafana Cloud.

---

## 2. Guardrails & Architecture Rules

- **Telemetry Ingress**: Applications MUST route metrics, logs, and traces using OTLP protocol over gRPC (`4317`) or HTTP (`4318`).
- **Exporter Secrets**: Exporters for third-party platforms (Grafana Cloud) MUST resolve values using system environment variables (`GRAFANA_CLOUD_OTLP_ENDPOINT`, `GRAFANA_CLOUD_TOKEN`). Never hardcode values in [config.yaml](./config.yaml).
- **Service Name injection**: Inject proper resource properties such as `service.name` at the receiver/processor level to allow easy telemetry filtering on the dashboards.
