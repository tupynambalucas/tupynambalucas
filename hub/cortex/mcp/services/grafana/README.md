# Grafana MCP Service

The `cortex/mcp/services/grafana` workspace provides the containerized Grafana Model Context Protocol (MCP) server for cluster observability, metric analysis, log querying, distributed tracing, and continuous profiling.

---

## Technology Stack

- **Base Image**: `grafana/mcp-grafana:latest`
- **Transport**: Streamable HTTP on port `8080`
- **Integrations**: Grafana, Prometheus / VictoriaMetrics, Grafana Loki, Grafana Tempo, Grafana Pyroscope

---

## Features

- **Metric Intelligence**: Instant and range PromQL querying over metrics.
- **Log Stream Analysis**: LogQL stream filtering and error pattern extraction from Loki.
- **Distributed Traces**: TraceQL search and span analysis in Tempo.
- **Continuous Profiling**: Flamegraph retrieval from Pyroscope.
- **Dashboard & Alerting**: Dashboard search, inspection, and alert route management.

---

## Configuration & Environment

| Variable                        | Default               | Purpose                                         |
| :------------------------------ | :-------------------- | :---------------------------------------------- |
| `GRAFANA_URL`                   | `http://grafana:3000` | Target Grafana instance URL                     |
| `GRAFANA_SERVICE_ACCOUNT_TOKEN` | -                     | Service account bearer token for authentication |
| `GRAFANA_ORG_ID`                | `1`                   | Organization identifier                         |
