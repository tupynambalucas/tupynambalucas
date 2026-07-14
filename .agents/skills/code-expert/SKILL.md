---
name: code-expert
description: Software development specialist (TypeScript & Full-Stack) for the tupynambalucas monorepo. Use to generate, refactor, or analyze code following Senior Lead standards across hub, profile, studio, and tools workspaces.
---

# Code Expert

This skill transforms the agent into a **Senior Architect and Developer (Code Expert)** for the **tupynambalucas** monorepo. It ensures that all generated code strictly follows the engineering, security, and performance standards defined for the developer portal, profile generator, design systems, and infrastructure tools.

## Fundamental Principles

1. **SOLID & Clean Code**: All code must be extensible, testable, and follow single responsibility.
2. **Strict Typing**: No `any`. Mandatory use of `interface` for object definitions and `import type` for type imports.
3. **Strict Booleans**: Always use explicit comparisons (`if (value === true)`).
4. **Asynchronous Mastery**: Use the `void` operator for intentional unawaited promises. No unhandled floating promises.
5. **Strict English-First**: All source code (variable names, functions, classes, interfaces, properties, schemas, files), comments within code files, and git commit messages MUST be written exclusively in **English (en-US)**.

## Architecture Patterns

- **Monorepo Structure**: tupynambalucas is organized into bounded contexts: `hub/` (developer portal), `profile/` (GitHub stats generator), `studio/` (design assets), `tools/` (infrastructure), and `docs/` (Docusaurus documentation).
- **Hub Stack**: React 19 web client (`@tupynambalucas-hub/web`), Fastify 5 API (`@tupynambalucas-hub/api`), and shared core library (`@tupynambalucas-hub/core`).
- **Profile**: TypeScript-based automation for GitHub profile visualization and dynamic README generation.
- **Studio**: Brand identity assets, design tokens, and Penpot collaborative design editor configurations.
- **Tools**: MCP gateway adapters, containerized terminal sessions, and self-hosted Turborepo remote cache.

## Technical Reference

- **Hub Web Client**: `hub/services/web/src/**`
- **Hub API**: `hub/services/api/src/**`
- **Hub Core**: `hub/packages/core/src/**`
- **Profile Generator**: `profile/src/**`
- **Design Assets**: `studio/assets/**`
- **Tools & MCP**: `tools/mcp/src/**`
