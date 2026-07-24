# Local Context: Grafana MCP Integration

This directory contains the containerized Grafana Model Context Protocol (MCP) server integration for the AI Cortex subsystem.

---

## 1. Overview

The Grafana MCP service provides observability integrations with Grafana instances, Loki log aggregators, Prometheus metrics collectors, Tempo distributed tracing, and Pyroscope profiling.

- Docker Container Configuration: [Dockerfile](./Dockerfile)

---

## 2. Operational & Security Guardrails

- **Read-Only Default**: Agents MUST prioritize read-only query tools (`grafana_query_prometheus`, `grafana_query_loki_logs`, `grafana_tempo_get-trace`) before executing destructive or state-changing operations.
- **Log Query Limits**: LogQL queries (`grafana_query_loki_logs`) MUST specify reasonable time ranges and limit parameters to prevent memory exhaustion on log streams.
- **Dashboard Integrity**: Dashboard JSON modifications (`grafana_update_dashboard`) MUST be validated against schema structures before submission.

---

## 3. Environment Variables

The Grafana MCP server supports configuration via the following environment variables:

| Environment Variable            | Description                                                |
| :------------------------------ | :--------------------------------------------------------- |
| `GRAFANA_URL`                   | Base URL of the target Grafana instance.                   |
| `GRAFANA_SERVICE_ACCOUNT_TOKEN` | Service Account Token used for Grafana API authentication. |
| `GRAFANA_API_KEY`               | Legacy API Key used for Grafana authentication.            |
| `GRAFANA_ORG_ID`                | Organization Identifier in Grafana (default: `1`).         |

---

## 4. Available Tools

The Grafana MCP server exposes 74 observability tools:

- `grafana_add_activity_to_incident`: Adds timeline activity notes to a Grafana Incident.
- `grafana_alerting_manage_routing`: Configures notification policies and alert routes.
- `grafana_alerting_manage_rules`: Creates or updates alert rules.
- `grafana_analyze_loki_labels`: Analyzes Loki log streams and label cardinality.
- `grafana_check_datasources_health`: Performs health checks on configured Grafana data sources.
- `grafana_create_annotation`: Creates dashboard annotations for system events.
- `grafana_create_datasource`: Provisions a new data source configuration in Grafana.
- `grafana_create_folder`: Creates a new folder for dashboard organization.
- `grafana_create_incident`: Declares a new Grafana Incident.
- `grafana_create_snapshot`: Generates an interactive dashboard snapshot.
- `grafana_delete_snapshot`: Deletes an existing dashboard snapshot.
- `grafana_find_error_pattern_logs`: Detects recurring error patterns in Loki log streams.
- `grafana_find_slow_requests`: Identifies high-latency HTTP or database requests.
- `grafana_generate_deeplink`: Generates direct web UI links to panels or dashboards.
- `grafana_get_alert_group`: Retrieves alert groups matching evaluation criteria.
- `grafana_get_annotation_tags`: Lists active annotation tags across dashboards.
- `grafana_get_annotations`: Fetches annotations filtered by time range or dashboard.
- `grafana_get_assertions`: Retrieves assertion metrics for active alerts.
- `grafana_get_current_oncall_users`: Identifies on-call personnel currently on shift.
- `grafana_get_dashboard_by_uid`: Retrieves complete JSON model of a dashboard by UID.
- `grafana_get_dashboard_panel_queries`: Extracts underlying PromQL/Loki queries from panels.
- `grafana_get_dashboard_property`: Retrieves specific properties from a dashboard model.
- `grafana_get_dashboard_summary`: Generates a high-level summary of dashboard layout and panels.
- `grafana_get_datasource`: Retrieves data source configuration details by UID or name.
- `grafana_get_incident`: Fetches details and status for a specific incident.
- `grafana_get_oncall_shift`: Fetches current and upcoming on-call shifts.
- `grafana_get_panel_image`: Renders and returns a PNG image of a target panel.
- `grafana_get_plugin`: Retrieves installed plugin metadata.
- `grafana_get_sift_analysis`: Runs automated Sift root-cause analysis on incidents.
- `grafana_get_sift_investigation`: Fetches investigation progress from Sift AI.
- `grafana_get_snapshot`: Retrieves metadata for a specific snapshot.
- `grafana_grafana_api_request`: Executes arbitrary authenticated HTTP requests against Grafana API.
- `grafana_install_plugin`: Installs Grafana community or enterprise plugins.
- `grafana_list_alert_groups`: Lists active alert rule evaluation groups.
- `grafana_list_datasources`: Lists all configured data sources in the Grafana instance.
- `grafana_list_incidents`: Lists declared incidents filtered by status.
- `grafana_list_loki_label_names`: Lists available label names in Loki.
- `grafana_list_loki_label_values`: Lists values for a specific Loki label.
- `grafana_list_oncall_schedules`: Lists configured OnCall schedules.
- `grafana_list_oncall_teams`: Lists OnCall teams and member mappings.
- `grafana_list_oncall_users`: Lists registered users in Grafana OnCall.
- `grafana_list_prometheus_label_names`: Lists available label names in Prometheus.
- `grafana_list_prometheus_label_values`: Lists values for a specific Prometheus label.
- `grafana_list_prometheus_metric_metadata`: Retrieves metric type and help metadata.
- `grafana_list_prometheus_metric_names`: Lists metric names matching regex patterns.
- `grafana_list_provisioning_repositories`: Lists git repositories used for file provisioning.
- `grafana_list_pyroscope_label_names`: Lists continuous profiling labels in Pyroscope.
- `grafana_list_pyroscope_label_values`: Lists continuous profiling label values.
- `grafana_list_pyroscope_profile_types`: Lists profiling types (CPU, memory, mutex).
- `grafana_list_sift_investigations`: Lists ongoing Sift investigations.
- `grafana_list_snapshots`: Lists generated dashboard snapshots.
- `grafana_query_loki_logs`: Queries Loki log streams using LogQL syntax.
- `grafana_query_loki_patterns`: Extracts log structure patterns from LogQL queries.
- `grafana_query_loki_stats`: Queries log volume statistics over time.
- `grafana_query_prometheus`: Queries instant metric values using PromQL.
- `grafana_query_prometheus_histogram`: Queries metric histogram buckets.
- `grafana_query_pyroscope`: Queries continuous flamegraph profiles from Pyroscope.
- `grafana_search_dashboards`: Searches dashboards by title, tag, or folder.
- `grafana_search_folders`: Searches dashboard folders.
- `grafana_search_plugin_information`: Searches available plugins in catalog.
- `grafana_suggest_loki_alloy_label_config`: Suggests OpenTelemetry/Alloy log ingestion config.
- `grafana_tempo_docs-config`: Retrieves documentation on Tempo trace configuration.
- `grafana_tempo_docs-traceql`: Retrieves documentation on TraceQL query language.
- `grafana_tempo_get-attribute-names`: Lists span and process attribute names in Tempo.
- `grafana_tempo_get-attribute-values`: Lists attribute values for a specific Tempo attribute.
- `grafana_tempo_get-trace`: Retrieves full distributed trace details by trace ID.
- `grafana_tempo_traceql-metrics-instant`: Calculates instant metrics over traces using TraceQL.
- `grafana_tempo_traceql-metrics-range`: Calculates range metric time series using TraceQL.
- `grafana_tempo_traceql-search`: Searches distributed traces using TraceQL expressions.
- `grafana_update_annotation`: Updates text or tags of an existing annotation.
- `grafana_update_dashboard`: Updates a dashboard JSON model.
- `grafana_update_datasource`: Updates data source connection properties.
- `grafana_validate_provisioning_file`: Validates syntax of local provisioning YAML files.
