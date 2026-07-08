FROM alpine:3.18

# Install necessary tools for github-cli: bash, jq, github-cli, git, nodejs, npm, and ca-certificates
RUN apk add --no-cache \
    bash \
    jq \
    github-cli \
    git \
    nodejs \
    npm \
    ca-certificates

# Install pnpm globally
RUN npm install -g pnpm@11.1.2

WORKDIR /workspace

COPY scripts/entrypoint.sh /usr/local/bin/entrypoint.sh
RUN chmod +x /usr/local/bin/entrypoint.sh

ENTRYPOINT ["/usr/local/bin/entrypoint.sh"]
CMD ["/bin/bash"]


