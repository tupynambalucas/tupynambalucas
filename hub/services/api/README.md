# @tupynambalucas-hub/api - Community Instance API

This directory contains the core API for the Tupynambá Lucas system. In our architectural model, this is an **Instance-based Application**, meaning it is designed to be deployed specifically for each community (ecovillage, condominium, or tenant).

## Architectural Role: Instance-based

While the project currently focuses on "Single-Instance Mastery", the backend is built to support a future SaaS evolution:

- **Isolation**: Each instance manages its own business logic, database connections, and community-specific workflows.
- **Portability**: Designed to be containerized and scaled independently per tenant.
- **Contract-Driven**: Strictly follows the data contracts defined in `@tupynambalucas-hub/core`.

### Documentation

Detailed technical documentation is available in our [Knowledge Base](https://tupynambalucas-docs.pages.dev):

- [Architecture Overview](https://tupynambalucas-docs.pages.dev/docs/engineering/architecture): Technical decisions and domain modeling details.
- [Style Guide](https://tupynambalucas-docs.pages.dev/docs/engineering/styleguide): Coding standards and conventions.

---

## Project Structure

The source code follows a domain-driven approach within the Fastify ecosystem:

```text
src/
├── config/           # Global configurations (Env, Queues, Fastify)
├── domains/          # Application Core (Domain Logic)
│   ├── auth/         # Authentication and Session Management
│   ├── cycle/        # Sharing Cycle Management
│   └── product/      # Product Catalog and Ingestion
├── models/           # Mongoose Schemas (Persistence)
├── plugins/          # Fastify Plugins (DB, Security, Registry)
├── scripts/          # Automation Scripts
├── types/            # TypeScript type definitions and interfaces
└── utils/            # Shared Backend Utilities
```

---

## Environment Configuration

Create a `.env.dev` or `.env.prod` file in this directory (or copy from the provided templates `.env.dev.example` / `.env.prod.example`). Key variables include:

```properties
# Server
SERVER_PORT=3000
SERVER_HOST=localhost
NODE_ENV=development

# MongoDB (replica set enabled, enforcing canonical 'hubdb' name)
MONGO_URI=mongodb://YOUR_MONGO_USER:YOUR_MONGO_PASSWORD@localhost:27017/hubdb?authSource=admin&replicaSet=rs0&directConnection=true

# Redis (BullMQ)
REDIS_HOST=localhost
REDIS_PORT=6379

# Auth & Session Secrets
JWT_SECRET=your_jwt_secret_here
SESSION_SECRET=your_session_secret_here
USER_SESSION_KEY=EloInstance

# Admin Seed
ADMIN_USER_SEED=admin
ADMIN_EMAIL_SEED=your-email@example.com
ADMIN_PASS_SEED=admin

# External Services
SENTRY_DSN=your_sentry_dsn_here
TURNSTILE_SECRET_KEY=1x0000000000000000000000000000000AA
```

---

## Operation Scripts

- `pnpm dev`: Starts server in watch mode.
- `pnpm build`: Transpiles TypeScript to `dist/`.
- `pnpm start`: Executes the compiled application.
- `pnpm typecheck`: Verifies type integrity.
- `pnpm lint`: Executes code style verification.
