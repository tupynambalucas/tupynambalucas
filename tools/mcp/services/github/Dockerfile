FROM node:20-alpine

# Copy the pre-compiled Go binary from the official image
COPY --from=ghcr.io/github/github-mcp-server:latest /server/github-mcp-server /server/github-mcp-server

WORKDIR /app

# Install runtime dependencies and tsx for TypeScript execution
RUN npm install fastify@^5.7.4 @fastify/sse@^0.4.0 tsx@^4.19.3

# Copy the TypeScript SSE adapter
COPY services/common/sse-adapter.ts ./sse-adapter.ts

# Expose port and configure the wrapper to run the GitHub binary
ENV PORT=3001
ENV MCP_COMMAND=/server/github-mcp-server
ENV MCP_ARGS='["stdio"]'

CMD ["npx", "tsx", "sse-adapter.ts"]