# Tupynambalucas Kubernetes Orchestration

Centralized Kubernetes orchestration and GitOps deployment pipeline for the `tupynambalucas.dev` ecosystem.

## Overview

This workspace provides a unified, Kubernetes-native approach using **Skaffold** and **Kustomize**. It provisions real-time hot-reloading for local development across isolated `k3d` clusters and delivers scalable manifests for cloud environments.

## Prerequisites

- **k3d** (Docker-based Kubernetes)
- **Skaffold** v4+
- **Kubectl** & **Helm**

## Architecture

The infrastructure is split into two primary bounded contexts, deployed to independent clusters:

1. **Hub (`k3d-hub`)**: The internal team environment containing observability (Grafana, Loki), AI tools (Cortex MCP, Memory), and design studios (Penpot, Memos).
2. **Corporate (`k3d-corporate`)**: The public-facing products containing the main website, API, and knowledge base portal.

## Running the Infrastructure

Skaffold manages local development, building images directly into the shared k3d local registry and deploying via Kustomize overlays.

### Run Complete Infrastructure

Starts both the Hub and Corporate clusters.

```bash
cd k8s
skaffold dev
```

### Run Modular Infrastructure

Starts specific contexts to conserve local resources:

```bash
# Start only the internal Hub services
skaffold dev -f skaffold.hub.yaml

# Start only the Corporate products
skaffold dev -f skaffold.corporate.yaml
```
