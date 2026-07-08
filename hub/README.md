# Tupynambá Lucas - Developer Hub Workspace

This directory manages the developer hub workspace, which implements the personal web portfolio, blog engine, contact services, and administrator dashboard.

---

## Workspace Structure

The workspace is organized into the following packages and services:

### 1. [Developer Web Client](./services/web/README.md) (`services/web/`)

A React 19 Single Page Application serving the customer-facing portfolio website, blog, and admin dashboard.

- **Detailed Guide:** Refer to the [Web Client README](./services/web/README.md).

### 2. [Hub REST API](./services/api/README.md) (`services/api/`)

A Fastify 5 REST API handling domain routing, database persistence, blog content delivery, and contact form handlers.

- **Detailed Guide:** Refer to the [REST API README](./services/api/README.md).

### 3. [Hub Core Library](./packages/core/README.md) (`packages/core/`)

The Single Source of Truth (SSOT) for shared schemas, data validation rules (Zod), and type definitions used across web and api services.

- **Detailed Guide:** Refer to the [Core Library README](./packages/core/README.md).

---

## Technical & Domain Isolation

To comply with monorepo architectural guidelines, the hub workspace is completely decoupled from other packages. Cross-workspace relative imports are restricted to designated dependencies in `package.json`.

---

## Quick Start & Dev Setup

Ensure you have initialized the local infrastructure first:

1. **Configure environment files:**
   Copy templates and add your local secrets inside the services:

   ```bash
   cp hub/infrastructure/docker/.env.example hub/infrastructure/docker/.env.dev
   ```

2. **Start database infrastructure (MongoDB, Redis):**

   ```bash
   pnpm hub:up
   ```

3. **Run development services:**
   ```bash
   pnpm hub:dev
   ```

---

## Lifecycle Commands

Manage the workspace from the monorepo root:

- `pnpm hub:up`: Boots MongoDB and Redis Docker containers in detached mode.
- `pnpm hub:down`: Tears down the infrastructure containers.
- `pnpm hub:dev`: Runs the API and Web applications concurrently in development mode.
- `pnpm hub:build`: Compiles all TypeScript files in the hub workspace.
- `pnpm hub:typecheck`: Validates TypeScript type safety.
- `pnpm hub:lint`: Runs linter across all hub sub-packages.
- `pnpm hub:reset`: Clears Docker volumes and database caches and recreates containers.
