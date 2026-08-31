# Playwright MCP Service

The `cortex/mcp/services/playwright` workspace provides the containerized Playwright Model Context Protocol (MCP) server for headless browser automation, UI navigation, and DOM accessibility inspection.

---

## Technology Stack

- **Base Image**: Node.js 22 Alpine with Chromium dependencies (`nss`, `freetype`, `harfbuzz`, `ttf-freefont`, `chromium`)
- **Package**: `@playwright/mcp@latest`
- **Browser Engine**: Chromium headless (via Alpine repository)
- **Transport**: Streamable HTTP on port `8080`

---

## Features

- **Structural Snapshots**: Accessibility tree snapshots via `browser_snapshot` for token-efficient page inspection.
- **Interactive UI Testing**: Mouse clicks, form filling, text typing, and drag-and-drop operations.
- **Network & Console Monitoring**: Captures live console messages and network requests.
- **Host Connectivity**: Automatically resolves local developer services via `host.docker.internal`.

---

## Configuration & Environment

| Variable                       | Default   | Purpose                                   |
| :----------------------------- | :-------- | :---------------------------------------- |
| `PLAYWRIGHT_MCP_PORT`          | `8080`    | Server listening port                     |
| `PLAYWRIGHT_MCP_HOST`          | `0.0.0.0` | Network binding interface                 |
| `PLAYWRIGHT_MCP_HEADLESS`      | `true`    | Runs browser without GUI window           |
| `PLAYWRIGHT_MCP_NO_SANDBOX`    | `true`    | Enables execution inside Linux containers |
| `PLAYWRIGHT_MCP_ALLOWED_HOSTS` | `*`       | Host header validation allowlist          |
