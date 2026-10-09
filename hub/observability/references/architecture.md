# Platform Bounded Context Architecture

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
