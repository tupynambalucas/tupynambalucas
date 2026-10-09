# tupynambalucas.dev Agents Context

This document serves as the root context router for AI agents operating in the
tupynambalucas.dev monorepo.

## Repository Entry Points

- [README.md](./README.md): Serves exclusively as the dynamic GitHub Profile view, which
  is automatically updated by the `@Tupynambalucas/renderer` workspace generator.
- [MONOREPO.readme.md](./MONOREPO.readme.md): The official developer entry point and
  technical README for the repository.

## Bounded Contexts

- [.agents](./.agents/AGENTS.md): Authoritative domain for agentic AI configurations, skills, plugins, and repository manipulation scripts.
- [hub](./hub/AGENTS.md): Internal team context grouping `observability` (Grafana, Loki, Prometheus), `network` (Traefik, Cloudflared), `tools` (Headlamp), `studio` (Penpot, Memos, brand assets), and `cortex` (AgentGateway, Memory subsystem).
- [corporate](./corporate/AGENTS.md): Public-facing products context housing the company website (React), API (Fastify), and documentation portal (Docusaurus).
- [k8s](./k8s/AGENTS.md): Core infrastructure manifests organized by environment overlays (`dev`, `staging`, `prod`) and Helm charts.
- [renderer](./renderer/AGENTS.md): Dynamic asset generator and document compilation engine producing GitHub profile SVG cards and templated Markdown.
- [shared](./shared/AGENTS.md): Foundational cross-workspace utilities, global configurations, and Git hooks.
- [tools](./tools/AGENTS.md): GitHub CLI automation, repository provisioning scripts, and containerized Git environments.

## Kubernetes Orchestration

The monorepo uses Skaffold v4beta11 for local development (`dev` environment) across two isolated k3d clusters, configured in the `k8s/` directory:

- `root` ([k8s/skaffold.yaml](./k8s/skaffold.yaml)): Main orchestrator that requires the two modules below.
- `hub` ([k8s/skaffold.hub.yaml](./k8s/skaffold.hub.yaml)): Deploys internal tools to the `k3d-hub` cluster.
- `corporate` ([k8s/skaffold.corporate.yaml](./k8s/skaffold.corporate.yaml)): Deploys public products to the `k3d-corporate` cluster.

Cloud environments (`staging` and `prod`) are delivered via ArgoCD GitOps, circumventing Skaffold entirely.

## Global Constraints

- MUST maintain a senior, objective, and technical tone in all documentation.
- MUST avoid preambles, introductory chatter, or conclusion summaries.
- MUST keep sentences concise, clear, and direct.
- MUST write all documentation in English (en-US).
- MUST NOT use emojis in any technical document, README, or skill file.
- MUST NOT use placeholders (e.g., TODO, TBD).
- MUST use relative paths for all Markdown links. Absolute filesystem paths are strictly
  forbidden.
- MUST format all files according to Prettier standards (2-space indent, max 100-character
  line width).
- MUST hardcode the project name and domain in all `AGENTS.md` and `README.md` files (e.g., `Tupynambalucas`, `tupynambalucas.dev`).
- MUST NOT use agnostic tokens like `tupynambalucas.dev` or `Tupynambalucas` outside of the `knowledge-base/collections` directory.

## Required Skills

When performing documentation tasks in this monorepo, agents MUST activate the appropriate skill
by name before beginning:

- **`agent-router-expert`**: MUST be active when creating, updating, or reviewing any `AGENTS.md`
  file anywhere in the monorepo. This skill defines the 3-layer context hierarchy standard,
  `<context-hierarchy>` directive syntax, line budgets, and validation workflow.
- **`markdown-expert`**: MUST be active when creating, updating, or reviewing any `README.md`,
  `.md` skill file, or general Markdown document outside the `knowledge-base/` workspace.

These skills are referenced by name only and are resolved by the active agent runtime. Do not
reference skill files by filesystem path, as agents running in isolated container environments
resolve skills exclusively by their registered name.

## Routing

When working within a specific bounded context, agents MUST read the local `AGENTS.md` file
within that directory before proceeding.
