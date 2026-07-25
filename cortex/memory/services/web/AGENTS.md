# Local Context: Cortex Memory Web Dashboard

This workspace directory ([web/](./)) contains the React + Vite frontend application (`@tupynambalucas-cortex/memory-web`) for the Cortex Memory Subsystem.

---

## 1. Feature-Sliced Design (FSD) Layout

- **[src/features/](./src/features/)**: User-facing feature modules:
  - **[graph-explorer/](./src/features/graph-explorer/)**: Interactive 2D force-directed knowledge graph visualization ([GraphExplorer](./src/features/graph-explorer/components/GraphExplorer/index.tsx)).
- **[src/domains/](./src/domains/)**: Domain state management and HTTP API client:
  - **[memory/](./src/domains/memory/)**: Memory domain Zustand store ([memory.store.ts](./src/domains/memory/memory.store.ts)) and Axios API client ([memory.api.ts](./src/domains/memory/memory.api.ts)).
- **[src/components/](./src/components/)**: Reusable UI layout components (Sidebar, TopBar).

---

## 2. Operational & Design Guardrails

- **FSD Dependency Hierarchy**: Unidirectional import rules MUST be enforced (`features` -> `domains` -> `components`). Cross-feature or reverse imports are forbidden.
- **API Resolution**: Resolves Fastify API endpoints via `VITE_API_URL` environment configuration (defaults to `http://localhost:3006/api/memory`).
