# Technical Reference: Skaffold Configurations & Schemas

This document contains production-ready YAML templates, field specifications, CLI command options,
and architectural feature matrices for Skaffold v4 in this monorepo.

---

## 1. Production YAML Templates

### Root Kubernetes Master Config (`/skaffold.yaml`)

```yaml
apiVersion: skaffold/v4beta11
kind: Config
metadata:
  name: tupynambalucas-root
requires:
  - path: cortex/skaffold.yaml
    configs: ['cortex-dev']
  - path: studio/skaffold.yaml
    configs: ['studio-dev']
  - path: tools/skaffold.yaml
    configs: ['tools-dev']
manifests:
  rawYaml:
    - platform/infrastructure/kubernetes/namespace.yaml
    - platform/infrastructure/kubernetes/traefik.yaml
    - platform/infrastructure/kubernetes/otel-collector.yaml
    - platform/infrastructure/kubernetes/turbocache.yaml
    - cortex/infrastructure/kubernetes/namespace.yaml
    - cortex/infrastructure/kubernetes/agentgateway.yaml
```

### Cortex Workspace Config (`/cortex/skaffold.yaml`)

```yaml
apiVersion: skaffold/v4beta11
kind: Config
metadata:
  name: cortex-dev
build:
  local:
    concurrency: 0
  artifacts:
    - image: tupynambalucas-cortex-memory-api
      context: ..
      docker:
        dockerfile: cortex/memory/services/api/Dockerfile
      sync:
        manual:
          - src: 'cortex/memory/services/api/src/**/*.ts'
            dest: /app/src
            strip: 'cortex/memory/services/api/src/'
    - image: tupynambalucas-cortex-mcp-guardrails
      context: ..
      docker:
        dockerfile: cortex/mcp/guardrails/Dockerfile
      sync:
        infer:
          - 'cortex/mcp/guardrails/src/**/*.ts'
deploy:
  docker:
    useCompose: true
    images:
      - tupynambalucas-cortex-memory-api
      - tupynambalucas-cortex-mcp-guardrails
```

### Studio Workspace Config (`/studio/skaffold.yaml`)

```yaml
apiVersion: skaffold/v4beta11
kind: Config
metadata:
  name: studio-dev
build:
  local:
    concurrency: 0
  artifacts:
    - image: tupynambalucas-studio-web
      context: ..
      docker:
        dockerfile: studio/Dockerfile
      sync:
        manual:
          - src: 'studio/src/**/*'
            dest: /app/src
            strip: 'studio/src/'
deploy:
  docker:
    useCompose: true
    images:
      - tupynambalucas-studio-web
```

### Tools Workspace Config (`/tools/skaffold.yaml`)

```yaml
apiVersion: skaffold/v4beta11
kind: Config
metadata:
  name: tools-dev
build:
  local:
    concurrency: 0
  artifacts:
    - image: tupynambalucas-tools-cli
      context: ..
      docker:
        dockerfile: tools/Dockerfile
      sync:
        manual:
          - src: 'tools/src/**/*.ts'
            dest: /app/src
            strip: 'tools/src/'
deploy:
  docker:
    useCompose: true
    images:
      - tupynambalucas-tools-cli
```

---

## 2. API Schema Reference (`skaffold/v4beta11`)

| Section             | Field        | Type          | Description                                               |
| ------------------- | ------------ | ------------- | --------------------------------------------------------- |
| `metadata`          | `name`       | String        | Unique identifier for the module configuration            |
| `requires`          | `path`       | String        | Relative filepath to imported `skaffold.yaml`             |
| `requires`          | `configs`    | Array[String] | Array of module names to import from target path          |
| `build.artifacts[]` | `image`      | String        | Target container image name                               |
| `build.artifacts[]` | `context`    | String        | Root directory context for build execution                |
| `sync.manual[]`     | `src`        | String        | Glob pattern for local files to watch                     |
| `sync.manual[]`     | `dest`       | String        | Target directory path inside container                    |
| `sync.manual[]`     | `strip`      | String        | Path prefix to strip before copying to dest               |
| `sync.infer[]`      | Glob pattern | String        | Pattern matching files whose paths follow Dockerfile COPY |
| `deploy.docker`     | `useCompose` | Boolean       | Whether to execute deployments via Docker Compose         |
| `deploy.docker`     | `images`     | Array[String] | Container image names to deploy in Docker daemon          |

---

## 3. CLI Command Cheat Sheet

```bash
# Start continuous dev loop for a single workspace from its directory
cd cortex && skaffold dev

# Start continuous dev loop specifying a custom skaffold file
skaffold dev -f cortex/skaffold.yaml

# Start continuous dev loop for a specific module from root
skaffold dev --module cortex-dev

# Run single build and deploy pass without continuous watch
skaffold run -f cortex/skaffold.yaml

# Clean up all deployed Docker containers and artifacts
skaffold delete -f cortex/skaffold.yaml
```

---

## 4. Operational Feature Matrix

| Feature              | Root Kubernetes Mode                  | Workspace Docker Compose Mode      |
| -------------------- | ------------------------------------- | ---------------------------------- |
| Target Runtime       | Minikube / k3d / Remote K8s           | Local Docker Daemon / Compose      |
| Deployment Manifests | Kubernetes YAML (`kubectl`/`rawYaml`) | Docker Compose (`compose.yaml`)    |
| Hot Reload Support   | Pod sync via `kubectl exec`           | Container sync via `docker exec`   |
| Startup Latency      | 30-90 seconds                         | 2-5 seconds                        |
| Resource Footprint   | High (Cluster control plane + pods)   | Minimal (Container processes only) |
| Target Audience      | CI/CD, Staging, K8s testing           | Active daily code development      |
