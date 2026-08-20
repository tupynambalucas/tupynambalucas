# WSL2 Ubuntu & Native Docker Setup Guide (TCP Host Method)

This reference guide documents the step-by-step procedure to reset, install, and configure a zero-overhead, native Docker Engine environment inside **Ubuntu 24.04 LTS (WSL2)**, exposed via a secure local TCP connection to the **Windows Host** for the `tupynambalucas.dev` monorepo.

This architecture ensures that **Node.js, pnpm, and `node_modules` remain 100% isolated on Windows**, completely eliminating `node_modules` filesystem corruption caused by cross-platform sharing over DrvFs (`/mnt/d/`).

---

## Architectural Principles

1. **Zero Windows Footprint**: No Docker Desktop or Rancher Desktop GUI applications running in the background on Windows.
2. **Native Linux Runtime**: Docker Engine (`dockerd`) runs natively inside Ubuntu WSL2.
3. **No Node/pnpm in WSL**: There is **no need** to install Node.js or pnpm inside Ubuntu WSL. All package operations are executed exclusively from the Windows host.
4. **Secure Local TCP Bridge**: The Windows Docker CLI communicates with the native WSL Docker daemon via `tcp://127.0.0.1:2375`.
5. **On-the-Fly Path Translation**: Docker Compose V2 on Windows translates Windows paths (e.g. `D:\projects\...`) to WSL paths (e.g. `/mnt/d/projects/...`) for volume mounting.

---

## Step 1: Clean Factory Reset of WSL2 Ubuntu

To remove previous broken packages, configuration files, and permissions, perform a complete factory reset.

Execute in **Windows PowerShell**:

```powershell
# 1. Unregister and wipe existing Ubuntu-24.04 installation (if any)
wsl --unregister Ubuntu-24.04

# 2. Reinstall a clean Ubuntu-24.04 instance
wsl --install -d Ubuntu-24.04
```

Once installed, Ubuntu will prompt you to create an initial UNIX user account (e.g., `tupy`) and password.

---

## Step 2: Native Docker CE & Docker Compose V2 Setup

Execute in the **Ubuntu Terminal**:

```bash
# 1. Add official Docker GPG key
sudo apt-get update
sudo apt-get install -y ca-certificates curl gnupg lsb-release
sudo install -m 0755 -d /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg
sudo chmod a+r /etc/apt/keyrings/docker.gpg

# 2. Add official Docker APT repository
echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu $(. /etc/os-release && echo "$VERSION_CODENAME") stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

# 3. Install Docker Engine and Docker Compose Plugin
sudo apt-get update
sudo apt-get install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin

# 4. Add user to docker group
sudo usermod -aG docker $USER

# 5. Enable systemd in WSL2 configuration
sudo bash -c 'cat <<EOF > /etc/wsl.conf
[boot]
systemd=true
EOF'
```

---

## Step 3: Configure Docker Daemon to Listen on TCP

We must configure the Docker daemon to accept TCP connections on localhost, while keeping the default Unix socket.

Execute in the **Ubuntu Terminal**:

```bash
# 1. Create the systemd service override directory
sudo mkdir -p /etc/systemd/system/docker.service.d

# 2. Clear default ExecStart and remove the -H flag to allow /etc/docker/daemon.json configurations
sudo bash -c 'cat <<EOF > /etc/systemd/system/docker.service.d/override.conf
[Service]
ExecStart=
ExecStart=/usr/bin/dockerd --containerd=/run/containerd/containerd.sock
EOF'

# 3. Write daemon.json with Unix socket and local TCP hosts
sudo bash -c 'cat <<EOF > /etc/docker/daemon.json
{
  "hosts": ["unix:///var/run/docker.sock", "tcp://127.0.0.1:2375"]
}
EOF'
```

---

## Step 4: Apply WSL Boot Configuration

Restart WSL to apply systemd, daemon config, and group permissions.

Execute in **Windows PowerShell**:

```powershell
wsl --shutdown
```

Open the **Ubuntu Terminal** again to trigger boot, then verify Docker status and TCP listening port:

```bash
# Verify systemd service status
sudo systemctl status docker

# Verify TCP listening port
ss -tulpn | grep 2375
```

---

## Step 5: Configure Windows Host Environment

To route Windows Docker commands to the WSL VM, configure Windows Environment Variables.

Execute in **Windows PowerShell** (run as Administrator to set permanently):

```powershell
# Set DOCKER_HOST to connect to the WSL Docker Daemon
[Environment]::SetEnvironmentVariable("DOCKER_HOST", "tcp://127.0.0.1:2375", "User")

# Enable automatic path translation for volume mounts in Docker Compose V2
[Environment]::SetEnvironmentVariable("COMPOSE_CONVERT_WINDOWS_PATHS", "true", "User")
```

> [!IMPORTANT]
> Restart VS Code and all active terminal sessions on Windows after executing these commands to load the new environment variables.

---

## Step 6: Monorepo Workspace Operations

Now, you can execute all operations directly from the **Windows Terminal** (PowerShell/CMD). The workspace remains purely on Windows (e.g. `D:\projects\tupynambalucas`), and all node modules are kept exclusively on Windows.

### Available Workspace Scripts (Run from Windows Terminal)

| Target Stack          | Command               | Description                                  |
| :-------------------- | :-------------------- | :------------------------------------------- |
| **Monorepo Init**     | `pnpm install`        | Installs dependencies exclusively on Windows |
| **Penpot Editor**     | `pnpm penpot:up`      | Starts Penpot in WSL natively via TCP        |
| **Memos Whiteboard**  | `pnpm memos:up`       | Starts Memos in WSL natively via TCP         |
| **Cortex Core Stack** | `pnpm cortex:core:up` | Starts Cortex Core in WSL natively via TCP   |
| **Cortex MCP Bridge** | `pnpm cortex:mcp:up`  | Starts Cortex MCP in WSL natively via TCP    |

To stop services:

- Penpot: `pnpm penpot:down`
- Memos: `pnpm memos:down`
- Cortex Core: `pnpm cortex:core:down`

---

## Step 7: Visual Management Interface (VS Code Extension)

To monitor and manage active containers, inspect logs, and view images or volumes with zero extra memory overhead on Windows, we use the official **Docker Extension for VS Code**.

- **Extension Link**: [Docker for VS Code (ms-azuretools.vscode-docker)](https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-docker)

### How it works:

1. Since we configured the Windows environment variable `DOCKER_HOST="tcp://127.0.0.1:2375"`, the VS Code extension automatically detects and routes all visual operations directly to the **native WSL Ubuntu Docker daemon** over the local TCP bridge.
2. In the VS Code Activity Bar (left sidebar), click the **Docker whale icon**.
3. You will see three fully interactive panels:
   - **Containers**: Lists all active services (e.g. Penpot, Memos, Cortex Core). Right-click any container to view streaming real-time logs, stop, restart, or open a shell inside the container.
   - **Images**: Lists all local Docker images inside the WSL host.
   - **Volumes & Networks**: Displays persistency volumes and bridging configurations.

---

## Troubleshooting Checklist

- **No connection to Docker Daemon (`error during connect...`)**: Ensure WSL is running and the systemd docker service is active. Run `wsl -l -v` in Windows to confirm Ubuntu is running, and `sudo systemctl restart docker` in Ubuntu.
- **Volume mount is empty or fails**: Make sure the environment variable `COMPOSE_CONVERT_WINDOWS_PATHS` is set to `true` on Windows, and you are using modern `docker compose` (V2) instead of legacy `docker-compose` (V1).
- **Port conflicts on localhost**: Verify Docker Desktop is completely closed and uninstalled on Windows, as its default daemons might conflict with WSL's local port forwarding.
