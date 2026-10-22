# =================================================================== #
# hub/observability/otelcol — OpenTelemetry Collector Custom Build
# =================================================================== #

# ---- Stage 1: Certificates ----
FROM alpine:3.19 AS certs
RUN apk --update add ca-certificates

# ---- Stage 2: Builder ----
FROM golang:1.25.0 AS build-stage
WORKDIR /build

COPY ./src/builder-config.yaml builder-config.yaml

RUN --mount=type=cache,target=/root/.cache/go-build GO111MODULE=on go install go.opentelemetry.io/collector/cmd/builder@v0.158.0
RUN --mount=type=cache,target=/root/.cache/go-build builder --config builder-config.yaml

# ---- Stage 3: Dev Profile ----
FROM alpine:3.19 AS dev
WORKDIR /otelcol
COPY --from=certs /etc/ssl/certs/ca-certificates.crt /etc/ssl/certs/ca-certificates.crt
COPY --chmod=755 --from=build-stage /build/otelcol-custom /otelcol/otelcol-custom
EXPOSE 4317 4318 12001
ENTRYPOINT ["/otelcol/otelcol-custom"]
CMD ["--config", "/otelcol/collector-config.yaml"]

# ---- Stage 4: Prod Profile ----
FROM gcr.io/distroless/base:latest AS prod

ARG USER_UID=10001
USER ${USER_UID}

COPY --from=certs /etc/ssl/certs/ca-certificates.crt /etc/ssl/certs/ca-certificates.crt
COPY --chmod=755 --from=build-stage /build/otelcol-custom /otelcol/otelcol-custom

EXPOSE 4317 4318 12001

ENTRYPOINT ["/otelcol/otelcol-custom"]
CMD ["--config", "/otelcol/collector-config.yaml"]

