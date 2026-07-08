FROM alpine:3.18

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

ENTRYPOINT ["/usr/local/bin/entrypoint.sh"]
CMD ["/bin/bash"]

