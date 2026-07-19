FROM node:22-bookworm-slim

# Install system dependencies and Docker CLI
# sha512sum is provided by coreutils, which is pre-installed in debian base
RUN apt-get update && apt-get install -y \
    git \
    openssh-client \
    curl \
    gnupg \
    ca-certificates \
    && mkdir -p -m 755 /etc/apt/keyrings \
    # Install Docker CLI keyring and repository
    && curl -fsSL https://download.docker.com/linux/debian/gpg | gpg --dearmor -o /etc/apt/keyrings/docker.gpg \
    && chmod a+r /etc/apt/keyrings/docker.gpg \
    && echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/debian bookworm stable" | tee /etc/apt/sources.list.d/docker.list > /dev/null \
    && apt-get update \
    && apt-get install -y docker-ce-cli \
    && rm -rf /var/lib/apt/lists/*

# Install pnpm globally via npm
RUN npm install -g pnpm@11.1.2

# Install the Antigravity CLI using the official installer script
# --dir /usr/local/bin places the binary in the system PATH without requiring .bashrc changes
RUN curl -fsSL https://antigravity.google/cli/install.sh | bash -s -- --dir /usr/local/bin

WORKDIR /workspace

# Keep container alive in background; entrypoint is provided via docker exec
CMD ["tail", "-f", "/dev/null"]
