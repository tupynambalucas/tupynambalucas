# Local Context: Studio Design System & Assets Package

This workspace directory ([assets/](./)) contains the centralized brand identity assets, design tokens, theme configurations, and SVG icon components (`@tupynambalucas-studio/assets`) for the tupynambalucas.dev monorepo.

---

## 1. Package Structure

- **[tokens/](./tokens/)**: Canonical design tokens, theme variables, and styling entry points:
  - **[colors.ts](./tokens/colors.ts)**: Color palette definitions.
  - **[tokens.css](./tokens/tokens.css)**: Core design token variables.
  - **[theme.css](./tokens/theme.css)**: Tailwind CSS zero-runtime theme configuration.
- **[icons/](./icons/)**: Scoped React SVG icon components exported via `@tupynambalucas-studio/assets/icons`.
- **[brand/](./brand/)**: Vector logos ([brand/logos/](./brand/logos/)) and favicons.
- **[images/](./images/)**: Static image assets.
- **[three/](./three/)**: 3D web graphics assets.
- **[assets-manifest.json](./assets-manifest.json)**: Manifest index describing design system assets.

---

## 2. Operational Guardrails

- **Token Invariance**: Brand CSS color tokens and variables MUST be maintained in this package. AI agents MUST NEVER define hardcoded hex values in local application CSS modules.
- **SVG Optimization**: Vector icons added to `icons/` MUST be optimized SVGs wrapped as React components.
- **Export Paths**: Package export mappings are declared in [package.json](./package.json).
