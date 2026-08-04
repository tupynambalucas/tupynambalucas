# OpenTelemetry Collector Monitoring Service

The `otpl/` directory manages configuration routing for the local platform telemetry ingestion layer.

---

## Service Overview

1. **[config.yaml](./config.yaml)**: Configures OpenTelemetry pipelines (metrics, logs, traces) defining gRPC and HTTP receivers on ports `4317`/`4318` and exporting traces to Grafana Cloud.
