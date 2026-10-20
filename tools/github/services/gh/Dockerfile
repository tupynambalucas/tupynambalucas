# =================================================================== #
# tools/github/services/gh — GitHub CLI containerized service
# =================================================================== #

# ---- Stage 1: Base ----
FROM alpine:3.18 AS base

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

# ---- Stage 2: Dev Profile ----
FROM base AS dev
ENTRYPOINT ["/usr/local/bin/entrypoint.sh"]
CMD ["/bin/bash"]

# ---- Stage 3: Prod Profile ----
FROM base AS prod
ENTRYPOINT ["/usr/local/bin/entrypoint.sh"]
CMD ["/bin/bash"]


