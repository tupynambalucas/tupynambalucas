# Local Context: Context7 MCP Integration

This directory contains the Context7 Model Context Protocol (MCP) server integration guidelines for the AI Cortex subsystem.

---

## 1. Overview

The Context7 MCP service provides real-time documentation, API references, and code snippets for modern frameworks and software libraries.

- Instructions: [instructions.md](./instructions.md)

---

## 2. Operational & Security Guardrails

- **Library ID Resolution**: Agents MUST invoke `context7_resolve-library-id` to fetch the authoritative library identifier before executing `context7_query-docs`.
- **Query Specificity**: Provide targeted queries to minimize token consumption and focus documentation context.
- **Authentication**: Authenticated upstream using `CONTEXT7_API_KEY` configured in AgentGateway ([config.yaml](../../../gateway/config.yaml)).

---

## 3. Available Tools

- `context7_resolve-library-id`: Searches for and resolves the Context7-compatible library ID for a given framework or library name.
- `context7_query-docs`: Queries documentation and code snippets for a specified library ID.
