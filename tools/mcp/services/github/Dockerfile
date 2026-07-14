FROM node:20-alpine

# Copy the pre-compiled Go binary from the official image
COPY --from=ghcr.io/github/github-mcp-server:latest /server/github-mcp-server /server/github-mcp-server

# Install the community proxy
RUN npm install -g mcp-proxy

EXPOSE 8080

ENTRYPOINT ["mcp-proxy", "--port", "8080", "--", "/server/github-mcp-server", "stdio"]