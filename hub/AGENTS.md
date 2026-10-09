<context-hierarchy>
  <parent src="../AGENTS.md" type="global-rules" />
</context-hierarchy>

# Bounded Context: Hub

The `hub/` workspace contains the internal team context for the `tupynambalucas.dev` monorepo. It centralizes all internal services, tools, and observability stacks into a single, cohesive environment.

## 1. Sub-Domains

This context is divided into several sub-domains:

- `cortex/`: AI intelligence layer, including AgentGateway, MCP service integrations, and the Memory subsystem.
- `network/`: Internal routing and tunneling (e.g., Traefik, Cloudflared).
- `observability/`: Telemetry and monitoring stacks (Grafana, Loki, Prometheus, Tempo, OpenTelemetry).
- `studio/`: Collaborative design and knowledge tools (Penpot, Memos, and static brand assets).
- `tools/`: Internal utilities and developer tooling (Headlamp, Turbocache).

## 2. Constraints

- All hub services are deployed exclusively via the `k8s/` infrastructure manifests to the `k3d-hub` cluster.
- Do not add external-facing products here; those belong in the `corporate/` context.
