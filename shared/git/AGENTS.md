<context-hierarchy>
  <parent src="../../AGENTS.md" type="global-rules" />
  <parent src="../AGENTS.md" type="bounded-context-rules" />
  <system-instruction>
    AGENT: If you have not read "../../AGENTS.md" and "../AGENTS.md" in this session, stop now
    and read both files using your file-reading tools before proceeding. Both global constraints
    and bounded context rules are mandatory.
  </system-instruction>
</context-hierarchy>

# Local Context: Shared Git

This workspace ([git/](./)) contains Husky hook definitions and TypeScript scripts for Git lifecycle events. Read [../AGENTS.md](../AGENTS.md) for the parent bounded context rules before operating here.

---

## 1. Directory Layout

- **[husky/](./husky/)**: Git lifecycle hook mappings (e.g., pre-commit, prepare-commit-msg).
- **[scripts/](./scripts/)**: TypeScript files executed during Git hooks (e.g., pre-commit.ts, prepare-commit-msg.ts).

---

## 2. Coding Guardrails

- MUST use .ts for lifecycle scripts rather than pure Bash to ensure cross-platform compatibility.
- MUST NOT introduce heavy dependencies that slow down developer Git operations.
