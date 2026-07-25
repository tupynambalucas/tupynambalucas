# AgentGateway ExtMCP Guardrail Server

This directory contains the standalone gRPC ExtMCP policy processor for AgentGateway in the AI Cortex subsystem.

---

## Architecture Overview

The ExtMCP Guardrail service implements the AgentGateway ExtMCP gRPC protocol to gate and mutate Model Context Protocol (MCP) method calls (`tools/call`, `tools/list`) before reaching backend containers or returning to AI agents.

- Protocol Specification: [ext_mcp.proto](./proto/ext_mcp.proto)
- Docker Container Configuration: [Dockerfile](./Dockerfile)
- Context Router: [AGENTS.md](./AGENTS.md)

---

## Key Responsibilities

1. **Host URL Mutation**: Intercepts `tools/call` requests (e.g. `browser_navigate`) and transforms `localhost` or `127.0.0.1` targets into `host.docker.internal` for container-to-host connectivity.
2. **Tool Listing Enrichment**: Modifies `tools/list` responses to enrich tool descriptions with operational environment notes.
3. **Fail-Safe Processing**: Catches internal payload parsing exceptions and gracefully falls back to pass-through behavior (`pass: {}`).
