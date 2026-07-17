---
name: agent-router-expert
description: Use this skill to create, analyze, or update local and root router context files (AGENTS.md) across monorepo workspaces.
---

# Agent Router Expert

This skill defines the standards, structure, design patterns, and validation workflow for `AGENTS.md` context router files in the **tupynambalucas** monorepo.

## 1. Global Documentation Standards

The following rules apply to all documentation tasks, regardless of file extension or location.

### A. Tone of Voice

- Maintain a senior, objective, and technical tone.
- Avoid preambles, introductory chatter, or conclusion summaries.
- Keep sentences concise, clear, and direct.

### B. Strict English-First

- All technical documentation, READMEs, architectural briefs, and code comments/examples MUST be written in English (en-US).

### C. Zero Emojis

- Emojis are strictly forbidden in all technical documents, READMEs, and skill files to maintain a professional, corporate appearance.

### D. Mermaid Diagram Standards

- Always define layout direction explicitly (e.g., `direction TD` or `direction LR`).
- Use clear node labels wrapped in double quotes (e.g., `node["label"]`) to prevent parser issues with special characters.
- Use subgraphs to explicitly illustrate Bounded Context boundaries (e.g., separating `extension/` logic from `studio/` logic).
- Do not use HTML formatting tags within Mermaid labels; rely on plain Markdown where supported.

### E. Zero Placeholders

- Never include empty sections, "TBD", or "TODO" notes in documentation. If a section is not yet ready, omit it completely.

### F. Prettier Formatting Standards

- All files must comply with the Prettier formatting rules defined in [.prettierrc.json](../../../.prettierrc.json) (2-space indentation, max 100-character line width, hyphen-based unordered lists, and proper JavaScript/TypeScript code block styling).

---

## 2. Document Guidelines

Use these guidelines when creating, updating, or analyzing `AGENTS.md` context files across monorepo workspaces and packages.

- **Purpose**: Act as local and root routers/guardrail lists to provide high-fidelity context for AI agents without cluttering developer-facing READMEs.
- **Rules**:
  - Every referenced file, schema, or configuration directory MUST use clickable relative markdown links (e.g. [tsconfig.json](./tsconfig.json)) to facilitate rapid tool-based navigation.
  - Clickable relative links MUST NEVER be wrapped in backticks (e.g., `[label](path)`) because it prevents parsers from identifying them as interactive links.
  - Absolute file system paths (e.g. `/absolute/path/to/project`, `/projects/...`) and external web URLs (e.g. `https://github.com/...`, `https://docusaurus.io/...`) MUST NEVER be used inside `AGENTS.md` files. Local development localhost links (e.g. `http://localhost:3000`) are permitted solely in commands execution logs/guidance.
  - Write using clear, absolute constraints ("NEVER", "MUST", "ALWAYS") rather than conversational prose.
  - Do not duplicate global rules (English-First, Zero Emojis, Zero Placeholders) in local sub-workspace context files.
- **Reference Files**:
  - AI Agent syntax and path reference: [references/syntax.md](references/syntax.md)
  - Root, core, api, and web layouts: [references/patterns.md](references/patterns.md)
  - Verification, emoji auditing, and rule alignment: [references/workflow.md](references/workflow.md)

---

## 3. Build and Content Validation Workflow

Before completing any documentation task, you must execute the verification steps defined in the workflow guide:

- Follow the verification and audit steps in [references/workflow.md](references/workflow.md).
