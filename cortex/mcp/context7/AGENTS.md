# Local Context: Context7 MCP Integration

This directory contains the Context7 Model Context Protocol (MCP) server integration guidelines for the AI Cortex subsystem.

---

## 1. Overview

The Context7 MCP service provides up-to-date documentation and code snippets for libraries and frameworks.

---

## 2. Operational & Security Guardrails

- **Library ID Resolution**: Agents MUST invoke `context7_resolve-library-id` to fetch the authoritative library ID string before executing `context7_query-docs`.
- **Query Specificity**: Provide targeted queries to minimize token usage and focus documentation context.

---

## 3. Available Tools

- `context7_resolve-library-id`: Searches for and resolves the Context7-compatible library ID for a given framework or library name.
- `context7_query-docs`: Queries documentation and code snippets for a specified library ID.
