# Agentgateway Observability Architecture Analysis

Analysis based on scraping the official agentgateway documentation for
[Prometheus](https://agentgateway.dev/docs/standalone/latest/integrations/observability/prometheus/),
[Grafana](https://agentgateway.dev/docs/standalone/latest/integrations/observability/grafana/), and
[OpenTelemetry](https://agentgateway.dev/docs/standalone/latest/integrations/observability/opentelemetry/)
integrations.

---

## Key Findings from Documentation

### Prometheus (Metrics)

- Agentgateway exposes a **native Prometheus-compatible `/metrics` endpoint** on port **`15020`**
  (standalone) or **`15001`** (our `statsAddr` config).
- Prometheus can scrape this endpoint **directly** without any intermediary.
- The official docs recommend: `targets: ['localhost:15020']` with `scrape_interval: 15s`.

### OpenTelemetry (Traces + Logs only)

- OTel integration is for **distributed tracing**, not metrics.
- The docs explicitly state: _"For metrics, agentgateway exposes a Prometheus-compatible `/metrics`
  endpoint."_
- OTel sends traces via OTLP gRPC to an OTel Collector or Jaeger.
- Our gateway config already has `tracing.otlpEndpoint: http://otel-collector:4317`.

### Grafana (Visualization)

- Official example uses **Prometheus as the datasource** for metrics dashboards.
- The pre-built dashboard expects a Prometheus datasource and queries like
  `rate(agentgateway_requests_total[5m])`.

---

## Current Architecture vs Recommended Architecture

### Current Flow (Indirect -- via OTel Collector)

```
agentgateway:15001 --> OTel Collector (prometheus receiver) --> prometheus exporter:8889 --> Prometheus:9090 --> Grafana
```

> [!WARNING]
> This adds an unnecessary hop. The OTel Collector's `prometheus` receiver scrapes the gateway,
> then re-exports those same metrics via its own `prometheus` exporter for our Prometheus to scrape
> again. This adds latency, complexity, and potential metric name/label mangling.

### Recommended Flow (Direct -- Prometheus scrapes gateway)

```
agentgateway:15001 --> Prometheus:9090 --> Grafana
agentgateway:4317  --> OTel Collector --> Grafana Cloud / Sentry (traces + logs only)
```

> [!TIP]
> This is the architecture recommended by the official agentgateway documentation.
> Prometheus scrapes the native metrics endpoint directly. The OTel Collector handles only traces
> and logs (its actual purpose).

---

## Issues Found in Current Configuration

### 1. OTel Collector should NOT relay metrics

The `prometheus` receiver in
[platform/services/otpl/config.yaml](file:///D:/projects/tupynambalucas/platform/services/otpl/config.yaml)
scrapes the agentgateway and re-exports via the `prometheus` exporter. This is redundant.

### 2. Cross-namespace DNS for Docker Compose

In Docker Compose, the `agentgateway` container is aliased as `agentgateway-metrics` on the
`platform-net` network
([compose.yaml L40-41](file:///D:/projects/tupynambalucas/cortex/infrastructure/docker/compose.yaml#L40-L41)).
Prometheus should scrape `agentgateway-metrics:15001` directly.

### 3. Cross-namespace DNS for Kubernetes

In Kubernetes, `agentgateway-metrics` is a Service in namespace `cortex`
([gateway.yaml L77](file:///D:/projects/tupynambalucas/cortex/infrastructure/kubernetes/gateway.yaml#L77)).
Prometheus (in `platform` namespace) needs the FQDN:
`agentgateway-metrics.cortex.svc.cluster.local:15001`.

### 4. OTel Collector metrics pipeline exports to Grafana Cloud

The metrics pipeline currently exports to `otlphttp/grafanacloud`. This should be removed from
the metrics pipeline since we are moving to local Grafana. The OTel Collector should only handle
traces and logs for cloud export.

---

## Proposed Action Plan

### Step 1: Update Prometheus config to scrape agentgateway directly

Update [platform/services/prometheus/config.yaml](file:///D:/projects/tupynambalucas/platform/services/prometheus/config.yaml)
to add the agentgateway as a direct scrape target:

```yaml
scrape_configs:
  - job_name: 'prometheus'
    static_configs:
      - targets: ['localhost:9090']

  - job_name: 'agentgateway'
    scrape_interval: 15s
    static_configs:
      - targets: ['agentgateway-metrics:15001']
```

### Step 2: Remove prometheus receiver/exporter from OTel Collector

Update [platform/services/otpl/config.yaml](file:///D:/projects/tupynambalucas/platform/services/otpl/config.yaml):

- Remove the `prometheus` receiver (scrape config for agentgateway-metrics).
- Remove the `prometheus` exporter (port 8889).
- Remove `prometheus` from the metrics pipeline receivers and exporters.
- Keep the `otlp` receiver for traces and logs.

### Step 3: Remove OTel Collector port 8889 exposure

Update [platform/infrastructure/kubernetes/otel-collector.yaml](file:///D:/projects/tupynambalucas/platform/infrastructure/kubernetes/otel-collector.yaml):

- Remove `prom-exporter` port from both the Deployment and Service.

### Step 4: Remove otel-collector target from Prometheus

Since Prometheus will no longer need to scrape the OTel Collector, remove the `otel-collector:8889`
target from the Prometheus config.

---

## Architecture Summary

| Signal  | Source               | Collector           | Storage       | Visualization   |
| :------ | :------------------- | :------------------ | :------------ | :-------------- |
| Metrics | agentgateway:15001   | Prometheus (direct) | Prometheus    | Grafana (local) |
| Traces  | agentgateway:4317    | OTel Collector      | Grafana Cloud | Grafana Cloud   |
| Logs    | Docker fluentforward | OTel Collector      | Grafana Cloud | Grafana Cloud   |
| Errors  | agentgateway:4317    | OTel Collector      | Sentry        | Sentry          |
