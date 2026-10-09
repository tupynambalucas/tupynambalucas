FROM ducktors/turborepo-remote-cache:latest

# Expose the default server port
EXPOSE 3000

# We pass runtime environment variables via env_file in docker-compose

# Create the local storage directory and set permissions if using "local" provider
USER root
RUN mkdir -p /data/cache && chown -R app:app /data/cache
USER app

# The start command is handled automatically by the base image entrypoint (tini + node)