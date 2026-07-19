# Local Context: Monorepo Platform Infrastructure

This workspace ([platform/](./)) centralizes and manages the operational, always-running platform utilities supporting local development, continuous integration, and telemetry aggregation.

---

## Local Architecture & Directory Map

- **[services/monitor/](./services/monitor/)**: Edge OpenTelemetry Collector configuration for aggregating logs, metrics, and distributed traces.
- **[services/turbocache/](./services/turbocache/)**: High-performance containerized Remote Cache service for Turborepo builds.
- **[infrastructure/docker/compose.yaml](./infrastructure/docker/compose.yaml)**: Docker Compose orchestration declaring network topologies and secrets mapping.

---

## Platform Guardrails

1. **Service Independence**: Services in this workspace should expose generic endpoints and avoid tight coupling with specific application logic.
2. **Docker Orchestration**: Always launch services using the scoped commands defined below. Never run container dependencies manually.
3. **Internal Telemetry**: The OpenTelemetry Collector (`otel-collector`) serves as the single entry point for developer telemetry. All runtime platform applications MUST forward stats using OTLP protocols.
4. **Volume Persistence**: Turborepo cache files and OpenTelemetry state directories must map to local host directories to prevent data loss between rebuilds.

---

## Scoped Commands

Run these scripts from the monorepo root:

- `pnpm platform:up`: Boots platform containers in the background.
- `pnpm platform:down`: Stops and tears down the platform stack.
- `pnpm platform:reset`: Purges platform volumes and restarts the stack with clean states.
