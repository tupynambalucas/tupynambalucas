# Cortex Memory Web Dashboard

The `services/web` directory contains the Vite + React + Tailwind CSS dashboard (`@tupynambalucas-cortex/memory-web`) for inspecting knowledge graphs, chat history, and vector search results.

---

## Application Structure

- **[src/features/](./src/features/)**: Feature-Sliced Design UI components (Graph Explorer, Search, History).
- **[src/domains/](./src/domains/)**: Domain API integrations and Zustand state stores.
- **[src/components/](./src/components/)**: Core layout components.

---

## Development Scripts

- `pnpm dev`: Launches Vite development server at `http://localhost:9006`.
- `pnpm build`: Compiles production web bundle into `dist/`.
- `pnpm preview`: Serves production build locally.
- `pnpm typecheck`: Validates TypeScript types without emitting files.
