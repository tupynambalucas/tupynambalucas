# Local Context: Tempo Distributed Tracing Service

This service directory ([tempo/](./)) manages distributed trace storage, WAL buffering, and TraceQL query resolution for the tupynambalucas.dev platform.

---

## 1. Directory Layout

- **[tempo-config.yaml](./tempo-config.yaml)**: Tempo storage schema, local WAL buffering, block compaction, and OTLP ingestion settings.
- **[Dockerfile](./Dockerfile)**: Container packaging based on `grafana/tempo:2.5.0`.

---

## 2. Guardrails & Architecture Rules

- **Execution Ports**: Tempo internally exposes HTTP query port `3200` and OTLP ingress ports `4317` (gRPC) / `4318` (HTTP).
- **Trace Ingestion**: OpenTelemetry Collector forwards distributed traces directly to `http://tempo:4318`.
- **Storage Persistence**: Traces and block files are persisted via PersistentVolumeClaim `tempo-pvc` (1Gi) mapped to `/tmp/tempo`.
- **Query Resolution**: Grafana queries traces from Tempo at `http://tempo:3200` using TraceQL expressions.
