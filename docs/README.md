# @tupynambalucas/docs - Documentation Hub

This is the central, authoritative documentation hub for the tupynambalucas.dev project. Built with Docusaurus v3, it provides a high-performance, strictly-typed technical and product knowledge base.

---

## Structure & Content

- **`handbook/`**: Core project documentation (Architecture, Master Plan, Product Vision, Style Guide).
- **`src/pages/`**: Custom interactive landing pages for workspace contexts (Studio, Tools).
- **`releases/`**: Official project Changelog and versioned release notes.
- **`i18n/`**: Full internationalization support (English and Brazilian Portuguese).

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
