# PROFESSIONAL MULTI-STAGE DOCKERFILE FOR DOCKER HUB MCP SERVER
# Repository: https://github.com/docker/hub-mcp

# --- Build Stage ---
FROM node:22-slim AS builder

# Install git for cloning
RUN apt-get update && apt-get install -y git && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Clone the official repository
RUN git clone https://github.com/docker/hub-mcp.git .

# Install all dependencies (including devDependencies for build)
RUN npm install

# Build the project (generates dist/ folder)
RUN npm run build

# Prune development dependencies to keep the image slim
RUN npm prune --omit=dev


# --- Runtime Stage ---
FROM node:22-slim

WORKDIR /app

# Copy only the necessary files from the builder stage
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

# Install runtime dependencies and tsx for TypeScript execution
RUN npm install fastify@^5.7.4 @fastify/sse@^0.4.0 tsx@^4.19.3

# Copy the TypeScript SSE adapter
COPY services/common/sse-adapter.ts ./sse-adapter.ts

ENV PORT=3004
ENV MCP_COMMAND=node

# Use a shell entrypoint to construct the MCP_ARGS JSON array dynamically based on env vars
ENTRYPOINT ["sh", "-c", "if [ -n \"$HUB_USERNAME\" ]; then export MCP_ARGS=\"[\\\"dist/index.js\\\", \\\"--transport=stdio\\\", \\\"--username\\\", \\\"$HUB_USERNAME\\\"]\"; else export MCP_ARGS=\"[\\\"dist/index.js\\\", \\\"--transport=stdio\\\"]\"; fi; exec npx tsx sse-adapter.ts"]
