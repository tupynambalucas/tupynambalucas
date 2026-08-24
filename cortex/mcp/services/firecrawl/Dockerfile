FROM node:22-alpine

WORKDIR /app

RUN npm install -g firecrawl-mcp@latest && \
    node -e "const fs = require('fs'); const path = '/usr/local/lib/node_modules/firecrawl-mcp/node_modules/@modelcontextprotocol/server/dist/mcp-DXXb3Vv3.mjs'; if (fs.existsSync(path)) { let c = fs.readFileSync(path, 'utf8'); c = c.replace('!server._supportedProtocolVersions.includes(version)', '!((server._supportedProtocolVersions || []).includes(version))'); c = c.replace('server._supportedProtocolVersions = [...server._supportedProtocolVersions, ...missing]', 'server._supportedProtocolVersions = [...(server._supportedProtocolVersions || []), ...missing]'); fs.writeFileSync(path, c); }"

ENV HTTP_STREAMABLE_SERVER=true
ENV HOST=0.0.0.0
ENV FASTMCP_HOST=0.0.0.0
ENV PORT=8080

EXPOSE 8080

ENTRYPOINT ["firecrawl-mcp"]
