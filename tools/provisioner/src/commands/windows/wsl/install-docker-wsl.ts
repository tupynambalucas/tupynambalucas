import type { Command } from '../../../core/command.js';
import { PowerShellExecutor } from '../../../core/executor.js';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SCRIPT_PATH = path.resolve(
  __dirname,
  '../../../../scripts/windows/wsl/install-docker-wsl.ps1',
);

export class InstallDockerWslCommand implements Command {
  public readonly id = 'windows-wsl-install';
  public readonly label = 'Install & Configure WSL2 + Docker TCP Host';
  public readonly description =
    'Launches elevated installer to set up Ubuntu 24.04 and expose Docker Engine on TCP port 2375.';

  public async execute(): Promise<boolean> {
    return PowerShellExecutor.executeAsAdmin(SCRIPT_PATH);
  }
}
export default InstallDockerWslCommand;
