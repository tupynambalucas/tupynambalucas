# %PROJECT_NAME% Infrastructure

Centralized Kubernetes orchestration and GitOps deployment pipeline for the `%PROJECT_DOMAIN%` ecosystem.

## Overview

This workspace replaces isolated Docker Compose configurations with a unified, Kubernetes-native approach using **Skaffold** and **Kustomize**. It provides real-time hot-reloading for local development and scalable deployments for production environments.

## Prerequisites

- **Minikube** (configured with the `podman` driver and at least 8GB RAM / 4 CPUs)
- **Skaffold** v4+
- **Kubectl** & **Helm**

## Architecture

The infrastructure is split into three primary bounded contexts, all orchestrated from a single `skaffold.yaml`:

1. **Platform (`platform-dev`)**: The foundational ingress, observability, and networking layer (Traefik, Grafana, OpenTelemetry, Cloudflare Tunnel).
2. **Cortex (`cortex-dev`)**: The AI intelligence and MCP services layer.
3. **Studio (`studio-dev`)**: The design and documentation services (Penpot, Memos).

## Running the Infrastructure

You can run the entire monorepo infrastructure at once, or spin up specific modules. Skaffold is configured to automatically resolve dependencies (e.g., spinning up Cortex will automatically spin up the Platform layer first).

### Run Complete Infrastructure

Starts every service in the monorepo with hot-reloading enabled.

```bash
pnpm infra:dev
```

### Run Modular Infrastructure

Starts specific contexts to save local resources:

```bash
# Start only the Platform layer
pnpm infra:platform:dev

# Start Platform + AI Services
pnpm infra:cortex:dev

# Start Platform + Design Tools
pnpm infra:studio:dev
```

### Cleanup

To teardown the cluster components and clean up local images and volumes:

```bash
pnpm infra:clean
```
