# Firecrawl MCP Agent Instructions

## 1. Domain Scope

The Firecrawl MCP server provides web scraping, domain mapping, content extraction, and autonomous web research capabilities.

---

## 2. Tool Execution Best Practices

- **Scrape vs. Crawl**: Prefer `firecrawl_scrape` for single-page text extraction. Use `firecrawl_crawl` only when full multi-page site discovery is required.
- **Structured Data**: Use `firecrawl_extract` when schema-conforming JSON entity extraction is required from web sources.
- **Academic Research**: Use `firecrawl_research_search_papers` and `firecrawl_research_read_paper` for querying academic literature.
