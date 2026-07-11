# Workspace Context: Studio Workspace

This file defines the domain rules, local stack services, and directory structure for the **Studio Bounded Context** (`studio/`).

---

## Studio Navigation

Before editing or analyzing design files, brand tokens, or the S3 synchronization scripts, read the local rules for the specific workspace:

- **Design Assets & Penpot Editor**: [design/AGENTS.md](./design/AGENTS.md) — Shared brand assets, theme tokens, and self-hosted Penpot docker configuration under `@tupynambalucas-studio/design`.
- **Cloudflare R2 Storage Sync**: [bucket/AGENTS.md](./bucket/AGENTS.md) — Dynamic synchronization CLI engine for design assets with Cloudflare R2 bucket under `@tupynambalucas-studio/bucket`.

---

## Workspace Architecture

The Studio workspace centralizes brand visual assets, CSS design tokens, and SVG icon wrappers:

- **[design/assets/tokens/](./design/assets/tokens/)**: Canonical design token definitions (color variables, typography mappings) consumed by both Hub and Docs clients.
- **[design/assets/icons/](./design/assets/icons/)**: Scoped React SVG wrapper components generated from raw vectors.
- **[bucket/](./bucket/)**: Custom asset synchronization script for Cloudflare R2.

---

## Studio Guardrails

1. **Token Invariance**: Brand CSS color tokens and variables MUST be maintained in this workspace and exported. AI agents MUST NEVER define hardcoded hex values in local application CSS modules.
2. **Asset Organization**: AI agents MUST NEVER commit heavy binary design backups to git branches. Keep source design vectors in [design/assets/brand/logos/](./design/assets/brand/logos/) and load final web-ready SVGs into [design/assets/icons/](./design/assets/icons/).
3. **No Dead References**: Avoid references to theme configurations or custom IDE extensions in this workspace.

---

## Scoped Commands

Run these scripts from the monorepo root to manage the design stack:

- `pnpm penpot:up`: Launches the Penpot collaborative design services at `http://localhost:9005`.
- `pnpm penpot:down`: Stops the Penpot services.
- `pnpm penpot:aide:up`: Starts the Penpot AI assistant (aide) interface.
- `pnpm penpot:aide:down`: Stops the Penpot AI assistant.
- `pnpm studio:bucket`: Runs the Cloudflare R2 synchronization CLI.
