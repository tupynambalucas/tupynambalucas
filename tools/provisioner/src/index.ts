import { intro, outro, select, isCancel } from '@clack/prompts';

async function main(): Promise<void> {
  let currentMenu: 'main' | 'windows' | 'podman' | 'exit' = 'main';

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
            hint: 'Access Windows virtualization and Podman engine setup options',
          },
          {
            value: 'macos',
            label: 'macOS (Apple Silicon / Intel)',
            hint: 'Native macOS developer tools and Podman machine options',
          },
          {
            value: 'linux',
            label: 'GNU/Linux (Native Ubuntu/Debian)',
            hint: 'Native Linux container engine and workstation setup',
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
        outro(`Environment option '${osChoice}' skeleton is ready for module integration.`);
        process.exit(0);
      }
    }

    if (currentMenu === 'windows') {
      const winChoice = await select({
        message: 'Windows platform utilities:',
        options: [
          {
            value: 'podman',
            label: 'Podman Container Engine',
            hint: 'Manage daemonless Podman CLI, podman machine, and WSL integration',
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
        currentMenu = 'podman';
      }
    }

    if (currentMenu === 'podman') {
      const podmanChoice = await select({
        message: 'Podman provisioning actions:',
        options: [
          {
            value: 'info',
            label: 'Podman Engine Architecture',
            hint: 'Daemonless container engine architecture overview',
          },
          {
            value: 'back',
            label: '<- Back to Windows Menu',
          },
        ],
      });

      if (isCancel(podmanChoice)) {
        break;
      }

      if (podmanChoice === 'back') {
        currentMenu = 'windows';
        continue;
      }

      // eslint-disable-next-line no-console
      console.log('\nPodman provisioning skeleton is ready for implementation.\n');

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
