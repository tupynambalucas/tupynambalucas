# Configuration as Code (CaC) and Infrastructure as Code (IaC) Separation

In our GitOps architecture, we enforce a strict separation between Infrastructure as Code (IaC) and Configuration as Code (CaC) for platform services (e.g., Observability tools like Grafana, Prometheus, Loki, Fluentbit, and Cortex Gateway).

## Architectural Dilemma

Historically, configuration files like `prometheus.yml` or `fluent-bit.conf` were baked directly into Kubernetes `ConfigMap` manifests within the same YAML file as the Deployment and Service. This caused several issues:

- **Poor Developer Experience**: Editing a multiline string in a YAML file breaks syntax highlighting and IDE linting for the underlying language (e.g., JSON, PromQL, Conf).
- **Lack of Atomic Updates**: Modifying a baked-in ConfigMap does not automatically trigger a rolling update of the associated Pods, as the Deployment spec remains unchanged.

## The Solution: Kustomize configMapGenerator

To solve these issues, we adhere to the following directory structure and GitOps flow:

1. **Native Files**: Configuration files are stored in their native formats (e.g., `prometheus-config.yml`, `fluent-bit.conf`) directly inside the service's manifest directory (e.g., `k8s/manifests/hub/observability/fluentbit/`). This preserves IDE support and readability.
2. **Kustomize Generation**: We use Kustomize's `configMapGenerator` to dynamically construct the ConfigMap from these native files.
3. **Automatic Rolling Updates**: By using `configMapGenerator`, Kustomize automatically appends a unique content hash to the generated ConfigMap's name. When the configuration changes, the hash changes, generating a new ConfigMap. The Deployment reference is automatically updated to point to the new name, which triggers Kubernetes to gracefully roll out the new Pods.

### Example Directory Structure

```plaintext
k8s/manifests/hub/observability/fluentbit/
├── fluent-bit.conf       # Native CaC file
├── parsers.conf          # Native CaC file
├── fluentbit.yaml        # IaC (DaemonSet, ServiceAccount, RBAC)
└── kustomization.yaml    # Orchestrates generation
```

### Example Kustomization

```yaml
apiVersion: kustomize.config.k8s.io/v1beta1
kind: Kustomization
resources:
  - fluentbit.yaml
configMapGenerator:
  - name: fluent-bit-config
    namespace: platform
    files:
      - fluent-bit.conf=fluent-bit.conf
      - parsers.conf=parsers.conf
```

This ensures our enterprise infrastructure remains scalable, atomic, and highly maintainable.
