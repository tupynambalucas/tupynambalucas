# Monorepo Platform Infrastructure

This workspace houses the containerized platform services that power the local development environment, telemetry pipelines, and Turborepo build caching for `tupynambalucas.dev`.

## Architecture Overview

The platform workspace manages three core runtime services:

1. **AgentGateway**: A Go-based federation proxy that acts as the entry point for Model Context Protocol (MCP) clients. It routes and aggregates commands sent to downstream MCP containers.
2. **otel-collector**: An OpenTelemetry Collector that aggregates telemetry metrics, logs, and distributed traces, exporting them to Grafana Cloud and Sentry.
3. **turbocache**: A high-performance local cache server that stores Turborepo cache artifacts, drastically speeding up compilation and testing pipelines.

## Directory Layout

- **[infrastructure/docker/](./infrastructure/docker/)**: Contains multi-profile Docker Compose configurations (`compose.yaml`, `compose.override.yaml`, `compose.prod.yaml`) and environment files (`.env.*`).
- **[services/agentgateway/](./services/agentgateway/)**: Contains configuration files (`config.yaml`) for the AgentGateway federation tool.
- **[services/monitor/](./services/monitor/)**: Contains configuration schemas and routing logic for the OTLP Collector.
- **[services/turbocache/](./services/turbocache/)**: Contains build rules and Dockerfiles for compilation cache.

## Local Operations

Commands must be run from the repository root directory:

| Environment     | Action      | Command                       |
| :-------------- | :---------- | :---------------------------- |
| **Development** | Start Stack | `pnpm platform:dev:up`        |
| **Development** | Stop Stack  | `pnpm platform:dev:down`      |
| **Development** | Reset Data  | `pnpm platform:dev:reset`     |
| **Production**  | Start Stack | `pnpm platform:prod:up`       |
| **Production**  | Stop Stack  | `pnpm platform:prod:down`     |
| **Production**  | Reset Data  | `pnpm platform:prod:reset`    |
| **Staging**     | Start Stack | `pnpm platform:staging:up`    |
| **Staging**     | Stop Stack  | `pnpm platform:staging:down`  |
| **Staging**     | Reset Data  | `pnpm platform:staging:reset` |
