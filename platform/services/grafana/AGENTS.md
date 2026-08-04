# Local Context: Grafana Visualization Service

This service directory ([grafana/](./)) manages visualization and dashboard configurations for
monitoring the Monorepo infrastructure.

---

## 1. Directory Layout

- **[Dockerfile](./Dockerfile)**: Sets up the Grafana service based on the official `grafana/grafana`
  base image.
- **[provisioning/](./provisioning/)**: Holds YAML configurations to automatically load data sources
  and dashboards.
- **[provisioning/dashboards/sources/](./provisioning/dashboards/sources/)**: Stores JSON dashboard
  files, including the core agentgateway metrics dashboard.

---

## 2. Guardrails & Architecture Rules

- **Execution Port**: The server internally exposes port `3000`. Inside Kubernetes, this must be
  mapped to port `3000` on the Service definition.
- **Provisioning Flow**: Dashboards and datasources MUST be provisioned using code files under
  `provisioning/`. Never configure dashboards manually in the UI for persistent setups.
- **Permissions**: The Dockerfile MUST copy provisioning configurations using the `grafana` user
  ownership context (`--chown=grafana:grafana`).
- **Authentication**: Grafana admin security requires mapping the `GF_SECURITY_ADMIN_PASSWORD`
  variable to the `GRAFANA_ADMIN_PASSWORD` secret generated from the local environment
  configurations.
