# Kubernetes Infrastructure and GitOps

This directory houses the authoritative Diataxis documentation for the `tupynambalucas.dev` Kubernetes infrastructure, detailing orchestrator configuration, manifest structure, and the Separation of Deployers pattern.

## Guides

- [How to add a service](./guides/add-a-service.md): Procedure for adding a first-party service to the hub or corporate stack.

## Reference

- [Environments and hostnames](./reference/environments-and-hostnames.md): Overlay matrix, hostname convention, Ingress patch table, namespaces, and secrets.

## Explanation

- [Directory structure conventions](./explanation/folder-structure.md): Component-per-folder layout and Kustomize base rules.
- [Configuration as Code](./explanation/configuration-as-code.md): Native configuration files and `configMapGenerator`.
- [Separation of Deployers](./explanation/separation-of-deployers.md): Helm for third-party charts, Kustomize for first-party manifests.

> **Note**: This documentation is maintained through the `k8s-docs-manager` skill of the `k8s-expert` plugin whenever the `k8s/` workspace changes.
