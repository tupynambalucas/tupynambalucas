FROM node:22-alpine

RUN apk add --no-cache chromium nss freetype harfbuzz ca-certificates ttf-freefont

WORKDIR /app

RUN npm install -g @playwright/mcp@latest

EXPOSE 8080

ENV PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH=/usr/bin/chromium-browser

ENTRYPOINT ["npx", "-y", "@playwright/mcp", "--port", "8080", "--host", "0.0.0.0", "--headless", "--no-sandbox", "--allowed-hosts", "*", "--browser", "chromium", "--executable-path", "/usr/bin/chromium-browser"]
