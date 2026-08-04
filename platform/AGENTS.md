# Local Context: Monorepo Platform Infrastructure Router

This workspace context ([platform/](./)) centralizes and manages the operational, always-running platform utilities supporting local development, continuous integration, telemetry aggregation, and cluster monitoring.

---

## 1. Directory Layout

- **[services/grafana/](./services/grafana/)**: Local Grafana instance for infrastructure monitoring and metric visualization ([services/grafana/AGENTS.md](./services/grafana/AGENTS.md)).
- **[services/headlamp/](./services/headlamp/)**: Tokenless Kubernetes Web UI dashboard for cluster-wide visualization ([services/headlamp/AGENTS.md](./services/headlamp/AGENTS.md)).
- **[services/otpl/](./services/otpl/)**: Edge OpenTelemetry Collector configuration for aggregating logs, metrics, and traces ([services/otpl/AGENTS.md](./services/otpl/AGENTS.md)).
- **[services/prometheus/](./services/prometheus/)**: Local Prometheus metrics collection and storage server ([services/prometheus/AGENTS.md](./services/prometheus/AGENTS.md)).
- **[services/turbocache/](./services/turbocache/)**: High-performance containerized Remote Cache service for Turborepo builds ([services/turbocache/AGENTS.md](./services/turbocache/AGENTS.md)).
- **[infrastructure/](./infrastructure/)**: System orchestration, Docker compose, and Kubernetes infrastructure router context ([infrastructure/AGENTS.md](./infrastructure/AGENTS.md)).

---

## 2. Operational & Container Networking Guardrails

- **Credential Separation**: Never hardcode API keys, access tokens, or personal identifiers. All
  configuration parameters MUST be loaded via local environment files
  ([.env](./infrastructure/.env)) and mapped into container environments via `platform-secrets`
  in Kubernetes or `--env-file` in Docker Compose.
- **Service Independence**: Services in this workspace should expose generic endpoints and avoid
  tight coupling with specific application logic.
- **Internal Telemetry**: The OpenTelemetry Collector (`otel-collector`) serves as the single entry
  point for developer telemetry. All runtime platform applications MUST forward stats using OTLP
  protocols.
- **Volume Persistence**: Turborepo cache files and OpenTelemetry state directories must map to
  local host directories to prevent data loss between rebuilds.

---

## 3. Operations Commands Summary

Manage the Platform environments using the mapped root execution scripts:

| Platform / Subsystem        | Up / Dev Command    | Down / Clean Command  | Reset Command         |
| :-------------------------- | :------------------ | :-------------------- | :-------------------- |
| **Docker Compose (Podman)** | `pnpm platform:up`  | `pnpm platform:down`  | `pnpm platform:reset` |
| **Kubernetes (Skaffold)**   | `pnpm platform:dev` | `pnpm platform:clean` | `pnpm platform:stop`  |
