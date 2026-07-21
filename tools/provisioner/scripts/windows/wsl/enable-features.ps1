# Enable Windows Optional Features for WSL2
# Run as Administrator

Write-Host "=== Enabling Windows WSL2 Optional Features ===" -ForegroundColor Cyan
Write-Host "This script will enable the Windows Subsystem for Linux and Virtual Machine Platform features." -ForegroundColor Yellow
Write-Host ""

# Check if running as Administrator
$isAdmin = ([Security.Principal.WindowsPrincipal] [Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)
if (-not $isAdmin) {
    Write-Host "ERROR: This script must be run as Administrator!" -ForegroundColor Red
    Write-Host "Right-click PowerShell and select 'Run as Administrator'" -ForegroundColor Yellow
    exit 1
}

$rebootRequired = $false

# 1. Enable WSL Feature
Write-Host "Checking WSL optional feature..." -ForegroundColor Green
try {
    $wslInstalled = Get-WindowsOptionalFeature -Online -FeatureName Microsoft-Windows-Subsystem-Linux
    if ($wslInstalled.State -ne "Enabled") {
        Write-Host "Enabling Microsoft-Windows-Subsystem-Linux..." -ForegroundColor Yellow
        Enable-WindowsOptionalFeature -Online -FeatureName Microsoft-Windows-Subsystem-Linux -NoRestart
        Write-Host "WSL feature enabled successfully!" -ForegroundColor Green
        $rebootRequired = $true
    }
    else {
        Write-Host "WSL feature is already enabled." -ForegroundColor Yellow
    }
}
catch {
    Write-Host "Error enabling WSL: $_" -ForegroundColor Red
}

# 2. Enable Virtual Machine Platform
Write-Host "`nChecking Virtual Machine Platform optional feature..." -ForegroundColor Green
try {
    $vmPlatform = Get-WindowsOptionalFeature -Online -FeatureName VirtualMachinePlatform
    if ($vmPlatform.State -ne "Enabled") {
        Write-Host "Enabling VirtualMachinePlatform..." -ForegroundColor Yellow
        Enable-WindowsOptionalFeature -Online -FeatureName VirtualMachinePlatform -NoRestart
        Write-Host "Virtual Machine Platform enabled successfully!" -ForegroundColor Green
        $rebootRequired = $true
    }
    else {
        Write-Host "Virtual Machine Platform is already enabled." -ForegroundColor Yellow
    }
}
catch {
    Write-Host "Error enabling Virtual Machine Platform: $_" -ForegroundColor Red
}

if ($rebootRequired) {
    Write-Host "`n[IMPORTANT] Optional features have been enabled successfully!" -ForegroundColor Green
    Write-Host "A system restart (reboot) is REQUIRED before you can install or use WSL2." -ForegroundColor Red
    Write-Host "Please RESTART your computer and run 'pnpm provision' again to complete the WSL setup." -ForegroundColor Yellow
} else {
    Write-Host "`nBoth optional features are already enabled. No reboot required!" -ForegroundColor Green
}

Write-Host "`nPress any key to close this window..." -ForegroundColor Cyan
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
exit 0
