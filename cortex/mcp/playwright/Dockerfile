FROM node:22-alpine

RUN apk add --no-cache nss freetype harfbuzz ca-certificates ttf-freefont

WORKDIR /app

RUN npm install -g @playwright/mcp@latest && \
    npx playwright install chromium-headless-shell

EXPOSE 8080

ENTRYPOINT ["npx", "@playwright/mcp"]
