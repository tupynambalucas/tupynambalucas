# AgentGateway Ingress Subsystem

The `gateway/` directory contains configuration assets for `agentgateway`, which serves as the central API Ingress Gateway for the AI Cortex ecosystem.

---

## Components

- **[config.yaml](./config.yaml)**: Main YAML configuration file for proxy routes, CORS policies, and ExtMCP guardrails.
- **[gateway-grafana-dashboard.json](./gateway-grafana-dashboard.json)**: Pre-configured Grafana telemetry dashboard for gateway metrics.

---

## Gateway Architecture

The ingress gateway exposes unified HTTP and SSE endpoints for AI agent clients, routing incoming tool calls through gRPC policy guardrails before forwarding them to downstream MCP service containers.
