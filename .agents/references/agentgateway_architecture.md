# AgentGateway Architecture & MCP Integration Reference

> **Subsystem**: AI Cortex (`cortex`) / AgentGateway Ingress Gateway  
> **Source Index**: Compiled from official [agentgateway.dev](https://agentgateway.dev) documentation and `llms.txt`.

---

## 1. Executive Architecture Overview

`agentgateway` operates as a high-performance unified data plane for HTTP, gRPC, LLM, and **Model Context Protocol (MCP)** traffic. In the `tupynambalucas` monorepo, `agentgateway` acts as a central **MCP Multiplexer / Virtual Gateway** running in the `cortex` Kubernetes namespace.

```
[ Antigravity CLI / IDE / Clients ]
               │
               ▼ (HTTP / SSE / Bearer / Token)
 ┌──────────────────────────────────────────────┐
 │             AgentGateway (cortex)            │
 ├──────────────────────────────────────────────┤
 │ - Native CORS Policy                         │
 │ - Authentication (apiKey mode strict)        │
 │ - Authorization (CEL Rules / x-mcp-token)    │
 │ - ExtMCP gRPC Guardrails (mcp-guardrails)    │
 └───────┬──────────────┬──────────────┬────────┘
         │              │              │
         ▼              ▼              ▼
   [ mcp-github ] [ mcp-firecrawl ] [ mcp-memory ] ...
```

---

## 2. MCP Connectivity & Target Multiplexing

AgentGateway multiplexes multiple upstream MCP servers behind a single listener (port `443` internal, exposed as ingress port `8080`).

### Target Configuration Schema (`config.yaml`)

```yaml
# yaml-language-server: $schema=https://agentgateway.dev/schema/config
mcp:
  port: 443
  policies:
    cors:
      allowOrigins:
        - 'https://agentgateway-mcp-dev.tupynambalucas.dev'
      allowMethods: ['*', GET, POST, OPTIONS, PUT, DELETE]
      allowHeaders: ['*']
      exposeHeaders: ['Mcp-Session-Id']
      allowCredentials: true
    apiKey:
      mode: strict
      keys:
        - key: '$CORTEX_MCP_TOKEN'
          metadata:
            role: 'senior-agent'
    authorization:
      rules:
        - require: 'request.headers["x-mcp-token"] == "$CORTEX_MCP_TOKEN" || request.headers["authorization"] == "Bearer $CORTEX_MCP_TOKEN"'
  targets:
    - name: github
      mcp:
        host: http://mcp-github:8080/mcp
      policies:
        backendAuth:
          key: '$GITHUB_PERSONAL_ACCESS_TOKEN'
    - name: firecrawl
      mcp:
        host: http://mcp-firecrawl:8080/mcp
    - name: memory
      mcp:
        host: http://mcp-memory:8080/mcp
  statefulMode: stateless
  failureMode: failOpen
```

---

## 3. Security & Authentication Layers

### 3.1 Dual-Layer Protection Strategy

1. **API Key Authentication (`apiKey`)**:
   - Mode: `strict`
   - Key evaluation: Loaded dynamically from environment variable `$CORTEX_MCP_TOKEN`.
2. **CEL Authorization (`authorization.rules`)**:
   - Evaluates incoming request headers (`x-mcp-token` or `Authorization: Bearer <token>`).
   - Fails closed on unauthenticated attempts.

### 3.2 Client Configuration (`.agents/mcp_config.json`)

Antigravity and external MCP clients inject the secret dynamically using environment variable expansion `${env:CORTEX_MCP_TOKEN}`:

```json
{
  "mcpServers": {
    "agentgateway": {
      "url": "https://agentgateway-mcp-dev.tupynambalucas.dev/mcp",
      "headers": {
        "x-mcp-token": "${env:CORTEX_MCP_TOKEN}"
      },
      "lifecycle": "eager"
    }
  }
}
```

---

## 4. Operational Guardrails & ExtMCP Policy Engine

- **gRPC ExtMCP Guardrails**: Bound to `mcp-guardrails:9001` to enrich tool descriptions (`tools/list`) and mutate local target parameters (`tools/call`).
- **Resiliency & Failure Mode**: `failureMode: failOpen` ensures high availability if a target backend is transiently unavailable.
