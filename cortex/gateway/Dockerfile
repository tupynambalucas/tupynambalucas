FROM cr.agentgateway.dev/agentgateway:v1.3.1

ENV GITHUB_PERSONAL_ACCESS_TOKEN=""
ENV CONTEXT7_API_KEY=""
ENV OTEL_EXPORTER_OTLP_ENDPOINT="http://otel-collector:4317"

COPY cortex/gateway/config.yaml /config.yaml

CMD ["-f", "/config.yaml"]
