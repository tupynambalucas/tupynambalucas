# Enterprise Repository Transfer and Local Workspace Runbook

This runbook documents the authoritative, step-by-step procedures to transfer the monorepo from the personal user account (`tupynambalucas/tupynambalucas`) to the corporate GitHub organization (`tupynambalucas-dev`), align remote repository naming with the `@tupynambalucas-dev/platform` standard, and update the local developer environment on Windows.

---

## 1. Architectural Alignment: Repository Naming

In our Bounded Context architecture, package scopes follow the corporate hierarchy:

- **Root Orchestrator**: `@tupynambalucas-dev/platform` (defined in root `package.json`).
- **Target Organization**: `tupynambalucas-dev`
- **Target Repository Name**: `platform` (recommended: `https://github.com/tupynambalucas-dev/platform`) or `tupynambalucas-core` (if legacy branding is required).
  - _Recommendation_: Name the GitHub repository `platform` to achieve 1:1 symmetry with the root package `"name": "@tupynambalucas-dev/platform"`.

---

## 2. GitHub Transfer Procedure (Cloud)

GitHub provides a zero-downtime repository transfer mechanism that automatically preserves all commit history, tags, pull requests, releases, issues, and redirects existing Git traffic.

### Step-by-Step GitHub Transfer

1. **Access Repository Settings**:
   - Navigate to: `https://github.com/tupynambalucas/tupynambalucas/settings`
2. **Scroll to Danger Zone**:
   - Scroll down to the bottom of the General settings page to **Danger Zone**.
3. **Execute Transfer**:
   - Click **Transfer ownership** (`Transfer`).
   - In **New owner's GitHub username or organization name**, enter: `tupynambalucas-dev`.
   - In **Type the name of the repository to confirm**, enter: `tupynambalucas`.
   - Confirm the transfer.
4. **Rename Repository (in Organization)**:
   - Once transferred to `tupynambalucas-dev`, navigate to `https://github.com/tupynambalucas-dev/tupynambalucas/settings`.
   - Under **Repository name**, change `tupynambalucas` to `platform`.
   - Click **Rename**.

---

## 3. Local Workspace Alignment (Windows)

When renaming directories on Windows, running processes (such as IDEs, background node servers, or terminals) hold open file descriptors and block renaming with error `EBUSY` or `Access Denied`.

### Step 1: Terminate Local Locks

1. Close all active terminal sessions running in `C:\Users\tupyn\projects\tupynambalucas`.
2. Stop background Docker / Skaffold / dev servers.
3. Close the IDE (VS Code / Antigravity).

### Step 2: Rename the Folder in PowerShell

Open a standard PowerShell window (not located inside the target folder) and run:

```powershell
Rename-Item -Path "C:\Users\tupyn\projects\tupynambalucas" -NewName "platform"
```

If you prefer prefixing with the organization:

```powershell
Rename-Item -Path "C:\Users\tupyn\projects\tupynambalucas" -NewName "tupynambalucas-dev-platform"
```

### Step 3: Update Git Remote Origin

Reopen your terminal inside the renamed directory (`C:\Users\tupyn\projects\platform`) and update the remote origin URLs:

```bash
# If using SSH (Recommended):
git remote set-url origin git@github.com:tupynambalucas-dev/platform.git

# If using HTTPS:
git remote set-url origin https://github.com/tupynambalucas-dev/platform.git

# Verify remote configuration:
git remote -v
```

### Step 4: Verify Branch Synchronization

Ensure all local branches reference the newly transferred remote:

```bash
git fetch origin --prune
git status
```

---

## 4. Verification Checklist

- [x] All 22 monorepo workspaces standardized under `@tupynambalucas-dev/*`.
- [x] Docusaurus documentation and portal homepage verified error-free (`pnpm portal:build`).
- [x] All changes cleanly committed following Conventional Commits.
- [x] Branch `develop` pushed to origin.
- [x] Branch `develop` merged into `main` and pushed to origin.
- [x] Repository transferred to `tupynambalucas-dev` organization on GitHub.
- [x] Local Windows folder renamed to `platform` (`tupynambalucas-dev\platform`).
- [x] Local Git remote updated to `https://github.com/tupynambalucas-dev/platform.git`.
- [x] Functional teams RBAC synchronized (`core-engineers: push`, `infra-ops: maintain`, `creative-team: push`).
