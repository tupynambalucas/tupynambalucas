# @tupynambalucas-studio/design - Studio Assets and Penpot Configuration

This package houses the centralized brand assets, design tokens, and the Penpot collaborative design editor docker orchestration for the tupynambalucas workspace.

---

## Workspace Structure

The package is split into visual identity assets and self-hosted design tool configurations:

### 1. Design Assets (`assets/`)

Provides shared assets and visual building blocks used across all client packages (such as React packages in `hub`):

- **Icons**: Shared SVG React components (`assets/icons/`).
- **Brand/Logos**: SVG and raster logos for brand consistency (`assets/brand/logos/`).
- **Design Tokens**: Standard color maps, light/dark themes, CSS variables (`assets/tokens/`).

All assets are exported via ESM exports defined in `package.json`.

### 2. Penpot Editor Orchestration (`infrastructure/docker/` and `services/`)

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
- `pnpm penpot:aide:up`: Boots Penpot AI assistant.
- `pnpm studio:typecheck`: Validates TypeScript type safety across the studio packages.
- `pnpm studio:lint`: Runs ESLint verification.
