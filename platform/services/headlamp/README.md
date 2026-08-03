# Kubernetes Web UI Dashboard (Headlamp)

Headlamp is an extensible, developer-friendly web UI for visual monitoring and administration of Kubernetes clusters.

---

## Service Overview

This directory contains the custom build configuration to run Headlamp inside the local Kubernetes development cluster:

1. **[config.yaml](./config.yaml)**: Kubeconfig configuration configured to dynamically read the mounted Pod ServiceAccount token (`tokenFile`), enabling seamless login-free access.
2. **[Dockerfile](./Dockerfile)**: Sets up the custom container build environment, copying the custom kubeconfig to the standard location under `/home/headlamp/.kube/config` with correct file ownership.
