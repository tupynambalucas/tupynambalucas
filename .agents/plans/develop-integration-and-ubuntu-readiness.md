# Develop Integration and Ubuntu Readiness

Audit of the `enterprise-architecture` plan set against the current `k8s/` tree and the Git state of
`chore/enterprise-architecture`, followed by the procedure that lands the branch in `develop`
without overwriting files and the gates that must pass before the Ubuntu environment is built.

Related documents:

- [Ubuntu setup](./enterprise-architecture/ubuntu-setup.md)
- [Migration phases](./enterprise-architecture/migration-phases.md)
- [Infrastructure refactor](./enterprise-architecture/infrastructure-refactor.md)

## 1. Git State (measured)

| Fact                                                       | Value                                 |
| :--------------------------------------------------------- | :------------------------------------ |
| `chore/enterprise-architecture` commits ahead of `develop` | 15                                    |
| `chore/enterprise-architecture` commits behind `develop`   | 0                                     |
| `develop` versus `origin/develop`                          | identical                             |
| Merge base of the branch and `develop`                     | `4c36dda8` (tip of `develop`)         |
| `main` only commits                                        | 50 (renderer bot, no net file change) |
| `develop` only commits (relative to `main`)                | 1                                     |
| Dry run `chore -> develop` (`git merge-tree`)              | clean, no conflicts                   |
| Dry run `develop -> main`                                  | clean, no conflicts                   |
| Rename detection `develop..HEAD`                           | 869 renames, 176 adds, 244 deletes    |
| `core.autocrlf` on Windows, index line endings             | `true`, index is LF                   |
| Uncommitted entries in the working tree                    | 52 (staged renames, edits, untracked) |

Consequences:

- The branch is a strict descendant of `develop`. A fast-forward is possible, so nothing in
  `develop` can be overwritten.
- Nothing from `develop` is missing in the branch because the branch is zero commits behind.
- The 52 uncommitted entries are NOT in any branch. They contain the entire `k8s/` rework of this
  session (kustomization files, file renames, overlay patches, reference docs). A clone, a
  checkout, or a `git clean` would lose them.
- The `origin/generated` branch is 215 commits behind its remote counterpart locally. It is
  written by the renderer workflow and MUST NOT be touched by this migration.

## 2. Findings in the Plan Set

### 2.1 Blocking

| ID  | Finding                                                                                                                                                                                                                         | Fix                                                                                       |
| :-- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | :---------------------------------------------------------------------------------------- |
| B1  | Work is uncommitted. `ubuntu-setup.md` clones from `/mnt/d/...`, which only carries committed history.                                                                                                                          | Commit and push the branch first (section 4, step 1). Clone from GitHub, not from `/mnt`. |
| B2  | `git clone /mnt/...` sets `origin` to the Windows path, not GitHub. The plan states the opposite.                                                                                                                               | Clone from the GitHub URL, or run `git remote set-url origin <github-url>` after cloning. |
| B3  | Windows path is wrong. The repository lives at `C:\Users\tupyn\projects\tupynambalucas`, not `D:\projects\Tupynambalucas`.                                                                                                      | Use `/mnt/c/Users/tupyn/projects/tupynambalucas` for secret copy and the backup.          |
| B4  | The `.env` copy step overwrites the restructured `k8s/.env` (sectioned, corporate variables merged) with the old `infrastructure/.env`.                                                                                         | Copy `k8s/.env` from the Windows checkout as is. Never copy `infrastructure/.env`.        |
| B5  | `corporate` cluster has no ingress controller. `skaffold.corporate.yaml` has no `helm.releases` for Traefik, and k3s Traefik is disabled in the cluster command. Ingresses in `manifests/corporate/portal` use class `traefik`. | Add the Traefik release to `skaffold.corporate.yaml` (section 5, item C1).                |
| B6  | `corporate` cluster has no `cloudflared` Deployment. `cloudflared.yaml` lives only in `manifests/hub/network`. The plan states every cluster runs its own tunnel.                                                               | Add `manifests/corporate/network/cloudflared.yaml` or document corporate as tunnel-less.  |
| B7  | `.github/workflows/deploy-docs.yaml` still triggers on `knowledge-base/**` and publishes `knowledge-base/docusaurus/services/portal/build`. After merging into `develop` the docs deployment stops triggering or fails.         | Update path filter and `directory` to `corporate/services/portal` (section 5, item C2).   |
| B8  | Root `package.json` still defines `hub:up`, `hub:down`, `hub:reset`, `hub:prod`, `hub:staging` against `hub/infrastructure/docker`, plus `podman:*` and `minikube:*` scripts. `k8s/package.json` still runs `podman` prune.     | Remove or replace the scripts (section 5, item C3).                                       |

### 2.2 Inconsistencies

| ID  | Finding                                                                                                                                                                    | Fix                                                                    |
| :-- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :--------------------------------------------------------------------- |
| I1  | `ubuntu-setup.md` intro says "one k3d cluster named `dev`". The body and `README.md` define two clusters, `hub` and `corporate`.                                           | Intro corrected to two clusters.                                       |
| I2  | Registry created as `registry.localhost` (container `k3d-registry.localhost`). `migration-phases.md` rollback deletes `enterprise-registry`, which does not exist.         | Rollback corrected to `k3d-registry.localhost` and the shared network. |
| I3  | `migration-phases.md` Phase 2 validation uses `kustomize build --enable-helm`. The adopted standard is Separation of Deployers with `kubectl kustomize` and no Helm.       | Validation command corrected.                                          |
| I4  | Phases 2 and 4 describe work that is already committed (`hub/`, `corporate/`, `k8s/` exist, `pnpm-workspace.yaml` is updated).                                             | Phases marked as completed in section 3.                               |
| I5  | `enterprise-architecture/README.md` links `../wsl-ubuntu-docker-k3d-native-migration.md` and `../wsl-ubuntu-podman-migration.md`. Neither file exists in `.agents/plans/`. | Remove the two dead links.                                             |
| I6  | `.wslconfig` comments are in Portuguese. Repository rule requires en-US.                                                                                                   | Comments translated.                                                   |
| I7  | `hub` overlays include every namespace manifest, including `docs`. `docs` belongs to `corporate` only.                                                                     | Split `manifests/namespaces` per cluster (section 5, item C4).         |

### 2.3 Gaps in `ubuntu-setup.md`

| ID  | Gap                                                                                                                                                                                  | Resolution                                                                                  |
| :-- | :----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :------------------------------------------------------------------------------------------ |
| G1  | Docker Desktop for Windows with WSL integration conflicts with native Docker Engine (two daemons, `docker context`).                                                                 | Disable Docker Desktop WSL integration. Verify with `docker context ls` and `docker info`.  |
| G2  | Skaffold pushes `localhost:5000/<image>` but pods pull through the node containerd mirror. `k3d-registry.localhost` must resolve on the host and mirrors must cover the pushed name. | Add `127.0.0.1 k3d-registry.localhost` to `/etc/hosts` and add a push-then-pull smoke test. |
| G3  | Tool versions are unpinned (`skaffold latest`, `pnpm@latest`, k3d `main`). Skaffold is `v4beta11`, k3s is whatever k3d ships.                                                        | Pin Skaffold, k3d, Helm, and `--image rancher/k3s:<version>`.                               |
| G4  | Native build prerequisites are missing for `bcrypt`, `sharp`, and `protobufjs` builds (`build-essential`, `python3`, `git`, `jq`, `unzip`).                                          | Add an `apt` prerequisite block.                                                            |
| G5  | No Git identity, GitHub authentication, or SSH key step inside Ubuntu.                                                                                                               | Add `git config user.*` and `gh auth login` (or SSH key) before the first push.             |
| G6  | `fs.inotify.max_user_watches` is not raised. Skaffold sync and Docusaurus watchers exhaust the default on large trees.                                                               | Add a `sysctl` drop-in.                                                                     |
| G7  | Husky hooks and `lint-staged` run under `pnpm install`. Hooks require `pnpm install` to finish before the first commit.                                                              | Add to Phase 1 validation.                                                                  |
| G8  | `.vscode/tasks.json` has Windows only launchers for `Antigravity CLI` and `Admin CLI`. No `linux` branch exists and `Admin CLI` references a missing `launch-admin.ps1`.             | Add `linux` command blocks or remove obsolete tasks (section 5, item C5).                   |
| G9  | `agy`, Claude, and MCP tool configuration are per-user. Repository `.agents/` is versioned, but `~/.gemini` is not.                                                                  | Document that user level configuration is re-created after cloning.                         |
| G10 | `k8s/.env` keys include `CLOUDFLARE_TUNNEL_TOKEN`. A single token cannot serve two clusters in dev.                                                                                  | Use one token per tunnel (`dev-hub`, `dev-corporate`) as separate keys.                     |

## 3. Phase Status

| Phase                     | Status                                                                      |
| :------------------------ | :-------------------------------------------------------------------------- |
| 0 Preparation             | Done. Backup `tupynambalucas-backup` exists. Branch created from `develop`. |
| 2 Infrastructure refactor | Done except items B5, B6, I7.                                               |
| 4 Monorepo restructure    | Done in Git history. Remaining cleanup: B7, B8, stale references.           |
| 1 Ubuntu environment      | Pending. Blocked by B1 to B4.                                               |
| 3 Cloudflare              | Pending.                                                                    |
| 5 Cloud environments      | Pending.                                                                    |

## 4. Procedure: Land the Branch in `develop`

All commands run on Windows in `C:\Users\tupyn\projects\tupynambalucas` unless stated.

1. Freeze and commit the working tree on the branch.

   ```powershell
   git status --short
   git add -A k8s .agents corporate
   git status --short
   git commit -m "refactor(k8s): apply component layout and anti-stuttering manifest names"
   ```

   Review `git status --short` before and after. Stage remaining entries explicitly. Do not use
   `git add -A` at the repository root while `.env` files exist, although `.gitignore` excludes
   them.

2. Verify that secrets and generated files are not staged.

   ```powershell
   git diff --cached --name-only | Select-String -Pattern "\.env$|node_modules|\.docusaurus"
   ```

   The command MUST print nothing.

3. Run the quality gates on the branch: `pnpm install --frozen-lockfile`, `pnpm -r typecheck`,
   and `kubectl kustomize --load-restrictor=LoadRestrictionsNone k8s/overlays/<env>/<ctx>` for all
   six overlays.

4. Push the branch.

   ```powershell
   git push origin chore/enterprise-architecture
   ```

5. Refresh and compare with the remote before integrating.

   ```powershell
   git fetch --all --prune
   git rev-list --left-right --count origin/develop...chore/enterprise-architecture
   ```

   Expected output is `0 N`. If the left number is greater than zero, someone pushed to
   `develop`. Run `git merge origin/develop` into the branch, resolve conflicts on the branch,
   re-run step 3, and push again. Never resolve conflicts on `develop`.

6. Open a pull request `chore/enterprise-architecture -> develop`. Use the merge strategy
   `Rebase and merge` or a merge commit. Do NOT use squash. Squash collapses 15 commits and
   discards the rename history that `git log --follow` relies on.

7. After the merge, protect against stale work:

   ```powershell
   git checkout develop
   git pull --ff-only origin develop
   git branch -d chore/enterprise-architecture
   git push origin --delete chore/enterprise-architecture
   ```

   Keep `tupynambalucas-backup` until Ubuntu validation passes.

8. Update `main` only when `develop` is validated. `main` receives a nightly renderer commit, so
   run `git fetch origin main` and `git merge --no-ff origin/develop` on a short lived branch
   `chore/sync-main`, then open a pull request into `main`. A dry run showed no conflicts.

### 4.1 Safety Rules

- Never `git push --force` to `develop` or `main`.
- Never run `git clean -fd` or `git reset --hard` while the 52 uncommitted entries exist.
- The renderer workflow writes to `main` and `generated`. Do not rebase either branch.
- `.github/workflows/deploy-docs.yaml` triggers on every push to `develop` that touches its path
  filter. Fix item B7 in the same pull request, otherwise the first push to `develop` after the
  move deploys nothing or fails.

## 5. Required Changes Before Merge

Status: C1 to C7 are implemented on the branch and pending the next commit and push. The merge into
`develop` is deferred.

| ID  | Change                                                                                                                                                                       | Location                                                         |
| :-- | :--------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :--------------------------------------------------------------- |
| C1  | Add the Traefik Helm release to the corporate Skaffold module, mirroring `skaffold.hub.yaml`, and add `overlays/dev/corporate/helm-values/traefik-values.yaml`.              | `k8s/skaffold.corporate.yaml`, `k8s/overlays/dev/corporate`      |
| C2  | Replace `knowledge-base/**` with `corporate/**` in the path filter and set `directory: corporate/services/portal/build`. Confirm the Docusaurus output path first.           | `.github/workflows/deploy-docs.yaml`                             |
| C3  | Remove `hub:up`, `hub:down`, `hub:reset`, `hub:prod`, `hub:staging`, `podman:*`, `minikube:*`. Point `infra:dev` and `infra:delete` to `skaffold dev` and `skaffold delete`. | `package.json`, `k8s/package.json`                               |
| C4  | Split namespaces so that `hub` creates `platform`, `cortex`, `studio` and `corporate` creates `docs`.                                                                        | `k8s/manifests/namespaces`, overlays                             |
| C5  | Add `linux` launchers to `.vscode/tasks.json` and delete tasks that reference missing scripts.                                                                               | `.vscode/tasks.json`                                             |
| C6  | Remove stale `knowledge-base` entries from `.dockerignore` and rewrite `.agents/scripts/refactor_preset.cjs` paths or delete the one-off script.                             | `.dockerignore`, `.agents/scripts`                               |
| C7  | Split `CLOUDFLARE_TUNNEL_TOKEN` into `CLOUDFLARE_TUNNEL_TOKEN_HUB` and `CLOUDFLARE_TUNNEL_TOKEN_CORPORATE` and update the cloudflared manifests.                             | `k8s/.env.example`, `k8s/manifests/hub/network/cloudflared.yaml` |

## 6. Ubuntu Readiness Gates

Execute in order. Each gate has a pass condition.

| Gate | Action                                                                                                               | Pass condition                                                    |
| :--- | :------------------------------------------------------------------------------------------------------------------- | :---------------------------------------------------------------- |
| U0   | Section 4 steps 1 to 4 completed.                                                                                    | `git status` clean, branch present on GitHub.                     |
| U1   | Back up the Windows checkout to `tupynambalucas-backup` again (includes `k8s/.env`).                                 | `k8s/.env` exists in the backup.                                  |
| U2   | `wsl --install -d Ubuntu`, `.wslconfig`, systemd, `wsl --shutdown`.                                                  | `systemctl is-system-running` returns `running`.                  |
| U3   | Disable Docker Desktop WSL integration, install Docker Engine.                                                       | `docker info` reports the Ubuntu engine, not `desktop-linux`.     |
| U4   | Install pinned toolchain (k3d, kubectl, Helm, Skaffold, Node 22, pnpm).                                              | All `--version` commands succeed.                                 |
| U5   | Clone from GitHub into `~/projects/tupynambalucas`, check out the branch, copy `k8s/.env` from the Windows checkout. | `git remote -v` shows GitHub, `k8s/.env` present and not tracked. |
| U6   | `pnpm install --frozen-lockfile`.                                                                                    | Exit code 0, Husky hooks installed.                               |
| U7   | Create network, registry, and both clusters.                                                                         | Both `kubectl --context ... get nodes` report `Ready`.            |
| U8   | Registry smoke test: tag, push to `localhost:5000`, run a pod with the pushed image on each cluster.                 | Pod reaches `Running` on `k3d-hub` and `k3d-corporate`.           |
| U9   | `kubectl kustomize --load-restrictor=LoadRestrictionsNone` on all six overlays inside Ubuntu.                        | Six exit codes of 0.                                              |
| U10  | `skaffold dev -f skaffold.hub.yaml`, then `skaffold dev -f skaffold.corporate.yaml`.                                 | Deployments Available, tunnel logs show registered connections.   |
| U11  | Open the repository through the WSL extension and run the Linux task launchers.                                      | Integrated terminal is `bash` in the repository root.             |
| U12  | Freelens connects to both contexts.                                                                                  | Cluster list shows `k3d-hub` and `k3d-corporate`.                 |

Rollback for U7 to U10: `k3d cluster delete hub corporate`, `k3d registry delete k3d-registry.localhost`,
`docker network rm k3d-enterprise-net`. The Windows checkout and the backup stay untouched.

## 7. Exit Criteria

- `develop` contains the 15 branch commits plus the commit of section 4 step 1, with history
  preserved (`git log --follow` works on moved files).
- `git grep -n -E "knowledge-base|hub/infrastructure|podman|minikube"` returns no match outside
  `.agents/references`, `.agents/plans`, and documentation that explains the migration.
- Deploy Documentation workflow succeeds on the first push to `develop`.
- Gates U0 to U12 pass.
