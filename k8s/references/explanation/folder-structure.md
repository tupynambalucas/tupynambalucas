# Directory Structure Conventions

This reference defines the authoritative structure for Kubernetes manifests within the `tupynambalucas.dev` monorepo.

## Layered Layout

```text
k8s/
├── manifests/                 Base manifests, free of environment-specific values
│   ├── namespaces/
│   ├── hub/
│   │   ├── observability/     One folder per service (grafana, loki, otelcol, ...)
│   │   ├── network/
│   │   ├── tools/
│   │   ├── studio/            memos/, penpot/
│   │   └── cortex/            gateway/, mcp/, memory/
│   └── corporate/
│       └── portal/
├── overlays/                  One overlay per environment and cluster
│   ├── dev/{hub,corporate}/
│   ├── staging/{hub,corporate}/
│   └── prod/{hub,corporate}/
├── charts/                    Vendored Helm charts
├── references/                Diataxis documentation
└── skaffold*.yaml             Local development orchestration
```

## Rules

- **Component per folder**: A service that owns configuration files (`.conf`, `.yml`, `.json`) gets its own folder containing its manifest, its native configuration files, and a local `kustomization.yaml` that generates the ConfigMap. See [Configuration as Code](./configuration-as-code.md).
- **Flat inside a component**: Resources of the same component stay in one flat folder. Kind-based subdirectories (`services/`, `deployments/`, `ingresses/`) are forbidden.
- **Every directory is a Kustomize base**: Any directory referenced under `resources:` MUST contain a `kustomization.yaml`. Parent folders (`hub/observability`, `hub/studio`, `hub/cortex`, `corporate`) only aggregate their children.
- **No redundant prefixes (anti-stuttering)**: Manifest filenames MUST NOT repeat their parent directory name or domain as a prefix (e.g., use `context7.yaml` instead of `mcp-context7.yaml` inside `cortex/mcp/`, and `api.yaml` instead of `memory-api.yaml` inside `cortex/memory/`). However, internal Kubernetes object identifiers (`metadata.name`) MUST retain their domain/service prefixes where necessary for cluster DNS disambiguation.
- **Bases contain no environment values**: Hostnames, replicas, and log levels are set by overlays. See [Environments and hostnames](../reference/environments-and-hostnames.md).

## Correct and Incorrect Examples

Correct (component-centric and flat):

```text
k8s/manifests/hub/cortex/mcp/
├── context7.yaml
├── firecrawl.yaml
├── kustomization.yaml
└── memory.yaml
```

Incorrect (redundant nesting or stuttering prefixes):

```text
k8s/manifests/hub/cortex/mcp/
└── services/                 <-- Incorrect: Redundant nesting
    ├── mcp-context7.yaml     <-- Incorrect: Stuttering 'mcp-' prefix inside 'mcp/' folder
    └── mcp-firecrawl.yaml
```

## Rationale

- **Discoverability**: Grouping by component reduces mental overhead. Everything for `grafana` lives in `grafana/`.
- **Atomic updates**: A change to one component cannot affect another through a shared kustomization.
- **Modularity**: ArgoCD and Skaffold add or remove a whole service by editing one line in an aggregating `kustomization.yaml`.
- **GitOps alignment**: Application and domain-centric grouping is preferred over Kubernetes object-kind grouping.
