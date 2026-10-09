# Enterprise Architecture Migration Plan

Migration plan for moving the Tupynambalucas monorepo to a native Linux development environment,
a Domain Driven Design (DDD) folder layout, and a Kubernetes manifest tree that supports the
`dev`, `staging`, and `prod` environments.

## Decisions

- **Local runtime**: WSL2 Ubuntu, native Docker Engine, and k3d. Podman Machine and Windows NTFS
  are retired from the development loop.
- **Local topology**: two isolated k3d clusters (`k3d-hub` and `k3d-corporate`) running on
  a shared Docker network and registry, mirroring cloud architecture locally.
- **Cloud topology**: `hub` and `corporate` run in separate clusters per environment (staging and
  prod).
- **Bounded contexts**: `hub` groups `observability`, `network`, `tools`, `studio`, and `cortex`.
  `corporate` groups the public website, API, and documentation portal.
- **Ingress model**: Cloudflare Tunnel in all environments (`dev`, `staging`, and `prod`). Each
  cluster runs its own tunnel connector, eliminating public IPs, cloud LoadBalancers, and
  cert-manager.
- **Skaffold scope**: local development only, deploying to `k3d-hub` and `k3d-corporate` via
  `kubeContext`. Cloud deployments use GitOps.

## Documents

1. [Ubuntu setup](./ubuntu-setup.md): WSL2, Docker, k3d, registry, kubeconfig, Freelens.
2. [Enterprise structure](./enterprise-structure.md): topology, environments, domains, and
   deployment tooling.
3. [Cloudflared tunnels](./cloudflared-tunnels.md): tunnel design for dev, staging, and prod.
4. [Monorepo restructure](./monorepo-restructure.md): bounded context moves and workspace changes.
5. [Infrastructure refactor](./infrastructure-refactor.md): new `k8s` tree, file mapping,
   overlays, and Skaffold modules.
6. [Migration phases](./migration-phases.md): execution order, validation, and rollback.

## Related Plans

- [Native Docker and k3d migration](../wsl-ubuntu-docker-k3d-native-migration.md): original
  migration plan that this plan extends.
- [Podman migration](../wsl-ubuntu-podman-migration.md): superseded by the native approach.
