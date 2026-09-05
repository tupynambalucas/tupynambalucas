<context-hierarchy>
  <parent src="../AGENTS.md" type="global-rules" />
  <system-instruction>
    AGENT: If you have not read "../AGENTS.md" in this session, stop now and read it using your
    file-reading tools before proceeding. Global constraints are mandatory.
  </system-instruction>
</context-hierarchy>

# Bounded Context: Shared

This file defines the domain rules, architecture, and workspace navigation for the Shared bounded context in the %PROJECT_DOMAIN% monorepo. This bounded context holds cross-workspace utilities, configurations, and Git hooks.

---

## 1. Bounded Context Navigation

- **[config/](./config/AGENTS.md)**: Global formatting, TypeScript configuration, and project constants.
- **[git/](./git/AGENTS.md)**: Git lifecycle hooks and commit scripts.

---

## 2. Ubiquitous Language

The following terms MUST be used in all code, variables, schemas, comments, and documentation within this bounded context. Using synonyms or informal alternatives is forbidden.

| Term   | Definition                   | Forbidden Synonyms |
| :----- | :--------------------------- | :----------------- |
| Config | Centralized project settings | setup, variables   |
| Hook   | Git lifecycle script         | trigger, event     |

---

## 3. Bounded Context Architecture

`mermaid
flowchart TD
    direction TD
    A["Shared Context"] --> B["config/"]
    A --> C["git/"]
    B -.-> D["Monorepo Workspaces"]
    C -.-> E["Version Control System"]
`

---

## 4. Context Isolation Guardrails

- MUST NOT import modules from any other bounded contexts.
- MUST provide fully agnostic and generic utilities that apply globally.
