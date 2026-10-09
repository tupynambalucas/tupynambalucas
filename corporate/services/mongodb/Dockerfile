FROM mongo:7.0

# Instala openssl para gerar o keyfile e dos2unix para normalizar scripts
RUN apt-get update && apt-get install -y openssl dos2unix && rm -rf /var/lib/apt/lists/*

WORKDIR /infrastructure

# Copia os scripts
COPY scripts/entrypoint.sh ./entrypoint.sh
COPY init-scripts/init-db.sh ./init-db.sh

# Normaliza os fins de linha e dá permissão de execução
RUN dos2unix ./entrypoint.sh ./init-db.sh && \
    chmod +x ./entrypoint.sh ./init-db.sh

# Define o entrypoint padrão (será usado pelo DB)
# O Seed Service sobrescreverá o entrypoint no compose
ENTRYPOINT ["./entrypoint.sh"]
