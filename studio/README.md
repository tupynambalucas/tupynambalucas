# Design Studio Workspace

This workspace centralizes brand identity management, design assets, and self-hosted collaborative design tools for the project.

---

## Workspace Structure

The workspace is organized into the following sub-packages:

### 1. [Design Assets](./assets/README.md) (`studio/assets/`)

Brand colors, logos, icons, styling tokens, and asset synchronization via S3/Cloudflare R2.

- **Detailed Guide:** Refer to the [Design Assets README](./assets/README.md).

### 2. [Penpot Collaborative Design](./penpot/README.md) (`studio/penpot/`)

Self-hosted Docker configurations for the Penpot collaborative vector-based UI/UX design editor.

- **Detailed Guide:** Refer to the [Penpot README](./penpot/README.md).

---

## Configuration

### Core Design Platform (Penpot)

Before running the collaborative design services, you must configure a `.env` file under `studio/penpot/`:

```bash
# Path: studio/penpot/.env

# PENPOT Main Configuration
PENPOT_SECRET_KEY=generate_a_secure_random_string
PENPOT_DATABASE_URI=postgresql://user:password@host:port/database?sslmode=require
PENPOT_DATABASE_USERNAME=your_db_user
PENPOT_DATABASE_PASSWORD=your_db_password

# PENPOT Object Storage (S3)
PENPOT_BUCKET_NAME=your_bucket_name
PENPOT_BUCKET_ACCESS_ID=your_access_key_id
PENPOT_BUCKET_SECRET_KEY=your_secret_access_key
```

### R2 Asset Sync System (Assets Bucket)

For synchronizing web-ready assets (e.g. icons, logos) directly with Cloudflare R2, configure the environment variables in `studio/assets/bucket/.env.studio.bucket`:

```bash
# Path: studio/assets/bucket/.env.studio.bucket

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
