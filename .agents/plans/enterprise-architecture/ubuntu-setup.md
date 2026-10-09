# Ubuntu Native Environment Setup

Configures WSL2 Ubuntu to run one k3d cluster named `dev` that hosts the `hub` and `corporate`
bounded contexts. Source code lives on the Linux filesystem (`ext4`) to remove the NTFS and
`gvproxy` bottlenecks that crashed the Skaffold proxy.

## 1. WSL2 Preparation

1. Install the distribution from Windows PowerShell:

   ```powershell
   wsl --install -d Ubuntu
   ```

2. Limit WSL2 resources in `%UserProfile%\.wslconfig`. The `dev` cluster requests about 3.8 GB of
   memory and has limits near 15.9 GB, so reserve headroom for builds:

   ```ini
   [wsl2]
   memory=16GB
   processors=8
   swap=4GB
   localhostForwarding=true

   [experimental]
   # Libera RAM cacheada de volta para o Windows gradualmente
   autoMemoryReclaim=gradual
   # Evita que o disco virtual cresça indefinidamente sem encolher
   sparseVhd=true
   ```

3. Enable systemd in `/etc/wsl.conf` inside Ubuntu so Docker starts with the distribution:

   ```ini
   [boot]
   systemd=true
   ```

4. Restart WSL2 with `wsl --shutdown`.
5. Clone the repository inside the Linux home directory, never under `/mnt/d`:

   ```bash
   mkdir -p ~/projects && cd ~/projects
   # Fast local clone from Windows disk preserving git history and origin:
   git clone /mnt/d/projects/Tupynambalucas ~/projects/Tupynambalucas
   cd ~/projects/Tupynambalucas
   git config --global core.autocrlf input
   ```

## 2. Toolchain Installation

Install all required developer tools inside Ubuntu:

### Docker Engine

```bash
sudo apt-get update
sudo apt-get install -y ca-certificates curl gnupg
sudo install -m 0755 -d /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg \
  | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg
echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] \
https://download.docker.com/linux/ubuntu $(. /etc/os-release && echo $VERSION_CODENAME) stable" \
  | sudo tee /etc/apt/sources.list.d/docker.list
sudo apt-get update
sudo apt-get install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin
sudo usermod -aG docker $USER
```

### k3d

```bash
curl -s https://raw.githubusercontent.com/k3d-io/k3d/main/install.sh | bash
```

### kubectl

```bash
curl -fsSL https://pkgs.k8s.io/core:/stable:/v1.31/deb/Release.key \
  | sudo gpg --dearmor -o /etc/apt/keyrings/kubernetes-apt-keyring.gpg
echo 'deb [signed-by=/etc/apt/keyrings/kubernetes-apt-keyring.gpg] https://pkgs.k8s.io/core:/stable:/v1.31/deb/ /' \
  | sudo tee /etc/apt/sources.list.d/kubernetes.list
sudo apt-get update
sudo apt-get install -y kubectl
```

### Helm

```bash
curl -fsSL https://raw.githubusercontent.com/helm/helm/main/scripts/get-helm-3 | bash
```

### Skaffold

```bash
curl -Lo skaffold https://storage.googleapis.com/skaffold/releases/latest/skaffold-linux-amd64
sudo install skaffold /usr/local/bin/
rm skaffold
```

### Node.js (LTS v22) and pnpm

```bash
curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash -
sudo apt-get install -y nodejs
corepack enable
corepack prepare pnpm@latest --activate
```

## 3. Local Registry and Clusters

The two clusters run on a shared Docker network and use a single local registry on port 5000.
Because each cluster has its own Cloudflare Tunnel, neither cluster needs to compete for host
ports 80 and 443. Both clusters disable the bundled Traefik in favor of our custom Helm-deployed
Traefik:

```bash
# 1. Create shared Docker network
docker network create k3d-enterprise-net

# 2. Create shared local registry
k3d registry create registry.localhost --port 5000

# 3. Create Hub cluster (internal tooling)
k3d cluster create hub \
  --network k3d-enterprise-net \
  --servers 1 \
  --agents 1 \
  --registry-use k3d-registry.localhost:5000 \
  --k3s-arg "--disable=traefik@server:*"

# 4. Create Corporate cluster (external products)
k3d cluster create corporate \
  --network k3d-enterprise-net \
  --servers 1 \
  --agents 1 \
  --registry-use k3d-registry.localhost:5000 \
  --k3s-arg "--disable=traefik@server:*"

# 5. Configure default repo for Skaffold
skaffold config set default-repo localhost:5000
```

## 4. Zero Data Loss Guarantee & Secrets Migration

Setting up WSL2 and native Linux carries **zero risk of losing your existing project**:

1. **Storage Isolation**: Windows drives (`C:`, `D:`) and WSL2 disks are physically and logically
   independent. WSL2 stores its data inside a dedicated virtual disk (`ext4.vhdx`). Nothing done
   inside Ubuntu can accidentally wipe or modify `D:\projects\tupynambalucas`.
2. **Git Cloud Remote**: Your Git commits and branches are hosted securely on GitHub.
3. **Safe Clone**: We clone into `~/projects/Tupynambalucas` inside Linux. The Windows repository
   at `D:\projects\tupynambalucas` remains an untouched backup.
4. **Copying Untracked `.env` Secrets**:
   Copy uncommitted `.env` files from Windows directly into the Linux environment:

   ```bash
   # From inside Ubuntu:
   cp /mnt/d/projects/Tupynambalucas/.env ~/projects/Tupynambalucas/.env 2>/dev/null || true
   cp /mnt/d/projects/Tupynambalucas/infrastructure/.env ~/projects/Tupynambalucas/k8s/.env 2>/dev/null || true
   ```

5. **Disaster Recovery (1-Command Full System Snapshot)**:
   You can take a complete, bootable image backup of your entire Ubuntu environment at any time
   from Windows PowerShell:

   ```powershell
   # In Windows PowerShell (stops WSL and exports full snapshot):
   wsl --shutdown
   wsl --export Ubuntu "D:\wsl-backup\ubuntu-dev-$(Get-Date -Format 'yyyyMMdd').tar"
   ```

   To restore the entire machine on any Windows computer:

   ```powershell
   wsl --import Ubuntu-Restored "C:\WSL\Ubuntu" "D:\wsl-backup\ubuntu-dev-20261005.tar" --version 2
   ```

6. **Direct Windows File Explorer Access**:
   You can inspect or copy files directly between Windows and Ubuntu at any time by entering
   this path in Windows Explorer: `\\wsl$\Ubuntu\home\<USER>\projects\Tupynambalucas`.

## 5. IDE Integration (VS Code / Antigravity)

Antigravity and VS Code communicate with WSL2 using the remote server architecture: the UI runs on
Windows with GPU acceleration, while language servers, extensions, pnpm, and terminal shells run
inside native Linux ext4.

### Opening the Project

1. Install the **WSL** extension (`ms-vscode-remote.remote-wsl`) in Antigravity or VS Code on
   Windows.
2. Open Windows Terminal (Ubuntu profile) and navigate to the project directory:

   ```bash
   cd ~/projects/Tupynambalucas
   code .
   # or when using the Antigravity launcher:
   antigravity .
   ```

   VS Code / Antigravity launches on Windows with `WSL: Ubuntu` displayed in the bottom-left corner.

3. Alternatively, inside VS Code / Antigravity, press `Ctrl+Shift+P` -> select
   `WSL: Open Folder in WSL...` -> enter `/home/<USER>/projects/Tupynambalucas`.

### Terminal and Tasks Integration

When opened in WSL mode:

- The integrated terminal (`` Ctrl+` ``) automatically opens native Ubuntu `bash` inside the
  repository.
- `.vscode/tasks.json` can define OS-specific launchers (`windows` vs `linux`) so tasks work
  whether opened locally on Windows or remotely inside WSL:

```json
{
  "version": "2.0.0",
  "tasks": [
    {
      "label": "Antigravity CLI",
      "type": "process",
      "windows": {
        "command": "pwsh.exe",
        "args": [
          "-WindowStyle",
          "Hidden",
          "-Command",
          "Start-Process wt.exe -ArgumentList '--window -1 --maximized --profile \"Tupynamba - Antigravity CLI\" -d \"${workspaceFolder}\" -- pwsh.exe -NoExit -ExecutionPolicy Bypass -File \"${workspaceFolder}\\.vscode\\scripts\\launch-agy.ps1\"'"
        ]
      },
      "linux": {
        "command": "bash",
        "args": ["-c", "if command -v agy >/dev/null 2>&1; then agy; else pnpm agy; fi"]
      },
      "problemMatcher": [],
      "presentation": { "reveal": "always", "panel": "new" }
    }
  ]
}
```

## 6. Freelens Connectivity

Freelens runs on Windows and connects directly to both k3d clusters inside WSL2:

1. Merge both cluster contexts inside Ubuntu:

   ```bash
   k3d kubeconfig merge hub --kubeconfig-merge-default
   k3d kubeconfig merge corporate --kubeconfig-merge-default --kubeconfig-switch-context
   ```

2. In Windows Freelens, click "Add Cluster" and select the kubeconfig located at the network path
   (replace `USER` with your Ubuntu username):
   `\\wsl$\Ubuntu\home\USER\.kube\config`.
3. Freelens displays both `k3d-hub` and `k3d-corporate` side-by-side in the cluster sidebar.
   Switch between them with a single click.

## 7. Verification

Run these sanity checks inside Ubuntu to ensure the entire multi-cluster toolchain is operating:

```bash
docker run --rm hello-world
kubectl --context k3d-hub get nodes
kubectl --context k3d-corporate get nodes
helm version --short
skaffold version
node --version
pnpm --version
curl -s localhost:5000/v2/_catalog
```

## 8. Storage & Eviction Management

When running heavy multi-cluster workloads in WSL2, the underlying virtual disk (`ext4.vhdx`) will grow. If the disk fills or hits kubelet eviction thresholds, Kubernetes nodes will transition to the `Evicted` or `NotReady` state.

### Mitigation Strategies

1. **Regular Pruning**: Frequently clean up unused Docker objects:
   ```bash
   docker system prune -a --volumes -f
   ```
2. **Kubelet Eviction Thresholds**: If using smaller WSL2 disks, you can override k3s eviction thresholds during cluster creation by appending `--k3s-arg` parameters.
3. **Compact the VHDX**: Windows does not automatically shrink the WSL2 VHDX when files are deleted inside Linux. Periodically compact it from Windows PowerShell (stops WSL):
   ```powershell
   wsl --shutdown
   Optimize-VHD -Path "C:\Users\<USER>\AppData\Local\Packages\CanonicalGroupLimited.Ubuntu_79rhkp1fndgsc\LocalState\ext4.vhdx" -Mode Full
   ```
