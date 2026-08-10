# Loki Log Aggregation Service

The `platform/services/loki` workspace provides Grafana Loki log aggregation, indexing, and LogQL search for the tupynambalucas.dev platform.

---

## Technology Stack

- **Base Image**: `grafana/loki:3.0.0`
- **Storage Engine**: TSDB Index with Filesystem Chunk Storage
- **Port**: `3100`

---

## Architecture & Integration

- **Ingestion Endpoint**: Receives OTLP log pushes from OpenTelemetry Collector at `http://loki:3100/loki/api/v1/push`.
- **Query Resolution**: Grafana queries log streams from Loki at `http://loki:3100`.
- **Configuration**: Managed declaratively in [loki-config.yaml](./loki-config.yaml).

---

## Getting Started

Loki starts automatically with the platform stack:

```bash
# Kubernetes development mode
pnpm platform:dev

# Standalone Docker Compose mode
pnpm platform:up
```
