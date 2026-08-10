# Local Context: Cortex Memory Web Dashboard

This workspace directory ([web/](./)) contains the React + Vite frontend application (`@tupynambalucas-cortex/memory-web`) for the Cortex Memory Subsystem.

---

## 1. Feature-Sliced Design (FSD) Layout

- **[src/features/](./src/features/)**: User-facing feature modules:
  - **[graph-explorer/](./src/features/graph-explorer/)**: Interactive 2D force-directed knowledge graph visualization ([GraphExplorer/index.tsx](./src/features/graph-explorer/components/GraphExplorer/index.tsx), [NodeDetailDrawer/index.tsx](./src/features/graph-explorer/components/NodeDetailDrawer/index.tsx)).
  - **[vector-playground/](./src/features/vector-playground/)**: Vector search testing, score thresholding, and live similarity query UI ([VectorPlayground/index.tsx](./src/features/vector-playground/components/VectorPlayground/index.tsx)).
  - **[chat-memory/](./src/features/chat-memory/)**: Episodic chat session inspector and turn timeline ([ChatMemoryView/index.tsx](./src/features/chat-memory/components/ChatMemoryView/index.tsx)).
  - **[docs-sync/](./src/features/docs-sync/)**: Real-time documentation synchronization trigger and indexing status view ([DocsSyncStatus/index.tsx](./src/features/docs-sync/components/DocsSyncStatus/index.tsx)).
- **[src/domains/](./src/domains/)**: Domain state management and HTTP API client:
  - **[memory/](./src/domains/memory/)**: Memory domain Zustand store ([memory.store.ts](./src/domains/memory/memory.store.ts)) and Axios API client ([memory.api.ts](./src/domains/memory/memory.api.ts)).
- **[src/components/](./src/components/)**: Reusable UI layout components (Sidebar, Card, Badge, Button).
- **[nginx.conf](./nginx.conf)**: Nginx configuration for production container hosting.
- **[Dockerfile](./Dockerfile)**: Multi-stage Docker build packaging Vite static assets with Nginx.

---

## 2. Web Coding & Operational Guardrails

- **FSD Dependency Hierarchy**: Unidirectional import rules MUST be enforced (`features` -> `domains` -> `components`). Cross-feature or reverse imports are forbidden.
- **API Resolution**: Resolves Fastify API endpoints via `VITE_API_URL` environment configuration (defaults to `http://localhost:3006/api/memory`).
- **Zustand Selector Pattern**: Components MUST use individual atomic selectors when accessing Zustand state to prevent unnecessary re-renders.
- **Explicit JSX Checks**: In React 19 TSX files, always use explicit boolean/length checks (e.g. `items.length > 0 && <Component />`).

---

## 3. Scoped Operations

- `pnpm --filter @tupynambalucas-cortex/memory-web dev`: Starts Vite dev server on port `9006`.
- `pnpm --filter @tupynambalucas-cortex/memory-web build`: Compiles production web bundle into `dist/`.
- `pnpm --filter @tupynambalucas-cortex/memory-web preview`: Serves built distribution locally on port `9006`.
- `pnpm --filter @tupynambalucas-cortex/memory-web typecheck`: Validates TypeScript type compliance.
- `pnpm --filter @tupynambalucas-cortex/memory-web lint`: Runs ESLint validation.
