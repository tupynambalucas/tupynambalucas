# Firecrawl MCP Integration

This directory contains the containerized Firecrawl Model Context Protocol (MCP) server integration for the AI Cortex subsystem.

---

## 1. Overview

The Firecrawl MCP service provides web scraping, crawling, searching, and autonomous research capabilities. It converts live web pages into structured JSON or clean Markdown context for AI agent consumption.

- Docker Container Configuration: [Dockerfile](./Dockerfile)

---

## 2. Environment Variables

The Firecrawl MCP server supports configuration via the following environment variables:

| Environment Variable             | Description                                                       |
| :------------------------------- | :---------------------------------------------------------------- |
| `FIRECRAWL_API_KEY`              | API key for Firecrawl Cloud API authentication.                   |
| `FIRECRAWL_API_URL`              | Custom API endpoint URL for self-hosted Firecrawl instances.      |
| `HTTP_STREAMABLE_SERVER`         | Enable HTTP Streamable Server transport mode (`true` or `false`). |
| `HOST`                           | Interface binding host for HTTP transport (default: `0.0.0.0`).   |
| `PORT`                           | Listening port for HTTP transport (default: `8080`).              |
| `FIRECRAWL_OAUTH_TOKEN`          | Static OAuth access token for authenticated API requests.         |
| `FIRECRAWL_NO_SEARCH_FEEDBACK`   | Disable search feedback tool registration (`1` or `0`).           |
| `FIRECRAWL_NO_ENDPOINT_FEEDBACK` | Disable generic endpoint feedback tool registration (`1` or `0`). |

---

## 3. Available Tools

The Firecrawl MCP server exposes the following web scraping and intelligence tools:

- `firecrawl_scrape`: Scrapes content from a single URL into structured JSON or Markdown.
- `firecrawl_map`: Maps a website domain to discover all indexed sub-URLs.
- `firecrawl_search`: Searches the web for matching query content and optional page highlights.
- `firecrawl_search_feedback`: Submits quality feedback on previous search results.
- `firecrawl_feedback`: Submits generic endpoint execution feedback for jobs.
- `firecrawl_crawl`: Initiates multi-page recursive website crawling jobs.
- `firecrawl_check_crawl_status`: Checks status and retrieves data for an active crawl job.
- `firecrawl_extract`: Extracts structured JSON schema entities from target URLs.
- `firecrawl_agent`: Launches autonomous web research agents for multi-source analysis.
- `firecrawl_agent_status`: Checks execution status of an autonomous research agent job.
- `firecrawl_interact`: Performs interactive browser actions (click, scroll, type) on pages.
- `firecrawl_interact_stop`: Terminates an active browser interaction session.
- `firecrawl_parse`: Parses uploaded documents, PDFs, or local file references into Markdown/JSON.
- `firecrawl_monitor_create`: Creates a recurring web page monitoring schedule.
- `firecrawl_monitor_list`: Lists active web page monitors.
- `firecrawl_monitor_get`: Retrieves details and history for a specific monitor.
- `firecrawl_monitor_update`: Updates monitoring parameters or check intervals.
- `firecrawl_monitor_delete`: Deletes a web page monitor.
- `firecrawl_monitor_run`: Triggers an immediate manual check run for a monitor.
- `firecrawl_monitor_checks`: Lists historical execution checks for a monitor.
- `firecrawl_monitor_check`: Fetches detailed results for a specific monitor check.
- `firecrawl_research_search_papers`: Searches academic research papers.
- `firecrawl_research_inspect_paper`: Inspects detailed metadata and citations for a paper.
- `firecrawl_research_related_papers`: Finds related academic papers.
- `firecrawl_research_read_paper`: Extracts full readable text from academic paper PDFs.
- `firecrawl_research_search_github`: Searches GitHub repositories for academic research context.
