# Knowledge Base

Welcome to the central technical documentation and developer knowledge base for the tupynambalucas.dev monorepo.

This bounded context implements a decoupled architecture that separates static content collections from the Docusaurus rendering engine and packaging layer.

---

## Architecture Overview

- **[collections/](./collections/README.md)**: Decoupled content collections, domain-driven documentation (Diátaxis framework), and Crowdin translation synchronization SDK.
- **[docusaurus/](./docusaurus/README.md)**: Docusaurus build system, preset configurations, presentation theme layer, and deployable documentation portal services.

---

## Core Philosophy

1. **Content Decoupling**: Documentation content is authored and versioned in `collections/` independently of the presentation layer.
2. **Feature-Sliced Design (FSD)**: Content is organized by domain (`domains/portal/`) separating technical guides (`docs/`), community resources (`community/`), and engineering articles (`blog/`).
3. **Automated Localization**: Crowdin API client integration orchestrates multilingual compilation and synchronization between cloud translations and local build targets.
4. **AST Token Portability**: All documents use agnostic tokens (`tupynambalucas.dev`, `Tupynambalucas`) resolved dynamically during build.
