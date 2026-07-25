# Local Context: Studio Workspace

This workspace context ([studio/](./)) defines domain rules, local infrastructure services, design tokens, and asset pipelines for the **Studio Bounded Context**.

---

## 1. Directory Layout

- **[assets/](./assets/)**: Brand identity assets, design tokens, theme configurations, and React SVG icon library under `@tupynambalucas-studio/assets` ([assets/AGENTS.md](./assets/AGENTS.md)).
- **[bucket/](./bucket/)**: Cloudflare R2 asset synchronization CLI tool under `@tupynambalucas-studio/bucket` ([bucket/AGENTS.md](./bucket/AGENTS.md)).
- **[creative/](./creative/)**: Raw creative design sources, Penpot project exports, and master graphics.
- **[infrastructure/](./infrastructure/)**: Containerized infrastructure definitions ([infrastructure/docker/compose.yaml](./infrastructure/docker/compose.yaml)) for Penpot v2 design editor and Memos.

---

## 2. Architectural Principles & Guardrails

1. **Token Invariance**: Brand CSS color tokens and variables MUST be maintained in [assets/tokens/](./assets/tokens/). AI agents MUST NEVER define hardcoded hex values in local application CSS modules.
2. **Asset Governance**: Raw vector logos MUST be placed in [assets/brand/logos/](./assets/brand/logos/) and web-ready icon components inside [assets/icons/](./assets/icons/). Heavy binary backups MUST NOT be committed to Git.
3. **Layered Service Infrastructure**: Containerized Penpot and Memos infrastructure services are orchestrated via [infrastructure/docker/compose.yaml](./infrastructure/docker/compose.yaml).

---

## 3. Scoped Operations

Run these scripts from the monorepo root:

- `pnpm penpot:up`: Launches Penpot collaborative design service at `http://localhost:9005`.
- `pnpm penpot:down`: Stops Penpot services.
- `pnpm penpot:reset`: Resets Penpot container volumes.
- `pnpm memos:up`: Launches Memos knowledge capture service.
- `pnpm studio:bucket`: Runs the Cloudflare R2 synchronization CLI.
