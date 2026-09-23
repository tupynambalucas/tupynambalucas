# Kubectl MCP Service

The `cortex/mcp/services/kubectl` workspace provides the containerized Kubectl Model Context Protocol
(MCP) server for Kubernetes cluster management and observability. It operates as a data plane service
behind the AgentGateway, exposing 253 diagnostic and management tools to the AI agent runtimes.

## Architecture and Integration

This service uses the official `ghcr.io/rohitg00/kubectl-mcp-server:latest` image running natively
inside the Kubernetes cluster.

- **Transport Mechanism**: Configured with `--transport streamable-http` on port `8080`.
- **Ingress Routing**: AgentGateway proxies AI requests to this service. External agents connect via
  the Cloudflare Tunnel (`agentgateway-mcp-dev.%PROJECT_DOMAIN%`) utilizing the SSE remote
  transport.
- **Cluster Authentication**: Operates without a local `kubeconfig` file. It relies on the in-cluster
  `mcp-kubectl-sa` ServiceAccount, which holds a `ClusterRoleBinding` to the `cluster-admin` role,
  ensuring comprehensive access across all namespaces.

> [!IMPORTANT]
> External agents interacting through the AgentGateway inherit the in-cluster permissions of the
> `mcp-kubectl-sa` ServiceAccount. Do not expose this service directly to public networks without the
> AgentGateway authentication layer.

## Core Capabilities

- **Diagnostic Operations**: Instant retrieval of pod logs, events, metrics, and resource conditions
  (`get_logs`, `get_pod_events`, `check_pod_health`).
- **Network Troubleshooting**: Connectivity diagnostics and DNS resolution checks for Services and
  Ingress routing (`diagnose_network_connectivity`, `trace_service_chain`).
- **Ecosystem Tooling**: Deep integration with GitOps (Flux/ArgoCD), Helm v3 lifecycle management,
  Cert-Manager diagnostics, and Policy validation (Kyverno).
- **Cost Optimization**: Automated detection of idle or overprovisioned resources to generate
  actionable scaling recommendations (`get_resource_recommendations`, `get_idle_resources`).
- **Security Auditing**: RBAC permission analysis, secret masking, and pod security policy
  verification (`audit_rbac_permissions`, `check_secrets_security`).

## Configuration Reference

The service is configured via environment variables and Kubernetes manifests.

| Variable           | Default | Description                                   |
| ------------------ | ------- | --------------------------------------------- |
| `KUBECTL_MCP_PORT` | `8080`  | Port utilized for the streamable-http server. |

> [!NOTE]
> The default transport argument in the official image is overridden in `mcp.yaml` to utilize the
> `streamable-http` interface required by AgentGateway.
