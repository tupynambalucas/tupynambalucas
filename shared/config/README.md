# Shared Configuration

The @monorepo/shared-config workspace serves as the single source of truth (SSOT) for the %PROJECT_DOMAIN% identity, global code formatting rules, and TypeScript base configurations.

## Features

- **Project Metadata**: Managed in project.config.json, defining brand names, domains, and repository locations.
- **Formatting**: Managed in prettierrc.json and .prettierignore. Consumed across the monorepo.
- **TypeScript**: Managed in sconfig.base.json for base compilation standards.

## Project Configuration

The primary configuration is defined in project.config.json and consumed dynamically by UI workspaces, the Docusaurus engine, and infrastructure provisioning scripts.

`json
{
  "PROJECT_NAME": "...",
  "PROJECT_DOMAIN": "...",
  "GITHUB_ORG": "...",
  "GITHUB_REPO": "..."
}
`

## Architectural Role

This package is foundational and must remain devoid of cross-workspace dependencies. It ensures that the monorepo acts as a seamless, copy-pasteable template without hardcoded brand names scattered across the codebase.
