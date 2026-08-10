# Cortex Memory Web Dashboard

The `cortex/memory/services/web` workspace contains the Vite + React 19 + Tailwind CSS dashboard (`@tupynambalucas-cortex/memory-web`) for visual inspection of knowledge graphs, episodic chat history, vector similarity search, and documentation synchronization.

---

## Technology Stack

- **Framework**: React 19, Vite
- **Styling**: Tailwind CSS v4, CSS Modules
- **State Management**: Zustand
- **Visualization**: `react-force-graph-2d`, Lucide React
- **Port**: `9006`

---

## Application Structure (Feature-Sliced Design)

```
services/web/src/
├── components/          # Reusable shared UI layout components (Sidebar, Card, Badge)
├── domains/
│   └── memory/         # Zustand store and Axios API integration
├── features/
│   ├── chat-memory/    # Episodic conversation inspector
│   ├── docs-sync/      # Knowledge base sync status view
│   ├── graph-explorer/ # 2D Force-directed knowledge graph explorer
│   └── vector-playground/ # Live vector search playground
├── types/              # Vite and CSS Module definitions
├── App.tsx             # Main application layout and view router
└── main.tsx            # React DOM mounting entry point
```

---

## Development Scripts

- `pnpm dev`: Launches Vite development server at `http://localhost:9006`.
- `pnpm build`: Compiles production web bundle into `dist/`.
- `pnpm preview`: Serves production build locally on port `9006`.
- `pnpm typecheck`: Validates TypeScript types without emitting files.
- `pnpm lint`: Runs ESLint validation.
