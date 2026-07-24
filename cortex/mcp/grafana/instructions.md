# Grafana MCP Agent Instructions

## 1. Domain Scope

The Grafana MCP server provides observability, metrics (Prometheus), logs (Loki), traces (Tempo), and profiling (Pyroscope) tools.

---

## 2. Operational Rules

- **Read-Only First**: Always perform read operations (`grafana_query_prometheus`, `grafana_query_loki_logs`, `grafana_tempo_get-trace`) to diagnose system state before making any configuration changes.
- **Log Range Boundaries**: Always specify explicit time ranges and line limits for `grafana_query_loki_logs` queries to prevent memory spikes.
