# Local Context: Loki Log Aggregation Service

This service directory ([loki/](./)) manages log aggregation, TSDB indexing, and LogQL query resolution for the tupynambalucas.dev platform.

---

## 1. Directory Layout

- **[loki-config.yaml](./loki-config.yaml)**: Loki server configuration specifying single-tenant auth, filesystem chunk storage, and 24h TSDB indexing.
- **[Dockerfile](./Dockerfile)**: Container packaging based on `grafana/loki:3.0.0`.

---

## 2. Guardrails & Architecture Rules

- **Execution Port**: Loki internally exposes HTTP port `3100`. Inside Kubernetes, it is mapped via Service `loki` on port `3100`.
- **Log Ingestion**: OpenTelemetry Collector forwards aggregated application and system logs to `http://loki:3100/loki/api/v1/push`.
- **Storage Persistence**: Log chunks and index files are persisted via PersistentVolumeClaim `loki-pvc` (1Gi) mapped to `/tmp/loki`.
- **Query Resolution**: Grafana communicates directly with Loki at `http://loki:3100` using LogQL syntax.
