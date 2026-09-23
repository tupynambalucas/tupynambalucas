# Specification: Kubernetes Refactor (Helm + Kustomize)

This document details the migration from distributed local manifests to the centralized Platform Engineering model, supporting both local execution and Cloud deployments.

## 1. Skaffold Profiles & Environment Mapping

Since Docker Compose is being removed in favor of a pure Kubernetes-native workflow, Skaffold must handle both local development and remote cloud deployments.

We will place `skaffold.yaml` at `infrastructure/skaffold.yaml`. It will dynamically map to the Kustomize overlays in `environments/`:

```yaml
# infrastructure/skaffold.yaml
apiVersion: skaffold/v4beta11
kind: Config

# Default profile (Local Development)
manifests:
  kustomize:
    paths:
      - environments/local
    buildArgs:
      - --load-restrictor=LoadRestrictionsNone
      - --enable-helm

profiles:
  - name: prod
    manifests:
      kustomize:
        paths:
          - environments/prod
        buildArgs:
          - --load-restrictor=LoadRestrictionsNone
          - --enable-helm
```

## 2. Consolidating Helm Charts

- Move `cortex/infrastructure/kubernetes/agentgateway-chart` to `infrastructure/charts/agentgateway`.
- Encapsulate all remaining internal services (`hub-api`, `memory`, `mcp`) into local Helm charts inside `infrastructure/charts/`.

## 3. The Environment Kustomization

The `infrastructure/environments/local/kustomization.yaml` acts as the environment registry:

```yaml
apiVersion: kustomize.config.k8s.io/v1beta1
kind: Kustomization

secretGenerator:
  - name: monorepo-secrets
    envs:
      - secrets.env

helmCharts:
  # Third-party standard charts
  - name: traefik
    repo: https://traefik.github.io/charts
    version: 26.0.0
    releaseName: traefik
    valuesFile: helm-values/traefik-values.yaml

  # Local Monorepo charts
  - name: agentgateway
    repo: file://../../charts/agentgateway
    releaseName: agentgateway
    valuesFile: helm-values/agentgateway-values.yaml
```

## 4. Cloud Native Cloud Deployments

With this structure, CD pipelines (like GitHub Actions or ArgoCD) can target `environments/prod` directly, while developers run `pnpm dev` which invokes `skaffold dev` pointing to `environments/local`.
