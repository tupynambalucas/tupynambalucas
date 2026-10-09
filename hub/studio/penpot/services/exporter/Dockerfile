# =================================================================== #
# studio/penpot — penpot-exporter
# Wraps the official penpotapp/exporter image (Node.js + Playwright).
# Build context: this directory (studio/penpot/services/exporter).
# Port 6061: export service (PDF, PNG rendering).
# =================================================================== #

# --- Dev Profile ---
FROM penpotapp/exporter:2.17 AS dev

EXPOSE 6061

# --- Prod Profile ---
FROM penpotapp/exporter:2.17 AS prod

EXPOSE 6061
