# =================================================================== #
# hub/cortex/mcp/services/playwright — Playwright MCP service
# =================================================================== #

# ---- Stage 1: Base ----
FROM node:22-alpine AS base

RUN apk add --no-cache chromium nss freetype harfbuzz ca-certificates ttf-freefont

WORKDIR /app

RUN npm install -g @playwright/mcp@latest

EXPOSE 8080
ENV PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH=/usr/bin/chromium-browser

# ---- Stage 2: Dev Profile ----
FROM base AS dev
ENTRYPOINT ["npx", "-y", "@playwright/mcp", "--port", "8080", "--host", "0.0.0.0", "--headless", "--no-sandbox", "--allowed-hosts", "*", "--browser", "chromium", "--executable-path", "/usr/bin/chromium-browser"]

# ---- Stage 3: Prod Profile ----
FROM base AS prod
ENTRYPOINT ["npx", "-y", "@playwright/mcp", "--port", "8080", "--host", "0.0.0.0", "--headless", "--no-sandbox", "--allowed-hosts", "*", "--browser", "chromium", "--executable-path", "/usr/bin/chromium-browser"]
