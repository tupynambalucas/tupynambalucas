FROM node:20-bookworm

# Install Playwright dependencies and Google Chrome
RUN npx -y playwright@1.58.2 install --with-deps chrome

# Install the community proxy
RUN npm install -g mcp-proxy

EXPOSE 8080

ENTRYPOINT ["mcp-proxy", "--port", "8080", "--", "npx", "-y", "@playwright/mcp"]
