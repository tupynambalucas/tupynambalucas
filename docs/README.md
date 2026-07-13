# @tupynambalucas/docs - Documentation Hub

This is the central, authoritative documentation hub for the tupynambalucas.dev project monorepo. Built with Docusaurus v3, it provides a high-performance, strictly-typed technical and product knowledge base.

---

## Structure & Content

The documentation workspace is organized as follows:

- **[handbook/](./handbook/)**: Core project documentation structured around the **Diátaxis framework** (Tutorials, How-To Guides, Reference, Explanation).
- **[workspaces/](./workspaces/)**: Technical specifications and developer guidelines for each monorepo workspace (Hub, Profile, Studio, Tools, Docs, Shared).
- **[roadmap/](./roadmap/)**: Project development timeline and release roadmap.
- **[releases/](./releases/)**: Official project Changelog and versioned release notes.
- **[src/pages/](./src/pages/)**: MDX layout configurations and custom React landing pages.
- **[i18n/](./i18n/)**: Full internationalization support (English and Brazilian Portuguese).

---

## Diátaxis Framework

All documentation under [handbook/](./handbook/) strictly adheres to the Diátaxis framework to classify and separate content by user intent:

- **Tutorials**: Learning-oriented guides that help developers get started.
- **How-to Guides**: Goal-oriented recipes that solve specific problems.
- **Reference**: Information-oriented technical descriptions, APIs, and configuration schemas.
- **Explanation**: Understanding-oriented discussions on architecture and concepts.

For more details on applying Diátaxis to this workspace, please refer to the introductory guide in [handbook/intro.mdx](./handbook/intro.mdx) or the local agent guidelines in [AGENTS.md](./AGENTS.md).

---

## Local Development

Manage the documentation from the project root or this directory:

### From Monorepo Root

```bash
pnpm docs:dev     # Start in English (default) - http://localhost:3002
pnpm docs:dev:pt  # Start in Brazilian Portuguese (pt-BR)
```

### Within this Workspace

```bash
pnpm start     # Start in English
pnpm start:pt  # Start in Brazilian Portuguese (pt-BR)
```

---

## Build Pipelines

```bash
pnpm build
```

The static site will be generated in the `build/` directory using an optimized SSG pipeline.

---

## Deployment

The documentation is automatically deployed to Cloudflare Pages via GitHub Actions.

- **Workflow:** `.github/workflows/deploy-docs.yaml`
- **Authoritative URL:** [https://docs.tupynambalucas.dev](https://docs.tupynambalucas.dev)
