import type { Command } from '../../../core/command.js';
import { PowerShellExecutor } from '../../../core/executor.js';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SCRIPT_PATH = path.resolve(__dirname, '../../../../scripts/windows/wsl/restore-wsl.ps1');

export class RestoreWslCommand implements Command {
  public readonly id = 'windows-wsl-restore';
  public readonly label = 'Restore & Reset WSL Ubuntu + Docker Installation';
  public readonly description =
    'Launches elevated script to completely wipe existing Ubuntu WSL distro and restore it with a fresh Docker setup.';

  public async execute(): Promise<boolean> {
    return PowerShellExecutor.executeAsAdmin(SCRIPT_PATH);
  }
}
export default RestoreWslCommand;
