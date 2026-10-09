# Migration Phases

Execution order, validation, and rollback. Each phase ends in a state that works on its own.

## Phase 0: Preparation

- **Sync Main:** Ensure the `main` branch is fully synchronized with `develop` (`git checkout main`, `git merge develop`, `git push origin main`) to establish a clean baseline.
- **Create Branch:** Checkout `develop` and create the branch `chore/enterprise-architecture`. All structural changes will happen here.
- **Local Backup (Critical):** Before moving folders, create a full local backup of the repository using `rsync -a` or `cp -a` to a folder outside the Git working tree (e.g., `cp -a Tupynambalucas Tupynambalucas-backup`). This guarantees no unversioned configurations (like `.env`) or local logic are permanently lost if a `git clean -fd` or hard reset is required during the refactor.
- **Handling Tracked vs Untracked Files:**
  - Use `git mv` (or `git mv -k` to gracefully skip errors) exclusively for tracked files to preserve Git history.
  - Ignored files like `node_modules` must _not_ be moved. Delete them and regenerate them using `pnpm install` after the restructure to ensure workspace symlinks rebuild correctly.
  - Crucial unversioned files like `.env` must be moved manually (e.g., `cp infrastructure/.env k8s/.env`) by referring to the backup.
- **Record a baseline:** `pnpm install`, `pnpm -r typecheck`, and a successful docs build.

Rollback: delete the branch and restore unversioned files from the backup.

## Phase 1: Ubuntu Environment

Follow [Ubuntu setup](./ubuntu-setup.md). Clone the repository into the Linux filesystem and copy
the `.env` files.

Validation:

- `kubectl --context k3d-hub get nodes` and `kubectl --context k3d-corporate get nodes` list nodes.
- `pnpm install` completes on the Linux clone.
- Local registry responds on `localhost:5000`.

Rollback: delete the clusters with `k3d cluster delete hub corporate && k3d registry delete enterprise-registry`. The Windows setup is untouched.

## Phase 2: Infrastructure Refactor

Follow [Infrastructure refactor](./infrastructure-refactor.md) without moving any monorepo
context. Skaffold paths still point at the current `platform`, `studio`, `cortex`, and
`knowledge-base` folders.

Steps:

1. Rename `infrastructure/` to `k8s/` with `git mv`.
2. Move manifests into the new tree and update the file mapping. Remove obsolete cert-manager
   namespace and charts.
3. Create `overlays/dev/hub` and `overlays/dev/corporate`, remove hostnames from the base.
4. Split `skaffold.yaml` into the root and two module files.
5. Update `pnpm-workspace.yaml`, root `package.json` scripts, and the `AGENTS.md` router.

Validation:

- `kustomize build --enable-helm --load-restrictor=LoadRestrictionsNone overlays/dev/hub` and
  `overlays/dev/corporate` render without errors.
- The rendered dev output matches the output of the old `environments/local` apart from file
  order. Compare with `diff` on the sorted resources.
- `skaffold dev -f skaffold.hub.yaml` and `skaffold dev -f skaffold.corporate.yaml` reach healthy states and `-dev` hostnames respond through the tunnels.

Rollback: revert the phase commits.

## Phase 3: Cloudflare

Follow [Cloudflared tunnels](./cloudflared-tunnels.md).

- Confirm the `dev-hub` and `dev-corporate` tunnels and public hostnames in Cloudflare dashboard.
- Add Cloudflare Access policies to every `hub` hostname.

Validation: tunnel logs show registered connections and each hostname answers.

## Phase 4: Monorepo Restructure

Follow [Monorepo restructure](./monorepo-restructure.md). Do one context per commit, in this
order:

1. Remove `hub/infrastructure/docker` with `git rm`, move `hub/` to `corporate/`, then merge
   `knowledge-base/` into it.
2. Create the new `hub/` and dissolve `platform/` directly into `hub/observability/`,
   `hub/tools/`, and `hub/network/`.
3. Move `studio/` to `hub/studio/` and `cortex/` to `hub/cortex/`.
4. Update the Skaffold artifact paths, Dockerfiles, workflows, and router files.
5. Update the documentation pages that describe bounded contexts.

Validation after each commit:

- `pnpm install` and `pnpm -r typecheck` pass.
- `skaffold build -f skaffold.hub.yaml` and `skaffold build -f skaffold.corporate.yaml` build artifacts.

Final validation: clean runs of both stacks on fresh `k3d-hub` and `k3d-corporate` clusters.

Rollback: revert the last commit. Each context move is independent.

## Phase 5: Cloud Environments

- Add the `staging` and `prod` overlays for `hub` and `corporate` with their hostnames and
  tunnels.
- Provision the clusters with Terraform in `terraform/`.
- Install ArgoCD and create one Application per overlay.

Validation: ArgoCD reports every Application as Synced and Healthy.

## Exit Criteria

- One command starts the whole `dev` environment from a clean clone on Ubuntu.
- No `-dev` hostname remains in `manifests/`.
- `pnpm -r typecheck`, the docs build, and the renderer workflow pass.
- No reference to `infrastructure/`, `knowledge-base/`, or root-level `platform/`, `studio/`,
  `cortex/` remains in the repository.
