FROM node:22-bookworm-slim

# Install system dependencies, Docker CLI, and GitHub CLI
RUN apt-get update && apt-get install -y \
    git \
    openssh-client \
    curl \
    gnupg \
    ca-certificates \
    && mkdir -p -m 755 /etc/apt/keyrings \
    # Install GitHub CLI keyring and repository
    && curl -fsSL https://cli.github.com/packages/githubcli-archive-keyring.gpg | tee /etc/apt/keyrings/githubcli-archive-keyring.gpg > /dev/null \
    && chmod go+r /etc/apt/keyrings/githubcli-archive-keyring.gpg \
    && echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/githubcli-archive-keyring.gpg] https://cli.github.com/packages stable main" | tee /etc/apt/sources.list.d/github-cli.list > /dev/null \
    # Install Docker CLI keyring and repository
    && curl -fsSL https://download.docker.com/linux/debian/gpg | gpg --dearmor -o /etc/apt/keyrings/docker.gpg \
    && chmod a+r /etc/apt/keyrings/docker.gpg \
    && echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/debian bookworm stable" | tee /etc/apt/sources.list.d/docker.list > /dev/null \
    && apt-get update \
    && apt-get install -y gh docker-ce-cli \
    && rm -rf /var/lib/apt/lists/*

# Install pnpm and the GitHub Copilot CLI
# Correct npm package name is @github/copilot (not @github/copilot-cli)
RUN npm install -g pnpm@11.1.2 @github/copilot

WORKDIR /workspace

# Keep container alive in background; entrypoint is provided via docker exec
CMD ["tail", "-f", "/dev/null"]
