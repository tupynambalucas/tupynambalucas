# Kubernetes Infrastructure & GitOps

This directory houses the authoritative Diátaxis documentation for the `tupynambalucas.dev` Kubernetes infrastructure, detailing our orchestrator configurations, manifest structures, and **Separation of Deployers** pattern.

## Diátaxis Structure

- **[tutorials/](./tutorials/)**: Step-by-step exercises for setting up the local cluster and orchestrator.
- **[guides/](./guides/)**: How-to guides for common operations (e.g., how to add a new Helm chart, how to create a new Kustomize overlay).
- **[reference/](./reference/)**: Technical specifications, API limits, and configuration schemas (Note: only for pure technical reference, otherwise use guides or explanation).
- **[explanation/](./explanation/)**: Architectural decisions (e.g., why Helm is used exclusively for third-party charts, why `--enable-helm` is an anti-pattern).

> **Note**: This documentation is automatically maintained and enforced by the `k8s-expert` plugin skills whenever agents interact with the `k8s/` workspace.
