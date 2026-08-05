# Tempo Service

This service manages Grafana Tempo distributed tracing for the `tupynambalucas.dev` platform.

## Architecture

- **Ingestion**: OTLP HTTP (`4318`) / OTLP gRPC (`4317`).
- **Visualization**: Grafana queries traces from Tempo at `http://tempo:3200`.
