# Local Context: Workstation Provisioner CLI

This workspace ([tools/provisioner/](./)) implements the workstation bootstrapping, WSL2 environment provisioning, and local development tools configuration CLI.

---

## Local Architecture & Directory Map

- **[scripts/windows/wsl/](./scripts/windows/wsl/)**: Contains modular PowerShell scripts to orchestrate WSL2 installation and native Docker TCP daemon configuration.
- **[src/core/](./src/core/)**: Houses core Command interface abstractions, background state detectors (with fallback), and child process executors supporting administrative elevation.
- **[src/commands/](./src/commands/)**: Modular implementations of platform-specific provisioning operations following SOLID design principles.

---

## Workstation Provisioner Guardrails

1.  **Administrative Escalation**: Commands that modify system configurations (e.g., enabling Windows features, installing WSL, or updating variables) MUST request elevation via native Windows UAC using `PowerShellExecutor.executeAsAdmin()`.
2.  **Strict Modular Organization & Symmetrical Naming**: Setup scripts MUST be modularized under `scripts/<os>/<category>/` and wrapped within individual `Command` implementations under `src/commands/<os>/<category>/`. Command files MUST match their underlying PowerShell setup script filename 1-to-1 symmetrically (e.g., `install-docker-wsl.ps1` matches `install-docker-wsl.ts`).
3.  **Background Non-Elevated Detection**: System status detectors (e.g., `WSLDetector`) MUST execute without administrative privileges. If a command normally requires elevation (like DISM optional feature checks), a robust fallback check (like querying local system services or registry entries) MUST be implemented.
4.  **Dynamic Path Resolution**: Paths to setup scripts MUST be resolved dynamically using relative path calculations (`path.resolve(__dirname, ...)`) to ensure correct resolution both under source execution (`tsx`) and compiled distribution.
5.  **Interactive Navigation**: Any additions to the user-facing CLI MUST utilize `@clack/prompts`, implement `console.clear()` inside the main loop for crisp visual refreshing, and support backwards navigation (`<- Back` option) at all nested menu levels.

---

## Scoped Commands

Run these commands from the monorepo root:

- `pnpm provision`: Initiates the interactive workstation setup CLI.
- `pnpm --filter @tupynambalucas-tools/provisioner run typecheck`: Validates static type safety using TypeScript.
- `pnpm --filter @tupynambalucas-tools/provisioner run lint`: Runs ESLint and Prettier conformance checks.
