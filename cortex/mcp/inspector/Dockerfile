FROM node:22-alpine

WORKDIR /app

RUN npm install -g @modelcontextprotocol/inspector@latest

COPY cortex/mcp/inspector/mcp.json /app/mcp.json

ENV HOST=0.0.0.0
ENV MCP_AUTO_OPEN_ENABLED=false
ENV DANGEROUSLY_OMIT_AUTH=true
ENV DANGEROUSLY_BIND_ALL_INTERFACES=true

EXPOSE 6274 6277

ENTRYPOINT ["npx", "@modelcontextprotocol/inspector", "--config", "/app/mcp.json"]
