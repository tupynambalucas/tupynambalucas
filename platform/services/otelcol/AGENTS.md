# Local Context: OpenTelemetry Collector Monitoring Service

This service directory ([otel-collector/](./)) aggregates metrics, logs, and distributed traces from all monorepo applications.

---

## 1. Directory Layout

- **[config.yaml](./config.yaml)**: Configures OTLP receivers, batch processors, and exporters to VictoriaMetrics, VictoriaLogs, and VictoriaTraces.
- **[Dockerfile](./Dockerfile)**: Sets up the OpenTelemetry Collector image using `otel/opentelemetry-collector-contrib`.

---

## 2. Guardrails & Architecture Rules

- **Telemetry Ingress**: Applications MUST route metrics, logs, and traces using OTLP protocol over gRPC (`4317`) or HTTP (`4318`).
- **Exporter Targets**: Forward metrics to `vmetrics` (`:8428`), logs to `vlogs` (`:9428`), and traces to `vtraces` (`:10428`).
- **Service Name Injection**: Inject proper resource properties such as `service.name` at the receiver/processor level to allow easy telemetry filtering on the dashboards.
