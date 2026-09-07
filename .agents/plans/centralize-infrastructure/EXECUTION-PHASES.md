# Specification: Execution Phases

## Phase 1: Scaffold the Workspace

1. Create `infrastructure/` directory and `package.json` (`@monorepo/infrastructure`).
2. Scaffold `charts/` and the `environments/` folders (`local`, `staging`, `prod`).

## Phase 2: Centralize Master Skaffold

1. Create `infrastructure/skaffold.yaml` (Master Orchestrator).
2. Port all `build.artifacts` from `platform`, `cortex`, and `studio`.
3. Set the default Kustomize path to `environments/local`.
4. Create the `prod` profile pointing to `environments/prod`.

## Phase 3: Migrate Helm Charts & External Manifests

1. Move the existing `agentgateway-chart` from `cortex` to `infrastructure/charts/`.
2. Recreate the `helmCharts` block for Traefik inside `environments/local/kustomization.yaml`.
3. Sequentially migrate all remaining YAMLs (Prometheus, Grafana, Penpot, Memory) into Helm charts in `infrastructure/charts/`.

## Phase 4: Purge Legacy Infrastructure

1. Delete all `infrastructure/` folders from `cortex`, `platform`, and `studio` (including their old K8s and Docker Compose files).
2. Delete the obsolete `skaffold.yaml` files in those workspaces.
3. Test local execution via `skaffold dev` from the `infrastructure/` context.
