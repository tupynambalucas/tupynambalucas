# Local Context: Monitor Ecosystem

This workspace ([tools/monitor/](./)) is the centralized Observability and Telemetry hub for the monorepo. It implements the Edge Observability pattern, collecting metrics and traces from the entire ecosystem via an OpenTelemetry Collector gateway.

---

## Local Architecture & Directory Map

- **[gateway/](./gateway)**: Houses the OpenTelemetry Collector (`otel-collector`), which acts as the unified ingestion point (OTLP gRPC/HTTP) for all external applications (like AgentGateway).
- **[services/](./services)**: Containerized telemetry backends and visualization tools (e.g., Prometheus for metrics, Grafana for dashboards, Tempo for traces).
- **[infrastructure/docker/compose.yaml](./infrastructure/docker/compose.yaml)**: Docker Compose orchestration defining the `tupynambalucas-monitor-net` external bridge network, persistent volumes, and service constraints.
- **[infrastructure/docker/.env.example](./infrastructure/docker/.env.example)**: Environment template file.

---

## Monitor Guardrails

1. **Centralized Ingestion**: Applications MUST NOT connect directly to Prometheus or other backends. All telemetry data (metrics, logs, traces) MUST be sent to the `gateway` (OpenTelemetry Collector) using the OTLP protocol.
2. **Network Isolation**: The monitor stack MUST expose a shared external Docker bridge network (`tupynambalucas-monitor-net`). External workspaces (like `tools/mcp`) attach to this network to send data.
3. **Data Persistence**: Backends like Prometheus and Grafana MUST use named Docker volumes to prevent data loss between container restarts.
4. **Provisioning as Code**: Grafana dashboards and datasources SHOULD be provisioned via configuration files (`services/grafana/provisioning/`), avoiding manual UI setup where possible.
