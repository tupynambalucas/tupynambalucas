# Environments and Hostnames

Technical specification of the overlay matrix, hostname convention, and namespaces for the `tupynambalucas.dev` infrastructure.

## Overlay Matrix

| Overlay             | Target cluster            | Hostname suffix | Deployed by |
| :------------------ | :------------------------ | :-------------- | :---------- |
| `dev/hub`           | `k3d-hub`                 | `-dev`          | Skaffold    |
| `dev/corporate`     | `k3d-corporate`           | `-dev`          | Skaffold    |
| `staging/hub`       | staging hub cluster       | `-stg`          | ArgoCD      |
| `staging/corporate` | staging corporate cluster | `-stg`          | ArgoCD      |
| `prod/hub`          | prod hub cluster          | none            | ArgoCD      |
| `prod/corporate`    | prod corporate cluster    | none            | ArgoCD      |

Cloudflare Universal SSL covers one subdomain level, so environments use a suffix instead of a nested subdomain: `grafana-dev.tupynambalucas.dev`, `grafana-stg.tupynambalucas.dev`, `grafana.tupynambalucas.dev`.

## Hostname Injection

- Base manifests declare the production hostname (for example `grafana.tupynambalucas.dev`). The `prod` overlays apply no hostname patches.
- The `dev` and `staging` overlays replace each Ingress `host` through inline JSON 6902 patches in their `kustomization.yaml`, targeting the Ingress by `kind` and `name`.
- JSON patches are used instead of strategic merge patches because `host` is a list element of `spec.rules`, which has no strategic merge key.
- Rule indexes are positional. When a rule is added to or removed from a base Ingress, the patches in all four non-prod overlays MUST be updated.

| Ingress                        | Namespace   | Rule indexes patched                                                   |
| :----------------------------- | :---------- | :--------------------------------------------------------------------- |
| `traefik-dashboard-ingress`    | `platform`  | 0 (`traefik`)                                                          |
| `grafana-ingress`              | `platform`  | 0 (`grafana`)                                                          |
| `headlamp-ingress`             | `platform`  | 0 (`headlamp`)                                                         |
| `turbocache-ingress`           | `platform`  | 0 (`turbocache`)                                                       |
| `memos-ingress`                | `studio`    | 0 (`memos`)                                                            |
| `penpot-ingress`               | `studio`    | 0 (`penpot`)                                                           |
| `memory-ingress`               | `cortex`    | 0 (`memory`), 1 (`memory-api`)                                         |
| `agentgateway-ingress`         | `cortex`    | 0 (`agentgateway`), 1 (`agentgateway-ingress`), 2 (`agentgateway-mcp`) |
| `web-ingress`                  | `corporate` | 0 (`web`)                                                              |
| `api-ingress`                  | `corporate` | 0 (`api`)                                                              |
| `kb-docusaurus-portal-ingress` | `docs`      | 0 (`docs`), `dev` only                                                 |

## Namespaces

Defined in [manifests/hub/namespaces](../../manifests/hub/namespaces/kustomization.yaml) and [manifests/corporate/namespaces](../../manifests/corporate/namespaces/kustomization.yaml). Names are stable because internal URLs such as `*.platform.svc` depend on them.

| Namespace   | Contents                                                    |
| :---------- | :---------------------------------------------------------- |
| `platform`  | Observability, Traefik, Cloudflared, Headlamp, Turbocache   |
| `cortex`    | AgentGateway, MCP services, Memory API and web, MongoDB     |
| `studio`    | Penpot, Memos                                               |
| `corporate` | Traefik, Cloudflared, Web, API, Redis, MongoDB (`dev` only) |
| `docs`      | Documentation portal (`dev` only)                           |

## Secrets

Each overlay generates its secrets from `k8s/.env` with `secretGenerator` and `generatorOptions.disableNameSuffixHash: true`:

- Hub overlays generate `platform-secrets`, `cortex-secrets`, and `studio-secrets`.
- The `dev/corporate` overlay generates `corporate-secrets`. The `staging` and `prod` corporate
  overlays do not generate secrets from `.env`. The cloud secret mechanism provides
  `corporate-secrets`.

## Documentation Portal

The portal runs in Kubernetes only in `dev`, so Skaffold can hot reload it. In `staging` and
`prod`, `deploy-docs.yaml` publishes it to Cloudflare Pages (`docs.tupynambalucas.dev`). It is not
part of any cloud overlay or tunnel.

## Validation

Every overlay MUST render without errors:

```bash
kubectl kustomize --load-restrictor=LoadRestrictionsNone k8s/overlays/dev/hub
```

Third-party Helm charts (Traefik) are not rendered by Kustomize. See [Separation of Deployers](../explanation/separation-of-deployers.md).
