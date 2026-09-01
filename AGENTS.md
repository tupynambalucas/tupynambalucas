# %PROJECT_DOMAIN% Agents Context

This document serves as the root context router for AI agents operating in the
%PROJECT_DOMAIN% monorepo.

## Repository Entry Points

- [README.md](./README.md): Serves exclusively as the dynamic GitHub Profile view, which
  is automatically updated by the `@%PROJECT_NAME%/renderer` workspace generator.
- [MONOREPO.readme.md](./MONOREPO.readme.md): The official developer entry point and
  technical README for the repository.

## Bounded Contexts

- [cortex](./cortex/AGENTS.md): Unified AI processing hub housing the AgentGateway MCP
  ingress proxy, MongoDB Vector RAG memory subsystem, MCP adapter services, and
  containerized agent runtimes. Kubernetes namespace `cortex`, Skaffold module `cortex-dev`.
- [platform](./platform/AGENTS.md): Always-on cluster infrastructure providing Traefik
  ingress routing, Cloudflare Tunnel edge connectivity, cert-manager TLS automation,
  OpenTelemetry observability pipelines (Prometheus, Loki, Tempo, Grafana), Headlamp
  cluster dashboard, and Turbocache remote build cache. Kubernetes namespace `platform`,
  Skaffold module `platform-dev`.
- [studio](./studio/AGENTS.md): Brand identity management, design tokens, and
  collaborative design infrastructure (Penpot v2, Memos), plus Cloudflare R2 asset
  synchronization. Kubernetes namespace `studio`, Skaffold module `studio-dev`.
- [hub](./hub/AGENTS.md): Developer website client (React 19), REST API (Fastify 5),
  and Zod-based data core library.
- [renderer](./renderer/AGENTS.md): Dynamic asset generator and document compilation
  engine producing GitHub profile SVG cards and templated Markdown.
- [docs](./docs/AGENTS.md): Docusaurus v3 knowledge base structured under the Diataxis
  framework with English and Portuguese (pt-BR) localization.
- [tools](./tools/AGENTS.md): GitHub CLI automation, repository provisioning scripts,
  and containerized Git environments.

## Kubernetes Orchestration

The monorepo uses Skaffold v4beta11 with three composable modules defined in
[skaffold.yaml](./skaffold.yaml):

- `platform-dev` ([platform/skaffold.yaml](./platform/skaffold.yaml)): Base
  infrastructure module. Required by all other modules.
- `cortex-dev` ([cortex/skaffold.yaml](./cortex/skaffold.yaml)): AI services module.
  Automatically starts `platform-dev`.
- `studio-dev` ([studio/skaffold.yaml](./studio/skaffold.yaml)): Design services module.
  Automatically starts `platform-dev`.

## Global Constraints

- MUST write all documentation in English (en-US).
- MUST NOT use emojis in any technical document, README, or skill file.
- MUST NOT use placeholders (e.g., TODO, TBD).
- MUST use relative paths for all Markdown links. Absolute filesystem paths are strictly
  forbidden.
- MUST format all files according to Prettier standards (2-space indent, max 100-character
  line width).

## .agents Architecture & Scripting Rules

The `.agents/` directory is the authoritative domain for agentic AI configurations. It strictly follows a Domain-Driven Design (DDD) directory structure:

- `.agents/plans/`: Temporary, markdown-based plan artifacts outlining execution steps for complex tasks.
- `.agents/plugins/`: MCP (Model Context Protocol) plugin definitions and server configurations.
- `.agents/rules/`: Global context files and shared system prompts.
- `.agents/scripts/`: Agent-authored utility scripts (Node.js, Bash, Python) meant for repository manipulation.
- `.agents/skills/`: Self-contained `.md` instruction files detailing expert agent personas and workflow rules.

**CRITICAL SCRIPTING RULE**: Agents MUST NOT create utility or scratch scripts (e.g., `scratch.js`, `update.js`) directly in the monorepo root.

- If a script is meant to be saved and version-controlled for the monorepo, it MUST be created inside `.agents/scripts/`.
- If a script is strictly temporary (for one-off execution or debugging), it MUST be created in the agent's isolated artifact directory (`<appDataDir>/brain/<conversation-id>/scratch/`) or immediately deleted after execution.

## Required Skills

When performing documentation tasks in this monorepo, agents MUST activate the appropriate skill
by name before beginning:

- **`agent-router-expert`**: MUST be active when creating, updating, or reviewing any `AGENTS.md`
  file anywhere in the monorepo. This skill defines the 3-layer context hierarchy standard,
  `<context-hierarchy>` directive syntax, line budgets, and validation workflow.
- **`markdown-expert`**: MUST be active when creating, updating, or reviewing any `README.md`,
  `.md` skill file, or general Markdown document outside the `docs/` workspace.

These skills are referenced by name only and are resolved by the active agent runtime. Do not
reference skill files by filesystem path, as agents running in isolated container environments
resolve skills exclusively by their registered name.

## Routing

When working within a specific bounded context, agents MUST read the local `AGENTS.md` file
within that directory before proceeding.
