# Loki Service

This service manages Grafana Loki log aggregation for the `tupynambalucas.dev` platform.

## Architecture

- **Ingestion**: Receives logs at `http://loki:3100/loki/api/v1/push`.
- **Visualization**: Grafana queries logs from Loki at `http://loki:3100`.
