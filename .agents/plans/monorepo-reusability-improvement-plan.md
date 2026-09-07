# Monorepo Reusability Improvement Plan

> Analysis date: 2026-09-05
> Scope: Monorepo configuration, AGENTS.md, README.md, docs/, and .agents/skills/ files

---

## Executive Summary

The monorepo has a strong foundation for reusability through the `project.config.json` token
system and the `remark-project-variables` plugin. However, a recursive audit reveals several
critical issues that prevent true copy-paste reusability. The AST token replacement only works for Docusaurus at build time. It leaves Kubernetes manifests, Docker Compose configs, CORS configurations, and package.json files fully hardcoded. Additionally, there are placeholder GitHub URLs with no resolution mechanism, outdated workspace references, and structural gaps like the lack of a proper "State-Aware" bootstrap/init script and the absence of **Helm** for infrastructure packaging.

---

## 1. Critical Issues (P0) — Blocks Deployment & Reusability Immediately

### 1.1. Kubernetes Ingress YAML & Cert-Manager

**Severity**: HIGH (Deployment Blocker)
There are ~20 hardcoded host entries across 10 YAML files. Deploying a fork without changing these will fail TLS provisioning entirely.

**Recommendation**: Migrate to a **Hybrid Helm + Kustomize** architecture. Use Helm Charts to package the base infrastructure, and use Kustomize overlays on top of the rendered Helm charts to dynamically inject the `PROJECT_DOMAIN` ConfigMap into Ingress hosts via `replacements`. Do not use find-and-replace scripts for Kubernetes state.

### 1.2. AgentGateway CORS Config

**Severity**: HIGH (Functionality Blocker)
**File**: `cortex/gateway/config.yaml` (Loaded via `configMapGenerator`)
A cloned repo will reject all browser requests from the new domain because `allowedOrigins` contains 8 hardcoded `tupynambalucas.dev` entries.

**Professional Best Practice**: Do **not** use `envsubst` initContainers or shell scripts, as they add runtime complexity and failure points (considered "quick and dirty" for simple CI/CD). Since we are adopting **Helm** (see Section 1.3), the industry standard is to migrate this static `configMapGenerator` into a Helm Chart template.
Helm natively supports string interpolation inside ConfigMaps. We will place `config.yaml` in the new Helm chart as a template and use Helm's `{{ .Values.projectDomain }}` to dynamically render the CORS allowed origins.

### 1.3. Infrastructure Manifests Lack Packaging (Helm Integration)

**Severity**: HIGH (Scalability Blocker)
Currently, third-party services (Traefik, Grafana, Redis, etc.) and internal services are deployed using raw Kubernetes YAML files. This makes version upgrades, cross-team distribution, and complex lifecycle management extremely difficult for a reusable template.

**Recommendation**: Adopt **Helm** as the package manager for the monorepo.

1. Consume official Helm Charts for third-party dependencies in the `platform` and `studio` workspaces.
2. Build a standardized base Helm Chart for internal microservices (like `@repo/hub/api` and `@repo/hub/web`).
3. Use Kustomize strictly for environment-specific tweaks (Dev vs. Prod overlays) on top of the Helm Charts.

---

## 2. High Priority Issues (P1) — High Friction & Context Accuracy

### 2.1. `package.json` Manifests, CI/CD, & `.env` Files

**Severity**: Medium (High friction)
The following fields are hardcoded identically across 9+ `package.json` files, package filters in `.github/workflows/deploy-docs.yaml`, and hardcoded variables in `.env` files (e.g., `PENPOT_PUBLIC_URI=https://penpot-dev.tupynambalucas.dev` in `studio/infrastructure/.env`):

- `author`: `Tupynambá Lucas Varela Rodrigues <tupynambalucas.dev>`
- `homepage`: `https://docs.tupynambalucas.dev`
- `repository.url`: `git+https://github.com/tupynambalucas/tupynambalucas.git`

**Recommendation**: Mutate these fields dynamically using the Provisioner CLI (see section 2.2).

### 2.2. Integrate "State-Aware Bootstrap" into the Provisioner CLI

**Severity**: Medium (High friction)
There is no automated renaming script for new project instances.

**Enterprise Best Practice (Commander + Clack Prompts Architecture)**:
We will adopt the professional CLI pattern (Commander.js + `@clack/prompts`) originally drafted in earlier design docs, applying it _exclusively_ to power the `tools/provisioner` Workstation/Bootstrap CLI.

1. **SSOT Alignment**: The CLI imports `@monorepo/shared-config/project.config.json` as the ultimate Source of Truth.
2. **Architecture**: Implement **Commander.js** for command routing and keep **`@clack/prompts`** for the interactive TUI experience.
3. **Implementation**:
   - Refactor `src/index.ts` to initialize Commander (Completed: Old code purged).
   - Create a dedicated module `src/commands/init.command.ts` (mapped to `pnpm provision init`).
4. **Execution Flow (`init` command)**:
   - Ask the user for the new `PROJECT_DOMAIN`, `GITHUB_ORG`, etc., using `@clack/prompts` wizard.
   - Update `project.config.json` (the SSOT).
   - Iterate through `package.json`, GitHub Workflows, Docker Compose configs, and all local `.env` / `.env.example` files to safely string-replace the _old_ SSOT values with the _new_ ones.

### 2.3. Placeholder GitHub URLs

**Files**: `docs/handbook/tutorials/local-development-setup.mdx`, `docs/handbook/intro.mdx`
Contain `https://github.com/workspace/workspace.git` with no token substitution.

**Recommendation**: Use `%GITHUB_ORG%/%GITHUB_REPO%` tokens and ensure `remark-project-variables` resolves them.

### 2.4. `code-expert` Skill — Stale Architecture References

**File**: `.agents/skills/code-expert/SKILL.md`
Describes architecture referencing contexts that were renamed/restructured (e.g., `profile/` instead of `renderer/`, `tools/mcp/`). This misguides the AI.

**Mandatory Action**: **DELETE the skill completely**. We must exclude this skill from the repository immediately. It is no longer a recommendation, but a strict requirement to prevent AI confusion.

### 2.5. MONOREPO.readme.md — Fully Hardcoded

**File**: `MONOREPO.readme.md`
Fully hardcoded with project-specific values.

**Recommendation**: Use tokens or render the file via a dedicated pipeline to substitute values before publication.

---

## 3. Medium Priority Issues (P2) — Documentation & Token Coverage

### 3.1. `hub/AGENTS.md` — Token Inconsistency

Uses `@%PROJECT_NAME%-hub/web` but the codebase uses `@monorepo/hub-web`.
**Recommendation**: Standardize `AGENTS.md` to use the literal package names defined in `package.json` (e.g., `@monorepo/hub-web`).

### 3.2. Docker Compose `extra_hosts` & Network Aliases

**Files**: `studio/infrastructure/docker/compose.yaml`, `hub/infrastructure/docker/compose.yaml`
Hardcoded `tupynambalucas.internal:host-gateway` and `tupynambalucas.hub.prod`.
**Recommendation**: Expand `project.config.json` to include `PROJECT_INTERNAL_HOST` and replace this via the CLI bootstrap process.

### 3.3. Stale References and Portuguese Text in Docs

- `docs/handbook/explanation/bounded-contexts.mdx`: References non-existent `profile/` context.
- `docs/handbook/reference/styleguide.mdx`: Contains Portuguese UI text (`'Alface Crespa'`).
  **Recommendation**: Update references to `renderer/` and translate styleguide examples to English.

### 3.4. Missing Template Bootstrap Documentation

**Recommendation**: Create `docs/handbook/tutorials/bootstrapping-a-new-project.mdx` explaining how to fork the repo and run the state-aware bootstrap CLI command.

### 3.5. Missing Architectural Decision Records (ADR)

**Severity**: Low (Enterprise Maturity Blocker)
**Recommendation**: Document these structural changes using the ADR pattern to ensure future maintainers understand the design. Create `docs/handbook/explanation/adr-001-gitops-architecture.mdx` explaining the Helm+Kustomize hybrid model, and `adr-002-state-aware-provisioning.mdx` explaining the `project.config.json` lifecycle.

---

## 4. Expansion of `project.config.json`

**Proposed Expansion**:

```json
{
  "PROJECT_NAME": "Tupynambalucas",
  "PROJECT_DISPLAY_NAME": "Tupynambá Lucas",
  "PROJECT_DOMAIN": "tupynambalucas.dev",
  "PROJECT_INTERNAL_HOST": "tupynambalucas.internal",
  "GITHUB_ORG": "tupynambalucas",
  "GITHUB_REPO": "tupynambalucas",
  "AUTHOR_NAME": "Tupynambá Lucas Varela Rodrigues",
  "AUTHOR_EMAIL": "tupynambalucas.dev"
}
```

---

## 5. Architectural Guide: Skaffold + Helm + Kustomize

Currently, the workspaces (`platform`, `cortex`, `studio`) configure Skaffold (v4beta11) strictly for Kustomize without Helm support.

**Current State (skaffold.yaml):**

```yaml
manifests:
  kustomize:
    paths:
      - infrastructure/kubernetes
    buildArgs:
      - --load-restrictor=LoadRestrictionsNone
```

**Enterprise Target Architecture (The Native Hybrid Approach):**
To seamlessly marry Kustomize's environment overlaying with Helm's packaging, we will use Kustomize's built-in `helmCharts` generator, which Skaffold fully supports.

1. **Update all `skaffold.yaml` files** to append the `--enable-helm` argument to Kustomize:

```yaml
manifests:
  kustomize:
    paths:
      - infrastructure/kubernetes
    buildArgs:
      - --load-restrictor=LoadRestrictionsNone
      - --enable-helm # Enables Kustomize to inflate Helm charts
```

2. **Update `kustomization.yaml` files** to replace raw YAMLs with Helm Charts:

```yaml
apiVersion: kustomize.config.k8s.io/v1beta1
kind: Kustomization

helmCharts:
  - name: traefik
    repo: https://traefik.github.io/charts
    version: 26.0.0
    releaseName: traefik
    namespace: platform
    valuesFile: helm-values/traefik-values.yaml

# We then patch the Helm output using Kustomize logic
replacements:
  - source:
      kind: ConfigMap
      name: project-domain-config
      fieldPath: data.PROJECT_DOMAIN
    targets:
      - select:
          kind: Ingress
        fieldPaths:
          - spec.rules.*.host
```

This guarantees that Skaffold handles the orchestration naturally, Helm handles the complex component definitions, and Kustomize cleanly injects your project configurations (including retaining `secretGenerator` blocks to load local `.env` variables into the Helm-rendered resources).

---

## 6. Recommended Execution Order

**Phase 1 — Critical Infra Blockers & Helm Migration**:

1. **Update Skaffold configs**: Add `--enable-helm` to Kustomize `buildArgs` in `platform`, `cortex`, and `studio`.
2. **Adopt Helm**: Transition raw Kubernetes YAMLs to official Helm Charts via `helmCharts` in `kustomization.yaml` (and create local Helm charts for `agentgateway`).
3. **Implement Kustomize Overlays**: Create Kustomize `replacements` targeting the Helm-rendered outputs to dynamically inject `PROJECT_DOMAIN`.

**Phase 2 — State-Aware Bootstrap Tooling**: 4. Expand `project.config.json` with new proposed fields. 5. Implement the **Bootstrap Command (`init`)** using `commander` + `@clack/prompts` in the existing `tools/provisioner/` CLI.

**Phase 3 — Fix Broken References & Agent Contexts**: 6. **Delete `code-expert` skill** (`rm -rf .agents/skills/code-expert`). _This is mandatory._ 7. Fix `bounded-contexts.mdx` to reflect current workspace structures. 8. Resolve `hub/AGENTS.md` package naming inconsistency.

**Phase 4 — Enterprise Documentation Polish**: 9. Create ADRs (`adr-001` and `adr-002`) documenting the new architecture. 10. Add `%GITHUB_ORG%` / `%GITHUB_REPO%` tokens to MDX docs. 11. Translate Portuguese strings in `styleguide.mdx` to English. 12. Write `bootstrapping-a-new-project.mdx` tutorial.
