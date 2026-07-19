# Docker Hub MCP Context - Tupynambá Lucas

This file provides rules and security compliance references for container registry interactions within the **Tupynambá Lucas** infrastructure.

## 🛡️ Image Guidelines

- **Hardened Base Images**: Only check and recommend officially verified, security-hardened Alpine or Debian Slim base images.
- **Tag Parity**: Check tags against current monorepo versions to guarantee dependency consistency across local development, staging, and production environments.
