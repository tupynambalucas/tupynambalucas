FROM grafana/mcp-grafana:latest

# AgentGateway expects the MCP services to run on port 8080.
EXPOSE 8080

# Use CMD to append arguments to the default ENTRYPOINT (which is /app/mcp-grafana).
# Define the transport streamable-http, the port, and allow any host/origin.
CMD ["-t", "streamable-http", "--address", "0.0.0.0:8080", "-allowed-hosts", "*", "-allowed-origins", "*"]
