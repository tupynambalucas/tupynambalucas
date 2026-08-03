# Firecrawl MCP Agent Instructions

## 1. Domain Scope

The Firecrawl MCP server provides web scraping, domain mapping, content extraction, and autonomous web research capabilities.

---

## 2. Environment & Network Routing Rules

- **Local Host Server Resolution**: When scraping or interacting with local development
  applications running on the developer's host machine, ALWAYS substitute `localhost` or `127.0.0.1`
  with `host.docker.internal`.
- **Automatic Target URL Mapping**: Agents MUST automatically resolve and target local applications
  using the following mapping. Do not query the user for URLs:
  - **docs** (Docusaurus dev server): `http://host.docker.internal:3002`
  - **hub-web** (Vite/React dev server): `http://host.docker.internal:5173`
  - **hub-api** (Fastify REST API): `http://host.docker.internal:3000`

---

## 3. Tool Execution Best Practices

- **Scrape vs. Crawl**: Prefer `firecrawl_scrape` for single-page text extraction. Use
  `firecrawl_crawl` only when full multi-page site discovery is required.
- **Structured Data**: Use `firecrawl_extract` when schema-conforming JSON entity extraction is
  required from web sources.
- **Academic Research**: Use `firecrawl_research_search_papers` and `firecrawl_research_read_paper`
  for querying academic literature.
