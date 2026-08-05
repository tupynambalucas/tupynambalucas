# Prometheus Service

This service manages Prometheus metric collection and storage for the `tupynambalucas.dev` platform.

## Architecture

- **Ingestion**: Scrapes metrics from `agentgateway` (`:15001`) and OpenTelemetry Collector.
- **Visualization**: Grafana queries metrics from Prometheus at `http://prometheus:9090`.
