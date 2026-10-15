# Infrastructure Refactor

Renames `infrastructure/` to `k8s/` and reorganizes it by bounded context and resource
domain, with one overlay per environment and deploy target.

## 1. Target Tree

```text
k8s/
  skaffold.yaml                 root config, requires the two modules below
  skaffold.hub.yaml             hub artifacts and deploy
  skaffold.corporate.yaml       corporate artifacts and deploy
  manifests/
    namespaces/
    hub/
      observability/            one folder per service, each with its own kustomization.yaml
      network/
      tools/
      studio/
        penpot/
        memos/
      cortex/
        gateway/                agentgateway routing and values
        memory/                 mongodb, api, web, ingress
        mcp/                    flat folder: context7, firecrawl, github, grafana, guardrails, inspector, kubectl, memory, playwright
    corporate/
      portal/
      web/
      api/
  charts/                       vendored Helm charts (agentgateway, traefik)
  overlays/
    dev/
      hub/
      corporate/
    staging/
      hub/
      corporate/
    prod/
      hub/
      corporate/
  references/
    explanation/ guides/ reference/   Diataxis documentation
  .env.example
  AGENTS.md
  README.md
  package.json
```

Each overlay folder holds a `kustomization.yaml` with inline Ingress host patches and a\r\n`helm-values/` folder when the overlay configures a third-party chart.

## 2. File Mapping

| Current file in `infrastructure/`                                | New location in `k8s/`                                                                                            |
| :--------------------------------------------------------------- | :---------------------------------------------------------------------------------------------------------------- |
| `manifests/cert-manager-namespace.yaml`                          | removed, obsolete (cert-manager eliminated)                                                                       |
| `manifests/cortex-namespace.yaml`                                | `manifests/hub/namespaces/cortex.yaml`                                                                            |
| `manifests/docs-namespace.yaml`                                  | `manifests/corporate/namespaces/docs.yaml`                                                                        |
| `manifests/platform-namespace.yaml`                              | `manifests/hub/namespaces/platform.yaml`                                                                          |
| `manifests/studio-namespace.yaml`                                | `manifests/hub/namespaces/studio.yaml`                                                                            |
| `manifests/platform-grafana.yaml`                                | `manifests/hub/observability/grafana.yaml`                                                                        |
| `manifests/platform-prometheus.yaml`                             | `manifests/hub/observability/prometheus.yaml`                                                                     |
| `manifests/platform-loki.yaml`                                   | `manifests/hub/observability/loki.yaml`                                                                           |
| `manifests/platform-tempo.yaml`                                  | `manifests/hub/observability/tempo.yaml`                                                                          |
| `manifests/platform-otelcol.yaml`                                | `manifests/hub/observability/otelcol.yaml`                                                                        |
| `manifests/platform-fluentbit.yaml`                              | `manifests/hub/observability/fluentbit.yaml`                                                                      |
| `manifests/platform-kubestatemetrics.yaml`                       | `manifests/hub/observability/kube-state-metrics.yaml`                                                             |
| `manifests/platform-cloudflared.yaml`                            | `manifests/hub/network/cloudflared.yaml`                                                                          |
| `manifests/traefik-ingress.yaml`                                 | `manifests/hub/network/traefik.yaml`                                                                              |
| `manifests/platform-headlamp.yaml`                               | `manifests/hub/tools/headlamp.yaml`                                                                               |
| `manifests/platform-turbocache.yaml`                             | `manifests/hub/tools/turbocache.yaml`                                                                             |
| `manifests/studio-penpot.yaml`                                   | `manifests/hub/studio/penpot/penpot.yaml`                                                                         |
| `manifests/studio-penpot-seed.yaml`                              | `manifests/hub/studio/penpot/seed.yaml`                                                                           |
| `manifests/studio-memos.yaml`                                    | `manifests/hub/studio/memos/memos.yaml`                                                                           |
| `manifests/studio-memos-seed.yaml`                               | `manifests/hub/studio/memos/seed.yaml`                                                                            |
| `manifests/cortex-mcp.yaml`                                      | split into `manifests/hub/cortex/mcp/` (flat, clean file per service without redundant `mcp-` prefix)             |
| `manifests/cortex-memory.yaml`                                   | split into `manifests/hub/cortex/memory/` (`mongodb.yaml`, `api.yaml`, `web.yaml`, `ingress.yaml`)                |
| `manifests/kb-docusaurus-portal.yaml`                            | `manifests/corporate/portal/portal.yaml`                                                                          |
| `charts/agentgateway`                                            | `charts/agentgateway`                                                                                             |
| `charts/cert-manager-v1.14.4`                                    | removed, obsolete (cert-manager eliminated)                                                                       |
| `charts/traefik-26.0.0`                                          | `charts/traefik-26.0.0`                                                                                           |
| `environments/local/kustomization.yaml`                          | split into `overlays/dev/hub` and `overlays/dev/corporate`                                                        |
| `environments/local/helm-values/traefik-values.yaml`             | `overlays/dev/hub/helm-values/traefik-values.yaml`                                                                |
| `environments/local/traefik-rbac-patch.json`                     | removed, RBAC is injected through `extraObjects` in `traefik-values.yaml`                                         |
| `environments/local/charts/*`                                    | removed, duplicate of `charts/`                                                                                   |
| `references/skaffold/*`                                          | replaced by `references/{guides,reference,explanation}`                                                           |
| `skaffold.yaml`                                                  | split into the three Skaffold files (`k8s/skaffold.yaml`, `k8s/skaffold.hub.yaml`, `k8s/skaffold.corporate.yaml`) |
| `.env`, `.env.example`, `AGENTS.md`, `README.md`, `package.json` | same names at `k8s/` root                                                                                         |

## 3. Base Manifest Rules

- Base manifests contain no environment-specific values: no `-dev` hostnames, no replica counts, no
  debug log levels.
- Ingress hosts, replicas, resource limits, log levels, and image references are set by overlay
  patches.
- Namespaces keep their current names (`platform`, `cortex`, `studio`, `docs`). Renaming breaks
  internal URLs such as `*.platform.svc` and is out of scope.

## 4. Overlays

Every environment has a `hub` and a `corporate` overlay, so the same shape applies everywhere.

| Overlay             | Target cluster            | Hostnames | Tunnel              |
| :------------------ | :------------------------ | :-------- | :------------------ |
| `dev/hub`           | `k3d-hub`                 | `*-dev`   | `dev-hub`           |
| `dev/corporate`     | `k3d-corporate`           | `*-dev`   | `dev-corporate`     |
| `staging/hub`       | staging hub cluster       | `*-stg`   | `staging-hub`       |
| `staging/corporate` | staging corporate cluster | `*-stg`   | `staging-corporate` |
| `prod/hub`          | prod hub cluster          | clean     | `prod-hub`          |
| `prod/corporate`    | prod corporate cluster    | clean     | `prod-corporate`    |

In dev, each overlay deploys to its respective isolated k3d cluster (`k3d-hub` and `k3d-corporate`),
matching production architecture. In the cloud, each overlay is a separate ArgoCD Application.

Example overlay:

```yaml
apiVersion: kustomize.config.k8s.io/v1beta1
kind: Kustomization
resources:
  - ../../../manifests/hub/namespaces
  - ../../../manifests/hub/observability
  - ../../../manifests/hub/network
  - ../../../manifests/hub/tools
  - ../../../manifests/hub/studio
  - ../../../manifests/hub/cortex
patches:
  - target:
      kind: Ingress
      name: grafana-ingress
    patch: |-
      - op: replace
        path: /spec/rules/0/host
        value: grafana-dev.tupynambalucas.dev
generatorOptions:
  disableNameSuffixHash: true
secretGenerator:
  - name: platform-secrets
    namespace: platform
    envs:
      - ../../../.env
```

Use `resources` and `patches`. The `bases` and `patchesStrategicMerge` fields are deprecated.
Ingress hosts are replaced with inline JSON 6902 patches in each overlay (see the Ingress patch table in `k8s/references`). Third-party Helm charts (Traefik) are not rendered by Kustomize. Skaffold and ArgoCD deploy them as a separate Helm release (Separation of Deployers), so `--enable-helm` is not used.

## 5. Skaffold

Skaffold is used only for local development, so it only targets `dev`.

```yaml
# k8s/skaffold.yaml
apiVersion: skaffold/v4beta11
kind: Config
metadata:
  name: root
requires:
  - configs: [hub]
    path: skaffold.hub.yaml
  - configs: [corporate]
    path: skaffold.corporate.yaml
```

```yaml
# k8s/skaffold.hub.yaml
apiVersion: skaffold/v4beta11
kind: Config
metadata:
  name: hub
build:
  platforms: ['linux/amd64']
  local: { push: true, useDockerCLI: true, concurrency: 2, tryImportMissing: true }
  artifacts:
    - image: platform-grafana
      context: ../hub/observability/grafana
      docker: { dockerfile: Dockerfile, target: dev }
    # remaining hub artifacts keep their image names with updated paths
manifests:
  kustomize:
    paths: [overlays/dev/hub]
    buildArgs: [--load-restrictor=LoadRestrictionsNone]
deploy:
  kubectl:
    hooks:
      before:
        - host:
            command:
              - kubectl
              - apply
              - -f
              - https://raw.githubusercontent.com/traefik/traefik/v3.0/docs/content/reference/dynamic-configuration/kubernetes-crd-definition-v1.yml
portForward:
  - resourceType: service
    resourceName: agentgateway
    namespace: cortex
    port: 8080
    localPort: 8080
```

`skaffold.corporate.yaml` has the same shape with the `portal` artifact and the
`overlays/dev/corporate` path. The `portal` sync rules move from `knowledge-base/...` to
`corporate/...`.

Changes from the current file:

- `push: false` becomes `push: true` against `localhost:5000` (the shared k3d registry). Since k3d automatically links to this registry, images are instantly available to both clusters.
- `tryImportMissing: true` is added as a Skaffold v2 best practice to prevent rebuilding artifacts that already exist locally, optimizing the dev loop.
- Every `context`, `dockerfile`, and `sync` path follows the new tree.
- `skaffold.hub.yaml` locks to `kubeContext: k3d-hub`.
- `skaffold.corporate.yaml` locks to `kubeContext: k3d-corporate`.

Usage:

| Command                                   | Result                                                       |
| :---------------------------------------- | :----------------------------------------------------------- |
| `skaffold dev -f skaffold.hub.yaml`       | Builds and deploys hub stack to `k3d-hub`.                   |
| `skaffold dev -f skaffold.corporate.yaml` | Builds and deploys corporate stack to `k3d-corporate`.       |
| `skaffold dev` (from `k8s/`)              | Builds and deploys both stacks to their respective clusters. |

Both clusters run their own Traefik ingress controller and Cloudflare Tunnel, eliminating any
cross-cluster runtime dependencies and port contention in development (a known k3d pain point).

## 6. Cloud Delivery

Staging and prod overlays are not run by Skaffold. ArgoCD runs in each environment and syncs one
Application per overlay from this repository. Terraform provisions the clusters in a separate
top-level `terraform/` folder.
