<context-hierarchy>
  <parent src="../../AGENTS.md" type="global-rules" />
  <parent src="../AGENTS.md" type="bounded-context-rules" />
  <system-instruction>
    AGENT: If you have not read "../../AGENTS.md" and "../AGENTS.md" in this session, stop now
    and read both files using your file-reading tools before proceeding.
  </system-instruction>
</context-hierarchy>

# Local Context: AgentGateway Ingress Infrastructure

This workspace directory ([gateway/](./)) contains configuration and container assets for `agentgateway`, the central API Ingress Gateway for the AI Cortex subsystem.

---

## 1. Directory Layout

- **[config.yaml](./config.yaml)**: AgentGateway configuration defining upstream MCP targets, CORS policies, administrative endpoints, and ExtMCP gRPC policy processors.
- **[Dockerfile](./Dockerfile)**: Container build definition based on `cr.agentgateway.dev/agentgateway:latest`.

---

## 2. Operational & Routing Guardrails

- **Target Registration**: All downstream MCP server adapters MUST be registered under `mcp.targets` in [config.yaml](./config.yaml):
  - `github`: `http://mcp-github:8080/mcp`
  - `context7`: `https://mcp.context7.com/mcp`
  - `firecrawl`: `http://mcp-firecrawl:8080/mcp`
  - `grafana`: `http://mcp-grafana:8080/mcp`
  - `playwright`: `http://mcp-playwright:8080/mcp`
  - `memory`: `http://mcp-memory:8080/mcp`
- **ExtMCP Policy Binding**: Guardrail processors MUST point to `mcp-guardrails:9001` with `failOpen` mode enabled to ensure high availability.
- **Port Allocation**: Ingress traffic listens on internal port `443` (exposed as port `8080` in Kubernetes and Compose), administrative UI on port `15000`, and Prometheus stats on port `15001`.
- **Telemetry Configuration**: Distributed tracing MUST point to the OpenTelemetry collector at `http://otel-collector:4317` (or cluster DNS `http://otel-collector.platform.svc.cluster.local:4317`).
