FROM node:20-alpine

WORKDIR /app

RUN npm install -g @upstash/context7-mcp

# Install runtime dependencies and tsx for TypeScript execution
RUN npm install fastify@^5.7.4 @fastify/sse@^0.4.0 tsx@^4.19.3

# Copy the TypeScript SSE adapter
COPY services/common/sse-adapter.ts ./sse-adapter.ts

ENV PORT=3002
ENV MCP_COMMAND=context7-mcp

CMD ["npx", "tsx", "sse-adapter.ts"]