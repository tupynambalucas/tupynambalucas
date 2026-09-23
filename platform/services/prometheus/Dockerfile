FROM prom/prometheus:latest

# COPY prometheus.yml /etc/prometheus/prometheus.yml
COPY ./src/ /etc/prometheus
CMD [ "--config.file=/etc/prometheus/prometheus.yml", \
      "--storage.tsdb.path=/prometheus", \
      "--storage.tsdb.retention.time=30d", \
      "--web.enable-lifecycle", \
      "--web.enable-remote-write-receiver" ]

EXPOSE 9090
