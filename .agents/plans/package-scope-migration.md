# Plan: Generic Package Scope Migration

## Status: DRAFT — Pending approval before execution.

---

## 1. Context and Motivation

The monorepo currently uses the project owner's personal identity (`tupynambalucas`) as the NPM
scope prefix for all internal packages (e.g., `@monorepo/hub-api`). This couples the
package graph to a specific brand, making the monorepo non-portable: copying it to a new owner
or renaming the project requires a sweeping multi-file rename.

This plan migrates all internal package names to use the generic scope `@monorepo`, which is
consistent with the industry standard established by the Turborepo team (`@repo`) and aligns with
the monorepo's existing goal of brand-agnostic infrastructure.

The single allowed exception is the **root `package.json`**, which uses the actual project
identifier to declare ownership and acts as the canonical entry point for the repository itself.

---

## 2. Naming Convention Decision

### 2.1. Options Considered

| Option                            | Example             | Assessment                                        |
| :-------------------------------- | :------------------ | :------------------------------------------------ |
| Keep project name as scope prefix | `@monorepo/hub-api` | Brand-coupled. Fails portability goal.            |
| Use `@scope/context-package`      | `@scope/hub-api`    | Too abstract. May clash on npm.                   |
| Use `@repo/context-package`       | `@repo/hub-api`     | Turborepo convention. Unclaimable on npm. Good.   |
| Use `@monorepo/context-package`   | `@monorepo/hub-api` | Explicit, readable, unambiguous intent. Selected. |
| Use `@internal/context-package`   | `@internal/hub-api` | Signals non-publishable, but less standard.       |

### 2.2. Decision: `@monorepo` scope with `context-package` flat naming pattern

**Rationale:**

- `@monorepo` is the most semantically precise: it explicitly communicates that the package
  lives inside a monorepo and is not a standalone published library.
- It is conflict-safe: the `monorepo` npm organization does not publish packages that collide
  with this naming pattern.
- It aligns with the Turborepo `@repo` convention but is more readable for this project's
  Bounded Context DDD architecture.
- The bounded context name becomes the package's first identifier segment, mapping cleanly to
  the directory structure:

  ```text
  hub/services/api            ->  @monorepo/hub-api
  hub/services/web            ->  @monorepo/hub-web
  hub/packages/core           ->  @monorepo/hub-core
  cortex/memory/services/api  ->  @monorepo/cortex-memory-api
  studio/assets               ->  @monorepo/studio-assets
  shared/config               ->  @monorepo/shared-config
  docs                        ->  @monorepo/docs
  ```

### 2.3. Root `package.json` Convention

The root `package.json` name field is updated from `@tupynambalucas` to `tupynambalucas/monorepo`.
This follows the standard used by major open-source repositories (e.g., `vercel/turborepo`,
`facebook/react`) that signal authorship at the root without implying an NPM-publishable scope.

---

## 3. Complete Name Mapping

| File                                         | Current `name`                    | New `name`                        |
| :------------------------------------------- | :-------------------------------- | :-------------------------------- |
| `package.json` (root)                        | `@tupynambalucas`                 | `tupynambalucas/monorepo`         |
| `docs/package.json`                          | `@monorepo/docs`                  | `@monorepo/docs`                  |
| `platform/package.json`                      | `@monorepo/platform`              | `@monorepo/platform`              |
| `renderer/package.json`                      | `@monorepo/renderer`              | `@monorepo/renderer`              |
| `shared/config/package.json`                 | `@monorepo/shared-config`         | `@monorepo/shared-config`         |
| `shared/git/package.json`                    | `@monorepo/shared-git`            | `@monorepo/shared-git`            |
| `hub/packages/core/package.json`             | `@monorepo/hub-core`              | `@monorepo/hub-core`              |
| `hub/services/api/package.json`              | `@monorepo/hub-api`               | `@monorepo/hub-api`               |
| `hub/services/web/package.json`              | `@monorepo/hub-web`               | `@monorepo/hub-web`               |
| `studio/assets/package.json`                 | `@monorepo/studio-assets`         | `@monorepo/studio-assets`         |
| `studio/bucket/package.json`                 | `@monorepo/studio-bucket`         | `@monorepo/studio-bucket`         |
| `cortex/memory/packages/core/package.json`   | `@monorepo/cortex-memory-core`    | `@monorepo/cortex-memory-core`    |
| `cortex/memory/services/api/package.json`    | `@monorepo/cortex-memory-api`     | `@monorepo/cortex-memory-api`     |
| `cortex/memory/services/web/package.json`    | `@monorepo/cortex-memory-web`     | `@monorepo/cortex-memory-web`     |
| `cortex/mcp/guardrails/package.json`         | `@monorepo/cortex-mcp-guardrails` | `@monorepo/cortex-mcp-guardrails` |
| `cortex/mcp/services/firecrawl/package.json` | `@monorepo/cortex-mcp-firecrawl`  | `@monorepo/cortex-mcp-firecrawl`  |
| `cortex/mcp/services/memory/package.json`    | `@monorepo/cortex-mcp-memory`     | `@monorepo/cortex-mcp-memory`     |
| `tools/github/package.json`                  | `@monorepo/tools-github`          | `@monorepo/tools-github`          |
| `tools/provisioner/package.json`             | `@monorepo/tools-provisioner`     | `@monorepo/tools-provisioner`     |

---

## 4. Full Impact Surface

Beyond the `name` fields, every reference to the old names must be updated.

### 4.1. `package.json` files — dependency references

- `dependencies`, `devDependencies`, `peerDependencies` cross-workspace entries using
  `workspace:*` with old names.
- Root `package.json` `"prettier"` field: `"@monorepo/shared-config"` becomes
  `"@monorepo/shared-config"`.
- Root `package.json` `scripts` `--filter` flags referencing old scoped names.

### 4.2. TypeScript configuration

- All `tsconfig.json` `extends` entries: `@monorepo/shared-config/tsconfig.base.json`
  becomes `@monorepo/shared-config/tsconfig.base.json`.
- All `tsconfig.json` `paths` entries mapping `@monorepo/hub-core` to the local source.

### 4.3. Application source code

- TypeScript and JavaScript `import` statements importing from cross-workspace packages.
- Vite `vite.config.ts` `optimizeDeps.exclude` entries.

### 4.4. Build and infrastructure configuration

- `docusaurus.config.ts`: `require('@monorepo/shared-config/project.config.json')` becomes
  `require('@monorepo/shared-config/project.config.json')`.
- `docs/plugins/remark-project-variables/index.mjs`: same `require` call.
- `docs/plugins/studio-assets` (if it resolves `@monorepo/studio-assets/package.json`).
- Dockerfiles: inline comments referencing old package names (cosmetic but recommended).

### 4.5. Agent documentation and skills

- `AGENTS.md` (root), `.agents/AGENTS.md`, `docs/AGENTS.md`: all inline references to
  `@monorepo/shared-config/project.config.json`.
- All `.agents/skills/*/SKILL.md` files: Centralized Config bullet lines.

---

## 5. Ordered Execution Plan

> Execute steps in this exact order. Validate each step before proceeding.

### Step 1 — Update `name` fields in `package.json` files

Apply in bottom-up order (leaf packages first, root last) to avoid broken intermediate states:

1. `shared/config/package.json` — `@monorepo/shared-config`
2. `shared/git/package.json` — `@monorepo/shared-git`
3. `studio/assets/package.json` — `@monorepo/studio-assets`
4. `studio/bucket/package.json` — `@monorepo/studio-bucket`
5. `cortex/memory/packages/core/package.json` — `@monorepo/cortex-memory-core`
6. `cortex/memory/services/api/package.json` — `@monorepo/cortex-memory-api`
7. `cortex/memory/services/web/package.json` — `@monorepo/cortex-memory-web`
8. `cortex/mcp/guardrails/package.json` — `@monorepo/cortex-mcp-guardrails`
9. `cortex/mcp/services/firecrawl/package.json` — `@monorepo/cortex-mcp-firecrawl`
10. `cortex/mcp/services/memory/package.json` — `@monorepo/cortex-mcp-memory`
11. `hub/packages/core/package.json` — `@monorepo/hub-core`
12. `hub/services/api/package.json` — `@monorepo/hub-api`
13. `hub/services/web/package.json` — `@monorepo/hub-web`
14. `tools/github/package.json` — `@monorepo/tools-github`
15. `tools/provisioner/package.json` — `@monorepo/tools-provisioner`
16. `platform/package.json` — `@monorepo/platform`
17. `renderer/package.json` — `@monorepo/renderer`
18. `docs/package.json` — `@monorepo/docs`
19. `package.json` (root) — `tupynambalucas/monorepo`

### Step 2 — Update cross-workspace `dependencies` in all `package.json` files

For each workspace that imports another internal workspace, rename the dependency key to the
new `@monorepo/*` equivalent.

### Step 3 — Update `tsconfig.json` files

Replace all `extends` values and `paths` aliases referencing old scoped names.

### Step 4 — Update application source code

Run a codebase-wide search across `.ts`, `.tsx`, `.mjs`, and `.js` files for any import
containing `@tupynambalucas-` and replace with the corresponding `@monorepo/` name.

### Step 5 — Update root `package.json` scripts and metadata

- Update all `--filter` flags.
- Update the `"prettier"` config pointer field.

### Step 6 — Update build and infrastructure configuration files

- Update `docusaurus.config.ts` and `remark-project-variables/index.mjs` require paths.
- Update any Dockerfile comments for cosmetic consistency.

### Step 7 — Update agent documentation and skills

- Update all `AGENTS.md` inline references.
- Update all `.agents/skills/*/SKILL.md` Centralized Config lines.

### Step 8 — Reinstall dependencies

```bash
pnpm install
```

Regenerates `pnpm-lock.yaml` with the updated package graph and verifies all cross-workspace
links resolve correctly.

### Step 9 — Validate

```bash
pnpm typecheck
pnpm lint
pnpm build
```

All three commands must exit with code `0` before the migration is considered complete.

---

## 6. Verification Checklist

After Step 9 passes, run the following final audit:

```bash
# Must return zero results
grep -r "@tupynambalucas-" --include="*.ts" --include="*.tsx" --include="*.mjs" --include="*.js" .
grep -r "@tupynambalucas-" --include="*.json" . | grep -v "node_modules" | grep -v "pnpm-lock"
grep -r "@tupynambalucas-" --include="*.md" --include="*.mdx" . | grep -v "node_modules"
```

Only the following references to `tupynambalucas` are permitted to remain after migration:

- Root `package.json` `name`, `author`, `homepage`, `repository` fields.
- `MONOREPO.readme.md` and root `README.md` (brand-facing documents, exempt by rule).
- `CHANGELOG.md` and `ROADMAP.md` (historical records, not agent-facing config).
- `pnpm-lock.yaml` auto-generated content.

---

## 7. Risks and Mitigations

| Risk                                                | Mitigation                                                                   |
| :-------------------------------------------------- | :--------------------------------------------------------------------------- |
| Missed import in application code                   | Run the grep audit in Section 6 after Step 4                                 |
| TypeScript path alias mismatch                      | Run `pnpm typecheck` immediately after Step 3                                |
| `pnpm install` fails on broken cross-workspace link | Ensure all `name` fields are updated before running install                  |
| CI pipelines referencing old filter flags           | Update root `package.json` scripts in Step 5; CI workflows derive from these |

---

## 8. Out of Scope

- Renaming physical directories (e.g., `hub/` remains `hub/`). Only `name` fields and their
  references change.
- Modifying `author`, `repository`, or `homepage` fields in any `package.json`.
- Modifying root `README.md` or `MONOREPO.readme.md`.
- Changing `CHANGELOG.md` or `ROADMAP.md` historical content.
