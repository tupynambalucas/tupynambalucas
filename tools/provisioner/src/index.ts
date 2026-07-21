import { intro, outro, select, spinner, isCancel } from '@clack/prompts';
import { InstallDockerWslCommand } from './commands/windows/wsl/install-docker-wsl.js';
import { UninstallDockerWslCommand } from './commands/windows/wsl/uninstall-docker-wsl.js';
import { EnableFeaturesCommand } from './commands/windows/wsl/enable-features.js';
import { RestoreWslCommand } from './commands/windows/wsl/restore-wsl.js';
import { WSLDetector } from './core/detector.js';

async function main(): Promise<void> {
  // Main navigation loop
  let currentMenu: 'main' | 'windows' | 'wsl' | 'exit' = 'main';

  while ((currentMenu as string) !== 'exit') {
    // eslint-disable-next-line no-console
    console.clear();
    intro(' tupynambalucas.dev - Workstation Provisioner ');
    if (currentMenu === 'main') {
      const osChoice = await select({
        message: 'Select your Operating System / Environment:',
        options: [
          {
            value: 'windows',
            label: 'Windows Server / Desktop OS',
            hint: 'Access WSL2, virtualization, and Windows dev setup options',
          },
          {
            value: 'macos',
            label: 'macOS (Apple Silicon / Intel)',
            hint: 'Under construction - coming soon',
          },
          {
            value: 'linux',
            label: 'GNU/Linux (Native Ubuntu/Debian)',
            hint: 'Under construction - coming soon',
          },
          {
            value: 'exit',
            label: 'Exit Provisioner',
          },
        ],
      });

      if (isCancel(osChoice) || osChoice === 'exit') {
        break;
      }

      if (osChoice === 'windows') {
        currentMenu = 'windows';
      } else {
        outro(`Environment option '${osChoice}' is currently under development.`);
        process.exit(0);
      }
    }

    if (currentMenu === 'windows') {
      const winChoice = await select({
        message: 'Windows platform utilities:',
        options: [
          {
            value: 'wsl',
            label: 'WSL (Windows Subsystem for Linux)',
            hint: 'Manage WSL VMs, native Linux Docker Engine, and TCP bridge setup',
          },
          {
            value: 'back',
            label: '<- Back to Main Menu',
          },
        ],
      });

      if (isCancel(winChoice)) {
        break;
      }

      if (winChoice === 'back') {
        currentMenu = 'main';
      } else {
        currentMenu = 'wsl';
      }
    }

    if (currentMenu === 'wsl') {
      const sCheck = spinner();
      sCheck.start('Analyzing WSL environment and Windows features in the background...');
      const status = await WSLDetector.checkStatus();
      sCheck.stop('Environment analysis complete.');

      const installDockerWslCmd = new InstallDockerWslCommand();
      const uninstallDockerWslCmd = new UninstallDockerWslCommand();
      const enableFeaturesCmd = new EnableFeaturesCommand();
      const restoreWslCmd = new RestoreWslCommand();

      const options: Array<{ value: string; label: string; hint?: string }> = [];
      let message: string;

      const isWslInstalled = status.wslInstalled && status.ubuntuInstalled;
      const featuresEnabled = status.wslFeatureEnabled && status.vmPlatformEnabled;

      if (isWslInstalled) {
        message = 'WSL is already installed! Choose an action:';
        options.push(
          {
            value: 'restore',
            label: restoreWslCmd.label,
            hint: restoreWslCmd.description,
          },
          {
            value: 'uninstall',
            label: uninstallDockerWslCmd.label,
            hint: uninstallDockerWslCmd.description,
          },
        );
      } else if (!featuresEnabled) {
        message = 'WSL & Virtualization features are disabled. Please enable them first:';
        options.push({
          value: 'enable',
          label: enableFeaturesCmd.label,
          hint: enableFeaturesCmd.description,
        });
      } else {
        message = 'Virtualization features are enabled. Ready to install WSL:';
        options.push({
          value: 'install',
          label: installDockerWslCmd.label,
          hint: installDockerWslCmd.description,
        });
      }

      options.push({
        value: 'back',
        label: '<- Back to Windows Menu',
      });

      const wslChoice = await select({
        message,
        options,
      });

      if (isCancel(wslChoice)) {
        break;
      }

      if (wslChoice === 'back') {
        currentMenu = 'windows';
        continue;
      }

      const sExec = spinner();

      if (wslChoice === 'install') {
        sExec.start('Initializing elevated PowerShell window for WSL and Docker configuration...');
        const success = await installDockerWslCmd.execute();
        if (success) {
          sExec.stop(
            'PowerShell execution finished. If the task succeeded, restart terminal or VS Code.',
          );
        } else {
          sExec.stop('PowerShell execution failed or elevation was rejected.');
        }
      } else if (wslChoice === 'uninstall') {
        sExec.start('Initializing elevated PowerShell window for WSL and Docker wipe...');
        const success = await uninstallDockerWslCmd.execute();
        if (success) {
          sExec.stop('PowerShell execution finished. WSL environment has been wiped.');
        } else {
          sExec.stop('PowerShell execution failed or elevation was rejected.');
        }
      } else if (wslChoice === 'enable') {
        sExec.start('Initializing elevated PowerShell window to enable Windows features...');
        const success = await enableFeaturesCmd.execute();
        if (success) {
          sExec.stop('PowerShell execution finished. Please reboot your system to apply features.');
        } else {
          sExec.stop('PowerShell execution failed or elevation was rejected.');
        }
      } else if (wslChoice === 'restore') {
        sExec.start('Initializing elevated PowerShell window to restore and reset WSL...');
        const success = await restoreWslCmd.execute();
        if (success) {
          sExec.stop('PowerShell execution finished. WSL Ubuntu distribution has been restored.');
        } else {
          sExec.stop('PowerShell execution failed or elevation was rejected.');
        }
      }

      const nextAction = await select({
        message: 'Choose your next step:',
        options: [
          { value: 'menu', label: 'Return to Main Menu' },
          { value: 'exit', label: 'Exit Provisioner' },
        ],
      });

      if (isCancel(nextAction) || nextAction === 'exit') {
        currentMenu = 'exit';
      } else {
        currentMenu = 'main';
      }
    }
  }

  outro('Workstation Provisioner closed. Happy coding!');
}

main().catch((err) => {
  console.error('Critical error in Provisioner CLI:', err);
  process.exit(1);
});
