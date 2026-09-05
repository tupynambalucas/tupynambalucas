# Shared Git Utilities

The @monorepo/shared-git workspace contains the standardized Git lifecycle hooks (via Husky) and TypeScript-based commit validation scripts for the %PROJECT_DOMAIN% monorepo.

## Directory Layout

- husky/: Contains the Git hooks bindings (e.g., pre-commit, prepare-commit-msg).
- scripts/: Contains the actual cross-platform TypeScript scripts executed by the hooks.

## Features

- **Husky Automation**: Triggers automated scripts during pre-commit and prepare-commit-msg phases.
- **TypeScript Tooling**: Hook scripts are written in TypeScript and executed via Node for seamless cross-platform execution (Windows/macOS/Linux).
