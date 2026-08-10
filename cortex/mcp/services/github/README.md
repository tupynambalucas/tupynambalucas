# GitHub MCP Service

The `cortex/mcp/services/github` workspace provides the official containerized GitHub Model Context Protocol (MCP) server for repository automation, issue tracking, pull request operations, and Copilot integrations.

---

## Technology Stack

- **Base Image**: `ghcr.io/github/github-mcp-server:latest`
- **Transport**: Streamable HTTP on port `8080`
- **Protocols**: GitHub REST API v3, GitHub GraphQL API v4

---

## Features

- **Repository Management**: Code inspection, file creation, updates, and branch management.
- **Pull Request Automation**: Creating, updating, merging, and reviewing pull requests.
- **Issue Operations**: Reading, writing, searching, and managing sub-issue hierarchies.
- **Copilot Integration**: Assigning Copilot to issues and requesting automated reviews.

---

## Configuration & Environment

| Variable                       | Default      | Purpose                                         |
| :----------------------------- | :----------- | :---------------------------------------------- |
| `GITHUB_PERSONAL_ACCESS_TOKEN` | -            | Personal access token for GitHub authentication |
| `GITHUB_HOST`                  | `github.com` | Target GitHub host domain                       |
| `GITHUB_API_URL`               | -            | Custom base URL for GitHub Enterprise instances |
