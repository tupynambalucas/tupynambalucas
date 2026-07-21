# Workstation Provisioner CLI

This workspace encapsulates the workstation bootstrapping, local virtualization configurations, and developer environment setup utilities for the tupynambalucas.dev monorepo.

---

## Architecture Overview

The Workstation Provisioner standardizes local machine provisioning through a modular, automated, and elevated CLI tool:

1.  **Modular Platform Orchestration:** Setup scripts are split cleanly by operating system and feature area (e.g., WSL2 and Docker on Windows), keeping configurations highly maintainable.
2.  **Interactive Terminal Flow:** Uses `@clack/prompts` to guide developers through multi-level platform choices (OS Selection -> Platform Categories -> Execution Tasks) with real-time console clearing (`console.clear()`) to keep terminal views clean and focused.
3.  **Privilege Escalation:** Integrates native, synchronous process invocation that triggers Windows User Account Control (UAC) to run scripts as Administrator safely.
4.  **SOLID Infrastructure:** Built with strict boundary separation, separating presentation logic, core executors, and specific command modules.
5.  **Dynamic Environment Detection:** Analyzes the machine's environment in the background before rendering action prompts.

---

## Directory Layout

- **[scripts/windows/wsl/](./scripts/windows/wsl/)**: Contains PowerShell scripts to set up WSL2 Ubuntu 24.04 and configure the native Docker Engine TCP bridge.
- **[src/core/](./src/core/)**: Contains the Command interface abstractions, the environment status detector, and the Windows administrative process executor.
- **[src/commands/](./src/commands/)**: Houses platform-specific Command implementations wrapping the corresponding shell scripts.

---

## WSL & Docker Environment Verification (WSLDetector)

To determine which action menu paths to render, the background **`WSLDetector`** (`src/core/detector.ts`) runs a non-elevated background query before showing choices:

- **Services Fallback:** Because optional features querying via `Get-WindowsOptionalFeature` requires administrative privileges, the detector uses a highly robust `try/catch` fallback querying services (`WslService`/`LxssManager` and `vmcompute`) which can be run without elevation.
- **UTF-16 Normalization:** Resolves a Windows encoding quirk where `wsl.exe --list --quiet` outputs UTF-16 bytes with null characters (`\0`) by sanitizing them before executing a regex match on `'Ubuntu'`.

---

## Symmetrical Script & Command Mappings

To ensure maximum maintainability, every provisioning script has a 1-to-1 matching TypeScript Command class with symmetrical filenames:

| PowerShell Script (`scripts/windows/wsl/`) | TS Command Wrapper (`src/commands/windows/wsl/`) | Command Class               | Description                                                                           |
| :----------------------------------------- | :----------------------------------------------- | :-------------------------- | :------------------------------------------------------------------------------------ |
| **`install-docker-wsl.ps1`**               | **`install-docker-wsl.ts`**                      | `InstallDockerWslCommand`   | Sets up WSL2, Ubuntu, and Docker Engine on TCP port 2375.                             |
| **`uninstall-docker-wsl.ps1`**             | **`uninstall-docker-wsl.ts`**                    | `UninstallDockerWslCommand` | Completely removes Docker CLI, env variables, scheduler tasks, and the Ubuntu distro. |
| **`enable-features.ps1`**                  | **`enable-features.ts`**                         | `EnableFeaturesCommand`     | Turns on Windows Subsystem for Linux and Virtual Machine platform features.           |
| **`restore-wsl.ps1`**                      | **`restore-wsl.ts`**                             | `RestoreWslCommand`         | Performs a clean wipe and resets the Ubuntu distro to a fresh state with Docker.      |

---

## Operations & Orchestration Commands

All operations should be executed from the root of the monorepo:

- `pnpm provision`: Launches the interactive Workstation Provisioner terminal menu.
- `pnpm --filter @tupynambalucas-tools/provisioner run typecheck`: Validates static type safety using TypeScript.
- `pnpm --filter @tupynambalucas-tools/provisioner run lint`: Runs ESLint and Prettier conformance checks.
