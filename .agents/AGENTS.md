<context-hierarchy>
  <parent src="../AGENTS.md" type="global-rules" />
  <system-instruction>
    AGENT: If you have not read "../AGENTS.md" in this session, stop now and read it using your
    file-reading tools before proceeding. Global constraints are mandatory.
  </system-instruction>
</context-hierarchy>

# Bounded Context: AI Agents Configuration

This bounded context ([.agents/](./)) manages the lifecycle, personas, tools, and domain-specific knowledge for AI agents operating within the %PROJECT_DOMAIN% monorepo. It strictly adheres to the Antigravity (AGY) customization architecture.

---

## 1. Directory Architecture

- **[plans/](./plans/)**: Temporary, markdown-based execution plans for complex refactors.
- **[plugins/](./plugins/)**: Bundled MCP (Model Context Protocol) definitions, server lifecycle configs, and associated rules (e.g., the `cortex` plugin routing to `agentgateway`).
- **[rules/](./rules/)**: Global or localized markdown constraints that are automatically injected into the agent's context based on location or trigger conditions.
- **[scripts/](./scripts/)**: Agent-authored utility scripts (Node.js, Bash) meant for repository manipulation.
- **[skills/](./skills/)**: Self-contained Markdown instruction files defining expert personas, validation workflows, and multi-step runbooks. Loaded on demand via progressive disclosure.

---

## 2. Agent Constraints

1. **Root Script Ban**: Agents MUST NEVER create temporary or utility scripts (e.g., `scratch.js`, `update.js`) directly in the monorepo root.
2. **Script Location**: Permanent, version-controlled scripts MUST be saved in [scripts/](./scripts/). Transient execution scripts MUST be saved in the agent's isolated `brain/scratch/` directory.
3. **Cross-Boundary References**: Customizations inside [skills/](./skills/) or [plugins/](./plugins/) MUST be 100% self-contained. They MUST NOT contain relative links pointing to transient folders like [plans/](./plans/).
4. **Plugin Encapsulation**: Any new MCP server integration MUST be encapsulated inside a named plugin directory within [plugins/](./plugins/) containing a `plugin.json` and `mcp_config.json`.
5. **Generic Nomenclature**: All contextual configurations MUST use agnostic template variables (`%PROJECT_DOMAIN%`, `%PROJECT_NAME%`) rather than hardcoded brand names to preserve monorepo template portability.

---

## 3. Required Skill

When creating, updating, or analyzing custom Agent Skills within this bounded context, agents MUST activate the `skill-expert` skill by name before beginning.

---

## 4. Documentation Rules (Diátaxis & AST Variables)

When agents write technical documentation for the monorepo (specifically in the `docs/` workspace):

1. **Diátaxis Framework**: All documentation MUST be structured into four quadrants (`tutorials`, `guides`, `reference`, `explanation`). The AI must activate the `docusaurus-expert` skill for exact formatting instructions.
2. **AST Project Variables**: Agents MUST NOT hardcode project names or domains. Instead, they must use tokens like `%PROJECT_DOMAIN%` and `%PROJECT_NAME%` which are defined centrally in `@monorepo/shared-config/project.config.json` (located in the `shared/config/` workspace). The `remark-project-variables` plugin parses the MDX AST and automatically replaces these tokens during the build.
