# Bounded Context: Platform Services Router

This workspace context ([platform/](./)) centralizes and manages core cluster infrastructure, ingress routing, observability pipelines, developer dashboards, and Turborepo remote build caching for the tupynambalucas.dev monorepo.

---

## 1. Bounded Context Navigation

- **[infrastructure/](./infrastructure/AGENTS.md)**: Kubernetes Kustomize manifests, cert-manager certificates, Traefik ingress, and Docker Compose configurations ([infrastructure/AGENTS.md](./infrastructure/AGENTS.md)).
- **[services/grafana/](./services/grafana/AGENTS.md)**: Grafana visualization service, automated datasources, and provisioned telemetry dashboards ([services/grafana/AGENTS.md](./services/grafana/AGENTS.md)).
- **[services/headlamp/](./services/headlamp/AGENTS.md)**: Tokenless Kubernetes Web UI dashboard for cluster-wide resource administration ([services/headlamp/AGENTS.md](./services/headlamp/AGENTS.md)).
- **[services/otelcol/](./services/otelcol/AGENTS.md)**: Edge OpenTelemetry Collector aggregating metrics, logs, and distributed traces ([services/otelcol/AGENTS.md](./services/otelcol/AGENTS.md)).
- **[services/prometheus/](./services/prometheus/AGENTS.md)**: Prometheus time-series metrics storage and PromQL resolution engine ([services/prometheus/AGENTS.md](./services/prometheus/AGENTS.md)).
- **[services/loki/](./services/loki/AGENTS.md)**: Grafana Loki log aggregation and LogQL query service ([services/loki/AGENTS.md](./services/loki/AGENTS.md)).
- **[services/tempo/](./services/tempo/AGENTS.md)**: Grafana Tempo distributed trace storage and TraceQL query service ([services/tempo/AGENTS.md](./services/tempo/AGENTS.md)).
- **[services/turbocache/](./services/turbocache/AGENTS.md)**: Containerized Turborepo Remote Cache server accelerating monorepo builds ([services/turbocache/AGENTS.md](./services/turbocache/AGENTS.md)).

---

## 2. Bounded Context Architecture

Platform services operate as an always-on infrastructure foundation, providing unified telemetry ingestion, cluster administration, and build optimization:

```mermaid
flowchart TD
  subgraph IngressLayer ["Ingress & Networking"]
    Traefik["Traefik v3.1 Ingress Controller (:80 / :443 / :8080)"]
    Cloudflared["Cloudflare Tunnel (cloudflared)"]
    CertManager["cert-manager (DNS-01 ACME)"]
  end

  subgraph TelemetryPipeline ["OpenTelemetry Telemetry Pipeline"]
    Apps["Applications & Services (OTLP)"]
    KubeMetrics["Kubelet / cAdvisor / kube-state-metrics"]
    OtelCol["OpenTelemetry Collector (:4317 / :4318 / :24224)"]

    Apps --> OtelCol
    KubeMetrics --> OtelCol
  end

  subgraph StorageLayer ["Observability Storage"]
    Prometheus["Prometheus Server (:9090)"]
    Loki["Grafana Loki (:3100)"]
    Tempo["Grafana Tempo (:3200 / :4317 / :4318)"]

    OtelCol -->|Remote Write| Prometheus
    OtelCol -->|OTLP HTTP| Loki
    OtelCol -->|OTLP HTTP| Tempo
  end

  subgraph Dashboards ["Developer & Cluster Dashboards"]
    Grafana["Grafana Dashboards (:3000)"]
    Headlamp["Headlamp Kubernetes UI (:4466 -> :80)"]

    Grafana --> Prometheus
    Grafana --> Loki
    Grafana --> Tempo
  end

  subgraph BuildAcceleration ["Build Acceleration"]
    TurboCache["Turbocache Server (:3000 / :3008)"]
  end

  Traefik --> Grafana
  Traefik --> Headlamp
  Traefik --> TurboCache
```

### Port Allocation & Service Mapping

| Service Name         | Internal Port         | Host / Forwarded Port | Ingress Domain                      | Transport Protocol |
| :------------------- | :-------------------- | :-------------------- | :---------------------------------- | :----------------- |
| `traefik`            | 80 / 443 / 8082       | 80 / 443 / 8082       | `traefik-dev.tupynambalucas.dev`    | HTTP / HTTPS       |
| `grafana`            | 3000                  | 3000                  | `grafana-dev.tupynambalucas.dev`    | HTTP               |
| `headlamp`           | 4466 (Pod) / 80 (Svc) | 80 / 4466             | `headlamp-dev.tupynambalucas.dev`   | HTTP               |
| `turbocache`         | 3000                  | 3008 (Compose) / 3000 | `turbocache-dev.tupynambalucas.dev` | HTTP               |
| `otelcol`            | 4317 / 4318 / 24224   | 4317 / 4318 / 24224   | Internal Cluster DNS                | gRPC / HTTP        |
| `prometheus`         | 9090                  | 9090                  | Internal Cluster DNS                | HTTP / PromQL      |
| `loki`               | 3100                  | 3100                  | Internal Cluster DNS                | HTTP / LogQL       |
| `tempo`              | 3200 / 4317 / 4318    | 3200 / 4318           | Internal Cluster DNS                | HTTP / TraceQL     |
| `kube-state-metrics` | 8080 / 8081           | 8080 / 8081           | Internal Cluster DNS                | HTTP               |

---

## 3. Operational & Telemetry Guardrails

- **Unified Ingestion**: All runtime applications across the monorepo MUST forward logs, metrics, and distributed traces to `otelcol` via OTLP (`http://otel-collector:4317` or `http://otel-collector.platform.svc.cluster.local:4317`). Direct logging to database tables is strictly forbidden.
- **Credential Separation**: Secrets and sensitive tokens (such as `CLOUDFLARE_API_TOKEN`, `CLOUDFLARE_TUNNEL_TOKEN`, `TURBO_TOKEN`, `GRAFANA_ADMIN_PASSWORD`) MUST be declared in [.env](./infrastructure/.env) and mapped through `platform-secrets` or `cloudflare-api-token-secret`.
- **Declarative Provisioning**: Grafana dashboards and datasources MUST be maintained declaratively in [services/grafana/src/provisioning/](./services/grafana/src/provisioning/AGENTS.md). Manual UI dashboard configurations will be lost across container recycles.
- **Cache Persistence**: Turborepo cache artifacts and persistent telemetry data MUST be bound to PersistentVolumeClaims (`turbocache-pvc`, `grafana-pvc`, `prometheus-pvc`, `loki-pvc`, `tempo-pvc`) or named volume mounts.

---

## 4. Local Lifecycle Commands

| Target Runtime            | Purpose                                   | Command               |
| :------------------------ | :---------------------------------------- | :-------------------- |
| **Kubernetes (Skaffold)** | Start platform cluster with hot-reloading | `pnpm platform:dev`   |
| **Kubernetes (Skaffold)** | Delete cluster resources & clean cache    | `pnpm platform:clean` |
| **Kubernetes (Skaffold)** | Stop platform deployment stack            | `pnpm platform:stop`  |
| **Docker Compose**        | Boot standalone platform containers       | `pnpm platform:up`    |
| **Docker Compose**        | Stop standalone platform containers       | `pnpm platform:down`  |
| **Docker Compose**        | View platform container logs in real time | `pnpm platform:logs`  |
| **Docker Compose**        | Reset containers and persistent volumes   | `pnpm platform:reset` |
