# Centralize Infrastructure Plan (GitOps Helm + Kustomize)

> **Updated:** 2026-09-05 (Aligned with Monorepo Reusability State)

## 1. Executive Summary

Our monorepo currently distributes infrastructure definitions (Kubernetes manifests, Helm values, Skaffold configs, Docker Compose) across individual bounded contexts (`cortex/`, `platform/`, `studio/`). While this FSD (Feature-Sliced Design) approach works for application logic, distributing orchestration files fragments the cluster's state and complicates unified CI/CD deployments.

Following the successful migration to the **Hybrid Helm + Kustomize Architecture** and the implementation of the **State-Aware Provisioner CLI**, this plan dictates the extraction of all cluster orchestration into a centralized `infrastructure/` workspace.

## 2. Architectural Principles

1. **Platform Engineering GitOps**: All Kubernetes state must reside in a single workspace. This allows the CI/CD pipeline to deploy the entire stack via a single ArgoCD or FluxCD sync point.
2. **Helm-First Manifests**: The legacy approach of splitting raw YAMLs by resource type (`deployments/`, `services/`) is OBSOLETE. Infrastructure is packaged into local **Helm Charts** (e.g., `agentgateway-chart`) grouped by _application_, not by resource type.
3. **Environment Overlays via Kustomize**: Environments (`local-dev`, `prod`, `staging`) are managed exclusively via Kustomize overlays that consume the Helm charts and patch them.
4. **Master Skaffold Entrypoint**: A single `skaffold.yaml` in the `local-dev` environment orchestrates the entire cluster, replacing the distributed `skaffold.yaml` network.

## 3. Specification Sitemap

- **[DIRECTORY-STRUCTURE.md](./DIRECTORY-STRUCTURE.md)**: The target GitOps folder tree.
- **[KUBERNETES-REFACTOR.md](./KUBERNETES-REFACTOR.md)**: Rules for consolidating Helm Charts and Kustomize overlays.
- **[EXECUTION-PHASES.md](./EXECUTION-PHASES.md)**: Step-by-step migration guide.
