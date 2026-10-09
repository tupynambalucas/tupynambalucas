# FROM ghcr.io/headlamp-k8s/headlamp:v0.41.0
# USER root
# COPY config.yaml /home/headlamp/.kube/config
# RUN chown -R headlamp:headlamp /home/headlamp/.kube
# USER headlamp
# --- Dev Profile ---
FROM ghcr.io/headlamp-k8s/headlamp:v0.41.0 AS dev

ARG IMAGE_BASE=node:lts-alpine

USER root
COPY ./src/ /home/headlamp
RUN chown -R 472:0 /home/headlamp && \
    find /home/headlamp -type d -exec chmod 777 {} + && \
    find /home/headlamp -type f -exec chmod 666 {} +
USER 472

# --- Prod Profile ---
FROM ghcr.io/headlamp-k8s/headlamp:v0.41.0 AS prod

ARG IMAGE_BASE=node:22-alpine

USER root
COPY ./src/ /home/headlamp
RUN chown -R 472:0 /home/headlamp && \
    find /home/headlamp -type d -exec chmod 550 {} + && \
    find /home/headlamp -type f -exec chmod 440 {} +
USER 472