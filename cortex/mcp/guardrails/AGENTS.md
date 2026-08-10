# Local Context: AgentGateway ExtMCP Guardrail Server

This workspace directory ([guardrails/](./)) contains the standalone gRPC ExtMCP policy processor (`@tupynambalucas-cortex/mcp-guardrails`) for AgentGateway in the AI Cortex subsystem.

---

## 1. Directory Layout

- **[proto/ext_mcp.proto](./proto/ext_mcp.proto)**: Protocol Buffer definition for the AgentGateway ExtMCP gRPC service interface.
- **[src/index.ts](./src/index.ts)**: Main gRPC server initialization, proto compilation, and service binding.
- **[src/processors/request-mutator.ts](./src/processors/request-mutator.ts)**: Request processor implementing host URL rewriting for `browser_navigate` calls.
- **[src/processors/response-enricher.ts](./src/processors/response-enricher.ts)**: Response processor reading `instructions.md` files and injecting operational instructions into `tools/list` outputs.
- **[Dockerfile](./Dockerfile)**: Production container image build definition.

---

## 2. Operational & Security Guardrails

- **Host URL Mutation**: In the `CheckRequest` handler for `tools/call` methods, the processor automatically transforms `localhost` or `127.0.0.1` into `host.docker.internal` so containerized tools can access developer applications on the host machine.
- **Tool Description Enrichment**: In the `CheckResponse` handler for `tools/list` methods, the processor enriches tool descriptions with contextual service instructions read from `/mcp/<service>/instructions.md`.
- **Fail-Safe Fallbacks**: Handlers MUST catch internal JSON parsing exceptions and fall back to `{ pass: {} }` to prevent service disruption if unhandled or malformed payloads arrive.
- **Strict Non-Blocking Execution**: Asynchronous file reads MUST be cached in memory (`instructionsCache`) to minimize latency during tool discovery phases.

---

## 3. Scoped Operations

- `pnpm --filter @tupynambalucas-cortex/mcp-guardrails dev`: Starts TypeScript compiler in watch mode.
- `pnpm --filter @tupynambalucas-cortex/mcp-guardrails build`: Compiles TypeScript source to `dist/`.
- `pnpm --filter @tupynambalucas-cortex/mcp-guardrails typecheck`: Runs type checking without emitting files.
