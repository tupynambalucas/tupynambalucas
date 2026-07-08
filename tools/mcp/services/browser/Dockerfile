FROM node:20-bookworm

# Install Playwright dependencies and Google Chrome
RUN npx -y playwright@1.58.2 install --with-deps chrome

WORKDIR /app

# Install runtime dependencies and tsx for TypeScript execution
RUN npm install fastify@^5.7.4 @fastify/sse@^0.4.0 tsx@^4.19.3

# Copy the TypeScript SSE adapter
COPY services/common/sse-adapter.ts ./sse-adapter.ts

ENV PORT=3003
ENV MCP_COMMAND=npx
ENV MCP_ARGS='["-y", "@playwright/mcp"]'

CMD ["npx", "tsx", "sse-adapter.ts"]
