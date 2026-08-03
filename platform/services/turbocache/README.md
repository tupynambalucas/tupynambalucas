# Turborepo Remote Cache (turbocache)

The `turbocache/` directory contains container orchestration rules to host a local Turborepo Remote Cache server.

---

## Service Overview

1. **[Dockerfile](./Dockerfile)**: Declares a custom build environment using the `ducktors/turborepo-remote-cache` base, creating local persistent directories under `/data/cache` for cached build logs and build artifact files.
