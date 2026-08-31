# Kubectl MCP Agent Instructions

## 1. Domain Scope

The Kubectl MCP server provides AI assistants with the capability to manage, troubleshoot, and observe Kubernetes clusters directly through natural language.

---

## 2. Tool Execution Best Practices

- **Context Awareness**: The tools automatically use the cluster in which the MCP is running. If you need to interact with a different cluster, supply the `context` parameter explicitly if multiple contexts exist.
- **Resource Cleanup**: When diagnosing issues, use `get_logs`, `get_pod_events`, and `describe` operations instead of making changes. Only apply changes when explicitly requested or necessary.
- **Security Check**: Always verify RBAC and Secrets before applying changes to production-like environments.
