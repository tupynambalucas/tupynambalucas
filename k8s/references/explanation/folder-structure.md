# Directory Structure Conventions

This reference defines the authoritative structure for Kubernetes manifests within the `tupynambalucas.dev` monorepo.

## Flat Component Architecture

We prioritize a **flat architecture** for resources belonging to the same component or microservice, strictly avoiding redundant, kind-based subdirectories (e.g., `services/`, `deployments/`, `ingresses/`).

**Correct Structure (Component-Centric & Flat):**

```text
k8s/manifests/hub/cortex/mcp/
├── mcp-context7.yaml
├── mcp-firecrawl.yaml
└── mcp-memory.yaml
```

**Incorrect Structure (Redundant Nesting):**

```text
k8s/manifests/hub/cortex/mcp/
└── services/                 <-- ❌ Anti-pattern: Unnecessary nesting
    ├── mcp-context7.yaml
    └── mcp-firecrawl.yaml
```

### Rationale

- **Discoverability**: Grouping by component reduces mental overhead. Developers can see all related resources for `mcp` without navigating nested directories.
- **Kustomize Simplicity**: Kustomize paths remain clean and short in `kustomization.yaml` files.
- **GitOps Alignment**: Modern GitOps practices favor application/domain-centric grouping over Kubernetes object-kind grouping.
