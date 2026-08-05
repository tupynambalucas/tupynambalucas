# Monorepo Platform Services Workspace

Platform is the Bounded Context for the operational, always-running platform utilities supporting local development, telemetry aggregation, build caching, and cluster visualization for `tupynambalucas.dev`.

---

## Bounded Context Architecture

Platform organizes the system-wide utility services into modular domains:

1. **[services/grafana/](./services/grafana/)**: Local Grafana instance for infrastructure monitoring and metric visualization ([services/grafana/README.md](./services/grafana/README.md)).
2. **[services/headlamp/](./services/headlamp/)**: Tokenless Kubernetes Web UI dashboard for cluster-wide visualization ([services/headlamp/README.md](./services/headlamp/README.md)).
3. **[services/otel-collector/](./services/otel-collector/)**: Edge OpenTelemetry Collector configuration for aggregating logs, metrics, and traces ([services/otel-collector/README.md](./services/otel-collector/README.md)).
4. **[services/prometheus/](./services/prometheus/)**: Prometheus server for metric collection and PromQL storage ([services/prometheus/README.md](./services/prometheus/README.md)).
5. **[services/loki/](./services/loki/)**: Grafana Loki log aggregation server ([services/loki/README.md](./services/loki/README.md)).
6. **[services/tempo/](./services/tempo/)**: Grafana Tempo distributed trace storage server ([services/tempo/README.md](./services/tempo/README.md)).
7. **[services/turbocache/](./services/turbocache/)**: High-performance containerized Remote Cache service for Turborepo builds ([services/turbocache/README.md](./services/turbocache/README.md)).
8. **[infrastructure/](./infrastructure/)**: Centralized Docker compose profiles and Kubernetes deployment manifests ([infrastructure/README.md](./infrastructure/README.md)).

---

## Development Setup & Operations

Platform services can be orchestrated using either Docker Compose (via Podman/Docker) for local standalone execution or Kubernetes (via Minikube and Skaffold) for developer environments. Centralized configuration parameters are managed inside the [platform/infrastructure/.env](./infrastructure/.env) file.

### 1. Kubernetes & Skaffold (Hot-Reload Dev Cycle)

To build, deploy, and automatically sync changes to the local Kubernetes cluster:

```bash
pnpm platform:dev
```

This command spins up the telemetry gateway, build caches, Ingress proxies, and dashboard interfaces in the `platform` namespace.

### 2. Standalone Containers (Docker Compose / Podman)

To build and start the standalone container ecosystem:

```bash
pnpm platform:up
```

To view logs or stop the environment:

- View active logs: `pnpm platform:logs`
- Tear down the stack: `pnpm platform:down`
