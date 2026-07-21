# Docker WSL Setup Script (Without Docker Desktop)
# Run as Administrator

Write-Host "=== Docker WSL Setup Script ===" -ForegroundColor Cyan
Write-Host "This script will set up Docker in WSL2 without Docker Desktop" -ForegroundColor Yellow
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

# Step 1. Install WSL
Write-Host "`n[1/8] Installing WSL..." -ForegroundColor Green
$wslNewlyInstalled = $false
try {
    $wslInstalled = Get-WindowsOptionalFeature -Online -FeatureName Microsoft-Windows-Subsystem-Linux
    if ($wslInstalled.State -ne "Enabled") {
        Enable-WindowsOptionalFeature -Online -FeatureName Microsoft-Windows-Subsystem-Linux -NoRestart
        Write-Host "WSL feature enabled" -ForegroundColor Green
        $wslNewlyInstalled = $true
    }
    else {
        Write-Host "WSL already installed" -ForegroundColor Yellow
    }
}
catch {
    Write-Host "Error installing WSL: $_" -ForegroundColor Red
}

# Step 2. Enable Virtual Machine Platform
Write-Host "`n[2/8] Enabling Virtual Machine Platform..." -ForegroundColor Green
try {
    $vmPlatform = Get-WindowsOptionalFeature -Online -FeatureName VirtualMachinePlatform
    if ($vmPlatform.State -ne "Enabled") {
        Enable-WindowsOptionalFeature -Online -FeatureName VirtualMachinePlatform -NoRestart
        Write-Host "Virtual Machine Platform enabled" -ForegroundColor Green
        $wslNewlyInstalled = $true
    }
    else {
        Write-Host "Virtual Machine Platform already enabled" -ForegroundColor Yellow
    }
}
catch {
    Write-Host "Error enabling Virtual Machine Platform: $_" -ForegroundColor Red
}

# Step 3. Update WSL
Write-Host "`n[3/8] Updating WSL..." -ForegroundColor Green
try {
    wsl --update
    Write-Host "WSL updated successfully" -ForegroundColor Green
}
catch {
    Write-Host "Error updating WSL: $_" -ForegroundColor Red
}

# Step 4. Set WSL 2 as default and configure networking
Write-Host "`n[4/8] Setting WSL 2 as default version and configuring networking..." -ForegroundColor Green
try {
    wsl --set-default-version 2
    Write-Host "WSL 2 set as default" -ForegroundColor Green
    
    # Configure .wslconfig for mirrored networking
    $wslConfigPath = "$env:USERPROFILE\.wslconfig"
    $wslConfigContent = @"
[wsl2]
networkingMode=mirrored

"@
    
    # Create or update .wslconfig
    Set-Content -Path $wslConfigPath -Value $wslConfigContent -Force
    Write-Host "WSL networking mode set to mirrored" -ForegroundColor Green
    Write-Host "Configuration saved to $wslConfigPath" -ForegroundColor Yellow
}
catch {
    Write-Host "Error configuring WSL: $_" -ForegroundColor Red
}

# Step 5. Install Ubuntu 24.04 LTS from Windows Store
Write-Host "`n[5/8] Installing Ubuntu-24.04 LTS..." -ForegroundColor Green
Write-Host "Checking if Ubuntu-24.04 is already installed..." -ForegroundColor Yellow
$ubuntuInstalled = wsl --list --quiet | Select-String -Pattern "Ubuntu-24.04"

if (-not $ubuntuInstalled) {
    try {
        Write-Host "Installing Ubuntu-24.04 (LTS) without launching..." -ForegroundColor Yellow
        wsl --install -d Ubuntu-24.04 --no-launch
        Write-Host "Ubuntu-24.04 LTS package installed successfully." -ForegroundColor Green
    }
    catch {
        Write-Host "Error installing Ubuntu-24.04: $_" -ForegroundColor Red
        Write-Host "Please check your network and Windows Store configurations." -ForegroundColor Yellow
        exit 1
    }
}
else {
    Write-Host "Ubuntu-24.04 already installed" -ForegroundColor Yellow
}

# Step 6. Configure Silent WSL User Accounts & Systemd
Write-Host "`n[6/8] Configuring Ubuntu user account and systemd in the background..." -ForegroundColor Green
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

# Step 7. Update Ubuntu, Install and Configure Docker Engine inside Ubuntu-24.04
Write-Host "`n[7/8] Installing and configuring Docker Engine inside Ubuntu-24.04..." -ForegroundColor Green
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
    Write-Host "`nDocker Engine configured successfully inside Ubuntu-24.04!" -ForegroundColor Green
}
catch {
    Write-Host "Error configuring Docker inside Ubuntu-24.04: $_" -ForegroundColor Red
}

# Step 8. Install Docker CLI on Windows, configure DOCKER_HOST and Startup Job
Write-Host "`n[8/8] Installing Docker tools on Windows..." -ForegroundColor Green

try {
    # Install Docker CLI using winget
    Write-Host "Installing Docker CLI via winget..." -ForegroundColor Yellow
    winget install -e --id Docker.DockerCLI --accept-package-agreements --accept-source-agreements --silent 2>$null
    Write-Host "Docker CLI installed successfully!" -ForegroundColor Green
    
    # Install Docker Compose
    Write-Host "Installing Docker Compose via winget..." -ForegroundColor Yellow
    winget install -e --id Docker.DockerCompose --accept-package-agreements --accept-source-agreements --silent 2>$null
    Write-Host "Docker Compose installed successfully!" -ForegroundColor Green
    
    # Install Docker Buildx
    Write-Host "Installing Docker Buildx via winget..." -ForegroundColor Yellow
    winget install -e --id Docker.Buildx --accept-package-agreements --accept-source-agreements --silent 2>$null
    Write-Host "Docker Buildx installed successfully!" -ForegroundColor Green
    
    # Set DOCKER_HOST environment variable on Windows User profile
    Write-Host "Setting DOCKER_HOST environment variable..." -ForegroundColor Yellow
    $dockerHost = "tcp://127.0.0.1:2375"
    [Environment]::SetEnvironmentVariable("DOCKER_HOST", $dockerHost, "User")
    Write-Host "Set DOCKER_HOST to $dockerHost" -ForegroundColor Green
    
}
catch {
    Write-Host "Error installing Docker tools: $_" -ForegroundColor Red
    Write-Host "You may need to install them manually:" -ForegroundColor Yellow
    Write-Host "  winget install Docker.DockerCLI" -ForegroundColor White
    Write-Host "  winget install Docker.DockerCompose" -ForegroundColor White
    Write-Host "  winget install Docker.Buildx" -ForegroundColor White
}

# Creating Task Scheduler job to keep Ubuntu running in background
Write-Host "`nCreating Task Scheduler job to start Ubuntu-24.04 at user logon..." -ForegroundColor Green
try {
    $taskName = "WSL-Ubuntu-Startup"

    # Check if task already exists
    $existingTask = Get-ScheduledTask -TaskName $taskName -ErrorAction SilentlyContinue
    if ($existingTask) {
        Write-Host "Task already exists. Removing old task..." -ForegroundColor Yellow
        Unregister-ScheduledTask -TaskName $taskName -Confirm:$false
    }

    # Create the action (with working directory set to user profile, hidden window)
    $action = New-ScheduledTaskAction `
        -Execute "pwsh.exe" `
        -Argument "-NoProfile -ExecutionPolicy Bypass -WindowStyle Hidden -Command `"wsl.exe -d Ubuntu-24.04 -e bash -c 'sleep infinity'`"" `
        -WorkingDirectory $env:USERPROFILE

    # Create the trigger (at user logon)
    $trigger = New-ScheduledTaskTrigger -AtLogOn

    # Create the principal (run as current user with highest privileges)
    $principal = New-ScheduledTaskPrincipal `
        -UserId $env:USERNAME `
        -LogonType Interactive `
        -RunLevel Highest

    # Create settings
    $settings = New-ScheduledTaskSettingsSet `
        -AllowStartIfOnBatteries `
        -DontStopIfGoingOnBatteries `
        -StartWhenAvailable `
        -RestartCount 3 `
        -RestartInterval (New-TimeSpan -Minutes 1) `
        -ExecutionTimeLimit (New-TimeSpan -Seconds 0) `
        -DontStopOnIdleEnd


    # Register the task
    Register-ScheduledTask `
        -TaskName $taskName `
        -Action $action `
        -Trigger $trigger `
        -Principal $principal `
        -Settings $settings `
        -Description "Starts WSL Ubuntu-24.04 distribution at user logon to keep Docker running"
    
    Write-Host "Task Scheduler job created successfully!" -ForegroundColor Green
    Write-Host "Ubuntu-24.04 will now start automatically when you log on" -ForegroundColor Green
}
catch {
    Write-Host "Error creating Task Scheduler job: $_" -ForegroundColor Red
}

# Final instructions
Write-Host "`n=== Setup Complete! ===" -ForegroundColor Cyan
Write-Host "`nNext steps:" -ForegroundColor Yellow

if ($wslNewlyInstalled) {
    Write-Host "1. RESTART your computer (required for WSL installation)" -ForegroundColor White
    Write-Host "2. After restart, Docker will start automatically" -ForegroundColor White
    Write-Host "3. Test Docker with: docker run hello-world" -ForegroundColor White
}
else {
    Write-Host "1. Close and reopen your terminal to refresh environment variables" -ForegroundColor White
    Write-Host "2. Test Docker with: docker run hello-world" -ForegroundColor White
}
