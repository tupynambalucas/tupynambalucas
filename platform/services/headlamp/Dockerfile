FROM ghcr.io/headlamp-k8s/headlamp:v0.41.0
USER root
COPY platform/services/headlamp/config.yaml /home/headlamp/.kube/config
RUN chown -R headlamp:headlamp /home/headlamp/.kube
USER headlamp
