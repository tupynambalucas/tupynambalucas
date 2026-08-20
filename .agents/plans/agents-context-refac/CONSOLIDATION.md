# Consolidation and Deletion Plan

This document contains step-by-step instructions for merging, deleting, and consolidating
`AGENTS.md` files as defined in [INVENTORY.md](./INVENTORY.md). Execute phases in order.

---

## Phase 2A: Delete Leaf-Node Files with No Unique Rules

The following files contain no rules that are not already expressed (or will be expressed) in the
parent context file. Delete them after verifying their content is fully covered.

### Cortex MCP Service Adapters (6 files)

These files exist under `cortex/mcp/services/` and repeat the same guardrails already defined in
`cortex/mcp/AGENTS.md`. The parent file already lists all downstream services by name.

```bash
# Verify before deleting: compare unique rules
# If any unique rule is found, port it to cortex/mcp/AGENTS.md first
Remove-Item cortex/mcp/services/context7/AGENTS.md
Remove-Item cortex/mcp/services/firecrawl/AGENTS.md
Remove-Item cortex/mcp/services/github/AGENTS.md
Remove-Item cortex/mcp/services/grafana/AGENTS.md
Remove-Item cortex/mcp/services/memory/AGENTS.md
Remove-Item cortex/mcp/services/playwright/AGENTS.md
```

**Post-delete action**: Update `cortex/mcp/AGENTS.md` navigation section to remove direct links
to the deleted files. Replace individual service links with a single directory reference to
`./services/`.

### Platform Observability Services (3 files)

```bash
# These services have no rules beyond what platform/AGENTS.md port table already covers.
Remove-Item platform/services/grafana/AGENTS.md
Remove-Item platform/services/headlamp/AGENTS.md
Remove-Item platform/services/loki/AGENTS.md
Remove-Item platform/services/prometheus/AGENTS.md
Remove-Item platform/services/tempo/AGENTS.md
```

**Post-delete action**: Update `platform/AGENTS.md` navigation section to remove direct links to
the deleted files.

---

## Phase 2B: Merge Files into Parent Contexts

For each merge operation, extract the unique rules listed in the "Unique Rules to Migrate" column
from [INVENTORY.md](./INVENTORY.md) and append them to the target file under an appropriate
sub-section before deleting the source file.

### Merge: cortex/mcp/guardrails -> cortex/mcp/AGENTS.md

**Unique rules to migrate to `cortex/mcp/AGENTS.md`**:

Add a new sub-section `### Guardrails Service Rules` under the existing
`## 3. Operational & Security Guardrails` section:

```markdown
### Guardrails Service Rules

- The `mcp-guardrails` gRPC server MUST implement `tools/call` and `tools/list` ExtMCP handlers.
- All handler functions MUST be wrapped in try/catch and return `{ pass: {} }` on any parsing
  exception to enforce the fail-open high-availability contract.
- Tool description enrichment MUST add the configured `system_instruction` field to each tool
  metadata object before returning to AgentGateway.
- `localhost` URL mutation MUST rewrite all tool argument URLs matching `localhost` patterns to
  `host.docker.internal` equivalents for containerized browser tools.
```

**Delete after merge**: `cortex/mcp/guardrails/AGENTS.md`

---

### Merge: cortex/mcp/inspector -> cortex/mcp/AGENTS.md

**Unique rules to migrate to `cortex/mcp/AGENTS.md`**:

Add a note to the services navigation section:

```markdown
- **[inspector/](./inspector/)**: MCP Inspector web UI available at `http://localhost:6274` during
  development. Use exclusively for debugging tool schema definitions and live request inspection.
  MUST NOT be exposed in production environments.
```

**Delete after merge**: `cortex/mcp/inspector/AGENTS.md`

---

### Merge: cortex/memory sub-services -> cortex/memory/AGENTS.md

Consolidate all four sub-service files into `cortex/memory/AGENTS.md` under a new
`## 4. Service-Level Rules` section with four sub-sections:

**From `cortex/memory/packages/core/AGENTS.md`**:

```markdown
#### Core Package Rules

- All data models MUST be defined exclusively in `packages/core/` as the SSOT.
- Schema files MUST use the `.schema.ts` suffix.
- DTOs MUST extend Zod schemas using `.pick()` or `.omit()` transforms; manual field duplication
  is forbidden.
- `packages/core/` MUST NOT import from any service package within this subsystem.
```

**From `cortex/memory/services/api/AGENTS.md`**:

```markdown
#### API Service Rules

- The Fastify API MUST use the Repository Pattern with Mongoose model injection.
- `$vectorSearch` aggregation pipelines MUST always include `numCandidates` at minimum 10x the
  `limit` value to guarantee result quality.
- Startup document auto-sync MUST be idempotent: calculate content hashes before ingesting to
  avoid re-embedding unchanged documents.
```

**From `cortex/memory/services/mongodb/AGENTS.md`**:

```markdown
#### MongoDB Service Rules

- MongoDB MUST run as a single-node Replica Set (`rs0`) to support transactions and vector indexes.
- The `rs.initiate()` script in `init-replica.js` MUST be idempotent (check `rs.status()` before
  initiating).
- Vector indexes MUST be created through the initialization script, not programmatically from the
  API service.
```

**From `cortex/memory/services/web/AGENTS.md`**:

```markdown
#### Web Dashboard Rules

- Feature-Sliced Design import direction is strictly enforced: `pages` -> `widgets` -> `features`
  -> `entities` -> `shared`. Cross-layer imports are forbidden.
- State management MUST use TanStack Query for server state. Zustand is permitted only for local
  UI state with no API dependency.
```

**Delete after merge**: All four `cortex/memory/services/*/AGENTS.md` and
`cortex/memory/packages/core/AGENTS.md`.

---

### Merge: platform/infrastructure -> platform/AGENTS.md

**Unique rules to migrate** under a new `### Infrastructure Provisioning Rules` sub-section:

```markdown
#### Infrastructure Provisioning Rules

- All Kubernetes deployments MUST consume credentials from the `platform-secrets` Secret
  (generated from [infrastructure/.env](./infrastructure/.env)).
- Kustomize `secretGenerator` entries MUST include `options.disableNameSuffixHash: true` to
  maintain predictable Secret names referenced by Deployments.
- Docker Compose services MUST declare `restart: unless-stopped` policies for always-on services.
```

**Delete after merge**: `platform/infrastructure/AGENTS.md`

---

### Merge: platform/services/otelcol -> platform/AGENTS.md

**Unique rules to migrate** under a new `### OTel Collector Pipeline Rules` sub-section:

```markdown
#### OTel Collector Pipeline Rules

- The OpenTelemetry Collector configuration (`otelcol-config.yaml`) MUST define separate
  receivers, processors, and exporters. Combining pipeline stages in a single block is forbidden.
- All applications MUST use OTLP/gRPC (`4317`) for trace and metrics export and OTLP/HTTP
  (`4318`) exclusively for log export from non-gRPC-capable runtimes.
```

**Delete after merge**: `platform/services/otelcol/AGENTS.md`

---

### Merge: platform/services/turbocache -> platform/AGENTS.md

**Unique rules to migrate**:

```markdown
#### Turbocache Rules

- The `TURBO_TOKEN` environment variable MUST be set in both the `turbocache` service and all
  CI/CD pipeline environments. Builds without the token bypass remote caching silently.
- Cache artifact retention is configured via `TURBO_API` pointing to the internal cluster DNS
  service `turbocache.platform.svc.cluster.local`.
```

**Delete after merge**: `platform/services/turbocache/AGENTS.md`

---

### Merge: studio sub-directories -> studio/AGENTS.md

Consolidate `studio/assets/`, `studio/bucket/`, and `studio/infrastructure/` AGENTS.md files
into `studio/AGENTS.md` under a new `## 4. Sub-Domain Rules` section:

**From `studio/assets/AGENTS.md`**:

```markdown
#### Assets Sub-Domain Rules

- Design token files MUST follow the `[category].[property].css` naming pattern
  (e.g., `color.primary.css`).
- SVG icons MUST be exported with `viewBox` attributes only; `width` and `height` attributes
  MUST be stripped to allow CSS-controlled sizing.
- The React icon library build MUST be triggered via `pnpm --filter @tupynambalucas-studio/assets
build` before any workspace that imports icons runs its own build.
```

**From `studio/bucket/AGENTS.md`**:

```markdown
#### Bucket Sync Rules

- R2 sync operations MUST use the `@tupynambalucas-studio/bucket` CLI exclusively. Direct
  `wrangler r2 object put` commands are forbidden for bulk operations.
- Sync targets (`CLOUDFLARE_R2_BUCKET_NAME`) MUST be set via environment variables and MUST NOT
  be hardcoded in the CLI source.
```

**From `studio/infrastructure/AGENTS.md`**:

```markdown
#### Infrastructure Sub-Domain Rules

- Penpot MUST use Neon Serverless Postgres as its primary database. Local SQLite is forbidden.
- The Penpot `PENPOT_FLAGS` environment variable MUST enable `enable-login-with-password` for
  self-hosted deployments.
- Memos MUST run with the `--driver postgres` flag pointing to the Neon connection string.
```

**Delete after merge**: `studio/assets/AGENTS.md`, `studio/bucket/AGENTS.md`,
`studio/infrastructure/AGENTS.md`.

---

### Merge: tools sub-directories -> tools/AGENTS.md

**From `tools/github/AGENTS.md`**:

```markdown
#### GitHub CLI Rules

- The monorepo root MUST be bind-mounted to `/workspace` inside all GitHub CLI containers.
  All automation scripts MUST resolve relative paths from this mount point.
- GitHub Personal Access Tokens MUST be provided via the `GITHUB_TOKEN` environment variable
  passed through Docker `--env-file`. Tokens MUST NOT be embedded in Dockerfiles or scripts.
```

**From `tools/provisioner/AGENTS.md`**:

```markdown
#### Provisioner Rules

- All shell provisioning scripts MUST begin with `set -euo pipefail` to enforce immediate exit on
  error, undefined variable access, or pipe failures.
- WSL2 configuration changes MUST be documented in the provisioner README before being applied.
```

**Delete after merge**: `tools/github/AGENTS.md`, `tools/provisioner/AGENTS.md`.

---

## Phase 2C: Update Navigation Links in Parent Files

After all deletions and merges, update these files to remove broken navigation links:

| File                      | Section to Update          | Change Required                                                                   |
| :------------------------ | :------------------------- | :-------------------------------------------------------------------------------- |
| `cortex/mcp/AGENTS.md`    | Directory Layout           | Replace 6 individual service links with `[services/](./services/)` directory link |
| `cortex/memory/AGENTS.md` | Local Architecture         | Remove 4 sub-service links; consolidate as inline sub-section references          |
| `platform/AGENTS.md`      | Bounded Context Navigation | Remove 7 individual service links; consolidate in a `Services` note               |
| `studio/AGENTS.md`        | Directory Layout           | Remove 3 sub-directory AGENTS.md links                                            |
| `tools/AGENTS.md`         | Scoped Workspaces          | Remove 2 sub-directory AGENTS.md links; keep README links only                    |
