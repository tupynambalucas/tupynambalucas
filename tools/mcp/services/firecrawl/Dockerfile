FROM node:22-alpine

RUN npm install -g mcp-proxy

EXPOSE 8080

ENTRYPOINT ["mcp-proxy", "--port", "8080", "--", "npx", "-y", "firecrawl-mcp"]
