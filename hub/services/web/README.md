# @tupynambalucas-hub/web - Community Instance UI

This module comprises the user interface for the Tupynambá Lucas platform. In our architectural model, this is an **Instance-based Application**, providing the specific Shop and Administrative Dashboard for each community (ecovillage, condominium, or tenant).

## Architectural Role: Instance-based

While the project currently focuses on "Single-Instance Mastery", the frontend is built to support a future SaaS evolution:

- **Tailored Experience**: Each community instance receives a customized interface based on local configurations.
- **Client-Side Isolation**: Manages the state, authentication, and interactions for a single tenant instance.
- **Contract-Driven**: Strictly follows the data contracts and UI tokens defined in `@tupynambalucas-hub/core` and the design system.

### Documentation

Detailed technical documentation is available in our [Knowledge Base](https://tupynambalucas-docs.pages.dev):

- [Architecture Overview](https://tupynambalucas-docs.pages.dev/docs/engineering/architecture): Technical decisions and stack details.
- [Style Guide](https://tupynambalucas-docs.pages.dev/docs/engineering/styleguide): UI patterns and React 19 standards.

---

## Directory Structure

The source code is organized by _Features_, promoting cohesion and modularity:

```text
src/
├── assets/           # Static resources (Images, Fonts, SVGs)
├── components/       # Reusable UI component library (Atomic Design)
├── domains/          # API integration layer and Stores (Zustand)
├── features/         # Functional Modules
│   ├── admin/        # Control Panel (Management)
│   ├── shop/         # E-commerce and Catalog (Customer)
│   ├── auth/         # Authentication Flows
│   └── landing/      # Institutional Page
├── i18n/             # Translation configurations
├── lib/              # Third-party library configuration
├── loaders/          # Data loading logic
├── types/            # Shared TypeScript types and interfaces
└── utils/            # General purpose utility functions
```

---

## Environment Configuration

Create a `.env` file in this directory:

```properties
VITE_TURNSTILE_SITE_KEY=your_cloudflare_site_key
```

---

## Local Development

To run the frontend in isolation:

```bash
pnpm dev
```

Accessible at `http://localhost:5173`.

---

## Build and Deploy

```bash
pnpm build
```

Production artifacts are served by **Nginx** in the containerized environment.
