# --- Dev Profile ---
FROM grafana/grafana:latest AS dev

USER root
COPY ./src/ /etc/grafana
RUN chown -R 472:0 /etc/grafana && \
    find /etc/grafana -type d -exec chmod 777 {} + && \
    find /etc/grafana -type f -exec chmod 666 {} +
USER 472

# --- Prod Profile ---
FROM grafana/grafana:latest AS prod

USER root
COPY ./src/ /etc/grafana
RUN chown -R 472:0 /etc/grafana && \
    find /etc/grafana -type d -exec chmod 550 {} + && \
    find /etc/grafana -type f -exec chmod 440 {} +
USER 472