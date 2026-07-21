import type { Command } from '../../../core/command.js';
import { PowerShellExecutor } from '../../../core/executor.js';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SCRIPT_PATH = path.resolve(__dirname, '../../../../scripts/windows/wsl/enable-features.ps1');

export class EnableFeaturesCommand implements Command {
  public readonly id = 'windows-wsl-enable-features';
  public readonly label = 'Enable WSL & Virtual Machine Platform Features';
  public readonly description =
    'Launches elevated Windows installer to turn on WSL2 and virtualization kernel features.';

  public async execute(): Promise<boolean> {
    return PowerShellExecutor.executeAsAdmin(SCRIPT_PATH);
  }
}
export default EnableFeaturesCommand;
