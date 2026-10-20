# Develop Integration and Ubuntu Readiness Gates

Technical runbook for landing the `chore/enterprise-architecture` branch into `develop` and `main`
without losing git rename history, followed by the sequential validation gates required before the
native Ubuntu development loop is operational.

Related documents:

- [Ubuntu setup](./ubuntu-setup.md)
- [Migration phases](./migration-phases.md)
- [Infrastructure refactor](./infrastructure-refactor.md)
- [Enterprise architecture review](./enterprise-architecture-review.md)

---

## 1. Branch Integration Strategy

The migration involves structural renames and bounded context relocations. Preserving Git history
(`git log --follow`) requires adhering to strict branch landing rules.

### Safety Rules

- **No Squash Merges**: Merging `chore/enterprise-architecture` into `develop` MUST use a merge
  commit or rebase-and-merge. Squash merging collapses commits into a single commit and discards the
  fine-grained file rename metadata that Git relies on.
- **No Force Pushing**: Never run `git push --force` against `develop` or `main`.
- **Preserve Unversioned Files**: Never execute `git clean -fd` or `git reset --hard` while local
  unversioned files (such as `k8s/.env`) exist outside Git. Keep `tupynambalucas-backup` intact until
  Ubuntu validation passes.
- **Renderer Workflow Protection**: The dynamic renderer bot commits directly to `main` and
  `generated`. Do not rebase `main` against remote history without verifying merge-tree cleanly.

---

## 2. Procedure: Land the Branch into `develop`

All commands run in the repository root.

### Step 1: Stage and Commit the Working Tree

Stage modified manifests, configs, and documentation:

```powershell
git add k8s .agents corporate .vscode package.json
git status --short
git commit -m "chore(arch): finalize enterprise infrastructure refactor and corporate workloads"
```

Verify that secrets and ignored files are not staged:

```powershell
git diff --cached --name-only | Select-String -Pattern "\.env$|node_modules|\.docusaurus"
```

The command must print nothing.

### Step 2: Quality Gates on the Branch

Execute quality verification scripts locally before pushing:

```powershell
pnpm install --frozen-lockfile
pnpm -r typecheck
cd k8s
foreach ($env in 'dev','staging','prod') {
  foreach ($ctx in 'hub','corporate') {
    kubectl kustomize --load-restrictor=LoadRestrictionsNone "overlays/$env/$ctx" *> $null
    if ($LASTEXITCODE -ne 0) { throw "Overlay failed: $env/$ctx" }
  }
}
cd ..
```

All commands must exit with code 0.

### Step 3: Push and Pull Request

Push the working branch to GitHub:

```powershell
git push origin chore/enterprise-architecture
```

Compare with remote `develop`:

```powershell
git fetch --all --prune
git rev-list --left-right --count origin/develop...chore/enterprise-architecture
```

Expected output is `0 N` (zero commits behind `develop`).

Open a pull request from `chore/enterprise-architecture` into `develop`. Merge using a merge commit
or `Rebase and merge`.

### Step 4: Synchronize `develop` Locally

```powershell
git checkout develop
git pull --ff-only origin develop
git branch -d chore/enterprise-architecture
git push origin --delete chore/enterprise-architecture
```

### Step 5: Synchronize `main`

Once `develop` is verified, create a short-lived sync branch to merge into `main`:

```powershell
git checkout main
git pull origin main
git checkout -b chore/sync-main
git merge --no-ff develop -m "chore: sync develop enterprise architecture into main"
git push origin chore/sync-main
```

Open a pull request into `main` and merge.

---

## 3. Ubuntu Readiness Gates

Follow these sequential gates when bootstrapping the native WSL2 Ubuntu environment. Each gate has
an explicit pass condition.

| Gate    | Action                                                                                              | Pass Condition                                                           |
| :------ | :-------------------------------------------------------------------------------------------------- | :----------------------------------------------------------------------- |
| **U0**  | Section 2 steps 1 to 3 completed.                                                                   | `git status` clean, branch pushed to GitHub.                             |
| **U1**  | Verify local backup `tupynambalucas-backup`.                                                        | `k8s/.env` exists safely in backup directory.                            |
| **U2**  | Provision WSL2 Ubuntu: `wsl --install Ubuntu --name dev-ubuntu`, `.wslconfig`, systemd.             | `systemctl is-system-running` inside Ubuntu returns `running`.           |
| **U3**  | Disable Docker Desktop WSL integration, install native Docker Engine.                               | `docker info` reports the native Linux engine, not `desktop-linux`.      |
| **U4**  | Install toolchain (`k3d`, `kubectl`, `helm`, `skaffold`, `kubeseal`, `node 22`, `pnpm`).            | All CLI tool `--version` commands execute with exit code 0.              |
| **U5**  | Clone repository into `~/projects/tupynambalucas` and copy `k8s/.env` from Windows checkout.        | `git remote -v` points to GitHub; `k8s/.env` exists and is ignored.      |
| **U6**  | Install workspace dependencies (`pnpm install --frozen-lockfile`).                                  | Exit code 0, Husky git hooks initialized.                                |
| **U7**  | Create Docker network `k3d-enterprise-net`, local registry, and clusters (`hub`, `corporate`).      | Both `kubectl --context ... get nodes` report `Ready`.                   |
| **U8**  | Registry smoke test: build/tag an image, push to `localhost:5000`, run pod on both clusters.        | Pod reaches `Running` status on both `k3d-hub` and `k3d-corporate`.      |
| **U9**  | Render all six overlays via `kubectl kustomize` inside Ubuntu.                                      | All 6 overlays return exit code 0.                                       |
| **U10** | Launch Skaffold: `skaffold dev -f skaffold.hub.yaml` and `skaffold dev -f skaffold.corporate.yaml`. | Workloads reach `Running` and Cloudflare Tunnel logs confirm connection. |
| **U11** | Open repository via VS Code WSL extension.                                                          | Integrated terminal defaults to Linux `bash` at project root.            |
| **U12** | Connect Freelens desktop client to both cluster contexts.                                           | Freelens cluster list displays healthy `k3d-hub` and `k3d-corporate`.    |

### Rollback for Cluster Setup (U7 to U10)

If local cluster creation fails:

```bash
k3d cluster delete hub corporate
k3d registry delete k3d-registry.localhost
docker network rm k3d-enterprise-net
```

The Windows filesystem checkout and the backup remain untouched.

---

## 4. Exit Criteria

- `develop` and `main` contain the enterprise architecture commits with full Git rename history intact.
- All six Kubernetes overlays render cleanly without errors.
- Gates U0 through U12 pass in the native WSL2 Ubuntu environment.
