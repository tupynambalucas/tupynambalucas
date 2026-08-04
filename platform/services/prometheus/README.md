# Prometheus Metrics Service

The `prometheus/` directory contains container orchestration rules to host a local Prometheus
instance.

---

## Service Overview

1. **[Dockerfile](./Dockerfile)**: Declares a custom build environment using the `prom/prometheus`
   base, pre-loading `config.yaml` as the default `prometheus.yml` setup inside the container.
2. **[config.yaml](./config.yaml)**: Defines global evaluation parameters and scraping targets to
   pull performance metrics from the OTel Collector.
