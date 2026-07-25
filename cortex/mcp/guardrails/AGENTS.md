# Local Context: AgentGateway ExtMCP Guardrail Server

This workspace contains the standalone gRPC ExtMCP policy processor for AgentGateway in the AI Cortex subsystem.

---

## 1. Overview

The ExtMCP Guardrail service implements the AgentGateway ExtMCP gRPC protocol to gate and mutate Model Context Protocol (MCP) method calls (`tools/call`, `tools/list`) before reaching backend containers or returning to agents.

- Protocol Specification: [ext_mcp.proto](./proto/ext_mcp.proto)
- Docker Container Configuration: [Dockerfile](./Dockerfile)

---

## 2. Operational & Security Guardrails

- **Local Host URL Mutation**: In the `CheckRequest` phase for `tools/call` methods (e.g. `browser_navigate`), the server automatically transforms `localhost` or `127.0.0.1` into `host.docker.internal` so containerized tools can reach developer host applications seamlessly.
- **Tool Description Enrichment**: In the `CheckResponse` phase for `tools/list` methods, tool descriptions are enriched with operational environment notes.
- **Fail-Safe Execution**: Handlers MUST catch internal JSON parsing exceptions and fall back to `{ pass: {} }` to prevent service disruption if unhandled payloads arrive.
