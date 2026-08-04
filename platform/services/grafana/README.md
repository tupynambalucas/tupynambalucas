# Grafana Visualization Service

The `grafana/` directory contains container orchestration rules to host a local Grafana instance.

---

## Service Overview

1. **[Dockerfile](./Dockerfile)**: Declares a custom build environment using the `grafana/grafana`
   base image, copying all provisioning configurations and JSON dashboards into the image.
2. **[provisioning/](./provisioning/)**: Contains automated configurations for connecting to local
   metrics datasources (Prometheus) and loading the default agentgateway dashboards.
