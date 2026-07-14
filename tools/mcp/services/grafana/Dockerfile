FROM grafana/mcp-grafana:latest

# O Agent Gateway espera que os serviços MCP rodem na porta 8080
EXPOSE 8080

# Usamos CMD para adicionar os argumentos ao ENTRYPOINT padrão (que é o /app/mcp-grafana)
# Definimos o transport streamable-http, a porta e permitimos qualquer host/origem
CMD ["-t", "streamable-http", "--address", "0.0.0.0:8080", "-allowed-hosts", "*", "-allowed-origins", "*"]
