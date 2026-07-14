# tupynambalucas.dev Agents Context

This document serves as the root context router for AI agents operating in the tupynambalucas.dev monorepo.

## Repository Entry Points

- [README.md](./README.md): Serves exclusively as the dynamic GitHub Profile view, which is automatically updated by the `@tupynambalucas/renderer` workspace generator.
- [MONOREPO.md](./MONOREPO.md): The official developer entry point and technical README for the repository.

## Bounded Contexts

- [docs](./docs/AGENTS.md): Documentation and guides hub.
- [hub](./hub/AGENTS.md): Developer website client, REST API, and data core library.
- [renderer](./renderer/AGENTS.md): Dynamic asset generator and document compilation engine.
- [studio](./studio/AGENTS.md): Brand visual assets, design tokens, and Penpot editor configurations.
- [platform](./platform/AGENTS.md): Core cluster services, ingress routing, telemetry monitoring, and build cache.
- [tools](./tools/AGENTS.md): Model Context Protocol gateway, containerized terminals, and LLM worker agents.

## Global Constraints

- MUST write all documentation in English (en-US).
- MUST NOT use emojis in any technical document, README, or skill file.
- MUST NOT use placeholders (e.g., TODO, TBD).
- MUST use relative paths for all Markdown links. Absolute filesystem paths are strictly forbidden.
- MUST format all files according to Prettier standards (2-space indent, max 100-character line width).

## Routing

When working within a specific bounded context, agents MUST refer to the local `AGENTS.md` file within that directory for scoped instructions.
