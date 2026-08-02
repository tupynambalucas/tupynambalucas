FROM node:22-alpine

RUN apk add --no-cache nss freetype harfbuzz ca-certificates ttf-freefont

WORKDIR /app

RUN npm install -g @playwright/mcp@latest && \
    npx @playwright/mcp install-browser chrome-for-testing

EXPOSE 8080

ENTRYPOINT ["npx", "@playwright/mcp", "--port", "8080", "--host", "0.0.0.0", "--headless", "--no-sandbox", "--allowed-hosts", "*"]
