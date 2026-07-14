# @tupynambalucas/renderer

This workspace manages the generic dynamic asset generator and document compilation engine, responsible for generating custom visual SVG cards and compiling markdown templates into production-grade documents across the monorepo.

---

## Directory Layout

```
renderer/
├── src/
│   ├── index.ts                     # Main runner executing active pipelines
│   ├── pipelines/                   # Pipelines Layer (SOLID/OCP)
│   │   ├── types.ts                 # Shared Pipeline schemas & types
│   │   ├── github-profile.pipeline.ts # Standard profile compilation target
│   │   └── index.ts                 # Central active pipeline registry
│   ├── templates/                   # Domain-organized template directory
│   │   ├── cards/
│   │   │   ├── stats/               # Metrics-based dynamic cards
│   │   │   │   ├── overview.template.svg
│   │   │   │   └── languages.template.svg
│   │   │   └── static/              # Static-designed SVG visual cards
│   │   │       └── header.template.svg
│   │   └── docs/                    # Textual markdown templates
│   │       └── README.template.md
│   ├── renderers/                   # Compilation and layout engines
│   │   ├── stats-card.ts            # Statistics cards generator
│   │   └── header-card.ts           # Font-inlined header cards generator
│   └── utils/
│       ├── font-encoder.ts          # Base64 variable font encoder
│       ├── template-fill.ts         # Placeholders interpolation helper
│       └── glob.ts                  # Glob file matching utility
├── generated/                       # Compiled development previews directory
│   ├── cards/                       # Flat SVG card themes copies
│   │   ├── overview-light.svg       # Light overview statistics
│   │   ├── overview-dark.svg        # Dark overview statistics
│   │   ├── languages-light.svg      # Light languages statistics
│   │   ├── languages-dark.svg       # Dark languages statistics
│   │   ├── header-light.svg         # Light header banner
│   │   └── header-dark.svg          # Dark header banner
│   └── docs/                        # Separated markdown layout previews
│       ├── light/                   # Light-themed preview files
│       │   └── README.md            # Points to ../../cards/*-light.svg
│       └── dark/                    # Dark-themed preview files
│           └── README.md            # Points to ../../cards/*-dark.svg
└── package.json
```

---

## Technical Features

### 1. Extensible Pipeline Architecture

The system supports registering multiple independent pipelines inside `src/pipelines/index.ts`. Each pipeline defines template sources, output locations (both locally and in remote CI/CD branches), allowing the renderer to compile completely different document suites (e.g. GitHub developer profiles, handbook manuals, or design systems) concurrently.

### 2. Sandbox-Proof Vector Branding

By base64-encoding our local variable **Nunito** font file and embedding it as an inlined `@font-face` within our SVG templates, we bypass GitHub's strict HTML image sandbox restrictions. This ensures that custom text styles render with pixel-perfect brand fidelity on all screens.

### 3. Native Design System Binding

Colors and font primitives are resolved directly from `@tupynambalucas-studio/design` tokens. This makes our SVGs completely responsive to design system changes.

---

## Scripts

Run these scripts from the workspace directory or via pnpm filters:

- `pnpm clean`: Removes all compiled files, caches, and output build directories.
- `pnpm generate`: Runs the document compilation pipeline locally, writing files to the monorepo root or package previews.
- `pnpm typecheck`: Executes TypeScript compiler validation.
- `pnpm lint`: Performs static ESLint checks.
