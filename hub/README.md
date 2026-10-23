# Tupynambalucas Hub

The Hub workspace encapsulates all internal operations, telemetry, and collaborative tooling for the `tupynambalucas.dev` team. It is strictly separated from public-facing products to ensure security and operational isolation.

## Architecture

The Hub is divided into functional domains:

- **Cortex**: Advanced AI Agent routing (AgentGateway), Model Context Protocol (MCP) toolsets, and persistent Memory vectors.
- **Network**: Ingress control and secure tunneling via Traefik and Cloudflare.
- **Observability**: Comprehensive telemetry gathering and visualization using Grafana, Loki, Prometheus, Tempo, and OpenTelemetry.
- **Studio**: Self-hosted collaborative environments including Penpot for design and Memos for internal notes.
- **Tools**: Essential developer utilities like Headlamp (Kubernetes UI) and Turbocache (remote build caching).

## Development

The Hub services are orchestrated via Skaffold and deployed to their own dedicated local cluster (`k3d-hub`).

To spin up the entire Hub ecosystem locally:

```bash
cd ../k8s
skaffold dev -f skaffold.hub.yaml
```
