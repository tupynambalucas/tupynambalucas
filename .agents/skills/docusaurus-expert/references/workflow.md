# Docs Hub Documentation Workflow

This reference defines the compilation, localization, and single-pass alignment validation protocols for the Docusaurus Docs Hub.

---

## 1. i18n Translation Protocol

To support multi-language parity, follow these rules when editing or creating documentation:

- **100% Parity Check**: For every modified or new English document under the docs hub, you must create or update the corresponding Portuguese (`pt-BR`) file inside `docs/i18n/pt-BR/` in the correct plugin subdirectory:
  - Files under `docs/handbook/` -> `docs/i18n/pt-BR/docusaurus-plugin-content-docs/current/...`
  - Files under `docs/roadmap/` -> `docs/i18n/pt-BR/docusaurus-plugin-content-docs-roadmap/current/...`
  - Files under `docs/workspaces/` -> `docs/i18n/pt-BR/docusaurus-plugin-content-docs-workspaces/current/...`
- **Unescaped Elements**: Frontmatter keys, JSX component names, JSX props, and custom code block variables must be left completely untranslated.

---

## 2. Deferred Validation Pipeline

To optimize execution and avoid redundant checks, you MUST NOT run formatting, linting, typechecking, or compilation commands during intermediate edits. Batch all file creations and modifications, then execute this strict pipeline exactly once from the monorepo root:

### Step 1: Prettier Formatting Check

Verify and fix MDX formatting using Prettier:

```bash
# Verify formatting for all changed MDX/Markdown files
pnpm exec prettier --check docs/**/*.mdx

# Fix formatting if errors are found
pnpm exec prettier --write docs/**/*.mdx
```

### Step 2: MDX & Code Linting

Run ESLint to validate MDX syntax, JS/TS segments, and code blocks:

```bash
pnpm docs:lint
```

### Step 3: TypeScript Validation

Ensure type-safety of custom TS/JSX components, config files, and loaders:

```bash
pnpm docs:typecheck
```

### Step 4: Stop any Active Dev Server

To compile the site in production, the dev server must not be running on port 3002. If it is active, the custom build script will skip compiling to prevent a crash. Force stop it:

```bash
pnpm docs:down
```

### Step 5: Execute Production Build & link Checking

Run the full production compilation to verify pages and find any broken links or MDX parsing errors:

```bash
pnpm docs:build
```

Verify that the command exits with code `0`. Any broken markdown links or unresolved components will trigger a throw, halting the build.

---

## 3. Post-Task Guardrails

- **No Dev Server Auto-Start**: Do NOT run `pnpm docs:dev` or `pnpm docs:preview` after completing the changes. The skill's verification process ends with a successful production build test.
