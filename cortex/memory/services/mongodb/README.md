# Cortex Memory MongoDB Subsystem

The `cortex/memory/services/mongodb` directory contains the container image definitions and Replica Set bootstrapping scripts for the Cortex Memory database.

---

## Technology Stack

- **Base Image**: `mongo:7.0`
- **Utilities**: `openssl`, `dos2unix`
- **Configuration**: Single-node Replica Set (`rs0`) with internal keyfile authentication

---

## Components

- **[Dockerfile](./Dockerfile)**: Packages custom entry point scripts with normalized line endings.
- **[scripts/entrypoint.sh](./scripts/entrypoint.sh)**: Generates a secure random 756-byte keyfile (`/data/mongo-keyfile`) if not present and delegates to the official MongoDB entry point.
- **[init-scripts/init-db.sh](./init-scripts/init-db.sh)**: Idempotent script executed by the init container to configure `rs0` and verify PRIMARY readiness.

---

## Environment Variables

| Variable                     | Default               | Purpose                      |
| :--------------------------- | :-------------------- | :--------------------------- |
| `MONGO_INITDB_ROOT_USERNAME` | `cortex_admin`        | Administrative root user     |
| `MONGO_INITDB_ROOT_PASSWORD` | `cortex_password_dev` | Administrative root password |
| `MONGO_INITDB_DATABASE`      | `cortex_memory`       | Default memory database name |
