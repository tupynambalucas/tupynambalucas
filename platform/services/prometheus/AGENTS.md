# Local Context: Prometheus Metrics Storage Service

This service directory ([prometheus/](./)) manages metric storage and PromQL query resolution for Monorepo applications and Kubernetes infrastructure.

---

## 1. Directory Layout

- **[prometheus.yml](./prometheus.yml)**: Prometheus scrape targets and global telemetry settings.
- **[Dockerfile](./Dockerfile)**: Prometheus server image build based on `prom/prometheus`.

---

## 2. Guardrails & Architecture Rules

- **Execution Port**: Prometheus internally exposes port `9090`. Inside Kubernetes and Docker Compose, this MUST be mapped to port `9090` on the Service definition.
- **Scrape Target Rules**: Infrastructure metrics endpoints MUST be registered in [prometheus.yml](./prometheus.yml).
