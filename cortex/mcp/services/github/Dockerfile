FROM ghcr.io/github/github-mcp-server:latest

ARG GITHUB_PERSONAL_ACCESS_TOKEN
ENV GITHUB_PERSONAL_ACCESS_TOKEN=$GITHUB_PERSONAL_ACCESS_TOKEN

EXPOSE 8080

ENTRYPOINT ["/server/github-mcp-server", "http", "--listen-host", "0.0.0.0", "--port", "8080"]