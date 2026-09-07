# Specification: Directory Structure (Target State)

The `infrastructure/` workspace acts as the definitive GitOps source of truth for the cluster.

```text
infrastructure/
├── package.json               # Workspace package (@monorepo/infrastructure)
├── README.md
├── skaffold.yaml              # (MASTER) Orchestrates builds and points to Kustomize overlays via profiles
│
├── charts/                    # (HELM) Local Application Charts (Single Source of Truth)
│   ├── agentgateway/
│   ├── memory/
│   ├── hub-api/
│   └── hub-web/
│
├── environments/              # (KUSTOMIZE) Deployment Environments
│   ├── local/                 # Local development loop (replaces Docker Compose)
│   │   ├── kustomization.yaml # Renders all charts with local overrides
│   │   ├── secrets.env        # Local secrets (ignored in Git, managed by CLI)
│   │   └── helm-values/       # Local-specific values (e.g., Traefik dev ports, debug logs)
│   │
│   ├── staging/               # Remote Cloud Staging Environment
│   │   ├── kustomization.yaml
│   │   └── helm-values/
│   │
│   └── prod/                  # Remote Cloud Production Environment
│       ├── kustomization.yaml
│       └── helm-values/
│
└── docs/                      # Platform engineering documentation
```

## Encapsulation Rules

1. **Skaffold at the Root**: The `skaffold.yaml` file sits at the root of the `infrastructure/` folder. It uses **Profiles** to determine which environment (`local`, `staging`, `prod`) to deploy to.
2. **No Application Code**: The `infrastructure/` workspace contains ZERO application code. Dockerfiles remain in their respective bounded contexts (`cortex/`, `hub/`).
3. **Build Contexts**: The master `skaffold.yaml` traverses up to the app directories (e.g., `context: ../cortex/gateway`) to build images, but handles the deployment routing centrally.
