# Local Context: AI Cortex Bounded Context Router

This workspace context ([cortex/](./)) orchestrates the unified artificial intelligence infrastructure, including the ingress API gateway, persistent memory subsystems, Model Context Protocol (MCP) data plane integrations, control plane agent runtimes, and system orchestration infrastructure.

---

## 1. Directory Layout

- **[gateway/](./gateway/)**: The system API ingress gateway router context ([gateway/AGENTS.md](./gateway/AGENTS.md)).
- **[memory/](./memory/)**: Self-hosted MongoDB Vector RAG memory subsystem router context ([memory/AGENTS.md](./memory/AGENTS.md)).
- **[mcp/](./mcp/)**: Model Context Protocol (MCP) data plane, policy guardrails, and tool service adapters router context ([mcp/AGENTS.md](./mcp/AGENTS.md)).
- **[infrastructure/](./infrastructure/)**: System orchestration, Docker compose, and Kubernetes infrastructure router context ([infrastructure/AGENTS.md](./infrastructure/AGENTS.md)).

---

## 2. Operational & Container Networking Guardrails

- **Local Host Application Resolution**: When containerized MCP tools (such as Playwright MCP or
  Firecrawl MCP) access local development applications running on the host machine, agents MUST
  automatically resolve them using `http://host.docker.internal:<port>`. Do not ask the user for the
  URL.
  - **docs** (Docusaurus dev server): `http://host.docker.internal:3002`
  - **hub-web** (Vite/React dev server): `http://host.docker.internal:5173`
  - **hub-api** (Fastify REST API): `http://host.docker.internal:3000`
- **Credential Separation**: Never hardcode API keys, access tokens, or personal identifiers. All
  configuration parameters MUST be loaded via local environment files
  ([.env](./infrastructure/.env)) and mapped into container environments.
- **Path Mount Parity**: When configuring volumes, the monorepo root MUST be mapped to `/workspace`
  inside agent containers. Scripts must resolve relative file mappings based on this path.
- **Strict Execution Rules**: Shell scripts MUST include execution options like `set -euo pipefail`
  to abort execution immediately on errors.

---

## 3. Operations Commands Summary

Manage the Cortex environments using the mapped root execution scripts:

| Platform / Subsystem        | Up / Dev Command  | Down / Clean Command | Reset Command       |
| :-------------------------- | :---------------- | :------------------- | :------------------ |
| **Docker Compose (Podman)** | `pnpm cortex:up`  | `pnpm cortex:down`   | `pnpm cortex:reset` |
| **Kubernetes (Skaffold)**   | `pnpm cortex:dev` | `pnpm cortex:clean`  | `pnpm cortex:stop`  |
