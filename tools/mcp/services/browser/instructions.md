# Browser MCP Context - Tupynambá Lucas

This file defines guidelines and parameters for headless browser automation and UI testing in the **Tupynambá Lucas** project.

## ⚛️ Testing Scope

- **Target Flow**: Primarily focused on the Community Shop customer flow and the Administration management flow.
- **Port Mapping**: The web client runs on port `5173`. When accessing the host-level local development server from inside the browser container, always rewrite `localhost` or `127.0.0.1` to `host.docker.internal` to route correctly across the Docker network bridge.

## 🎨 Quality & UX Standards

- **Responsive Layouts**: Verify UI compliance across standard viewport dimensions (mobile, tablet, desktop).
- **Console Monitoring**: Actively query console logs during automation to inspect and report any React hydration warnings, runtime exceptions, or styling errors.
- **Performance Verification**: Audit network requests to identify slow-loading assets, heavy image sizes, or excessive bundle loads.
