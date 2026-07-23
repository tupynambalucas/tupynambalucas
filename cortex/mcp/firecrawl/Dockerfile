FROM node:22-alpine

WORKDIR /app

RUN npm install -g firecrawl-mcp@latest

ENV HTTP_STREAMABLE_SERVER=true
ENV HOST=0.0.0.0
ENV FASTMCP_HOST=0.0.0.0
ENV PORT=8080

EXPOSE 8080

ENTRYPOINT ["firecrawl-mcp"]
