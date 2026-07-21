# Restore / Reset WSL Ubuntu and Docker installation
# Run as Administrator

Write-Host "=== WSL Ubuntu & Docker Restore Reset ===" -ForegroundColor Cyan
Write-Host "This script will completely wipe the existing Ubuntu-24.04 WSL distro and restore it with Docker." -ForegroundColor Yellow
Write-Host "WARNING: All data inside your Ubuntu-24.04 WSL distro will be permanently deleted!" -ForegroundColor Red
Write-Host ""

# Check if running as Administrator
$isAdmin = ([Security.Principal.WindowsPrincipal] [Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)
if (-not $isAdmin) {
    Write-Host "ERROR: This script must be run as Administrator!" -ForegroundColor Red
    Write-Host "Right-click PowerShell and select 'Run as Administrator'" -ForegroundColor Yellow
    exit 1
}

# Load config from windows.config.json
$configPath = "$PSScriptRoot/../../../src/config/windows.config.json"
if (Test-Path $configPath) {
    $config = Get-Content -Raw -Path $configPath | ConvertFrom-Json
    $username = $config.wsl.username
    $password = $config.wsl.password
    Write-Host "Loaded configuration from windows.config.json" -ForegroundColor Green
} else {
    $username = "lucas"
    $password = "DevPassword123!"
    Write-Host "Configuration file not found. Using default user settings." -ForegroundColor Yellow
}

Write-Host "User configured: $username" -ForegroundColor Yellow
Write-Host ""

Write-Host "Are you sure you want to proceed with the restore?" -ForegroundColor Yellow
Write-Host "Press 'Y' to confirm, or any other key to cancel..." -ForegroundColor Yellow
$key = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
if ($key.Character -ne 'Y' -and $key.Character -ne 'y') {
    Write-Host "`nRestore cancelled by user." -ForegroundColor Yellow
    exit 0
}

Write-Host "`n`nStarting restore process..." -ForegroundColor Cyan

# 1. Terminate and unregister existing Ubuntu-24.04
Write-Host "`n[1/6] Shutting down WSL and unregistering Ubuntu-24.04 distro..." -ForegroundColor Green
try {
    wsl --shutdown
    $ubuntuInstalled = wsl --list --quiet | Select-String -Pattern "Ubuntu-24.04"
    if ($ubuntuInstalled) {
        wsl --unregister Ubuntu-24.04
        Write-Host "Ubuntu-24.04 distribution unregistered and data wiped successfully." -ForegroundColor Green
    } else {
        Write-Host "Ubuntu-24.04 was not registered. Proceeding to fresh install." -ForegroundColor Yellow
    }
}
catch {
    Write-Host "Error clearing Ubuntu distribution: $_" -ForegroundColor Red
}

# 2. Re-install Ubuntu-24.04
Write-Host "`n[2/6] Installing fresh Ubuntu-24.04 distribution..." -ForegroundColor Green
try {
    wsl --install -d Ubuntu-24.04 --no-launch
    Write-Host "Ubuntu-24.04 LTS package installed successfully." -ForegroundColor Green
}
catch {
    Write-Host "Error installing Ubuntu-24.04: $_" -ForegroundColor Red
    Write-Host "Please try installing Ubuntu-24.04 manually from Microsoft Store." -ForegroundColor Yellow
    exit 1
}

# 3. Configure Silent WSL User Accounts & Systemd
Write-Host "`n[3/6] Configuring Ubuntu user account and systemd in the background..." -ForegroundColor Green
try {
    $setupScript = @"
if ! id -u $username >/dev/null 2>&1; then
    useradd -m -s /bin/bash $username
    echo '$username:$password' | chpasswd
    usermod -aG sudo $username
    echo '$username ALL=(ALL) NOPASSWD:ALL' | tee -a /etc/sudoers.d/$username
fi

# Write wsl.conf with systemd and default user
cat <<EOF > /etc/wsl.conf
[user]
default=$username

[boot]
systemd=true
EOF
"@
    
    # Execute User Creation and systemd config inside Ubuntu as root
    Write-Host "Creating user '$username' and enabling systemd..." -ForegroundColor Yellow
    wsl -d Ubuntu-24.04 -u root -e bash -c ($setupScript -replace "`r`n", "`n")
    
    # Restart WSL to load systemd and the default user
    Write-Host "Restarting WSL instance..." -ForegroundColor Yellow
    wsl --terminate Ubuntu-24.04
    Start-Sleep -Seconds 3
    
    Write-Host "Ubuntu-24.04 fully initialized!" -ForegroundColor Green
}
catch {
    Write-Host "Error setting up default user in WSL: $_" -ForegroundColor Red
    exit 1
}

# 4. Configure Docker inside the fresh Ubuntu-24.04
Write-Host "`n[4/6] Updating Ubuntu and installing Docker Engine inside Ubuntu-24.04..." -ForegroundColor Green

$dockerSetupScript = @'
# Update and upgrade Ubuntu
echo "Updating and upgrading Ubuntu..."
apt update && apt upgrade -y

# Remove old Docker installations (if any)
echo "Removing old Docker installations (if any)..."
apt remove -y docker docker-engine docker.io containerd runc 2> /dev/null

# Install prerequisites
echo "Installing prerequisites..."
apt install -y ca-certificates curl gnupg lsb-release

# Add Docker's official GPG key
echo "Adding Docker GPG key..."
mkdir -p /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | gpg --dearmor -o /etc/apt/keyrings/docker.gpg

# Set up the repository
echo "Setting up Docker repository..."
echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" | tee /etc/apt/sources.list.d/docker.list > /dev/null

# Install Docker Engine
echo "Installing Docker Engine..."
apt update
apt install -y docker-ce docker-ce-cli containerd.io docker-compose-plugin

# Get the actual user
ACTUAL_USER=$(wsl.exe -l -v 2>/dev/null | grep Ubuntu-24.04 | awk '{print $1}' || echo $SUDO_USER)
if [ -z "$ACTUAL_USER" ] || [ "$ACTUAL_USER" = "root" ]; then
    ACTUAL_USER=$(awk -F: '$3 >= 1000 && $3 < 65534 {print $1; exit}' /etc/passwd)
fi

# Add user to docker group
if [ -n "$ACTUAL_USER" ]; then
    usermod -aG docker $ACTUAL_USER
    echo "Added $ACTUAL_USER to docker group"
else
    echo "Warning: Could not determine user for docker group"
fi

# Create systemd override directory
echo "Configuring Docker daemon..."
mkdir -p /etc/systemd/system/docker.service.d

# Configure Docker to listen on both unix socket and TCP
tee /etc/systemd/system/docker.service.d/override.conf > /dev/null <<EOF
[Service]
ExecStart=
ExecStart=/usr/bin/dockerd -H unix:///var/run/docker.sock -H tcp://0.0.0.0:2375
EOF

# Reload systemd configuration
systemctl daemon-reload

# Enable and start Docker service
systemctl enable docker
systemctl start docker

echo 'Docker installed and configured successfully inside Ubuntu-24.04!'
'@

# Convert Windows line endings to Unix line endings
$dockerScriptUnix = $dockerSetupScript -replace "`r`n", "`n"

# Execute the Docker setup script in WSL Ubuntu as root
try {
    wsl -d Ubuntu-24.04 -u root -e bash -c $dockerScriptUnix
    Write-Host "`nDocker configured successfully in fresh Ubuntu-24.04 distribution!" -ForegroundColor Green
}
catch {
    Write-Host "Error configuring Docker inside Ubuntu-24.04: $_" -ForegroundColor Red
}

# 5. Make sure DOCKER_HOST is set on Windows
Write-Host "`n[5/6] Ensuring DOCKER_HOST environment variable is configured on Windows..." -ForegroundColor Green
try {
    $dockerHost = "tcp://127.0.0.1:2375"
    [Environment]::SetEnvironmentVariable("DOCKER_HOST", $dockerHost, "User")
    Write-Host "Set DOCKER_HOST to $dockerHost" -ForegroundColor Green
}
catch {
    Write-Host "Error configuring DOCKER_HOST: $_" -ForegroundColor Red
}

# 6. Make sure Task Scheduler job is running
Write-Host "`n[6/6] Starting Task Scheduler job to keep WSL running..." -ForegroundColor Green
try {
    Start-ScheduledTask -TaskName "WSL-Ubuntu-Startup" -ErrorAction SilentlyContinue
    Write-Host "WSL Ubuntu Startup task triggered successfully." -ForegroundColor Green
}
catch {
    Write-Host "Task Scheduler job could not be started automatically. It will run on next user logon." -ForegroundColor Yellow
}

Write-Host "`n=== Restore Complete! ===" -ForegroundColor Cyan
Write-Host "Your WSL Ubuntu-24.04 distribution has been fully restored and Docker is running clean." -ForegroundColor Green
Write-Host "Close and reopen your terminal to apply any environment variable changes." -ForegroundColor Yellow
Write-Host ""
Write-Host "Press any key to close this window..." -ForegroundColor Cyan
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
exit 0
