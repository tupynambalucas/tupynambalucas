# Penpot Aide Service

The `studio/penpot/services/aide` workspace provides the container build definition for the Penpot
MCP AI assistant server (`penpot-aide`), which exposes design collaboration capabilities as an MCP
(Model Context Protocol) tool surface.

---

## Technology Stack

- **Base Image**: `penpotapp/mcp:2.17`
- **Ports**: `4400`, `4401`, `4402`, `4403` (MCP server and plugin server interfaces)

---

## Service Overview

- **[Dockerfile](./Dockerfile)**: Wraps the official `penpotapp/mcp` image with `dev` and `prod`
  build targets for Skaffold integration.

---

## Getting Started

Penpot Aide starts with the studio stack:

```bash
pnpm studio:dev
```

The service is accessible internally at `http://penpot-aide:4400` within the `studio` namespace.
