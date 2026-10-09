# GitOps Architecture & Orchestration

This directory houses the authoritative Diátaxis documentation for the `tupynambalucas.dev` Kubernetes infrastructure, specifically detailing our **Separation of Deployers** pattern using Helm and Kustomize.

## Diátaxis Structure

- **[tutorials/](./tutorials/)**: Step-by-step exercises for setting up the local cluster and orchestrator.
- **[guides/](./guides/)**: How-to guides for common operations (e.g., how to add a new Helm chart, how to create a new Kustomize overlay).
- **[reference/](./reference/)**: Technical specifications, API limits, and configuration schemas.
- **[explanation/](./explanation/)**: Architectural decisions (e.g., why Helm is used exclusively for third-party charts, why `--enable-helm` is an anti-pattern).

> **Note**: This documentation is automatically maintained and enforced by the `k8s-expert` plugin skills whenever agents interact with the `k8s/` workspace.
