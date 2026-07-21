import { spawn } from 'node:child_process';

export class PowerShellExecutor {
  /**
   * Executes a PowerShell script as Administrator using the standard Windows "Start-Process -Verb RunAs" method.
   * By using the "-Wait" parameter, the parent process waits until the elevated child process finishes.
   */
  public static executeAsAdmin(scriptPath: string): Promise<boolean> {
    return new Promise((resolve) => {
      // Escape paths for PowerShell strings
      const command = `Start-Process powershell -ArgumentList "-NoProfile -ExecutionPolicy Bypass -File \`"${scriptPath}\`"" -Verb RunAs -Wait`;

      const child = spawn(
        'powershell.exe',
        ['-NoProfile', '-ExecutionPolicy', 'Bypass', '-Command', command],
        {
          stdio: 'inherit',
        },
      );

      child.on('close', (code) => {
        // Resolves true if the spawning delegate executed without critical errors
        resolve(code === 0);
      });

      child.on('error', () => {
        resolve(false);
      });
    });
  }
}
export default PowerShellExecutor;
