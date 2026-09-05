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

- `platform/infrastructure/kubernetes/grafana.yaml`: `grafana-dev.tupynambalucas.dev`
- `platform/infrastructure/kubernetes/traefik.yaml`: `traefik-dev.tupynambalucas.dev`
- `cortex/infrastructure/kubernetes/gateway.yaml`: 6 subdomain host entries
- `cortex/infrastructure/kubernetes/certmanager.yaml`: `wildcard-local-tupynambalucas-dev`
- `studio/infrastructure/kubernetes/penpot.yaml`: `penpot-dev.tupynambalucas.dev`

**Recommendation**: Migrate to a **Hybrid Helm + Kustomize** architecture. Use Helm Charts to package the base infrastructure, and use Kustomize overlays on top of the rendered Helm charts to dynamically inject the `PROJECT_DOMAIN` ConfigMap into Ingress hosts via `replacements`. Do not use find-and-replace scripts for Kubernetes state.

### 1.2. AgentGateway CORS Config

**Severity**: HIGH (Functionality Blocker)
**File**: `cortex/gateway/config.yaml`
A cloned repo will reject all browser requests from the new domain because `allowedOrigins` contains 8 hardcoded `tupynambalucas.dev` entries.

**Recommendation**: Convert to `config.yaml.tmpl` with `${PROJECT_DOMAIN}` placeholders and render at container startup via `envsubst` or Skaffold `transform`.

### 1.3. Infrastructure Manifests Lack Packaging (Helm Integration)

**Severity**: HIGH (Scalability Blocker)
Currently, third-party services (Traefik, Grafana, Redis, etc.) and internal services are deployed using raw Kubernetes YAML files. This makes version upgrades, cross-team distribution, and complex lifecycle management extremely difficult for a reusable template.

**Recommendation**: Adopt **Helm** as the package manager for the monorepo.

1. Consume official Helm Charts for third-party dependencies in the `platform` and `studio` workspaces.
2. Build a standardized base Helm Chart for internal microservices (like `@repo/hub/api` and `@repo/hub/web`).
3. Use Kustomize strictly for environment-specific tweaks (Dev vs. Prod overlays) on top of the Helm Charts.

---

## 2. High Priority Issues (P1) — High Friction & Context Accuracy

### 2.1. `package.json` Manifests

**Severity**: Medium (High friction)
The following fields are hardcoded identically across 9+ `package.json` files:

- `author`: `Tupynambá Lucas Varela Rodrigues <tupynambalucas.dev>`
- `homepage`: `https://docs.tupynambalucas.dev`
- `repository.url`: `git+https://github.com/tupynambalucas/tupynambalucas.git`

**Recommendation**: Implement a "State-Aware" bootstrap script (see section 2.2) to dynamically update these fields.

### 2.2. Missing "State-Aware" Bootstrap Infrastructure

**Severity**: Medium (High friction)
There is no setup script for new project instances. A standard find-and-replace script or empty placeholders would break the template after the first fork (Template Rot).

**Recommendation**: Create a **State-Aware Bootstrap Script** in `tools/provisioner/` (e.g., `pnpm provision init`) that guarantees infinite forkability:

1. **Read Current State:** The script reads `project.config.json` to know the _current_ domain/name (e.g., `tupynambalucas.dev`).
2. **Prompt User:** Asks for the new domain/name.
3. **Targeted Replace:** Performs find-and-replace on `package.json` files searching specifically for the _current_ state and swapping to the _new_ state.
4. **Update Memory:** Overwrites `project.config.json` with the new state.

_This ensures the repository remains fully functional at all times and can be safely copied/forked across infinite generations without losing replaceability._

### 2.3. Placeholder GitHub URLs

**Files**: `docs/handbook/tutorials/local-development-setup.mdx`, `docs/handbook/intro.mdx`
Contain `https://github.com/workspace/workspace.git` with no token substitution.

**Recommendation**: Use `%GITHUB_ORG%/%GITHUB_REPO%` tokens and ensure `remark-project-variables` resolves them.

### 2.4. `code-expert` Skill — Stale Architecture References (DELETION)

**File**: `.agents/skills/code-expert/SKILL.md`
Describes architecture referencing contexts that were renamed/restructured (e.g., `profile/` instead of `renderer/`, `tools/mcp/`). This misguides the AI.

**Recommendation**: **Remove the skill entirely**. The `code-expert` skill will be deleted from the repository.

### 2.5. MONOREPO.readme.md — Fully Hardcoded

**File**: `MONOREPO.readme.md`
Fully hardcoded with project-specific values.

**Recommendation**: Use tokens or render the file via a dedicated pipeline to substitute values before publication.

---

## 3. Medium Priority Issues (P2) — Documentation & Token Coverage

### 3.1. `hub/AGENTS.md` — Token Inconsistency

Uses `@%PROJECT_NAME%-hub/web` but the codebase uses `@repo/hub/web`.
**Recommendation**: Standardize `AGENTS.md` to use the literal import paths (e.g., `@repo/hub/web`).

### 3.2. Docker Compose `extra_hosts`

**File**: `studio/infrastructure/docker/compose.yaml`
Hardcoded `tupynambalucas.internal:host-gateway`.
**Recommendation**: Expand `project.config.json` to include `PROJECT_INTERNAL_HOST` and replace this via the State-Aware init script.

### 3.3. Stale References and Portuguese Text in Docs

- `docs/handbook/explanation/bounded-contexts.mdx`: References non-existent `profile/` context.
- `docs/handbook/reference/styleguide.mdx`: Contains Portuguese UI text (`'Alface Crespa'`).
  **Recommendation**: Update references to `renderer/` and translate styleguide examples to English.

### 3.4. Missing Template Bootstrap Documentation

**Recommendation**: Create `docs/handbook/tutorials/bootstrapping-a-new-project.mdx` explaining how to fork the repo and run the state-aware bootstrap script.

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

## 5. Recommended Execution Order

**Phase 1 — Critical Infra Blockers & Helm Migration**:

1. **Adopt Helm**: Transition raw Kubernetes YAMLs in `platform` and `studio` to official Helm Charts.
2. **Implement Kustomize Overlays**: Create Kustomize `replacements` targeting the Helm-rendered outputs to dynamically inject `PROJECT_DOMAIN`.
3. Template `cortex/gateway/config.yaml` to use environment variables for CORS.

**Phase 2 — State-Aware Bootstrap Tooling**: 4. Expand `project.config.json` with new proposed fields. 5. Create the **State-Aware Bootstrap Script** (`pnpm provision init`) to inject `package.json` data and `extra_hosts` recursively without breaking future forks.

**Phase 3 — Fix Broken References & Agent Contexts**: 6. **Delete `code-expert` skill** (`rm -rf .agents/skills/code-expert`). 7. Fix `bounded-contexts.mdx` to reflect current workspace structures. 8. Resolve `hub/AGENTS.md` package naming inconsistency.

**Phase 4 — Documentation Polish**: 9. Add `%GITHUB_ORG%` / `%GITHUB_REPO%` tokens to MDX docs. 10. Translate Portuguese strings in `styleguide.mdx` to English. 11. Write `bootstrapping-a-new-project.mdx` tutorial.
