FROM node:20-alpine

RUN npm install -g mcp-proxy @upstash/context7-mcp

EXPOSE 8080

ENTRYPOINT ["mcp-proxy", "--port", "8080", "--", "context7-mcp"]