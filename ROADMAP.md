# Roadmap

All planned and completed milestones for each key workspace context in the tupynambalucas.dev ecosystem, aligning our immediate features with long-term platform transformations.

## Core Architecture & Strategy

This section outlines the strategic monorepo architecture, catalog configurations, and logical multi-tenant isolation goals for the tupynambalucas.dev project.

## Current Development Focus: "Single-Instance Mastery"

**CRITICAL STRATEGY:** Our immediate and absolute priority is to deliver a **complete, 100% functional, and polished single-instance application** (`@tupynambalucas-hub/*`).

While we have a long-term vision of becoming a multi-tenant SaaS platform, **SaaS architectural complexities must not be implemented at this stage.** All current development (codebase, database schemas, UI/UX) must remain focused on producing the best possible version of a standalone system for an ecovillage. The transition to a full SdasdasaaS model (Phase 6 of the Master Plan) will only be considered after the single-instance application is stable and fully operational.

---

## Completed Milestones

### Monorepo Architecture & Workspace Setup

- **Monorepo Workspace Segregation**: Structured workspace layers via PNPM Workspaces v11 and Turborepo, segregating `instance/`, `portal/`, `studio/`, `tools/`, and `docs/` domains.
- **High-Performance Task Orchestration**: Integrated **Turborepo** to orchestrate pipelines, enabling smart target caching and parallel execution of scripts.
- **Unified Configuration Inheritances**: Configured root-level `tsconfig.base.json` and `eslint.config.ts` extendable by workspace packages via TSConfig extends and ESLint config array definitions.
- **Node 22 & TypeScript ESM Configuration**: Converted all packages to use ECMAScript Modules (`"type": "module"`) and compiled with target `ESNext` for modern syntax support.

### Bounded Contexts & Domain Security

- **Strict Bounded Context Isolation**: Configured custom ESLint import restrictions (`no-restricted-imports`) in `eslint.config.ts` preventing cross-workspace dependencies (e.g., Instance context importing from Portal context, and vice-versa) to guarantee clean, decoupled business logic.
- **Domain-Core Pattern Integration**: Established `packages/core` in both `instance` and `portal` as the Single Source of Truth (SSOT) for data models and schema validators.
- **Unified Dependency Management via Catalogs**: Integrated PNPM v11 Catalogs feature in `pnpm-workspace.yaml` to govern third-party tool versions (e.g., Fastify 5, React 19, TSX, ESLint) across the entire monorepo.

## Planned Focus

- **Logical Multi-Tenant Isolation**: Ensure instances and portal run completely isolated execution domains.
- **SaaS Platform Evolution**: Transition from single-instance deployments to a centralized multi-tenant marketplace model, utilizing a centralized Traefik Edge Router as a single point of entry to dynamically route requests to isolated backend environments.

---

## Developer Hub (tupynambalucas.dev)

This section details the milestones and plans for the personal developer website, blog engine, contact systems, and administration dashboard.

---

## Completed Milestones

### Architecture & Service Setup

- **Modular Workspace Layout**: Established a solid codebase separation splitting the hub into `services/web` (React client), `services/api` (Fastify engine), and `packages/core` (Zod validation schemas and shared contracts).
- **Decoupled Local Infrastructure**: Initialized containerized local configurations for a MongoDB replica set (`rs0`) and Redis database to handle persistent storage and cache pipelines.

---

## Planned Focus

### Developer Portfolio & Showcase

- **Interactive Project Showcase**: Build an elegant visual grid displaying past works, architectural summaries, and production links.
- **Technical Skills Inventory**: Design a responsive visual matrix mapping programming competencies (TypeScript, React, Zig, Fastify, Docker, Databases) utilizing style variables from the studio tokens.

### Content & Communication Systems

- **Developer Blog Engine**: Program a dynamic content engine to publish articles, tech tutorials, and architecture case studies.
- **Contact Forms & Services Pipeline**: Implement structured forms allowing visitors to request freelance development services or consultancies, backed by verified Cloudflare Turnstile anti-spam layers and transactional email triggers.
- **Secure Dashboard**: Develop an administrative panel for managing blog posts, viewing incoming contact leads, and tracking analytics directly from the web client.

---

## Profile Generator (profile)

This section details the milestones and plans for the Node.js and TypeScript-based GitHub profile stats compiler and visual card generator. We prioritize TypeScript to maintain a cohesive, full-type codebase across the entire monorepo.

---

## Completed Milestones

### Workspace Initialization

- **Reference Integration**: Imported the upstream Zig-based reference code to serve as a guide for API query logic and SVG visual layout constraints.
- **Context Routing Setup**: Configured localized documentation (`README.md`) and agent guidelines (`AGENTS.md`) detailing the workspace specifications.

### Engine Re-Architecture & Implementation

- **TypeScript GraphQL Client**: Developed a robust API client in Node.js/TypeScript to query the GitHub GraphQL API, compiling commits, issues, PRs, and PR reviews.
- **Recursive Division Strategy**: Implemented recursive subdivision of monthly ranges to bypass the GitHub GraphQL API's 100-repository query limit.
- **Lines Changed API & Git Fallback**: Set up a retry loop for the asynchronous contributor statistics endpoint (supporting 202, 403, and 429 status codes), integrated with a fallback bare clone and `git log` analyzer.
- **SVG Visual Renderers**: Programmed visual SVGs for overview stats and language size statistics utilizing CSS animations and target hashes (`#gh-dark-mode-only` / `prefers-color-scheme`) for dual-theme support.
- **Automated Workflow Actions**: Programmed a GitHub Actions pipeline that builds and executes the TypeScript generator, automatically injecting updated visual elements into the root `README.md` on a daily cron schedule and on push.
- **Upstream Reference Clean-up**: Deleted the deprecated Zig-based codebase from the monorepo, keeping references clean and pointing directly to the upstream inspiration repository.

---

## Planned Focus

### Performance & Security Optimization

- **API Request Batching**: Optimize calls to the GitHub API to reduce network latency and limit the possibility of rate-limiting.
- **Subagent Customizations**: Extend the profile generator tool configuration to allow custom themes or layout parameters via environment variables.

---

## Studio (Design Hub)

This section covers the Penpot environment, design-token sync automation, and custom UI asset design.

## Completed Milestones

### Collaborative Design Environment

- **Self-Hosted Design Hub**: Deployed a containerized Penpot v2 instance (Aide-supported design workspace) inside the `@tupynambalucas-studio/design` environment, enabling secure local collaborative styling mockups.
- **Centralized Design System Packages**: Structured `@tupynambalucas-studio/design` to serve as the unified package for brand guidelines, typography styles, spacing configurations, and palette design tokens.

### Asset Pipelines

- **Branding Assets Export**: Standardized export assets (including SVG vectors, logo marks, and color sheets) in the project repositories, providing raw templates for web applications.
- **Brand Identity Realignment**: Reorganized the assets workspace structure to establish a canonical `brand` namespace (grouping logos, palettes, favicons, banners, guidelines) and renamed the design sources directory from `raw` to `sources`.
- **Cloud-Based Asset Hosting**: Implemented a bidirectional asset synchronization CLI engine under `@tupynambalucas-studio/design/bucket`, enabling seamless replication of brand-identity sources and web-ready assets with Cloudflare R2 Object Storage, eliminating heavy assets from Git history.

## Planned Focus

- **Sync Integration**: Automate the pipeline to sync tokens from Penpot directly into codebase design systems.
- **Extended Suite Assets**: Design custom marketing and UI asset libraries.

---

## Tools (Infrastructure & MCP)

This section outlines the gateway proxy infrastructure, containerized MCP servers, and agent sandboxes.

## Completed Milestones

### Gateway Proxy & Networking

- **Fastify HTTP Proxy Gateway**: Deployed a containerized gateway (`elo-mcp-gateway`) running on Fastify v5 that proxies and routes incoming local client requests (e.g. from the Antigravity CLI on port `3005`) to downstream context containers.
- **CORS & SSE Stream Handling**: Configured network-level CORS headers and disabled proxy timeouts to guarantee stable, persistent Server-Sent Events (SSE) connections.

### Containerized MCP Ecosystem

- **Playwright Headless Browser Sandbox**: Deployed a Debian-based container running Playwright Google Chrome, with automatic rewrite rules routing loopback/localhost requests back to the host machine bridge (`host.docker.internal`).
- **Structured MCP Servers**: Created Alpine/Debian-based containerized setups for:
  - `GitHub MCP`: Version control execution, issue tracking, and repository queries.
  - `Context7 MCP`: Documentation search targeting dependencies (React 19, Fastify 5, Three.js).
  - `Docker Hub MCP`: Container registry tracking.

### Automation Scripts

- **TypeScript Root Compilation Scripts**: Programmed TypeScript scripts (`generate-changelog.ts` and `generate-roadmap.ts`) running natively via `tsx` to compile workspace metrics and changes directly to root Markdown files.

### Containerized AI Agents (`tools/agents`)

- **Docker-based CLI Provisioning**: Architected and implemented a new `tools/agents` workspace that provisions GitHub Copilot and Google Antigravity CLIs as long-running Docker services, eliminating manual host-level CLI installations.
- **Unified Configuration Injection**: Both CLIs share a single `mcp_config.json` and a unified `skills/` directory, injected via bind mounts at container startup. No configuration is baked into image layers.
- **Persistent Session & Brain Storage**: OAuth tokens, conversation histories, and runtime data are persisted on the host machine via Git-ignored bind-mounted volumes, surviving container rebuilds.
- **Version-Controlled TUI Settings**: Antigravity CLI `settings.json`, `statusline.sh`, and `title.sh` are tracked in the repository and mounted over the container's runtime directory, giving the team direct control over CLI behavior without manual per-machine configuration.
- **Internal Network Routing**: Agent containers resolve all MCP services via the `elo.internal.tools.mcp:3005` custom host alias, allowing the stacks to start and stop completely independently without network configuration errors.
- **Docker-out-of-Docker (DooD)**: Both containers mount the host Docker socket, enabling containerized agents to orchestrate other monorepo stacks (e.g., `pnpm mcp:up`, `pnpm instance:up`) from within the container.
- **VS Code Task Integration**: Tasks registered in `.vscode/tasks.json` using `[Docker]` and `[Host]` prefixes to clearly distinguish container-based from host-global CLI execution during the migration transition period.

## Planned Focus

- **Agent Stack Validation**: End-to-end testing of MCP connectivity, OAuth persistence, and workspace bind mount integrity from within containerized agent sessions.
- **Host CLI Decommission**: After full agent stack validation, remove host-global CLI installations and delete legacy `.agents/` and `.github/copilot/` configuration directories.
- **CI/CD Integrations**: Build context validators and check scripts.
- **Automated Sandbox Reporting**: Expose runtime test and coverage dashboards to local agent environments.

---

## Knowledge Base (TupyDocs)

This section details the central developer portal onboarding references, guidelines, and translation parity tools.

## Completed Milestones

### Documentation Engine & Layout

- **Docusaurus Engine Integration**: Configured Docusaurus v3 as our central developer portal (TupyDocs), providing a responsive documentation engine.
- **Custom MDX Component Pages**: Programmed custom MDX pages (e.g. Tools Workspace ecosystem, Studio Branding) to visual-explain monorepo architecture workflows.
- **Left Navigation Sidebars**: Implemented autogenerated context-based sidebars and structured paths for all sections, simplifying navigation structure.

### Localization & Translation Parity

- **Native Translation Pipelines**: Integrated i18n support, creating a dual locale structure (English source and Portuguese `pt-BR` translation copies) with translation parity protocols.

### CI/CD Deployment

- **Automated Root Compilation (Paused)**: Built tasks to compile and push both `CHANGELOG.md` and `ROADMAP.md` to the repository root. This is temporarily disabled in the GitHub Actions workflow (`deploy-docs.yaml`) and will be refactored in a future phase.

## Planned Focus

- **Workflow & Compiler Refactor**: Redesign and re-enable the modular document compiler (changelog and roadmap generation) inside the deploy pipeline with improved Git conflict resolution and isolated test suites.
- **Translation Verification Pipeline**: Automate the verification check to ensure 100% documentation sync.
- **API Auto-Generation**: Extract documentation blocks directly from Fastify routing controllers.
