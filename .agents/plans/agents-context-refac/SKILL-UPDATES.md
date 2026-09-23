# Skill Update Specifications: agent-router-expert

This document defines the exact changes required in the `agent-router-expert` skill files to
bring them into alignment with the 3-layer context architecture and the actual monorepo structure.

Reference skill location: [.agents/skills/agent-router-expert/](../../skills/agent-router-expert/)

---

## 1. Changes to `SKILL.md`

### 1.1. Add Context Hierarchy Section

Add the following section after Section 1 (Global Documentation Standards) and before Section 2
(Document Guidelines):

```markdown
## 1.5. Context Hierarchy Directive

Every Layer-2 and Layer-3 `AGENTS.md` file MUST include a `<context-hierarchy>` XML block as the
very first content in the file. This directive instructs AI agents to read the parent context file
before proceeding.

- The directive MUST appear before the H1 heading.
- The `src` attribute MUST use a relative path to the parent `AGENTS.md`.
- The `<system-instruction>` MUST use imperative language ("stop now and read").
- The directive MUST NOT contain external URLs or absolute paths.

See [references/syntax.md](references/syntax.md) for the complete directive syntax specification.
See [TEMPLATES.md](../plans/agents-context-refac/TEMPLATES.md) for layer-specific directive examples.
```

### 1.2. Add Line Budget Rule to Document Guidelines (Section 2)

Add the following bullet to the existing `Rules` list in Section 2:

```markdown
- **Line Budget**: Each layer has a maximum line budget. Exceeding the budget degrades token
  efficiency. Layer 1: 80 lines. Layer 2: 120 lines. Layer 3: 100 lines. Extract concrete code
  patterns to separate linked reference files when needed.
```

### 1.3. Add Required Skills Declaration Standard

Add the following section after Section 2 (Document Guidelines) and before Section 3
(Build and Content Validation Workflow):

```markdown
## 2.5. Required Skills Declaration Standard

When an `AGENTS.md` file governs a workspace where agents perform documentation tasks requiring a
specialized skill, the skill MUST be declared in a `Required Skill` (or `Required Skills`) section.

**Rules**:

- Skills MUST be declared by name only (e.g., `agent-router-expert`, `docusaurus-expert`).
- Skills MUST NOT be referenced by filesystem path (e.g., `.agents/skills/agent-router-expert/`).
- Name-only resolution is mandatory because agents running in isolated container environments
  resolve skills exclusively through the active runtime's skill registry, not the filesystem.
- The Layer-1 root `AGENTS.md` declares global document-authoring skills (`agent-router-expert`
  and `markdown-expert`).
- Bounded context `AGENTS.md` files declare context-specific skills only when the bounded context
  has a specialized authoring workflow (e.g., `docs/AGENTS.md` declares `docusaurus-expert`).
- Layer-3 sub-domain files do NOT repeat skill declarations from parent files.
```

---

## 2. Changes to `references/patterns.md`

### 2.1. Fix Path Reference: `apps/` -> `services/`

The existing patterns use `apps/api` and `apps/web` paths, which do not match the actual monorepo
structure. The actual paths use `services/api` and `services/web`.

**Find and replace** in the file:

| Current                                  | Replacement                         |
| :--------------------------------------- | :---------------------------------- |
| `/[context]/apps/api/AGENTS.md`          | `/[context]/services/api/AGENTS.md` |
| `/[context]/apps/web/AGENTS.md`          | `/[context]/services/web/AGENTS.md` |
| `apps/api`, `apps/web` (all occurrences) | `services/api`, `services/web`      |

### 2.2. Add `<context-hierarchy>` Directive to Bounded Context Pattern (Section 2)

In the Bounded Context Router Pattern template (Section 2), add the `<context-hierarchy>` block
at the top of the template:

```markdown
<context-hierarchy>
  <parent src="../AGENTS.md" type="global-rules" />
  <system-instruction>
    AGENT: If you have not read "../AGENTS.md" in this session, stop now and read it using your
    file-reading tools before proceeding. Global constraints are mandatory.
  </system-instruction>
</context-hierarchy>
```

### 2.3. Add `<context-hierarchy>` Directive to Core/API/Web Patterns (Sections 3-5)

For all three package/application patterns, add the appropriate Layer-3 directive:

```markdown
<context-hierarchy>
  <parent src="../../AGENTS.md" type="global-rules" />
  <parent src="../AGENTS.md" type="bounded-context-rules" />
  <system-instruction>
    AGENT: If you have not read "../../AGENTS.md" and "../AGENTS.md" in this session, stop now
    and read both files before proceeding.
  </system-instruction>
</context-hierarchy>
```

### 2.4. Add Layer-3 Sub-Domain Pattern (New Section 6)

Add a new section at the end of `patterns.md`:

```markdown
---

## 6. Infrastructure / Deployment Context Pattern (`/[context]/infrastructure/AGENTS.md`)

Used for Kubernetes manifests, Docker Compose, and environment configuration directories.

### Outline Layout

# Local Context: [Context] Infrastructure & Deployment

This workspace ([infrastructure/](./)) contains orchestration configurations for [Context].
Read [../AGENTS.md](../AGENTS.md) for parent bounded context rules before operating here.

## 1. Directory Layout

- Paths to kubernetes/, docker/, .env.example.

## 2. Operational Guardrails

- Kustomize secret generation rules.
- Compose profile scoping rules.
- Environment parity requirements.
```

### 2.5. Add Ubiquitous Language Section to Bounded Context Pattern

Inside the Bounded Context Router Pattern template, add after Navigation:

```markdown
## Ubiquitous Language

| Term   | Definition              | Forbidden Synonyms      |
| :----- | :---------------------- | :---------------------- |
| `Term` | Domain-specific meaning | forbidden, alternatives |
```

---

## 3. Changes to `references/workflow.md`

### 3.1. Add Line Budget Validation Step

Add the following step to Section 2 (Formatting and Rules Check):

```markdown
### F. Line Budget Check

- Count the total lines of the modified `AGENTS.md` file.
- Layer 1 (root): MUST NOT exceed 80 lines.
- Layer 2 (bounded context): MUST NOT exceed 120 lines.
- Layer 3 (sub-domain): MUST NOT exceed 100 lines.
- If the budget is exceeded, extract code snippets to an `.agents/` hidden subdirectory and replace the
  inline block with a relative markdown link.
```

### 3.2. Add Context Hierarchy Directive Validation Step

Add to Section 1 (Context Verification):

```markdown
### C. Context Hierarchy Directive Check

- Verify that every Layer-2 and Layer-3 file has a `<context-hierarchy>` block as its first
  content (before the H1 heading).
- Verify that the `src` attributes in the directive resolve to existing `AGENTS.md` files using
  the relative path from the current file.
- Verify that the `<system-instruction>` uses imperative language.

### D. Required Skills Audit

- Verify that the root `/AGENTS.md` declares both `agent-router-expert` and `markdown-expert`
  in a `Required Skills` section.
- Verify that `docs/AGENTS.md` declares `docusaurus-expert` in a `Required Skill` section.
- Verify that all skill references use skill names only. The presence of any filesystem path
  (e.g., `.agents/skills/`, `../skills/`) in a skill declaration is a blocking violation.
- Verify that Layer-3 files do NOT contain skill declarations (they inherit from parents).
```

---

## 4. Changes to `references/syntax.md`

### 4.1. Add Context Hierarchy Directive Section

Add the following new section after Section 3 (LLM-Optimized Design Patterns):

```markdown
---

## 4. Context Hierarchy Directive Syntax

The `<context-hierarchy>` directive is an XML block placed at the top of every Layer-2 and
Layer-3 `AGENTS.md` file. It instructs agents to load parent context files before proceeding.

### Structure

The directive contains:

- One or more `<parent>` elements referencing parent context files via relative paths.
- A `<system-instruction>` element with an imperative, first-person instruction to the agent.

### Attributes

- `src` (required): Relative filesystem path from the current file to the parent `AGENTS.md`.
- `type` (required): Semantic category. Valid values: `global-rules`, `bounded-context-rules`.

### Layer-2 Example (one level deep)

<context-hierarchy>
  <parent src="../AGENTS.md" type="global-rules" />
  <system-instruction>
    AGENT: If you have not read "../AGENTS.md" in this session, stop now and read it using your
    file-reading tools before proceeding. Global constraints are mandatory.
  </system-instruction>
</context-hierarchy>

### Layer-3 Example (two levels deep)

<context-hierarchy>
  <parent src="../../AGENTS.md" type="global-rules" />
  <parent src="../AGENTS.md" type="bounded-context-rules" />
  <system-instruction>
    AGENT: If you have not read "../../AGENTS.md" and "../AGENTS.md" in this session, stop now
    and read both files using your file-reading tools before proceeding.
  </system-instruction>
</context-hierarchy>

### Critical Rules

- The directive MUST be the first content in the file, before the H1 heading.
- MUST use relative paths only. Absolute paths are forbidden.
- MUST NOT reference external URLs.
- MUST use imperative language in the system-instruction.
```
