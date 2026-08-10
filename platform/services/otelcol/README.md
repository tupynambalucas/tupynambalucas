# OpenTelemetry Collector Service

The `platform/services/otelcol` workspace builds and manages the custom OpenTelemetry Collector (`otelcol-contrib`) responsible for telemetry aggregation across the tupynambalucas.dev platform.

---

## Technology Stack

- **Builder**: OpenTelemetry Collector Builder (`builder@v0.158.0`)
- **Runtime**: Distroless Base Image (`gcr.io/distroless/base:latest`)
- **Ingestion Ports**: `4317` (OTLP gRPC), `4318` (OTLP HTTP), `24224` (FluentForward)

---

## Pipeline Overview

1. **Metrics**: Ingests OTLP metrics and scrapes cAdvisor/Node/kube-state-metrics, batching and forwarding them to Prometheus via Remote Write (`http://prometheus.platform.svc.cluster.local:9090/api/v1/write`).
2. **Logs**: Ingests OTLP and FluentForward logs, attaches resource attributes (`service.name=agentgateway`), and forwards them to Grafana Loki (`http://loki:3100/loki/api/v1/push`).
3. **Traces**: Ingests OTLP traces and forwards them to Grafana Tempo (`http://tempo:4318`).

---

## Component Configuration

- **[src/builder-config.yaml](./src/builder-config.yaml)**: Manifest specifying the Go modules compiled into the custom collector binary.
- **[src/collector-config.yaml](./src/collector-config.yaml)**: Declarative pipeline definitions, scrape jobs, and exporter URLs.

---

## Getting Started

The OpenTelemetry Collector is launched automatically as part of the platform stack:

```bash
# Kubernetes development mode
pnpm platform:dev

# Standalone Docker Compose mode
pnpm platform:up
```
