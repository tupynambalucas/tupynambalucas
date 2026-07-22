import { spawn } from 'node:child_process';

export class PowerShellExecutor {
  /**
   * Executes a PowerShell script as Administrator using Windows Shell.Application COM object.
   */
  public static executeAsAdmin(scriptPath: string): Promise<boolean> {
    return new Promise((resolve) => {
      const cleanPath = scriptPath.replace(/'/g, "''");
      const psCommand = `$sh = New-Object -ComObject Shell.Application; $sh.ShellExecute('powershell.exe', '-NoProfile -ExecutionPolicy Bypass -File "${cleanPath}"', '', 'runas', 1)`;

      const child = spawn(
        'powershell.exe',
        ['-NoProfile', '-ExecutionPolicy', 'Bypass', '-Command', psCommand],
        {
          stdio: 'inherit',
        },
      );

      child.on('close', (code) => {
        resolve(code === 0);
      });

      child.on('error', () => {
        resolve(false);
      });
    });
  }
}

export default PowerShellExecutor;
