# Local Context: AgentGateway Ingress Infrastructure

This workspace directory ([gateway/](./)) configures the system API Ingress Gateway (`agentgateway`) for the AI Cortex subsystem.

---

## 1. Subsystem Layout

- **[config.yaml](./config.yaml)**: Gateway configuration defining MCP targets, CORS policies, administrative endpoints, and guardrail gRPC processors.
- **[gateway-grafana-dashboard.json](./gateway-grafana-dashboard.json)**: Grafana dashboard telemetry model for monitoring gateway request metrics and latency.

---

## 2. Operational Rules

- **Target Registration**: All downstream MCP server containers MUST be registered as named targets under the `mcp.targets` key in [config.yaml](./config.yaml).
- **Policy Enforcement**: ExtMCP guardrail processors MUST point to the containerized gRPC guardrails service (`mcp-guardrails:9001`).
