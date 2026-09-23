# =================================================================== #
# studio/penpot — penpot-backend
# Wraps the official penpotapp/backend image (Clojure/JVM service).
# Build context: this directory (studio/penpot/services/backend).
# Port 6060: REST API + WebSocket notifications.
# =================================================================== #

# --- Dev Profile ---
FROM penpotapp/backend:2.17 AS dev

EXPOSE 6060

# --- Prod Profile ---
FROM penpotapp/backend:2.17 AS prod

EXPOSE 6060
