# Docs Workspace Restructuring Plan

> **Status:** Plan — pending execution
> **Scope:** Full structural refactor of the `docs/` workspace to align with the `hub/`
> and `cortex/memory/` bounded context patterns. This supersedes and replaces the previous
> custom theme plan (all theme goals are preserved and integrated here).

---

## 1. Motivation and Architectural Decision

The current `docs/` workspace is a flat structure where the Docusaurus service root, the custom
preset, the custom plugins, and future theme packages all co-exist in the same directory. This
creates coupling between infrastructure artifacts (Docusaurus config, content, static assets)
and reusable library packages (preset, theme, plugins).

The `hub/` and `cortex/memory/` bounded contexts demonstrate the correct pattern for this
monorepo: **services remain isolated in `services/`; reusable packages are isolated in
`packages/`; the bounded context root is a thin coordinator.**

Applying this pattern to `docs/` yields:

| Concern                                   | Current location        | Target location                  |
| ----------------------------------------- | ----------------------- | -------------------------------- |
| Docusaurus config, content, static assets | `docs/` root            | `docs/services/docusaurus/`      |
| Custom preset                             | `docs/preset/`          | `docs/packages/preset/`          |
| Custom theme plugin                       | (planned)               | `docs/packages/theme/`           |
| Custom plugin extensions                  | `docs/preset/plugins/`  | `docs/packages/plugins/`         |
| Sidebars                                  | `docs/preset/sidebars/` | `docs/packages/preset/sidebars/` |

The Docusaurus service (`docs/services/docusaurus/`) becomes a thin consumer: it imports
`@monorepo/docs-preset` from `docs/packages/preset/` via `workspace:*` and uses it in
`docusaurus.config.ts`. The preset in turn imports `@monorepo/docs-theme` and the individual
plugin packages from `docs/packages/`.

---

## 2. Target File Structure

```
docs/
├── tsconfig.json                        ← Bounded context root tsconfig references
├── AGENTS.md                            ← Bounded context AGENTS router
├── README.md
├── packages/
│   ├── preset/                          ← @monorepo/docs-preset
│   │   ├── package.json
│   │   ├── tsconfig.json
│   │   └── src/
│   │       ├── index.ts                 ← Preset entry (moved from docs/preset/index.ts)
│   │       ├── options.ts
│   │       ├── themeConfig.ts
│   │       ├── sidebars/
│   │       │   └── index.ts
│   │       └── plugins/
│   │           ├── ast-transformers/
│   │           ├── content-blog/
│   │           ├── content-docs/
│   │           ├── content-pages/
│   │           └── webpack-loaders/
│   │
│   ├── theme/                           ← @monorepo/docs-theme
│   │   ├── package.json
│   │   ├── tsconfig.json
│   │   └── src/
│   │       ├── index.ts                 ← Plugin entry: getThemePath, validateThemeConfig
│   │       ├── types.ts
│   │       └── theme/                  ← Component overrides (getThemePath → here)
│   │           └── .gitkeep            ← Initially empty; add overrides here
│   │
│   └── plugins/                         ← (future) standalone plugin packages
│       └── .gitkeep
│
└── services/
    └── docusaurus/                      ← @monorepo/docs-docusaurus (the Docusaurus app)
        ├── package.json                 ← Imports @monorepo/docs-preset via workspace:*
        ├── tsconfig.json
        ├── docusaurus.config.ts
        ├── babel.config.js
        ├── handbook/                    ← Content (moved from docs/handbook/)
        ├── workspaces/                  ← Content (moved from docs/workspaces/)
        ├── roadmap/                     ← Content (moved from docs/roadmap/)
        ├── releases/                    ← Content (moved from docs/releases/)
        ├── i18n/
        ├── src/
        │   ├── css/
        │   ├── pages/
        │   └── remark/
        ├── static/
        ├── scripts/
        ├── tooling/
        └── build/                       ← Docusaurus build output (gitignored)
```

---

## 3. Package Naming Convention

Following the exact pattern used by `hub/` and `cortex/memory/`:

| Package path                | Package name                | Role                                    |
| --------------------------- | --------------------------- | --------------------------------------- |
| `docs/packages/preset/`     | `@monorepo/docs-preset`     | Custom Docusaurus preset                |
| `docs/packages/theme/`      | `@monorepo/docs-theme`      | Custom theme plugin (Thin Orchestrator) |
| `docs/services/docusaurus/` | `@monorepo/docs-docusaurus` | Docusaurus site service                 |

---

## 4. Dependency Graph

```
docs/services/docusaurus/
  └── depends on @monorepo/docs-preset (workspace:*)
        └── depends on @monorepo/docs-theme (workspace:*)
        └── depends on @docusaurus/theme-classic (catalog:docs-stack)
        └── depends on @docusaurus/theme-live-codeblock (catalog:docs-stack)
        └── depends on @docusaurus/theme-mermaid (catalog:docs-stack)
        └── depends on @docusaurus/plugin-content-docs (catalog:docs-stack)
        └── ... (all other @docusaurus/* plugins)
```

The service (`docs/services/docusaurus/`) declares only `@monorepo/docs-preset` as a dependency.
All Docusaurus packages are transitive — they are consumed by the preset, not directly by the service.

> [!IMPORTANT]
> This is intentional. `docs/services/docusaurus/` should not re-declare `@docusaurus/*` packages
> directly. The preset owns the Docusaurus dependency surface. This mirrors how `hub/services/api`
> declares only `@monorepo/hub-core`, not every individual domain library.

---

## 5. Phase 1 — `pnpm-workspace.yaml` Update

Add the new nested workspace glob patterns. Remove the current flat `docs` entry.

```yaml
# pnpm-workspace.yaml — packages section (diff)

packages:
  - 'hub/services/*'
  - 'hub/packages/*'
  - 'shared/*'
  - 'studio/*'
  - 'tools/*'
  - 'infrastructure'
  - 'platform'
  # Remove: - 'docs'
  # Add:
  - 'docs/packages/*'
  - 'docs/services/*'
  - 'renderer'
  - 'cortex/mcp/guardrails'
  - 'cortex/mcp/services/*'
  - 'cortex/memory/packages/*'
  - 'cortex/memory/services/*'
```

---

## 6. Phase 2 — `docs/packages/preset/package.json`

```json
{
  "name": "@monorepo/docs-preset",
  "version": "0.1.0",
  "private": true,
  "description": "Custom Docusaurus preset for the monorepo knowledge base.",
  "type": "module",
  "exports": {
    ".": {
      "import": "./src/index.ts",
      "default": "./src/index.ts"
    }
  },
  "scripts": {
    "typecheck": "tsc --noEmit",
    "lint": "eslint ."
  },
  "dependencies": {
    "@monorepo/docs-theme": "workspace:*",
    "@monorepo/shared-config": "workspace:*",
    "@monorepo/studio-assets": "workspace:*",
    "@docusaurus/core": "catalog:docs-stack",
    "@docusaurus/theme-classic": "catalog:docs-stack",
    "@docusaurus/theme-common": "catalog:docs-stack",
    "@docusaurus/theme-live-codeblock": "catalog:docs-stack",
    "@docusaurus/theme-mermaid": "catalog:docs-stack",
    "@docusaurus/theme-search-algolia": "catalog:docs-stack",
    "@docusaurus/plugin-content-docs": "catalog:docs-stack",
    "@docusaurus/plugin-content-blog": "catalog:docs-stack",
    "@docusaurus/plugin-content-pages": "catalog:docs-stack",
    "@docusaurus/plugin-debug": "catalog:docs-stack",
    "@docusaurus/plugin-google-gtag": "catalog:docs-stack",
    "@docusaurus/plugin-google-tag-manager": "catalog:docs-stack",
    "@docusaurus/plugin-sitemap": "catalog:docs-stack",
    "@docusaurus/plugin-svgr": "catalog:docs-stack",
    "@docusaurus/plugin-css-cascade-layers": "catalog:docs-stack",
    "prism-react-renderer": "catalog:docs-stack"
  },
  "devDependencies": {
    "@docusaurus/types": "catalog:docs-stack",
    "@docusaurus/module-type-aliases": "catalog:docs-stack",
    "@docusaurus/tsconfig": "catalog:docs-stack",
    "@types/node": "catalog:",
    "typescript": "catalog:"
  }
}
```

---

## 7. Phase 3 — `docs/packages/theme/package.json`

```json
{
  "name": "@monorepo/docs-theme",
  "version": "0.1.0",
  "private": true,
  "description": "Custom Docusaurus theme plugin (Thin Orchestrator) for the monorepo knowledge base.",
  "type": "module",
  "exports": {
    ".": {
      "import": "./src/index.ts",
      "default": "./src/index.ts"
    }
  },
  "scripts": {
    "typecheck": "tsc --noEmit",
    "lint": "eslint ."
  },
  "dependencies": {
    "@docusaurus/theme-classic": "catalog:docs-stack",
    "@docusaurus/theme-live-codeblock": "catalog:docs-stack",
    "@docusaurus/theme-mermaid": "catalog:docs-stack",
    "@docusaurus/theme-common": "catalog:docs-stack"
  },
  "devDependencies": {
    "@docusaurus/types": "catalog:docs-stack",
    "@docusaurus/module-type-aliases": "catalog:docs-stack",
    "@docusaurus/tsconfig": "catalog:docs-stack",
    "@types/react": "catalog:web-stack",
    "@types/node": "catalog:",
    "react": "catalog:web-stack",
    "typescript": "catalog:"
  }
}
```

---

## 8. Phase 4 — `docs/services/docusaurus/package.json`

This replaces the current `docs/package.json`. Notice it only declares `@monorepo/docs-preset`
and `@docusaurus/core` — all other Docusaurus packages are transitive via the preset.

```json
{
  "name": "@monorepo/docs-docusaurus",
  "version": "1.0.0",
  "private": true,
  "description": "Knowledge base and developer documentation site for the monorepo.",
  "type": "module",
  "exports": {
    "./package.json": "./package.json",
    "./roadmap/*": "./roadmap/*",
    "./releases/*": "./releases/*"
  },
  "scripts": {
    "docusaurus": "docusaurus",
    "start": "docusaurus start --host 0.0.0.0 --port 3002",
    "start:pt": "docusaurus start --host 0.0.0.0 --port 3002 --locale pt-BR",
    "build": "tsx scripts/docs-build.ts",
    "swizzle": "docusaurus swizzle",
    "clear": "docusaurus clear",
    "serve": "docusaurus serve",
    "write-translations": "docusaurus write-translations",
    "write-heading-ids": "docusaurus write-heading-ids",
    "edit": "npx editsaurus",
    "docs:generate:changelog": "tsx tooling/generate-changelog.ts",
    "docs:generate:roadmap": "tsx tooling/generate-roadmap.ts",
    "typecheck": "tsc",
    "lint": "eslint ."
  },
  "dependencies": {
    "@monorepo/docs-preset": "workspace:*",
    "@docusaurus/core": "catalog:docs-stack",
    "@docusaurus/faster": "catalog:docs-stack",
    "@mdx-js/react": "catalog:docs-stack",
    "react": "catalog:web-stack",
    "react-dom": "catalog:web-stack",
    "@monorepo/shared-config": "workspace:*",
    "gsap": "catalog:web-stack",
    "@gsap/react": "catalog:web-stack",
    "clsx": "catalog:docs-stack"
  },
  "devDependencies": {
    "@docusaurus/module-type-aliases": "catalog:docs-stack",
    "@docusaurus/tsconfig": "catalog:docs-stack",
    "@docusaurus/types": "catalog:docs-stack",
    "@tailwindcss/postcss": "catalog:web-stack",
    "@types/node": "catalog:",
    "@types/react": "catalog:web-stack",
    "@types/unist": "catalog:",
    "tsx": "catalog:",
    "typescript": "catalog:",
    "unified": "catalog:"
  },
  "browserslist": {
    "production": [">0.5%", "not dead", "not op_mini all"],
    "development": ["last 3 chrome version", "last 3 firefox version", "last 5 safari version"]
  },
  "engines": {
    "node": ">=20.0"
  }
}
```

---

## 9. Phase 5 — `docs/packages/theme/src/index.ts`

Identical to the Thin Orchestrator defined in the previous plan, now living at the correct path.

```typescript
// docs/packages/theme/src/index.ts
import path from 'path';
import type { LoadContext, Plugin, OptionValidationContext } from '@docusaurus/types';
import type { ThemeConfigValidationContext } from '@docusaurus/types';

import * as themeClassicModule from '@docusaurus/theme-classic';
import * as themeLiveCodeblockModule from '@docusaurus/theme-live-codeblock';
import * as themeMermaidModule from '@docusaurus/theme-mermaid';

export interface PluginOptions {
  [key: string]: unknown;
}

/**
 * Custom Theme Plugin — Thin Orchestrator
 *
 * Registers docs/packages/theme/src/theme/ as the highest-priority component
 * override layer. Only components present in that directory shadow upstream.
 * All other components resolve through @docusaurus/theme-classic automatically.
 */
export default function customThemePlugin(
  _context: LoadContext,
  _options: PluginOptions,
): Plugin<undefined> {
  return {
    name: 'monorepo-custom-theme',

    getThemePath() {
      return './theme';
    },

    getTypeScriptThemePath() {
      return './theme';
    },

    getPathsToWatch() {
      const themePath = path.resolve(__dirname, './theme');
      return [`${themePath}/**/*.{ts,tsx,css}`];
    },
  };
}

export function validateThemeConfig(ctx: ThemeConfigValidationContext<Record<string, unknown>>) {
  let { themeConfig } = ctx;
  const { validate } = ctx;

  if ('validateThemeConfig' in themeClassicModule && themeClassicModule.validateThemeConfig) {
    themeConfig = (themeClassicModule.validateThemeConfig as Function)({ validate, themeConfig });
  }
  if (
    'validateThemeConfig' in themeLiveCodeblockModule &&
    themeLiveCodeblockModule.validateThemeConfig
  ) {
    themeConfig = (themeLiveCodeblockModule.validateThemeConfig as Function)({
      validate,
      themeConfig,
    });
  }
  if ('validateThemeConfig' in themeMermaidModule && themeMermaidModule.validateThemeConfig) {
    themeConfig = (themeMermaidModule.validateThemeConfig as Function)({ validate, themeConfig });
  }

  return themeConfig;
}

export function validateOptions({
  options,
}: OptionValidationContext<PluginOptions, PluginOptions>): PluginOptions {
  return options;
}
```

---

## 10. Phase 6 — `docs/packages/preset/src/index.ts` (Updated)

The `require.resolve('./theme/src/index')` path from the previous plan changes to the
workspace package name, because `@monorepo/docs-theme` is now an independent workspace package.

````typescript
// docs/packages/preset/src/index.ts
import { createRequire } from 'node:module';
import type { Preset, LoadContext, PluginConfig, PluginOptions } from '@docusaurus/types';
import type { MonorepoPresetOptions, ThemeConfig } from './options';
import projectConfig from '@monorepo/shared-config/project.config';

import { createDocsInstances } from './plugins/content-docs/instances';
import { createBlogInstance } from './plugins/content-blog/instances';
import { createPagesInstance } from './plugins/content-pages/instances';
import pluginStudioAssets from './plugins/webpack-loaders/studio-assets';

const require = createRequire(import.meta.url);

function makePluginConfig(
  source: string,
  options?: PluginOptions,
): string | [string, PluginOptions] {
  if (options !== undefined) {
    return [require.resolve(source), options];
  }
  return require.resolve(source);
}

export default function monorepoPreset(
  context: LoadContext,
  opts: MonorepoPresetOptions = {},
): Preset {
  const { siteConfig } = context;
  const { themeConfig } = siteConfig;
  const { algolia } = themeConfig as Partial<ThemeConfig>;
  const isProd = process.env.NODE_ENV === 'production';
  const {
    debug,
    docs,
    blog,
    pages,
    roadmap,
    workspaces,
    sitemap,
    svgr,
    theme = {
      customCss: ['./src/css/custom.css'],
    },
    liveCodeblock,
    gtag,
    googleTagManager,
    ...rest
  } = opts;

  const themes: PluginConfig[] = [];

  // ─── BASE THEME (lowest priority) ────────────────────────────────────────
  // Provides Navbar, Footer, Layout, DocSidebar, CodeBlock, Admonition, TOC.
  // customCss is processed here through webpack's CSS pipeline.
  themes.push(makePluginConfig('@docusaurus/theme-classic', theme));

  // ─── ADD-ON THEMES (extend classic with new components) ───────────────────
  // Overrides CodeBlock for ```jsx live ``` blocks; adds Playground, ReactLiveScope.
  themes.push(makePluginConfig('@docusaurus/theme-live-codeblock', liveCodeblock ?? {}));

  // Adds Mermaid diagram rendering component.
  themes.push(require.resolve('@docusaurus/theme-mermaid'));

  // ─── ALGOLIA SEARCH (optional) ────────────────────────────────────────────
  if (algolia !== undefined) {
    themes.push(require.resolve('@docusaurus/theme-search-algolia'));
  }

  // ─── LOCAL OVERRIDE LAYER (highest priority among registered themes) ───────
  // @monorepo/docs-theme uses the Thin Orchestrator pattern.
  // Only components in packages/theme/src/theme/ shadow upstream implementations.
  // validateThemeConfig chains all three upstream validators automatically.
  themes.push(makePluginConfig(require.resolve('@monorepo/docs-theme'), {}));

  if ('gtag' in themeConfig) {
    throw new Error(
      'The "gtag" field in themeConfig should now be specified as option for plugin-google-gtag.',
    );
  }

  const plugins: PluginConfig[] = [];

  if (siteConfig.future?.v4?.useCssCascadeLayers === true) {
    plugins.push(makePluginConfig('@docusaurus/plugin-css-cascade-layers'));
  }

  plugins.push(...createDocsInstances(opts));
  plugins.push(...createBlogInstance(opts));
  plugins.push(...createPagesInstance(opts));

  if (debug === true || (debug === undefined && isProd === false)) {
    plugins.push(require.resolve('@docusaurus/plugin-debug'));
  }
  if (gtag !== undefined) {
    plugins.push(makePluginConfig('@docusaurus/plugin-google-gtag', gtag));
  }
  if (googleTagManager !== undefined) {
    plugins.push(makePluginConfig('@docusaurus/plugin-google-tag-manager', googleTagManager));
  }
  if (sitemap !== false && (isProd === true || debug === true)) {
    plugins.push(makePluginConfig('@docusaurus/plugin-sitemap', sitemap));
  }
  if (svgr !== false) {
    plugins.push(makePluginConfig('@docusaurus/plugin-svgr', svgr));
  }

  plugins.push(pluginStudioAssets as any);

  if (Object.keys(rest).length > 0) {
    throw new Error(
      `Unrecognized keys ${Object.keys(rest).join(', ')} found in preset configuration.`,
    );
  }

  return { themes, plugins };
}

export type { MonorepoPresetOptions, ThemeConfig };
````

---

## 11. Phase 7 — `docs/services/docusaurus/docusaurus.config.ts` (Updated reference)

The `docusaurus.config.ts` now references `@monorepo/docs-preset` instead of a relative path.

```typescript
// docs/services/docusaurus/docusaurus.config.ts
import type { Config } from '@docusaurus/types';
import { getBaseThemeConfig } from '@monorepo/docs-preset/themeConfig';
import projectConfig from '@monorepo/shared-config/project.config';

const config: Config = {
  // ...
  presets: [
    [
      require.resolve('@monorepo/docs-preset'),
      {
        theme: {
          customCss: ['./src/css/custom.css'],
        },
        liveCodeblock: {
          playgroundPosition: 'bottom',
        },
        // ... other preset options
      },
    ],
  ],
  themeConfig: getBaseThemeConfig(projectConfig),
  // ...
};

export default config;
```

---

## 12. Phase 8 — `docs/tsconfig.json` (Bounded Context Root)

Following `hub/tsconfig.json`:

```json
{
  "files": [],
  "references": [
    { "path": "./packages/preset" },
    { "path": "./packages/theme" },
    { "path": "./services/docusaurus" }
  ]
}
```

---

## 13. pnpm Workspace Registration and Filtering Quick Reference

After adding `'docs/packages/*'` and `'docs/services/*'` to `pnpm-workspace.yaml`, pnpm
automatically discovers all packages matching those globs. The following selectors work:

```bash
# Install all docs workspace packages and their dependencies
pnpm --filter "@monorepo/docs-*..." install

# Build only the Docusaurus service (pulls in preset + theme transitively)
pnpm --filter "@monorepo/docs-docusaurus" build

# Typecheck all docs packages
pnpm --filter "{docs/**}" typecheck

# Build everything changed since origin/develop in the docs tree
pnpm --filter "{docs/**}[origin/develop]..." build
```

The `workspace:*` protocol guarantees that `@monorepo/docs-docusaurus` resolves
`@monorepo/docs-preset` and `@monorepo/docs-theme` to local symlinks, never to the registry.

---

## 14. Phase 9 — GitHub Workflows Update

### `.github/workflows/deploy-docs.yaml`

Three changes required:

1. `paths:` trigger — update to `docs/services/**` and `docs/packages/**`
2. `filter:` — update from `@tupynambalucas/docs...` to `@monorepo/docs-docusaurus...`
3. `directory:` — update from `docs/build` to `docs/services/docusaurus/build`

```yaml
name: Deploy Documentation

on:
  push:
    branches: [develop]
    paths:
      - 'docs/**' # unchanged — covers all docs/**
      - '.github/workflows/deploy-docs.yaml'
      - '.github/actions/deploy-cloudflare-pages/**'
  workflow_dispatch:

permissions:
  contents: write
  deployments: write

concurrency:
  group: 'pages'
  cancel-in-progress: false

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout Repository
        uses: actions/checkout@v4

      - name: Setup PNPM Environment
        uses: ./.github/actions/setup-pnpm-env
        with:
          node-version: 22
          frozen-lockfile: 'false'
          filter: '@monorepo/docs-docusaurus...' # CHANGED from @tupynambalucas/docs...

      - name: Generate Global Documents
        working-directory: docs/services/docusaurus # CHANGED — run in service root
        run: |
          pnpm docs:generate:changelog
          pnpm docs:generate:roadmap

      - name: Commit and Push Compiled Documents
        run: |
          git config --global user.name "github-actions[bot]"
          git config --global user.email "github-actions[bot]@users.noreply.github.com"
          git add CHANGELOG.md ROADMAP.md
          if git diff --staged --quiet; then
            echo "No changes to CHANGELOG.md or ROADMAP.md"
          else
            git commit -m "docs: update root CHANGELOG.md and ROADMAP.md [skip ci]"
            git push
          fi

      - name: Build documentation
        working-directory: docs/services/docusaurus # CHANGED
        run: pnpm build
        env:
          CLOUDFLARE_R2_ASSETS_PUBLIC_URL: ${{ secrets.CLOUDFLARE_R2_ASSETS_PUBLIC_URL }}

      - name: Idempotent Deploy to Cloudflare Pages
        uses: ./.github/actions/deploy-cloudflare-pages
        with:
          api_token: ${{ secrets.CLOUDFLARE_PAGES_API_TOKEN }}
          account_id: ${{ secrets.CLOUDFLARE_ACCOUNT_ID }}
          project_name: ${{ vars.CLOUDFLARE_PAGES_PROJECT_DOCS_NAME }}
          directory: docs/services/docusaurus/build # CHANGED from docs/build
          production_branch: develop
          custom_domain: 'docs.tupynambalucas.dev'
```

---

## 14. Phase 10 — `cortex/memory` Dockerfile and AGENTS.md Update

The `cortex/memory` subsystem copies `docs/` into the `memory-api` Docker image at build time
for vector RAG ingestion. The Dockerfile `COPY` instruction and the `AGENTS.md` documentation
must be updated to reflect the new path.

### `cortex/memory/services/api/Dockerfile` change

```dockerfile
# BEFORE:
COPY docs ./docs

# AFTER — copy only the markdown content, not the service root:
COPY docs/services/docusaurus/handbook ./docs/handbook
COPY docs/services/docusaurus/workspaces ./docs/workspaces
COPY docs/services/docusaurus/roadmap ./docs/roadmap
COPY docs/services/docusaurus/releases ./docs/releases
```

> [!NOTE]
> Alternatively, a single wildcard copy is valid if the memory API scans by file extension
> and ignores non-markdown files. If so, `COPY docs/services/docusaurus ./docs` preserves the
> existing ingestion contract with minimal change. Choose based on what `memory-api`'s file
> walker actually scans.

### `cortex/memory/AGENTS.md` change

Update **Principle 6** (Build-Time Docs Bundling):

```markdown
6. **Build-Time Docs Bundling**: The `docs/services/docusaurus/` directory is copied into the
   `memory-api` Docker image at build time. The `.dockerignore` MUST NOT exclude the markdown
   content directories (`handbook/`, `workspaces/`, `roadmap/`, `releases/`); only transient
   artifacts (`node_modules/`, `.docusaurus/`, `build/`) are excluded.
```

---

## 15. Phase 11 — `cortex/memory/.dockerignore` Update

Ensure the `.dockerignore` does not exclude the new content paths:

```
# docs service transient artifacts (NOT the markdown content)
docs/services/docusaurus/node_modules
docs/services/docusaurus/.docusaurus
docs/services/docusaurus/build
docs/services/docusaurus/.cache
docs/packages/*/node_modules
```

---

## 16. File Migration Map

| Source                          | Destination                                            |
| ------------------------------- | ------------------------------------------------------ |
| `docs/preset/index.ts`          | `docs/packages/preset/src/index.ts`                    |
| `docs/preset/options.ts`        | `docs/packages/preset/src/options.ts`                  |
| `docs/preset/themeConfig.ts`    | `docs/packages/preset/src/themeConfig.ts`              |
| `docs/preset/sidebars/index.ts` | `docs/packages/preset/src/sidebars/index.ts`           |
| `docs/preset/plugins/**`        | `docs/packages/preset/src/plugins/**`                  |
| `docs/src/**`                   | `docs/services/docusaurus/src/**`                      |
| `docs/static/**`                | `docs/services/docusaurus/static/**`                   |
| `docs/handbook/**`              | `docs/services/docusaurus/handbook/**`                 |
| `docs/workspaces/**`            | `docs/services/docusaurus/workspaces/**`               |
| `docs/roadmap/**`               | `docs/services/docusaurus/roadmap/**`                  |
| `docs/releases/**`              | `docs/services/docusaurus/releases/**`                 |
| `docs/i18n/**`                  | `docs/services/docusaurus/i18n/**`                     |
| `docs/scripts/**`               | `docs/services/docusaurus/scripts/**`                  |
| `docs/tooling/**`               | `docs/services/docusaurus/tooling/**`                  |
| `docs/package.json`             | `docs/services/docusaurus/package.json` (rewritten)    |
| `docs/tsconfig.json`            | `docs/services/docusaurus/tsconfig.json`               |
| `docs/docusaurus.config.ts`     | `docs/services/docusaurus/docusaurus.config.ts`        |
| `docs/babel.config.js`          | `docs/services/docusaurus/babel.config.js`             |
| (new)                           | `docs/packages/preset/package.json`                    |
| (new)                           | `docs/packages/preset/tsconfig.json`                   |
| (new)                           | `docs/packages/theme/package.json`                     |
| (new)                           | `docs/packages/theme/tsconfig.json`                    |
| (new)                           | `docs/packages/theme/src/index.ts`                     |
| (new)                           | `docs/packages/theme/src/types.ts`                     |
| (new)                           | `docs/packages/theme/src/theme/.gitkeep`               |
| (new)                           | `docs/tsconfig.json` (bounded context root references) |

---

## 17. Relative Path Audit

After migration, internal relative paths inside the preset and plugin files must be updated.
The following files contain `../../options` or `./index.ts` relative imports that will break:

| File                                            | Current import               | Updated import                                                  |
| ----------------------------------------------- | ---------------------------- | --------------------------------------------------------------- |
| `plugins/content-docs/instances.ts`             | `../../options`              | `../../options` (unchanged — same relative depth within `src/`) |
| `plugins/content-blog/instances.ts`             | `../../options`              | unchanged                                                       |
| `plugins/content-pages/instances.ts`            | `../../options`              | unchanged                                                       |
| `plugins/webpack-loaders/studio-assets.ts`      | `@monorepo/studio-assets`    | unchanged (workspace package)                                   |
| `plugins/content-docs/instances.ts` sidebarPath | `./preset/sidebars/index.ts` | `./src/sidebars/index.ts`                                       |

> [!WARNING]
> The `sidebarPath` passed to `plugin-content-docs` is resolved **relative to the Docusaurus
> service root** (`docs/services/docusaurus/`), not relative to the preset package. After
> migration the preset cannot use a literal path string here — it must use `require.resolve()`
> pointing to the sidebars file inside the preset package.
>
> ```typescript
> // BEFORE (broken after migration — relative to docusaurus service root):
> sidebarPath: './preset/sidebars/index.ts';
>
> // AFTER (correct — resolved to absolute path inside the preset package):
> sidebarPath: require.resolve('./sidebars/index.ts');
> // resolves to: docs/packages/preset/src/sidebars/index.ts
> ```

---

## 18. Swizzle Workflow Update

After migration, the `docusaurus swizzle` command must be run from inside the service root and
moved components placed in the theme package:

```bash
# Run from docs/services/docusaurus/
npx docusaurus swizzle @docusaurus/theme-classic Footer --wrap --typescript
# → Creates: docs/services/docusaurus/src/theme/Footer/index.tsx
# → Move to: docs/packages/theme/src/theme/Footer/index.tsx
```

The `getThemePath()` in `@monorepo/docs-theme` points to `./theme` relative to
`docs/packages/theme/src/index.ts`, which resolves to `docs/packages/theme/src/theme/`.
Any component placed there automatically enters the resolution chain.

---

## 19. Execution Checklist

### Infrastructure

- [ ] Update `pnpm-workspace.yaml` — replace `'docs'` with `'docs/packages/*'` and `'docs/services/*'`
- [ ] Update `docs/tsconfig.json` — add project references for packages and services

### Package scaffolding

- [ ] Create `docs/packages/preset/package.json`
- [ ] Create `docs/packages/preset/tsconfig.json`
- [ ] Create `docs/packages/theme/package.json`
- [ ] Create `docs/packages/theme/tsconfig.json`
- [ ] Create `docs/packages/theme/src/index.ts` (Thin Orchestrator)
- [ ] Create `docs/packages/theme/src/types.ts`
- [ ] Create `docs/packages/theme/src/theme/.gitkeep`

### File migration

- [ ] Move `docs/preset/**` → `docs/packages/preset/src/**`
- [ ] Move `docs/src/**` → `docs/services/docusaurus/src/**`
- [ ] Move `docs/static/**` → `docs/services/docusaurus/static/**`
- [ ] Move `docs/handbook/**` → `docs/services/docusaurus/handbook/**`
- [ ] Move `docs/workspaces/**` → `docs/services/docusaurus/workspaces/**`
- [ ] Move `docs/roadmap/**` → `docs/services/docusaurus/roadmap/**`
- [ ] Move `docs/releases/**` → `docs/services/docusaurus/releases/**`
- [ ] Move `docs/i18n/**` → `docs/services/docusaurus/i18n/**`
- [ ] Move `docs/scripts/**` → `docs/services/docusaurus/scripts/**`
- [ ] Move `docs/tooling/**` → `docs/services/docusaurus/tooling/**`
- [ ] Rewrite `docs/services/docusaurus/package.json`
- [ ] Move and update `docusaurus.config.ts` — change preset import to `@monorepo/docs-preset`

### Preset updates

- [ ] Add `liveCodeblock` option to `options.ts`
- [ ] Update `index.ts` — register four-theme array (classic + live-codeblock + mermaid + local)
- [ ] Update `index.ts` — reference `@monorepo/docs-theme` via `require.resolve()`
- [ ] Fix `sidebarPath` in `plugins/content-docs/instances.ts` — use `require.resolve('./sidebars/index.ts')`

### GitHub Actions

- [ ] Update `.github/workflows/deploy-docs.yaml` — filter, working-directory, build directory

### cortex/memory

- [ ] Update `cortex/memory/services/api/Dockerfile` — `COPY` path for docs content
- [ ] Update `cortex/memory/AGENTS.md` — Principle 6 path reference

### Validation

- [ ] Run `pnpm install` from monorepo root — verify workspace resolution
- [ ] Run `pnpm --filter @monorepo/docs-docusaurus build` — verify full build
- [ ] Run `pnpm --filter @monorepo/docs-docusaurus start` — verify dev server
- [ ] Run `npx docusaurus swizzle --list` from `docs/services/docusaurus/` — verify theme discovery
- [ ] Trigger `deploy-docs` workflow on `develop` push — verify CI path
