# Studio Design System & Assets Package

The `studio/assets` package (`@tupynambalucas-studio/assets`) exports brand identity assets, design system tokens, CSS theme definitions, and React SVG icon components.

---

## Package Contents

- **[tokens/](./tokens/)**: CSS variables, color scales, and Tailwind theme configuration.
- **[icons/](./icons/)**: React SVG icon library.
- **[brand/](./brand/)**: SVG logos and identity mark source files.
- **[three/](./three/)**: 3D scene assets.
- **[assets-manifest.json](./assets-manifest.json)**: Asset inventory manifest.

---

## Usage in Monorepo

Import styles and components directly in consuming applications:

```tsx
import { IconGithub } from '@tupynambalucas-studio/assets/icons';
import '@tupynambalucas-studio/assets/theme.css';
```

---

## Development Scripts

- `pnpm typecheck`: Validates TypeScript type compliance across assets and token exports.
- `pnpm lint`: Runs ESLint checks.
