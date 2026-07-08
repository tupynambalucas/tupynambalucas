FROM node:20-alpine

WORKDIR /app

# Install runtime dependencies and tsx for TypeScript execution
RUN npm install fastify@^5.7.4 @fastify/sse@^0.4.0 tsx@^4.19.3

# Copy the TypeScript SSE adapter
COPY services/common/sse-adapter.ts ./sse-adapter.ts

# Expose port and configure the wrapper to run firecrawl
ENV PORT=3006
ENV MCP_COMMAND=npx
ENV MCP_ARGS='["-y", "firecrawl-mcp"]'

CMD ["npx", "tsx", "sse-adapter.ts"]
