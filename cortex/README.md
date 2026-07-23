# Unified AI Cortex Workspace

Cortex is the unified Bounded Context for the tupynambalucas.dev artificial intelligence architecture, consolidating the gateway ingress, persistent memory databases, Model Context Protocol (MCP) data plane integrations, and control plane agent runtimes.

---

## Architecture Overview

Cortex organizes the AI ecosystem into three distinct functional planes:

1. **Ingress Gateway Plane ([gateway/](./gateway/))**:
   - Routes traffic, validates inputs, and connects clients to the Model Context Protocol ecosystem.
   - Utilizes `agentgateway` to expose HTTP endpoints and a visual playground interface.

2. **Data Plane & Memory Layer ([mcp/](./mcp/) & [memory/](./memory/))**:
   - Implements document-native Vector RAG memory databases (MongoDB) and tools integrations.
   - Downstream MCP server adapters expose specific resources and tools (Firecrawl, GitHub, Grafana, Playwright).

3. **Control Plane Agent Plane ([agents/](./agents/))**:
   - Operates containerized terminal runtimes (Google Antigravity CLI and GitHub Copilot CLI).
   - Downstream agents execute operations against the mapped repository workspace using tools.

---

## Model Context Protocol (MCP) Integrations

The Cortex data plane incorporates containerized MCP server adapters. Each adapter includes documentation detailing available tools and environment variables:

- **[Firecrawl MCP](./mcp/firecrawl/README.md)**: Web scraping, web searching, document parsing, and autonomous research tools.
- **[GitHub MCP](./mcp/github/README.md)**: Repository, pull request, issue, branch, commit, and Copilot management tools.
- **[Grafana MCP](./mcp/grafana/README.md)**: Observability, metrics (Prometheus), logs (Loki), traces (Tempo), and continuous profiling (Pyroscope) tools.
- **[Playwright MCP](./mcp/playwright/README.md)**: Headless browser automation and accessibility snapshot tools using Chromium.

---

## Directory Structures

- [gateway/](./gateway/): System API Ingress Gateway configuration and playground.
- [memory/](./memory/): Self-hosted MongoDB Vector RAG memory subsystem (core, api, web).
- [mcp/](./mcp/): Model Context Protocol server specifications and service Dockerfiles.
- [agents/](./agents/): Control plane agent CLI installation scripts and state folders.
- [infrastructure/](./infrastructure/): Docker orchestration compose files and development templates.

---

## Development Setup & Running

All services are orchestrated via Docker Compose profiles. Centralized configuration parameters are managed inside the [infrastructure/docker/.env](./infrastructure/docker/.env) file.

### 1. Core Services

To build and start the core services (gateway and memory database):

```bash
pnpm cortex:core:up
```

### 2. Model Context Protocol Services

To start all MCP adapters:

```bash
pnpm cortex:mcp:up
```

### 3. Agent Runtime Environment

To run the containerized agent CLI runtimes:

```bash
pnpm cortex:agents:up
```

For authentication, run:

- Antigravity CLI: `pnpm cortex:antigravity:auth`
- Copilot CLI: `pnpm cortex:copilot:auth`
