# @tupynambalucas-tools/turborepo - Turborepo Remote Cache

This workspace manages the infrastructure for the Turborepo Remote Cache server.

---

## Overview

The purpose of this workspace is to provide a self-hosted Remote Cache server (using `ducktors/turborepo-remote-cache`) to speed up builds and tests across the monorepo. It acts as an API that the Turborepo CLI communicates with during `npx turbo` commands.

---

## Getting Started

### Local Development

1. Ensure the `TURBO_TOKEN` in `architecture/docker/.env` matches the `TURBO_TOKEN` environment variable in your host machine or CI runner.
2. Ensure the `TURBO_TEAM` matches your configured `teamslug` or environment variable.
3. From the root of the monorepo, start the cache server:
   ```bash
   pnpm turborepo:up
   ```
4. Verify the logs:
   ```bash
   pnpm turborepo:logs
   ```

---

## Architecture

- The cache server stores artifacts in a Docker Volume (`turbo-cache-data`) configured to use the local filesystem. This avoids relying on external S3 buckets during local development.
- The `compose.yaml` uses the `services/cache/Dockerfile`, providing an extension point if you need to customize the cache server image in the future.
