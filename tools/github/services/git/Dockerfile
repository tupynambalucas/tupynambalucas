# =================================================================== #
# tools/github/services/git — Git command line containerized service
# =================================================================== #

# ---- Stage 1: Base ----
FROM alpine:3.18 AS base

# Install necessary tools for git command line, including git-flow (AVH Edition)
RUN apk add --no-cache \
    git \
    git-flow \
    bash \
    openssh-client \
    ca-certificates

WORKDIR /workspace

COPY entrypoint.sh /usr/local/bin/entrypoint.sh
RUN chmod +x /usr/local/bin/entrypoint.sh

# ---- Stage 2: Dev Profile ----
FROM base AS dev
ENTRYPOINT ["/usr/local/bin/entrypoint.sh"]
CMD ["/bin/bash"]

# ---- Stage 3: Prod Profile ----
FROM base AS prod
ENTRYPOINT ["/usr/local/bin/entrypoint.sh"]
CMD ["/bin/bash"]

