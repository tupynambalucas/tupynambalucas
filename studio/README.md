# Design Studio Workspace

This workspace centralizes brand identity management, design assets, and self-hosted collaborative design tools for the project.

---

## Workspace Structure

The workspace is organized into the following sub-packages:

### 1. [Design Assets & Penpot Config](./design/README.md) (`studio/design/`)

Centralized design system assets (brand logos, icons, styling tokens) and self-hosted docker configurations for the Penpot collaborative UI/UX vector-based design editor.

- **Detailed Guide:** Refer to the [Design & Penpot README](./design/README.md).

### 2. [Cloudflare R2 Asset Sync](./bucket/README.md) (`studio/bucket/`)

TypeScript command-line asset synchronization tool that replicates local design assets to and from Cloudflare R2 object storage.

- **Detailed Guide:** Refer to the [Bucket Synchronizer README](./bucket/README.md).

---

## Configuration

### Core Design Platform (Penpot)

Before running the collaborative design services, you must configure a `.env` file under `studio/design/infrastructure/docker/`:

```bash
# Path: studio/design/infrastructure/docker/.env

# PENPOT Main Configuration
PENPOT_SECRET_KEY=generate_a_secure_random_string
PENPOT_REDIS_URI=redis://valkey/0
PENPOT_FLAGS=disable-email-verification disable-secure-session-cookies
```

### R2 Asset Sync System (Assets Bucket)

For synchronizing web-ready assets (e.g., icons, logos) directly with Cloudflare R2, configure the environment variables in `studio/bucket/.env.studio.bucket`:

```bash
# Path: studio/bucket/.env.studio.bucket

S3_API=https://your-cloudflare-r2-endpoint.r2.cloudflarestorage.com/your-bucket-name
CLOUDFLARE_R2_ACCESS_KEY_ID=your_access_key_id
CLOUDFLARE_R2_SECRET_ACCESS_KEY=your_secret_access_key
CLOUDFLARE_R2_PUBLIC_URL=https://your-public-cdn-url.r2.dev
```

---

## Operations & Scripts

Manage the design tools using standardized scripts from the monorepo root:

### Collaborative Editor (Penpot)

- `pnpm penpot:up`: Launch Penpot collaborative editor at `http://localhost:9005`.
- `pnpm penpot:down`: Shutdown core docker containers.
- `pnpm penpot:update`: Pull latest Penpot images and restart.
- `pnpm penpot:reset`: Force complete container and database volume recreation.

### AI Automation Helpers

- `pnpm penpot:aide:up`: Launch Penpot AI assistant (aide) integration.
- `pnpm penpot:aide:down`: Stop the Penpot AI assistant container.

### Cloudflare R2 Asset Sync

- `pnpm studio:bucket`: Launch the interactive R2 synchronization menu (Push/Pull/Exit).
