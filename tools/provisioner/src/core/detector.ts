import { spawn } from 'node:child_process';

export interface WSLStatus {
  wslFeatureEnabled: boolean;
  vmPlatformEnabled: boolean;
  wslInstalled: boolean;
  ubuntuInstalled: boolean;
}

interface ParsedWSLStatus {
  wslFeatureEnabled?: boolean;
  vmPlatformEnabled?: boolean;
  wslInstalled?: boolean;
  ubuntuInstalled?: boolean;
}

export class WSLDetector {
  /**
   * Runs a fast background check on Windows optional features and WSL status.
   * Does NOT require administrative elevation.
   */
  public static checkStatus(): Promise<WSLStatus> {
    return new Promise((resolve) => {
      const psCommand = `
        $wslFeatureEnabled = $false
        $vmPlatformEnabled = $false

        try {
            $wslFeature = Get-WindowsOptionalFeature -Online -FeatureName Microsoft-Windows-Subsystem-Linux -ErrorAction Stop
            $wslFeatureEnabled = $wslFeature -and $wslFeature.State -eq 'Enabled'
            
            $vmPlatform = Get-WindowsOptionalFeature -Online -FeatureName VirtualMachinePlatform -ErrorAction Stop
            $vmPlatformEnabled = $vmPlatform -and $vmPlatform.State -eq 'Enabled'
        }
        catch {
            $wslService = Get-Service WslService, LxssManager -ErrorAction SilentlyContinue
            $wslFeatureEnabled = $null -ne $wslService

            $vmService = Get-Service vmcompute -ErrorAction SilentlyContinue
            $vmPlatformEnabled = $null -ne $vmService
        }

        $wslExists = $null -ne (Get-Command wsl.exe -ErrorAction SilentlyContinue)

        $ubuntuInstalled = $false
        if ($wslExists) {
            $listRaw = wsl.exe --list --quiet 2>$null
            if ($listRaw) {
                $listClean = $listRaw -join ' ' -replace [char]0, ''
                if ($listClean -match 'Ubuntu') {
                    $ubuntuInstalled = $true
                }
            }
        }

        $result = @{
            wslFeatureEnabled = [bool]$wslFeatureEnabled
            vmPlatformEnabled = [bool]$vmPlatformEnabled
            wslInstalled = [bool]$wslExists
            ubuntuInstalled = [bool]$ubuntuInstalled
        }

        $result | ConvertTo-Json -Compress
      `.trim();

      const child = spawn('powershell.exe', [
        '-NoProfile',
        '-ExecutionPolicy',
        'Bypass',
        '-Command',
        psCommand,
      ]);

      let stdout = '';

      child.stdout.on('data', (data: Buffer) => {
        stdout += data.toString();
      });

      child.stderr.on('data', (_data: Buffer) => {
        // Ignored to avoid unused variables
      });

      child.on('close', (code) => {
        if (code !== 0) {
          // Fallback if execution failed
          resolve({
            wslFeatureEnabled: false,
            vmPlatformEnabled: false,
            wslInstalled: false,
            ubuntuInstalled: false,
          });
          return;
        }

        try {
          const parsed = JSON.parse(stdout.trim()) as ParsedWSLStatus;
          resolve({
            wslFeatureEnabled: parsed.wslFeatureEnabled === true,
            vmPlatformEnabled: parsed.vmPlatformEnabled === true,
            wslInstalled: parsed.wslInstalled === true,
            ubuntuInstalled: parsed.ubuntuInstalled === true,
          });
        } catch {
          // Fallback on JSON parse error
          resolve({
            wslFeatureEnabled: false,
            vmPlatformEnabled: false,
            wslInstalled: false,
            ubuntuInstalled: false,
          });
        }
      });
    });
  }
}

export default WSLDetector;
