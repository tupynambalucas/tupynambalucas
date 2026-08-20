# Handbook Documentation Plan

This document specifies the new content additions required in `docs/handbook/` to document the
AGENTS.md context architecture, authoring standards, and the 3-layer hierarchy model.

The `docs/handbook/` is structured using the Diataxis framework with four quadrants:
tutorials, guides, reference, and explanation.

---

## 1. Assessment: Current Coverage

The current handbook does not document:

- The `AGENTS.md` file format or its purpose.
- The 3-layer context hierarchy model.
- The `<context-hierarchy>` directive.
- How to author or update `AGENTS.md` files.
- The relationship between bounded contexts and AI agent behavior.

The handbook's `explanation/` section covers bounded contexts at an architectural level (via
`bounded-contexts.mdx`) but does not address the AI context layer at all.

---

## 2. New Documents to Create

### 2.1. Explanation: AI Context Architecture

**File**: `docs/handbook/explanation/ai-context-architecture.mdx`
**Diataxis Quadrant**: Explanation (understanding-oriented)
**Purpose**: Explain WHY the 3-layer AGENTS.md hierarchy exists, the problems it solves, and
how it relates to DDD bounded contexts.

**Outline**:

```markdown
---
title: AI Context Architecture
description: Understanding the 3-layer AGENTS.md hierarchy and its role in the monorepo.
sidebar_position: [N]
---

# AI Context Architecture

## The Problem: Context Fragmentation

[Explain token waste, context myopia, and drift entropy from having 40+ files]

## The Solution: 3-Layer Context Hierarchy

[Explain Layer 1 / Layer 2 / Layer 3 responsibilities]

## Why This Matches DDD Bounded Contexts

[Connect the layer model to the Bounded Context structure already documented]

## The Context Hierarchy Directive

[Explain why the <context-hierarchy> XML block exists and how it works]

## Token Efficiency

[Explain the line budget per layer and why terseness matters for LLMs]
```

---

### 2.2. How-To Guide: Authoring AGENTS.md Files

**File**: `docs/handbook/guides/authoring-agents-md.mdx`
**Diataxis Quadrant**: How-To Guide (goal-oriented)
**Purpose**: Guide developers through the process of creating or updating an AGENTS.md file
for a new bounded context or sub-domain.

**Outline**:

```markdown
---
title: Authoring AGENTS.md Files
description: How to create and update AI context router files across the monorepo.
sidebar_position: [N]
---

# Authoring AGENTS.md Files

## Before You Start

[Prerequisites: understanding the 3-layer hierarchy, reading the skill]

## Determining the Layer

[Decision flowchart: is this a root / bounded context / sub-domain?]

## Creating a Layer-2 Bounded Context File

[Step-by-step with the template from TEMPLATES.md]

## Creating a Layer-3 Sub-Domain File

[Step-by-step with the template]

## Adding the Context Hierarchy Directive

[Exact syntax with path calculation guide]

## Writing the Ubiquitous Language Section

[How to identify and document domain terms]

## Running the Validation Workflow

[Reference to the workflow.md steps]
```

---

### 2.3. Reference: AGENTS.md File Format

**File**: `docs/handbook/reference/agents-md-format.mdx`
**Diataxis Quadrant**: Reference (information-oriented)
**Purpose**: Provide a complete reference for the AGENTS.md file format, all valid sections,
the `<context-hierarchy>` directive schema, and the line budget constraints.

**Outline**:

```markdown
---
title: AGENTS.md Format Reference
description: Complete reference for the AGENTS.md context file format and all valid sections.
sidebar_position: [N]
---

# AGENTS.md Format Reference

## File Location Rules

[Where files go, depth rules]

## Layer Definitions

[Table of layers with descriptions, line budgets, and file paths]

## Context Hierarchy Directive

[Complete XML schema with all attributes and valid values]

## Standard Sections by Layer

[Layer 1 sections | Layer 2 sections | Layer 3 sections]

## Formatting Rules

[Prettier compliance, heading hierarchy, list formatting, link rules]

## Forbidden Patterns

[What is never allowed: absolute paths, emojis, external URLs, duplicated global rules]
```

---

## 3. Sidebar Registration

After creating the three new MDX files, register them in the appropriate Docusaurus sidebar
configuration files:

| File                                      | Sidebar File  | Category                    |
| :---------------------------------------- | :------------ | :-------------------------- |
| `explanation/ai-context-architecture.mdx` | `sidebars.ts` | Explanation > Architecture  |
| `guides/authoring-agents-md.mdx`          | `sidebars.ts` | Guides > Developer Workflow |
| `reference/agents-md-format.mdx`          | `sidebars.ts` | Reference > File Formats    |

---

## 4. Localization

Per the `docs/AGENTS.md` guardrail, every English document addition MUST have a synchronized
Brazilian Portuguese (`pt-BR`) translation created under `docs/i18n/pt-BR/`.

Create the following translation stubs at the same time as the English originals:

- `docs/i18n/pt-BR/docusaurus-plugin-content-docs/current/handbook/explanation/ai-context-architecture.mdx`
- `docs/i18n/pt-BR/docusaurus-plugin-content-docs/current/handbook/guides/authoring-agents-md.mdx`
- `docs/i18n/pt-BR/docusaurus-plugin-content-docs/current/handbook/reference/agents-md-format.mdx`

---

## 5. Deferred: intro.mdx Update

The `docs/handbook/intro.mdx` references a workspace called `@tupynambalucas/profile` with a
"Zig-based GitHub profile stats compiler" in Section 3 and Section 5. This workspace no longer
exists under that name (the actual workspace is `renderer/`). This discrepancy is out of scope
for this refactoring plan but is noted here for a future documentation maintenance task.

Additionally, `intro.mdx` Section 3 references `hub/services/web` as a Cloudflare Pages
deployment, which is consistent with the current architecture. No changes needed there.
