# Local Context: Cortex Memory MCP Service

This workspace directory ([memory/](./)) contains the dedicated Model Context Protocol (MCP) server adapter (`@tupynambalucas-cortex/mcp-memory`) for the Cortex Memory Subsystem.

---

## 1. Local Architecture

- **[src/index.ts](./src/index.ts)**: Fastify HTTP SSE server entrypoint implementing `@modelcontextprotocol/sdk`.
- **[src/tools/](./src/tools/)**: Intent-driven MCP tool definitions exposed to AI Agents:
  - `memory_search_knowledge`: RAG vector search over indexed documents.
  - `memory_store_episodic`: Persistence of chat history turns and user facts.
  - `memory_query_graph`: Relational associative graph traversals.
  - `memory_ingest_document`: Document chunking, embedding generation, and vector indexing.
- **[src/client/](./src/client/)**: HTTP client adapter communicating with `memory-api`.

---

## 2. Operational Guardrails

- **Single Source of Truth**: Data contracts and Zod schemas inherit from `@tupynambalucas-cortex/memory-core`.
- **Domain Decoupling**: AI agents call domain tools (`memory_search_knowledge`) instead of raw database queries.
- **Port Allocation**: Host development mode uses port `9007` (`MEMORY_MCP_PORT`), avoiding port `8080` which is reserved for the AgentGateway ingress proxy (`agentgateway`). Containerized execution maps host port `8080` to internal container port `8080`.
- **Gateway Target**: Registered in AgentGateway (`gateway/config.yaml`) under target `memory` (`http://mcp-memory:8080/mcp`).
- **Service Parity**: Uses dual TSConfig (`tsconfig.json` for hot-reload dev, `tsconfig.build.json` for production builds).

---

## 3. Scoped Operations

- `pnpm cortex:memory:dev`: Runs complete memory stack (API, Web UI, MCP server, and MCP Inspector) concurrently in development mode.
- `pnpm --filter @tupynambalucas-cortex/mcp-memory dev`: Direct package development server with embedded MCP Inspector.
- `pnpm --filter @tupynambalucas-cortex/mcp-memory build`: Compile production distribution.
