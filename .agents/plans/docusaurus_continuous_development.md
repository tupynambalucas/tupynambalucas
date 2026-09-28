# Docusaurus Continuous Development Plan

## Overview

This plan outlines the continuous development environment for our Docusaurus documentation platform (`docs/services/docusaurus`) inside our Kubernetes/Minikube setup.

Since the true production deployment is handled via Cloudflare Pages and GitHub Actions (`.github/workflows/deploy-docs.yaml`), **this Kubernetes service is strictly for development**. Therefore, we will use a standard `Dockerfile` that runs the Docusaurus dev server, leveraging **Skaffold** to automatically synchronize files and trigger updates across our PNPM monorepo.

## Architecture & Logic Flow

1. **Monorepo Context**: The `Dockerfile` will be built from the root context to ensure local dependencies (like `docs/packages/preset` and `docs/packages/theme`) are correctly linked via PNPM workspaces.
2. **Hybrid Development Loop**:
   - **Skaffold File Sync**: Changes to markdown, source files, and local packages in `docs/` are instantly synced into the running pod.
   - **Docusaurus HMR**: The dev server (`pnpm start --poll`) detects these synced files and performs a Hot Module Replacement to update the browser.
   - **Auto-Redeploy**: If core files outside the sync rules (like `package.json` or `pnpm-workspace.yaml`) change, Skaffold will fall back to automatically rebuilding the image and redeploying the pod.
3. **Traefik & Cloudflared**: Traefik handles local cluster ingress, while a Cloudflared tunnel securely exposes `docs-dev.tupynambalucas.dev` to the internet.

## Implementation Steps

### 1. Standard Dockerfile for Development

Create a standard `Dockerfile` inside `docs/services/docusaurus`. It must be able to resolve `docs/packages` within the PNPM workspace.

```dockerfile
FROM node:22-alpine
WORKDIR /app

# Enable PNPM
RUN corepack enable pnpm
ENV CHOKIDAR_USEPOLLING=true

# Copy monorepo workspace configurations
COPY package.json pnpm-workspace.yaml pnpm-lock.yaml turbo.json ./
# Copy all docs workspace packages and the docusaurus service
COPY docs/ docs/

# Install dependencies for the entire workspace
RUN pnpm install

# Set working directory to the Docusaurus service
WORKDIR /app/docs/services/docusaurus

EXPOSE 3002
# Run the dev server with polling enabled for container compatibility
CMD ["pnpm", "run", "start", "--", "--host", "0.0.0.0", "--poll", "1000"]
```

### 2. Skaffold Configuration

Update the `infrastructure/skaffold.yaml` to include the Docusaurus artifact. The context must be the root directory `.` to access the whole workspace.

```yaml
build:
  artifacts:
    - image: docusaurus-dev
      context: .
      docker:
        dockerfile: docs/services/docusaurus/Dockerfile
      sync:
        manual:
          # Sync Docusaurus service files
          - src: 'docs/services/docusaurus/docs/**/*'
            dest: /app
          - src: 'docs/services/docusaurus/src/**/*'
            dest: /app
          - src: 'docs/services/docusaurus/static/**/*'
            dest: /app
          - src: 'docs/services/docusaurus/docusaurus.config.ts'
            dest: /app
          # Sync linked local packages
          - src: 'docs/packages/**/*'
            dest: /app
```

### 3. Kubernetes Manifests

Create manifests in `infrastructure/manifests/docusaurus/`:

**Deployment & Service (`docusaurus.yaml`):**

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: docusaurus
  namespace: docs
spec:
  replicas: 1
  selector:
    matchLabels:
      app: docusaurus
  template:
    metadata:
      labels:
        app: docusaurus
    spec:
      containers:
        - name: docusaurus
          image: docusaurus-dev
          ports:
            - containerPort: 3002
---
apiVersion: v1
kind: Service
metadata:
  name: docusaurus-svc
  namespace: docs
spec:
  ports:
    - port: 80
      targetPort: 3002
  selector:
    app: docusaurus
```

### 4. Traefik Ingress Configuration

```yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: docusaurus-ingress
  namespace: docs
  annotations:
    traefik.ingress.kubernetes.io/router.entrypoints: web
spec:
  rules:
    - host: docs-dev.tupynambalucas.dev
      http:
        paths:
          - path: /
            pathType: Prefix
            backend:
              service:
                name: docusaurus-svc
                port:
                  number: 80
```

### 5. Cloudflared Tunnel Setup

Deploy `cloudflared` in the cluster configured with the token/credentials to route `docs-dev.tupynambalucas.dev` back to the internal Traefik ingress (`http://traefik.platform.svc.cluster.local:80`).

## Execution

With Skaffold running:

- **Instant Updates**: Editing `docs/packages/theme/index.ts` or `docs/services/docusaurus/docs/intro.md` triggers a Skaffold Sync -> Docusaurus HMR.
- **Full Redeploy**: Changing a `package.json` triggers Skaffold to rebuild the Node image and rollout a new Docusaurus pod.
