# Tempo Distributed Tracing Service

The `platform/services/tempo` workspace provides Grafana Tempo distributed trace storage and TraceQL querying for the %PROJECT_DOMAIN% platform.

---

## Technology Stack

- **Base Image**: `grafana/tempo:2.5.0`
- **Query Port**: `3200`
- **Ingress Ports**: `4317` (OTLP gRPC), `4318` (OTLP HTTP)

---

## Architecture & Integration

- **Ingestion**: Ingests OTLP traces from the OpenTelemetry Collector at `http://tempo:4318`.
- **Query Processing**: Grafana queries distributed traces and spans from Tempo at `http://tempo:3200`.
- **Configuration**: Managed declaratively in [tempo-config.yaml](./tempo-config.yaml).

---

## Getting Started

Tempo starts automatically with the platform stack:

```bash
# Kubernetes development mode
pnpm platform:dev

# Standalone Docker Compose mode
pnpm platform:up
```
