FROM node:22-slim AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=8080

RUN npm install -g @upstash/context7-mcp@latest

EXPOSE 8080

CMD ["context7-mcp", "--transport", "http", "--port", "8080"]