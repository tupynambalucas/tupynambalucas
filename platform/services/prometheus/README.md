# Prometheus Metrics Service

The `platform/services/prometheus` workspace provides time-series metric storage, PromQL query processing, and Remote Write receiving for the %PROJECT_DOMAIN% platform.

---

## Technology Stack

- **Base Image**: `prom/prometheus:latest`
- **Port**: `9090`
- **Features**: TSDB Storage, Remote Write Ingestion, Scrape Engine

---

## Architecture & Data Flow

- **Remote Write**: Accepts metrics from OpenTelemetry Collector (`otelcol`) at `http://prometheus:9090/api/v1/write`.
- **Target Scraping**: Scrapes internal Prometheus metrics and AgentGateway telemetry metrics via [src/prometheus.yml](./src/prometheus.yml).
- **Visualization**: Grafana queries metrics from Prometheus at `http://prometheus:9090`.

---

## Getting Started

Prometheus starts automatically with the platform stack:

```bash
# Kubernetes development mode
pnpm platform:dev

# Standalone Docker Compose mode
pnpm platform:up
```
