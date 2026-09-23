# How-To Guides: Skaffold Workspace Setup & Hot Reloading

This document provides task-oriented recipes and step-by-step instructions for configuring and
troubleshooting Skaffold for local Docker development across monorepo workspaces.

---

## Guide 1: Create a Standalone Skaffold Configuration for a Workspace

Follow these steps to create an isolated `skaffold.yaml` file inside a workspace directory (such as
`cortex`, `studio`, or `tools`).

### Step 1: Define Workspace File Structure

Ensure your workspace contains its application source, build definitions, and Docker Compose setup:

```
cortex/
├── infrastructure/docker/compose.yaml
├── memory/services/api/
│   ├── Dockerfile
│   └── src/
├── mcp/guardrails/
│   ├── Dockerfile
│   └── src/
└── skaffold.yaml
```

### Step 2: Write the Workspace Configuration

Create `cortex/skaffold.yaml` using API version `skaffold/v4beta11`. Note that `context: ..` points to
the monorepo root so `pnpm` workspace files and shared dependencies can be accessed during Docker builds:

```yaml
apiVersion: skaffold/v4beta11
kind: Config
metadata:
  name: cortex-dev
build:
  local:
    concurrency: 0
  artifacts:
    - image: cortex-memory-api
      context: ..
      docker:
        dockerfile: cortex/memory/services/api/Dockerfile
      sync:
        manual:
          - src: 'cortex/memory/services/api/src/**/*.ts'
            dest: /app/src
            strip: 'cortex/memory/services/api/src/'
deploy:
  docker:
    useCompose: true
    images:
      - cortex-memory-api
```

---

## Guide 2: Configure File Sync Rules for Common Stacks

### Node.js / TypeScript (Nodemon / TSX)

```yaml
artifacts:
  - image: memory-api
    context: ..
    docker:
      dockerfile: cortex/memory/services/api/Dockerfile
    sync:
      manual:
        - src: 'cortex/memory/services/api/src/**/*.ts'
          dest: /app/src
          strip: 'cortex/memory/services/api/src/'
        - src: 'cortex/memory/services/api/package.json'
          dest: /app/package.json
          strip: 'cortex/memory/services/api/'
```

### Frontend Web (Vite / React / Next.js)

```yaml
artifacts:
  - image: memory-web
    context: ..
    docker:
      dockerfile: cortex/memory/services/web/Dockerfile
    sync:
      manual:
        - src: 'cortex/memory/services/web/src/**/*'
          dest: /app/src
          strip: 'cortex/memory/services/web/src/'
        - src: 'cortex/memory/services/web/public/**/*'
          dest: /app/public
          strip: 'cortex/memory/services/web/public/'
```

### Inferred Sync Mode (Dockerfile COPY/ADD Inferences)

```yaml
artifacts:
  - image: mcp-guardrails
    context: ..
    docker:
      dockerfile: cortex/mcp/guardrails/Dockerfile
    sync:
      infer:
        - 'cortex/mcp/guardrails/src/**/*.ts'
```

---

## Guide 3: Link Workspace Configs to Root Skaffold Config & Run via `--module`

To orchestrate multiple workspaces from the root repository directory without triggering root
Kubernetes cluster deployments, update `skaffold.yaml` at the monorepo root:

```yaml
apiVersion: skaffold/v4beta11
kind: Config
metadata:
  name: monorepo-root
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
    - cortex/infrastructure/kubernetes/agentgateway.yaml
```

### Running Workspace Modules from Root

When running from the root directory, pass `--module <module-name>` to target a specific workspace:

```bash
# Run cortex Docker Compose environment only (skips root K8s manifests)
skaffold dev --module cortex-dev

# Run multiple workspace Docker Compose environments concurrently
skaffold dev --module cortex-dev,studio-dev
```

**Key Execution Behavior**:

- Passing `--module cortex-dev` filters the dependency graph. Skaffold executes **ONLY** the `cortex-dev`
  module declared in `cortex/skaffold.yaml`.
- The root Kubernetes manifests in `manifests.rawYaml` are **skipped entirely** because `monorepo-root`
  is not included in the `--module` filter.
- Paths in `cortex/skaffold.yaml` (`context: ..`) are automatically resolved relative to `cortex/skaffold.yaml`,
  correctly pointing to the monorepo root directory.

---

## Guide 4: Activating and Deactivating Modules (`dev` and `down`)

To manage the lifecycle of workspace containers (starting up and tearing down infra), Skaffold provides
`skaffold dev` and `skaffold delete`.

### 1. Stopping & Tearing Down Infra (`down`)

To stop containers and tear down the infrastructure created by a specific workspace module:

```bash
# Tear down cortex Docker Compose containers from root using module name
skaffold delete --module cortex-dev

# Tear down cortex Docker Compose containers directly from workspace skaffold file
skaffold delete -f cortex/skaffold.yaml
```

### 2. Integrating with `package.json` Scripts

Replace direct `docker compose` commands in `package.json` with Skaffold module scripts:

```json
{
  "scripts": {
    "cortex:dev": "skaffold dev --module cortex-dev",
    "cortex:down": "skaffold delete --module cortex-dev",
    "studio:dev": "skaffold dev --module studio-dev",
    "studio:down": "skaffold delete --module studio-dev",
    "tools:dev": "skaffold dev --module tools-dev",
    "tools:down": "skaffold delete --module tools-dev"
  }
}
```

Running `pnpm cortex:down` will execute `skaffold delete --module cortex-dev`, which tears down only
the Docker Compose containers associated with the `cortex-dev` module while leaving other workspace
services running.

---

## Guide 5: Troubleshooting Hot Reload & File Sync Issues

### Issue 1: Changes are synced but application does not reload

- **Cause**: The container application process is not watching disk changes or is bound to a static
  dist build.
- **Solution**: Ensure your container entrypoint runs a live watching process (e.g. `tsx watch`,
  `nodemon`, `vite --host`, `uvicorn --reload`).

### Issue 2: File sync fails with `tar` command missing

- **Cause**: Skaffold injects files by piping a tar archive into `docker exec`. The container base
  image lacks `tar`.
- **Solution**: Ensure `tar` is installed in your base Dockerfile (e.g. `RUN apk add --no-base tar`
  in Alpine images).

### Issue 3: Inferred sync does not match changed files

- **Cause**: Multi-stage Dockerfiles only infer destination paths from the final stage.
- **Solution**: Switch from `sync.infer` to `sync.manual` with explicit `src`, `dest`, and `strip`
  directives.

---

## Guide 6: Managing Kubernetes Secrets & Environment Variable Injections

To prevent leaking secret API keys and environment variables in GitHub repositories when deploying
to Kubernetes clusters, use one of the following dynamic injection methods.

### Method 1: Dynamically Generate Secrets via Kustomize (`secretGenerator`)

Use Skaffold's Kustomize integration (`manifests.kustomize`) to automatically populate Kubernetes
`Secret` resources from the gitignored `.env` file at build time.

Create `cortex/infrastructure/kubernetes/kustomization.yaml`:

```yaml
apiVersion: kustomize.config.k8s.io/v1beta1
kind: Kustomization
resources:
  - namespace.yaml
  - agentgateway.yaml
  - mcp-servers.yaml
  - agents.yaml
secretGenerator:
  - name: mcp-secrets
    envs:
      - ../docker/.env
```

Update `skaffold.yaml` at monorepo root:

```yaml
manifests:
  kustomize:
    paths:
      - cortex/infrastructure/kubernetes
```

### Method 2: Manual Local Secret Creation via `kubectl`

Before running `skaffold dev` or `skaffold run` on a Kubernetes cluster, create the `mcp-secrets`
object locally once:

```bash
kubectl create secret generic mcp-secrets \
  --namespace cortex \
  --from-env-file=cortex/infrastructure/docker/.env
```

Manifests in Git reference keys via `secretKeyRef` without containing sensitive plain text values.
