# Local Context: AI Cortex Bounded Context Router

This workspace context ([cortex/](./)) orchestrates the unified artificial intelligence infrastructure, including the ingress API gateway, persistent graph database layers, Model Context Protocol (MCP) data plane integrations, and containerized AI agent runtimes.

---

## 1. Directory Layout

- **[gateway/](./gateway/)**: The API ingress gateway and ExtMCP policy guardrails service ([guardrails/](./gateway/guardrails/AGENTS.md)).
- **[memory/](./memory/)**: Self-hosted MongoDB Vector RAG memory subsystem (core, api, web).
- **[mcp/](./mcp/)**: Model Context Protocol (MCP) server-sent event (SSE) gateways and downstream tool adapters.
- **[agents/](./agents/)**: Containerized control plane agent terminal workspaces (Google Antigravity CLI and GitHub Copilot CLI).
- **[infrastructure/](./infrastructure/)**: System orchestration config folders containing [docker/](./infrastructure/docker/) compose and local settings templates.

---

## 2. Model Context Protocol (MCP) Integrations

The Cortex subsystem includes containerized MCP data plane integrations. Detailed context routers, environment variable specifications, and available tool lists are maintained in each server's AGENTS.md router:

- **[Context7 MCP](./mcp/context7/AGENTS.md)**: Real-time framework documentation and code snippet search tools.
- **[Firecrawl MCP](./mcp/firecrawl/AGENTS.md)**: Web scraping, search, document parsing, and autonomous research tools.
- **[GitHub MCP](./mcp/github/AGENTS.md)**: Repository, pull request, issue, branch, commit, and Copilot management tools.
- **[Grafana MCP](./mcp/grafana/AGENTS.md)**: Observability, metrics (Prometheus), logs (Loki), traces (Tempo), and continuous profiling (Pyroscope) tools.
- **[Playwright MCP](./mcp/playwright/AGENTS.md)**: Headless browser automation and accessibility snapshot tools using Chromium.

---

## 3. Operational & Container Networking Guardrails

- **Local Host Application Resolution**: When containerized MCP tools (such as Playwright MCP) access local development applications running on the host machine (e.g., `@docs` dev server or local web applications), agents MUST use `http://host.docker.internal:<port>` instead of `http://localhost:<port>`.
- **Credential Separation**: Never hardcode API keys, access tokens, or personal identifiers. All configuration parameters MUST be loaded via local environment files ([.env](./infrastructure/docker/.env)) and bind-mounted or mapped into container environments.
- **Path Mount Parity**: When configuring volumes in docker compose, the monorepo root MUST be mapped to `/workspace` inside agent containers. Scripts must resolve relative file mappings based on this path.
- **No Direct Folder Deletion**: Legacy folders under `tools/mcp`, `tools/agents`, and `platform/services/agentgateway` MUST NOT be deleted during transitions.
- **Strict Execution Rules**: Shell scripts MUST include execution options like `set -euo pipefail` to abort execution immediately on errors.

---

## 4. Operations Commands Summary

Manage the Cortex environments using the mapped root execution scripts:

| Context Subsystem              | Up Command              | Down Command              | Reset Command              |
| :----------------------------- | :---------------------- | :------------------------ | :------------------------- |
| **Core Infrastructure & MCPs** | `pnpm cortex:core:up`   | `pnpm cortex:core:down`   | `pnpm cortex:core:reset`   |
| **AI Agent Containers**        | `pnpm cortex:agents:up` | `pnpm cortex:agents:down` | `pnpm cortex:agents:reset` |
