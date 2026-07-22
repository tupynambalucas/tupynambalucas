# Workstation Provisioner CLI

This workspace encapsulates the workstation bootstrapping, local virtualization configurations, and developer environment setup utilities for the tupynambalucas.dev monorepo.

---

## Architecture Overview

The Workstation Provisioner standardizes local machine provisioning through a modular, automated CLI skeleton:

1. **Modular Platform Orchestration:** Setup scripts are split cleanly by operating system and feature area, keeping configurations highly maintainable.
2. **Interactive Terminal Flow:** Uses `@clack/prompts` to guide developers through multi-level platform choices (OS Selection -> Platform Categories -> Execution Tasks) with real-time console clearing (`console.clear()`) to keep terminal views clean and focused.
3. **Privilege Escalation:** Integrates native process invocation that triggers Windows User Account Control (UAC) to run scripts as Administrator safely.
4. **SOLID Infrastructure:** Built with strict boundary separation, separating presentation logic, core executors, and specific command modules.
5. **Dynamic Environment Detection:** Analyzes the machine's environment in the background before rendering action prompts.

---

## Directory Layout

- **[src/core/](./src/core/)**: Contains the Command interface abstractions, the environment status detector, and the Windows administrative process executor.
- **[src/commands/](./src/commands/)**: Houses platform-specific Command implementations wrapping corresponding shell scripts.
- **[scripts/](./scripts/)**: Platform-specific scripts organized by OS and target runtime module.

---

## Operations & Orchestration Commands

All operations should be executed from the root of the monorepo:

- `pnpm provision`: Launches the interactive Workstation Provisioner terminal menu.
- `pnpm --filter @tupynambalucas-tools/provisioner run typecheck`: Validates static type safety using TypeScript.
- `pnpm --filter @tupynambalucas-tools/provisioner run lint`: Runs ESLint and Prettier conformance checks.
