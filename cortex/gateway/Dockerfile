FROM cr.agentgateway.dev/agentgateway:latest

ENV OTEL_EXPORTER_OTLP_ENDPOINT="http://otel-collector:4317"

COPY ./config.yaml /config/

CMD ["-f", "/config/config.yaml"]
