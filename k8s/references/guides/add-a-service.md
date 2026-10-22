# How to Add a Service

Procedure for adding a new first-party service to the `hub` or `corporate` stack.

## Steps

1. Create the component folder under the correct bounded context, for example `k8s/manifests/hub/tools/my-service/`. Keep all resources of the component flat in this folder. See [Directory Structure Conventions](../explanation/folder-structure.md).
2. Write the manifest (`my-service.yaml`) with the production hostname in its Ingress. Do not include `-dev` or `-stg` hostnames.
3. If the service has configuration files, store them in their native format next to the manifest and generate the ConfigMap with `configMapGenerator`. See [Configuration as Code](../explanation/configuration-as-code.md).
4. Create `kustomization.yaml` in the component folder listing the manifest under `resources:`.
5. Add the folder to the aggregating `kustomization.yaml` of the parent (`hub/tools`, `hub/studio`, `hub/cortex`, or `corporate`).
6. Add an Ingress patch entry for the new Ingress to `overlays/dev/*` and `overlays/staging/*`. See [Environments and hostnames](../reference/environments-and-hostnames.md).
7. If the service builds an image, add the artifact to `skaffold.hub.yaml` or `skaffold.corporate.yaml`.
8. Validate every overlay:

```bash
kubectl kustomize --load-restrictor=LoadRestrictionsNone k8s/overlays/dev/hub
kubectl kustomize --load-restrictor=LoadRestrictionsNone k8s/overlays/staging/hub
kubectl kustomize --load-restrictor=LoadRestrictionsNone k8s/overlays/prod/hub
```

9. Update the documentation in `k8s/references/` if the change introduces a new convention.

## Third-Party Charts

Third-party software is deployed with Helm through Skaffold and ArgoCD, not through Kustomize. Add a `helm.releases` entry in the Skaffold file and place chart values under `overlays/<env>/<context>/helm-values/`.
