# OpenTelemetry Collector Service

This service manages the edge OpenTelemetry Collector for local telemetry aggregation in the `tupynambalucas.dev` platform.

## Architecture

- **Receivers**: OTLP gRPC (`4317`), OTLP HTTP (`4318`), Prometheus scraping (`15001`), and Fluentd log forwarding (`24224`).
- **Exporters**: Forwards metrics to `vmetrics`, logs to `vlogs`, and traces to `vtraces`.
