# Local Context: Tempo Distributed Tracing Service

This service directory ([tempo/](./)) manages trace storage and TraceQL query resolution for Monorepo applications and Kubernetes infrastructure.

---

## 1. Directory Layout

- **[tempo-config.yaml](./tempo-config.yaml)**: Local Tempo storage schema and OTLP ingestion settings.
- **[Dockerfile](./Dockerfile)**: Tempo server image build based on `grafana/tempo`.

---

## 2. Guardrails & Architecture Rules

- **Execution Ports**: Tempo internally exposes HTTP query port `3200` and OTLP ingress ports `4317` (gRPC) / `4318` (HTTP).
- **Trace Ingestion**: OpenTelemetry Collector forwards traces directly to `http://tempo:4318` or `tempo:4317`.
