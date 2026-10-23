# Tupynambalucas Corporate Products

The Corporate workspace contains the public-facing applications and services for the `tupynambalucas.dev` ecosystem.

## Architecture

This context is organized into the following primary products:

- **API**: High-performance backend services built with Fastify.
- **Web**: The main public website and user interfaces built with React and Vite.
- **Portal**: The technical documentation and knowledge base powered by Docusaurus.

These applications are isolated from internal team tools (which reside in the `hub/` workspace) to ensure security and independent scaling.

## Development

The Corporate services are orchestrated via Skaffold and deployed to a dedicated local cluster (`k3d-corporate`).

To spin up the Corporate ecosystem locally:

```bash
cd ../k8s
skaffold dev -f skaffold.corporate.yaml
```
