import type { Command } from '../../../core/command.js';
import { PowerShellExecutor } from '../../../core/executor.js';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SCRIPT_PATH = path.resolve(
  __dirname,
  '../../../../scripts/windows/wsl/uninstall-docker-wsl.ps1',
);

export class UninstallDockerWslCommand implements Command {
  public readonly id = 'windows-wsl-uninstall';
  public readonly label = 'Uninstall & Wipe WSL2 + Docker Configurations';
  public readonly description =
    'Launches elevated script to completely unregister Ubuntu and wipe local dev daemon configurations.';

  public async execute(): Promise<boolean> {
    return PowerShellExecutor.executeAsAdmin(SCRIPT_PATH);
  }
}
export default UninstallDockerWslCommand;
