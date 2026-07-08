# Local Context: Instance Web Client Application

This workspace (`@tupynambalucas-hub/web`) contains the React 19 Single Page Application client for community shop and administration operations.

---

## Local Architecture & Directory Map

The client layout under `src/` is organized according to Domain-Driven Design (DDD) and Feature-Sliced Design (FSD) hybrid guidelines:

- **[src/domains/](./src/domains/)**: Global business domains (e.g. `auth/`, `product/`, `cycle/`):
  - Stores: Zustand state store definitions (`auth.store.ts`).
  - Hooks: Atomic state selectors and derived calculations (`hooks/useAuth.ts`).
- **[src/features/](./src/features/)**: Feature modules representing isolated user workflows:
  - `admin/`: Cycle management, raw catalog parser ingestion dashboard.
  - `shop/`: Product catalog grid, cart, and Pix payment modal.
- **[src/shared/ui/](./src/shared/ui/)**: Reusable, domain-agnostic UI elements (buttons, loaders, fields).
- **[src/assets/](./src/assets/)**: Static icons, styles, and locales.

---

## Web Coding Guardrails

### A. Zustand Atomic Selectors Pattern

To prevent redundant rendering, stores MUST separate properties from actions. Components MUST consume state via atomic selector hooks:

```typescript
// Define Store
export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  actions: { setUser: (user) => set({ user }) },
}));

// Atomic Selector Hooks
export const useAuthUser = () => useAuthStore((state) => state.user);
export const useAuthActions = () => useAuthStore((state) => state.actions);
```

### B. Explicit JSX Render Checks

Always use explicit comparisons in JSX rendering conditions to prevent parsing bugs:

- **Correct**: `{isValid === true && <Modal />}` or `{items.length > 0 && <List />}`.
- **Incorrect**: `{isValid && <Modal />}` or `{items.length && <List />}`.

### C. Styling and Fluid Design (CSS Modules)

- **No Pixels (`px`)**: Spacing, sizing, and typography MUST use relative units (`rem`, `em`, `vw/vh`, or percentages). `1px` is allowed _only_ for hairline borders.
- **Fluid Layouts**: Leverage CSS Modules (`.module.css`) and relative functions (`clamp()`, `calc()`, `min()`, `max()`) for responsive layout scalability.
- **Tailwind Integration**: Tailwind classes are permitted inside CSS Modules using `@apply`.

```css
.card {
  padding: clamp(1rem, 3vw, 2rem);
  border: 1px solid var(--color-border-light);
}
```

### D. Build Constraints

- **Console Log Prohibitions**: Any instance of `console.log` will fail production builds. Use `console.info`, `console.warn`, or `console.error` for runtime logging.
- **React 19 Hook Usage**: Consume promises/context using the native `use()` hook when possible. Never read or mutate `ref.current` during rendering.

---

## Local Lifecycle Commands

- `pnpm dev`: Runs local Vite development server with proxy routing at `http://localhost:5173`.
- `pnpm build`: Performs type-checking and builds static optimized assets into `dist/`.
- `pnpm typecheck`: Validates TypeScript type safety.
- `pnpm lint`: Runs ESLint validation.
