# Local Context: Loki Log Aggregation Service

This service directory ([loki/](./)) manages log aggregation and LogQL query resolution for Monorepo applications and Kubernetes infrastructure.

---

## 1. Directory Layout

- **[loki-config.yaml](./loki-config.yaml)**: Local Loki storage schema and server settings.
- **[Dockerfile](./Dockerfile)**: Loki server image build based on `grafana/loki`.

---

## 2. Guardrails & Architecture Rules

- **Execution Port**: Loki internally exposes port `3100`. Inside Kubernetes and Docker Compose, this MUST be mapped to port `3100` on the Service definition.
- **Log Ingestion**: OpenTelemetry Collector and Fluentd forward logs to `http://loki:3100/loki/api/v1/push`.
