# Firecrawl MCP Service

The `cortex/mcp/services/firecrawl` workspace provides the containerized Firecrawl Model Context Protocol (MCP) server for web scraping, crawling, structured data extraction, and autonomous web research.

---

## Technology Stack

- **Base Image**: Node.js 22 Alpine
- **Package**: `firecrawl-mcp@latest`
- **Transport**: Streamable HTTP on port `8080`

---

## Features

- **High-Fidelity Web Scraping**: Extracts clean Markdown or JSON from dynamic web pages.
- **Deep Site Crawling**: Recursive domain mapping and multi-page indexing.
- **Structured Schema Extraction**: Parses unstructured web content into typed JSON entities.
- **Autonomous Research**: Coordinates multi-source web queries and academic literature exploration.

---

## Configuration & Environment

| Variable                 | Default   | Purpose                              |
| :----------------------- | :-------- | :----------------------------------- |
| `FIRECRAWL_API_KEY`      | -         | Authentication key for Firecrawl API |
| `HTTP_STREAMABLE_SERVER` | `true`    | Enables Streamable HTTP transport    |
| `PORT`                   | `8080`    | Internal server listening port       |
| `HOST`                   | `0.0.0.0` | Network binding interface            |
