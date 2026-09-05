<context-hierarchy>
  <parent src="../../AGENTS.md" type="global-rules" />
  <parent src="../AGENTS.md" type="bounded-context-rules" />
  <system-instruction>
    AGENT: If you have not read "../../AGENTS.md" and "../AGENTS.md" in this session, stop now
    and read both files using your file-reading tools before proceeding. Both global constraints
    and bounded context rules are mandatory.
  </system-instruction>
</context-hierarchy>

# Local Context: Shared Config

This workspace ([config/](./)) contains global configuration, TypeScript base configurations, and formatting rules. Read [../AGENTS.md](../AGENTS.md) for the parent bounded context rules before operating here.

---

## 1. Directory Layout

- **[project.config.json](./project.config.json)**: Single source of truth for project domains and repo paths.
- **[prettierrc.json](./prettierrc.json)**: Global Prettier formatting rules.
- **[.prettierignore](./.prettierignore)**: Global formatting exclusions.
- **[tsconfig.base.json](./tsconfig.base.json)**: Base TypeScript compilation configuration.

---

## 2. Coding Guardrails

- MUST maintain configuration files as pure JSON without dynamic logic.
- MUST NOT introduce dependencies on other monorepo packages.
