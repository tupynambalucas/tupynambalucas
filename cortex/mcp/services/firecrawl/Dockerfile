FROM node:22-alpine

WORKDIR /app

RUN npm install -g firecrawl-mcp@latest

ENV HTTP_STREAMABLE_SERVER=true
ENV HOST=0.0.0.0
ENV FASTMCP_HOST=0.0.0.0
ENV PORT=8080
COPY cortex/mcp/services/firecrawl/proxy.js ./

EXPOSE 8080

ENTRYPOINT ["node", "proxy.js"]
