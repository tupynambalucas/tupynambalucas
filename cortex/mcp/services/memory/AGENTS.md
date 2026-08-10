# Local Context: Cortex Memory MCP Service

This workspace directory ([memory/](./)) contains the dedicated Model Context Protocol (MCP) server adapter (`@tupynambalucas-cortex/mcp-memory`) for the Cortex Memory Subsystem.

---

## 1. Local Architecture

- **[src/index.ts](./src/index.ts)**: Fastify HTTP server entry point implementing `@modelcontextprotocol/sdk` over Streamable HTTP.
- **[src/tools/](./src/tools/)**: Domain MCP tool definitions:
  - `memory_search_knowledge`: Semantic RAG vector search over indexed documents.
  - `memory_store_episodic`: Persistence of chat history turns and user facts.
  - `memory_query_graph`: Relational associative graph traversals.
  - `memory_ingest_document`: Document chunking, embedding generation, and vector indexing.
- **[src/client/](./src/client/)**: HTTP client adapter communicating with `memory-api`.
- **[Dockerfile](./Dockerfile)**: Production container image build definition.

---

## 2. Operational Guardrails

- **Single Source of Truth**: Data contracts and Zod validation schemas inherit from `@tupynambalucas-cortex/memory-core`.
- **Domain Decoupling**: AI agents call domain tools (`memory_search_knowledge`) instead of raw database queries.
- **Port Allocation**: Host development mode uses port `9007` (`MEMORY_MCP_PORT`), avoiding port `8080` which is reserved for the AgentGateway ingress proxy (`agentgateway`). Containerized execution maps internal port `8080`.
- **Gateway Target**: Registered in AgentGateway ([config.yaml](../../../gateway/config.yaml)) under target `memory` (`http://mcp-memory:8080/mcp`).
- **Service Parity**: Uses dual TSConfig (`tsconfig.json` for hot-reload dev, `tsconfig.build.json` for production builds).

---

## 3. Scoped Operations

- `pnpm --filter @tupynambalucas-cortex/mcp-memory dev`: Runs Fastify MCP server in watch mode with `tsx`.
- `pnpm --filter @tupynambalucas-cortex/mcp-memory build`: Compiles TypeScript production distribution.
- `pnpm --filter @tupynambalucas-cortex/mcp-memory typecheck`: Validates TypeScript types without emitting files.
- `pnpm --filter @tupynambalucas-cortex/mcp-memory lint`: Executes ESLint validation.
