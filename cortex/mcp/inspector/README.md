# Cortex MCP Inspector Service

The `cortex/mcp/inspector` workspace provides a containerized web interface powered by `@modelcontextprotocol/inspector` for inspecting and testing Model Context Protocol (MCP) tool servers within the Cortex ecosystem.

---

## Features

- **Centralized UI**: Visual interface accessible at `http://localhost:6274`.
- **Dynamic Multi-Server Support**: Pre-configured via `mcp.json` to inspect `memory`, `github`, `firecrawl`, `grafana`, and `playwright` services.
- **Protocol Inspection**: Live inspection of tool schemas, prompts, resources, and execution output over Streamable HTTP transports.
