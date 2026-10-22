# AgentGateway ExtMCP Guardrail Server

The `cortex/mcp/guardrails` workspace provides the standalone gRPC ExtMCP policy processor (`@repo/cortex/mcp-guardrails`) for AgentGateway in the AI Cortex subsystem.

---

## Technology Stack

- **Runtime**: Node.js 22, TypeScript
- **Communication Protocol**: gRPC (`@grpc/grpc-js`, `@grpc/proto-loader`), Protocol Buffers
- **Port**: `9001` (Internal gRPC service)

---

## Architecture Overview

The ExtMCP Guardrail service implements the AgentGateway ExtMCP gRPC protocol to gate, validate, and mutate Model Context Protocol (MCP) method calls before reaching downstream containers or returning to AI agents:

```mermaid
sequenceDiagram
  autonumber
  actor Agent as AI Agent / Client
  participant GW as AgentGateway
  participant GR as ExtMCP Guardrails (:9001)
  participant MCP as Downstream MCP Service

  Agent->>GW: tools/call (e.g. scrape localhost:3002)
  GW->>GR: CheckRequest (ext_mcp.proto)
  Note over GR: Recursively mutates localhost -> host.docker.internal across all arguments
  GR-->>GW: Mutated Request Payload
  GW->>MCP: Execute Tool Call
  MCP-->>GW: Tool Execution Result
  GW-->>Agent: Final Response
```

---

## Key Responsibilities

1. **Transparent Network Proxying (Host URL Mutation)**: Intercepts `tools/call` requests for _any tool_ and recursively scans its JSON arguments. It automatically transforms any string containing `localhost` or `127.0.0.1` into `host.docker.internal` for seamless container-to-host connectivity.
2. **Fail-Safe Processing**: Catches internal payload parsing exceptions and gracefully falls back to pass-through behavior (`pass: {}`).

_Note: In previous architectures, this guardrail also enriched `tools/list` with markdown instructions. This anti-pattern has been removed to preserve pure tool schemas. Agent instructions are now properly managed client-side via `.agents/rules`._

---

## Development Scripts

- `pnpm dev`: Runs TypeScript compiler in watch mode.
- `pnpm build`: Compiles TypeScript source to `dist/`.
- `pnpm start`: Runs production Node.js gRPC server.
- `pnpm typecheck`: Validates TypeScript type compliance.
