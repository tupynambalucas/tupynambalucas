# Local Context: Cortex Memory MongoDB Subsystem

This workspace directory ([mongodb/](./)) contains container definitions and initialization scripts for the self-hosted MongoDB 7.0 database powering the Cortex Memory Subsystem.

---

## 1. Directory Layout

- **[Dockerfile](./Dockerfile)**: Custom MongoDB 7.0 container image installing `openssl` and `dos2unix`.
- **[scripts/entrypoint.sh](./scripts/entrypoint.sh)**: Custom entry point generating `/data/mongo-keyfile` for secure Replica Set authentication.
- **[init-scripts/init-db.sh](./init-scripts/init-db.sh)**: Idempotent initialization script that configures the single-node Replica Set (`rs0`) and awaits PRIMARY state.

---

## 2. Operational & Database Guardrails

- **Replica Set Requirement**: MongoDB MUST be initialized with replica set name `rs0` (`--replSet rs0`) to enable MongoDB transactions, change streams, and `$vectorSearch` indexes.
- **Keyfile Permissions**: The generated keyfile MUST have `400` permissions and be owned by UID `999:999` (the `mongodb` system user).
- **Idempotent Initialization**: The `init-db.sh` script MUST verify if `rs.status().ok` is already true before attempting `rs.initiate()`.
- **Port Allocation**: Internal container port is `27017`; mapped host port is `27018` in Docker Compose to avoid conflicts with local system MongoDB instances.
