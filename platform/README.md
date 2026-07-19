# Monorepo Platform Infrastructure

This workspace houses the containerized platform services that power the local development environment, telemetry pipelines, and Turborepo build caching for `tupynambalucas.dev`.

## Architecture Overview

The platform workspace manages two core runtime services:

1. **otel-collector**: An OpenTelemetry Collector that aggregates telemetry metrics, logs, and
   distributed traces, exporting them to Grafana Cloud and Sentry.
2. **turbocache**: A high-performance local cache server that stores Turborepo cache artifacts,
   drastically speeding up compilation and testing pipelines.

## Directory Layout

- **[infrastructure/docker/](./infrastructure/docker/)**: Contains the Docker Compose
  configuration ([compose.yaml](./infrastructure/docker/compose.yaml)) and environment files
  ([.env](./infrastructure/docker/.env)).
- **[services/monitor/](./services/monitor/)**: Contains configuration schemas and routing logic for the OTLP Collector.
- **[services/turbocache/](./services/turbocache/)**: Contains build rules and Dockerfiles for compilation cache.

## Local Operations

Commands must be run from the repository root directory:

| Action      | Command               |
| :---------- | :-------------------- |
| Start Stack | `pnpm platform:up`    |
| Stop Stack  | `pnpm platform:down`  |
| Reset Data  | `pnpm platform:reset` |
