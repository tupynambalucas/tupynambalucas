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

RUN npm install -g mcp-proxy

EXPOSE 8080

ENTRYPOINT ["sh", "-c", "if [ -n \"$HUB_USERNAME\" ]; then mcp-proxy --port 8080 -- node dist/index.js --transport=stdio --username \"$HUB_USERNAME\"; else mcp-proxy --port 8080 -- node dist/index.js --transport=stdio; fi"]
