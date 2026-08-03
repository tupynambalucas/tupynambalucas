# Cortex Memory MCP Service

The `cortex/mcp/services/memory` workspace provides the official Model Context Protocol (MCP) server for AI Agents to interact with the Cortex Memory RAG Subsystem.

---

## Technical Features

- **Protocol Support**: Model Context Protocol (MCP) over Streamable HTTP SSE (`/sse` and `/message` endpoints).
- **Network Ports**: Listens on port `9007` in local host dev mode and container internal port
  `8080` (mapped to host `9007`). Target registered in AgentGateway
  (`http://mcp-memory:8080/mcp`).
- **Domain Tools**:
  - `memory_search_knowledge`: Semantic RAG vector retrieval.
  - `memory_store_episodic`: Episodic chat memory persistence.
  - `memory_query_graph`: Entity graph traversal.
  - `memory_ingest_document`: Knowledge base document ingestion.
- **Strict Typing**: Type safety powered by `@tupynambalucas-cortex/memory-core` and Zod validation.
