<context-hierarchy>
  <parent src="../AGENTS.md" type="global-rules" />
  <system-instruction>
    AGENT: If you have not read "../AGENTS.md" in this session, stop now and read it using your
    file-reading tools before proceeding. Global constraints are mandatory.
  </system-instruction>
</context-hierarchy>

# Bounded Context: Studio Context Router

This bounded context ([studio/](./)) defines domain rules, design tokens, asset synchronization pipelines, and containerized design collaboration infrastructure for the **Studio Bounded Context**.

---

## 1. Directory Layout

- **[assets/](./assets/)**: Brand identity assets, design tokens, theme configurations, and React SVG icon library under `@repo/studio/assets`. Rules are consolidated in Section 4.
- **[bucket/](./bucket/)**: Cloudflare R2 asset synchronization CLI tool under `@repo/studio/bucket`. Rules are consolidated in Section 4.
- **[creative/](./creative/)**: Raw creative design sources, master Illustrator/Photoshop files, and vector graphics.
- **[infrastructure/](./infrastructure/)**: Containerized Docker Compose and Kubernetes deployment manifests for Penpot v2 and Memos. Rules are consolidated in Section 4.

---

## 1.5. Ubiquitous Language

| Term           | Definition                                                                | Forbidden Synonyms |
| :------------- | :------------------------------------------------------------------------ | :----------------- |
| `Design Token` | A CSS custom property encoding a brand value (color, spacing, typography) | variable, constant |
| `Asset`        | A production-ready SVG, font, or compiled CSS file served from R2         | resource, file     |
| `Brand`        | The visual identity system (logos, color palette, typography)             | style, theme       |

---

## 2. Bounded Context Architecture

- **Architecture Diagram**: [references/architecture.md](./references/architecture.md)

### Service Mapping & Port Allocation

| Service           | Internal Port | Host / Forwarded Port | Ingress Host                  | Protocol    |
| :---------------- | :------------ | :-------------------- | :---------------------------- | :---------- |
| `penpot-frontend` | 8080          | 9005                  | `penpot-dev.%PROJECT_DOMAIN%` | HTTP        |
| `penpot-backend`  | 6060          | 6060                  | Internal Cluster DNS          | HTTP        |
| `penpot-exporter` | 6061          | 6061                  | Internal Cluster DNS          | HTTP        |
| `valkey`          | 6379          | 6379                  | Internal Cluster DNS          | TCP (Redis) |
| `penpot-aide`     | 4400-4403     | 4400-4403             | Internal Cluster DNS          | HTTP / MCP  |
| `memos`           | 5230          | 5230                  | `memos-dev.%PROJECT_DOMAIN%`  | HTTP        |

---

## 3. Architectural Principles & Guardrails

1. **Token Invariance**: Brand CSS color tokens and variables MUST be maintained in [assets/src/tokens/](./assets/src/tokens/). AI agents MUST NEVER define hardcoded hex values in local application CSS modules.
2. **Asset Governance**: Raw vector logos MUST be placed in [assets/src/brand/logos/](./assets/src/brand/logos/) and web-ready icon components inside [assets/src/icons/](./assets/src/icons/). Heavy binary backups MUST NOT be committed to Git.
3. **Secrets Isolation**: Local variables and database strings MUST be defined in [.env](./infrastructure/.env) and mapped into container environments via `studio-secrets` in Kubernetes or `--env-file` in Docker Compose.
4. **Skaffold Dependency**: Studio requires `platform-dev` ([platform/skaffold.yaml](../platform/skaffold.yaml)). Whenever Studio runs in Kubernetes via Skaffold, Platform infrastructure starts automatically.

---

## 4. Sub-Domain Rules

### Assets Sub-Domain Rules

- Design token files MUST follow the `[category].[property].css` naming pattern (e.g., `color.primary.css`).
- SVG icons MUST be exported with `viewBox` attributes only; `width` and `height` attributes MUST be stripped to allow CSS-controlled sizing.
- The React icon library build MUST be triggered via `pnpm --filter @repo/studio/assets build` before any workspace that imports icons runs its own build.

### Bucket Sync Rules

- R2 sync operations MUST use the `@repo/studio/bucket` CLI exclusively. Direct `wrangler r2 object put` commands are forbidden for bulk operations.
- Sync targets (`CLOUDFLARE_R2_BUCKET_NAME`) MUST be set via environment variables and MUST NOT be hardcoded in the CLI source.

### Infrastructure Sub-Domain Rules

- Penpot MUST use Neon Serverless Postgres as its primary database. Local SQLite is forbidden.
- The Penpot `PENPOT_FLAGS` environment variable MUST enable `enable-login-with-password` for self-hosted deployments.
- Memos MUST run with the `--driver postgres` flag pointing to the Neon connection string.

---

## 5. Scoped Operations

| Target Runtime            | Purpose                                                  | Command                 |
| :------------------------ | :------------------------------------------------------- | :---------------------- |
| **Kubernetes (Skaffold)** | Start Studio & Platform in Kubernetes with hot-reloading | `pnpm studio:dev`       |
| **Kubernetes (Skaffold)** | Delete Studio cluster resources                          | `pnpm studio:clean`     |
| **Kubernetes (Skaffold)** | Stop Studio deployment stack                             | `pnpm studio:stop`      |
| **Docker Compose**        | Boot standalone Studio containers                        | `pnpm studio:up`        |
| **Docker Compose**        | Stop standalone Studio containers                        | `pnpm studio:down`      |
| **Docker Compose**        | View Studio container logs in real time                  | `pnpm studio:logs`      |
| **Docker Compose**        | Reset Studio container volumes                           | `pnpm studio:reset`     |
| **R2 Asset Sync**         | Run Cloudflare R2 bucket asset synchronization           | `pnpm studio:bucket`    |
| **Typecheck**             | Run TypeScript validation across studio packages         | `pnpm studio:typecheck` |
| **Lint**                  | Run ESLint validation across studio packages             | `pnpm studio:lint`      |
