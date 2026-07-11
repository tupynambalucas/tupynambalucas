# AI Agents Context File Patterns

This reference defines the templates and structural standards for `AGENTS.md` files at the root, bounded context, application, and library package levels.

---

## 1. Global Monorepo Router Pattern (`/AGENTS.md`)

The root `AGENTS.md` must act as the primary entry point, outlining monorepo topology, global guardrails, and AI personas.

### Outline Layout

```markdown
# tupynambalucas - Monorepo AI Master Context & Router

This file establishes the authoritative monorepo context, global rules, and interaction standards for AI agents.

## Navigation & Context Routing

- Link mappings to all root bounded contexts.

## Global Guardrails (Non-Negotiable)

- List of absolute requirements (English-First, No Emojis, No Placeholders, etc.).

## Unified Orchestration Commands

- Top-level pnpm dev/prod commands.

## AI Interaction Persona

- Role, tone, proactiveness, and validation rules.
```

---

## 2. Bounded Context Router Pattern (`/[context]/AGENTS.md`)

Created at the root of a domain directory (e.g. `extension/`, `studio/`, `tools/`, `studio/`) to route agents to its apps and packages.

### Outline Layout

```markdown
# Bounded Context Context: [Context Name]

This file defines the domain rules, local stack services, and workspace structure for the [Context Name] bounded context.

## Bounded Context Navigation

- Links to sub-workspaces (Core, API, Web, etc.).

## Bounded Context Architecture

- High-level role of this context, database name definitions, port mappings, and topological charts.

## Context Isolation Guardrails

- Rules preventing cross-context imports.

## Local Lifecycle Commands

- Stack execution and database setup commands.
```

---

## 3. Core Package Context Pattern (`/[context]/packages/core/AGENTS.md`)

Details the validation and type requirements of the core library.

### Outline Layout

```markdown
# Local Context: [Context] Core Package

This package is the Single Source of Truth (SSOT) for data contracts, validation schemas, and TypeScript interfaces.

## Local Architecture & Directory Map

- Paths to schemas, types, and constants.

## Core Package Guardrails

- Schema suffix conventions, import guidelines, and type assertions restrictions.

## Scoped Operations

- Compilation, watch mode, and typechecking scripts.
```

---

## 4. API Context Pattern (`/[context]/apps/api/AGENTS.md`)

Defines controllers, services, repositories, and models.

### Outline Layout

```markdown
# Local Context: [Context] API Application

This workspace contains the REST API for this bounded context.

## Local Architecture & Directory Map

- Paths to domains, config, plugins, and models.

## API Coding Guardrails

- Layered sequence rules, model injection syntax, idempotency requirements, and security rules.

## Local Lifecycle Commands

- Development server execution, build, and linting.
```

---

## 5. Web Context Pattern (`/[context]/apps/web/AGENTS.md`)

Specifies Zustand selectors, JSX rendering, and CSS rules.

### Outline Layout

```markdown
# Local Context: [Context] Web Client Application

This workspace contains the React Single Page Application client.

## Local Architecture & Directory Map

- Paths to shared/ui, features, domains, and assets.

## Web Coding Guardrails

- Zustand selector pattern, explicit JSX checks, relative CSS unit rules, and console logging constraints.

## Local Lifecycle Commands

- dev and build commands.
```
