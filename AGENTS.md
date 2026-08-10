# tupynambalucas.dev Agents Context

This document serves as the root context router for AI agents operating in the
tupynambalucas.dev monorepo.

## Repository Entry Points

- [README.md](./README.md): Serves exclusively as the dynamic GitHub Profile view, which
  is automatically updated by the `@tupynambalucas/renderer` workspace generator.
- [MONOREPO.readme.md](./MONOREPO.readme.md): The official developer entry point and
  technical README for the repository.
- [Documentation Site](https://docs.tupynambalucas.dev): Live Docusaurus knowledge base
  deployed on Cloudflare Pages.

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

## Routing

When working within a specific bounded context, agents MUST refer to the local `AGENTS.md`
file within that directory for scoped instructions.
