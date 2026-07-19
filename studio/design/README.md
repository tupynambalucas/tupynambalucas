# @tupynambalucas-studio/design - Studio Assets and Penpot Configuration

This package houses the centralized brand assets, design tokens, and the Penpot collaborative design editor docker orchestration for the tupynambalucas workspace.

---

## Directory Layout

- **[assets/brand/logos/](./assets/brand/logos/)**: Canonical brand visual logo vector resources.
- **[assets/icons/](./assets/icons/)**: React wrapper icon components generated from raw vector configurations.
- **[assets/tokens/](./assets/tokens/)**: Global CSS variables, styling setups, and colors.
- **[creative/](./creative/)**: Graphic raw vectors and creative assets storage.
- **[infrastructure/docker/](./infrastructure/docker/)**: Docker compose files and setup configurations for Penpot.
- **[penpot/](./penpot/)**: Multi-container service definitions for Valkey, postgres, frontend/backend, and aide assistant.

---

## Workspace Structure

The package is split into visual identity assets and self-hosted design tool configurations:

### 1. Design Assets (`assets/`)

Provides shared assets and visual building blocks used across all client packages (such as React packages in `hub`):

- **Icons**: Shared SVG React components (`assets/icons/`).
- **Brand/Logos**: SVG and raster logos for brand consistency (`assets/brand/logos/`).
- **Design Tokens**: Standard color maps, light/dark themes, CSS variables (`assets/tokens/`).

All assets are exported via ESM exports defined in `package.json`.

### 2. Penpot Editor Orchestration (`infrastructure/docker/` and `penpot/`)

Configures and runs the self-hosted collaborative designer tool for creating layouts and prototyping:

- Valkey cache.
- Postgres database.
- Penpot backend (clojure) and frontend (js).
- Penpot AI assistant (aide).

---

## Getting Started

### Design Tokens Integration

Import the CSS variables or helper hooks directly in client applications:

```css
@import '@tupynambalucas-studio/design/tokens.css';
@import '@tupynambalucas-studio/design/theme.css';
```

### Starting Penpot Local Editor

1. Spin up the docker environment from the monorepo root:
   ```bash
   pnpm penpot:up
   ```
2. Open your browser and navigate to `http://localhost:9005`.
3. To stop all design editor services:
   ```bash
   pnpm penpot:down
   ```

---

## Key Scripts

Manage the design system environment using these scripts from the monorepo root:

- `pnpm penpot:up`: Builds and runs Penpot local containers.
- `pnpm penpot:down`: Stops local Penpot containers.
- `pnpm penpot:reset`: Recreates compose containers.
- `pnpm studio:typecheck`: Validates TypeScript type safety across the studio packages.
- `pnpm studio:lint`: Runs ESLint verification.
