FROM grafana/mcp-grafana:latest

ARG GRAFANA_URL
ARG GRAFANA_SERVICE_ACCOUNT_TOKEN

ENV GRAFANA_URL=$GRAFANA_URL
ENV GRAFANA_SERVICE_ACCOUNT_TOKEN=$GRAFANA_SERVICE_ACCOUNT_TOKEN

# AgentGateway expects the MCP services to run on port 8080.
EXPOSE 8080

# Use CMD to append arguments to the default ENTRYPOINT (which is /app/mcp-grafana).
# Define the transport streamable-http, the port, and allow any host/origin.
CMD ["-t", "streamable-http", "--address", "0.0.0.0:8080", "-allowed-hosts", "*", "-allowed-origins", "*"]
