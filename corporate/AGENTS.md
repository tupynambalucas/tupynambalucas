<context-hierarchy>
  <parent src="../AGENTS.md" type="global-rules" />
</context-hierarchy>

# Bounded Context: Corporate

The `corporate/` workspace manages all public-facing products and services for the `tupynambalucas.dev` monorepo.

## 1. Sub-Domains

This context is divided into several sub-domains:

- `api/`: The primary backend REST API (Fastify).
- `portal/`: The central knowledge base and documentation portal (Docusaurus).
- `web/`: The main company website and frontend application (Vite/React).
- `packages/`: Shared logic, schemas, and configurations strictly for corporate products.
- `collections/`: Documentation content and assets structured for the portal.

## 2. Constraints

- Corporate services MUST NOT access internal Hub APIs directly without proper authentication and routing.
- All deployments are managed through the `k8s/` manifests, targeting the `k3d-corporate` cluster in local development.
- The `portal/` documentation MUST adhere to the Diátaxis framework.

## 3. Required Skill

- **`docusaurus-expert`**: MUST be active when creating or modifying markdown documentation inside the `portal/` or `collections/` directories to ensure MDX syntax compliance.
