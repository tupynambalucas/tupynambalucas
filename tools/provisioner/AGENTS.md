# Local Context: Workstation Provisioner CLI

This workspace ([tools/provisioner/](./)) implements the workstation bootstrapping and local development tools configuration CLI skeleton.

---

## Local Architecture & Directory Map

- **[src/core/](./src/core/)**: Houses core Command interface abstractions, background state detectors, and child process executors supporting administrative elevation.
- **[src/commands/](./src/commands/)**: Modular implementations of platform-specific provisioning operations.
- **[scripts/](./scripts/)**: Platform-specific scripts organized by OS and target runtime module.

---

## Workstation Provisioner Guardrails

1. **Administrative Escalation**: Commands that modify system configurations MUST request elevation via native Windows UAC using `PowerShellExecutor.executeAsAdmin()`.
2. **Strict Modular Organization**: Setup scripts MUST be modularized under `scripts/<os>/<category>/` and wrapped within individual `Command` implementations under `src/commands/<os>/<category>/`.
3. **Background Non-Elevated Detection**: System status detectors MUST execute without administrative privileges whenever possible.
4. **Dynamic Path Resolution**: Paths to setup scripts MUST be resolved dynamically using relative path calculations to ensure correct resolution both under source execution (`tsx`) and compiled distribution.
5. **Interactive Navigation**: Any additions to the user-facing CLI MUST utilize `@clack/prompts`, implement `console.clear()` inside the main loop for crisp visual refreshing, and support backwards navigation (`<- Back` option) at all nested menu levels.

---

## Scoped Commands

Run these commands from the monorepo root:

- `pnpm provision`: Initiates the interactive workstation setup CLI.
- `pnpm --filter @tupynambalucas-tools/provisioner run typecheck`: Validates static type safety using TypeScript.
- `pnpm --filter @tupynambalucas-tools/provisioner run lint`: Runs ESLint and Prettier conformance checks.
