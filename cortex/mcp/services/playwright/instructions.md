# Playwright MCP Agent Instructions

## 1. Domain Scope

The Playwright MCP server provides headless browser automation using Chromium. Use these tools to inspect web pages, evaluate UI layouts, and extract structural accessibility trees.

---

## 2. Environment & Network Routing Rules

- **Local Host Server Resolution**: When navigating to local development applications running on the
  developer's host machine, ALWAYS substitute `localhost` or `127.0.0.1` with `host.docker.internal`.
- **Automatic Target URL Mapping**: Agents MUST automatically resolve and navigate to local
  applications using the following mapping. Do not query the user for URLs:
  - **docs** (Docusaurus dev server): `http://host.docker.internal:3002`
  - **hub-web** (Vite/React dev server): `http://host.docker.internal:5173`
  - **hub-api** (Fastify REST API): `http://host.docker.internal:3000`

---

## 3. Tool Execution Best Practices

- **Snapshot vs. Screenshot**: Prefer `browser_snapshot` for inspecting text, DOM elements, and structural accessibility trees to conserve tokens. Use `browser_take_screenshot` only when visual layout evaluation is strictly necessary.
- **Form Filling**: Prefer `browser_fill_form` to fill multiple form inputs in a single operation rather than invoking `browser_type` repeatedly.
- **Resource Cleanup**: ALWAYS call `browser_close` when completing a browser testing session to release memory resources inside the container.
