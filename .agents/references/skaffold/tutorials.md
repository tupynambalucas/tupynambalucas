# Step-by-Step Tutorials: Skaffold Local Development & Hot Reload

This document provides step-by-step tutorials for developers setting up local container hot reload
for the `cortex`, `studio`, and `tools` workspaces using Skaffold and Docker Compose.

---

## Tutorial 1: Running Independent Hot Reload in the `cortex` Workspace

In this tutorial, you will launch the `cortex` workspace services using its standalone
`cortex/skaffold.yaml` and `cortex/infrastructure/docker/compose.yaml` files.

### Step 1: Verify Dependencies

Ensure Docker Desktop / Docker Engine and Skaffold CLI are installed and running:

```bash
docker info
skaffold version
```

### Step 2: Navigate to the Workspace

Change directory to `cortex`:

```bash
cd cortex
```

### Step 3: Launch Skaffold Dev Mode

Run `skaffold dev` pointing to the workspace configuration:

```bash
skaffold dev -f skaffold.yaml
```

Skaffold will perform the following actions:

1. Build the container images defined in `build.artifacts`.
2. Launch the services declared in `infrastructure/docker/compose.yaml` via Docker Compose.
3. Attach log tailing to container stdout/stderr.
4. Begin watching configured source files for hot reload file sync.

---

## Tutorial 2: Executing Live Hot Reload Code Edits

In this tutorial, you will modify source code in `cortex/memory/services/api` and verify sub-second file
sync without image rebuilding or container restart.

### Step 1: Open an Active Session

Ensure `skaffold dev -f cortex/skaffold.yaml` is running in your terminal.

### Step 2: Edit a Source File

Open `cortex/memory/services/api/src/server.ts` (or any TypeScript file in the `src` directory) in
your editor. Add a log statement or update an HTTP response handler:

```typescript
console.log('[HOT_RELOAD_TEST] Live file sync update executed successfully');
```

### Step 3: Observe Terminal & Container Output

Watch the Skaffold terminal log:

```text
[cortex-dev] Syncing 1 file for cortex-memory-api: /app/src/server.ts
[cortex-memory-api] [HOT_RELOAD_TEST] Live file sync update executed successfully
```

Notice that:

- No `docker build` command was triggered.
- Container ID remained identical.
- Total elapsed time from file save to application reload was < 500ms.

---

## Tutorial 3: Running Monorepo Multi-Module Orchestration from Root

In this tutorial, you will orchestrate multiple sub-workspace Skaffold configurations from the
monorepo root directory.

### Step 1: Navigate to Monorepo Root

```bash
cd /path/to/tupynambalucas
```

### Step 2: Launch Selected Workspace Modules

To launch only `cortex` and `studio` modules together:

```bash
skaffold dev --module cortex-dev,studio-dev
```

### Step 3: Clean Up Environment

Press `Ctrl+C` in the terminal or run:

```bash
skaffold delete -f cortex/skaffold.yaml
```

Skaffold will stop and remove all Docker Compose containers, networks, and temporary volumes created
during the session.

---

## Tutorial 4: Executing `cortex` in Dev Mode with Docker Compose Profiles

In this tutorial, you will launch specific service profiles (`core`, `memory`, `agents`) within the
`cortex` workspace using three different configuration techniques.

### Technique 1: Global `.env` Profile Configuration (Automatic)

Add `COMPOSE_PROFILES=core,memory,agents` to `cortex/infrastructure/docker/.env`.

Run from root:

```bash
# Automatically loads COMPOSE_PROFILES from .env
skaffold dev --module cortex-dev
```

### Technique 2: Environment Variable CLI Overrides

Pass `COMPOSE_PROFILES` dynamically via terminal:

**Linux / macOS (Bash / Zsh)**:

```bash
# Run core & memory profile services only
COMPOSE_PROFILES=core,memory skaffold dev --module cortex-dev

# Run full stack (core, memory, agents)
COMPOSE_PROFILES=core,memory,agents skaffold dev --module cortex-dev
```

**Windows (PowerShell)**:

```powershell
# Run core & memory profile services only
$env:COMPOSE_PROFILES="core,memory"; skaffold dev --module cortex-dev

# Run full stack (core, memory, agents)
$env:COMPOSE_PROFILES="core,memory,agents"; skaffold dev --module cortex-dev
```

### Technique 3: `package.json` Monorepo Scripts

Add profile scripts to root `package.json`:

```json
{
  "scripts": {
    "cortex:dev:core": "cross-env COMPOSE_PROFILES=core skaffold dev --module cortex-dev",
    "cortex:dev:full": "cross-env COMPOSE_PROFILES=core,memory,agents skaffold dev --module cortex-dev"
  }
}
```

Run via pnpm:

```bash
pnpm cortex:dev:core
pnpm cortex:dev:full
```
