# Cortex Memory MCP Service

The `cortex/mcp/services/memory` workspace provides the dedicated Model Context Protocol (MCP) server (`@tupynambalucas-cortex/mcp-memory`) for AI agents to interact with the Cortex Memory RAG Subsystem.

---

## Technology Stack

- **Runtime**: Node.js 22, Fastify 5, TypeScript
- **Protocol**: Model Context Protocol (MCP) via `@modelcontextprotocol/sdk`
- **Transport**: Streamable HTTP on port `8080` (host port `9007` in standalone dev)
- **Data Validation**: Zod schemas from `@tupynambalucas-cortex/memory-core`

---

## Technical Features

- **Semantic Knowledge Search**: `memory_search_knowledge` queries vectorized documentation and knowledge chunks.
- **Episodic Memory Persistence**: `memory_store_episodic` saves conversation turns, agent interactions, and user facts.
- **Graph Traversal**: `memory_query_graph` traverses associative relations and semantic entities.
- **Document Ingestion**: `memory_ingest_document` chunks, embeds, and indexes arbitrary text documents.

---

## Development Scripts

- `pnpm dev`: Starts Fastify MCP server in watch mode using `tsx`.
- `pnpm build`: Compiles TypeScript source to `dist/`.
- `pnpm start`: Runs production Node.js MCP server.
- `pnpm typecheck`: Validates TypeScript type compliance.
- `pnpm lint`: Checks code styling and ESLint rules.
