# Local Context: Prometheus Metrics Service

This service directory ([prometheus/](./)) manages metrics collection and storage configs for
aggregating telemetry from local Monorepo services.

---

## 1. Directory Layout

- **[Dockerfile](./Dockerfile)**: Sets up the Prometheus scraper using the official
  `prom/prometheus` base image.
- **[config.yaml](./config.yaml)**: Holds scrape target definitions, including localhost and the
  edge OTel Collector.

---

## 2. Guardrails & Architecture Rules

- **Execution Port**: The server internally exposes port `9090`. Inside Kubernetes, this must be
  mapped to port `9090` on the Service definition.
- **OTel Scrape Integration**: Prometheus collects all telemetry by scraping the OTel Collector's
  exporter endpoint (`otel-collector:8889`) rather than connecting to each individual microservice
  directly.
- **Configuration Flow**: Any changes to scrape rules must be declared inside `config.yaml`. Inside
  Kubernetes, this file is dynamically mapped to a ConfigMap using the Kustomize
  `configMapGenerator`.
