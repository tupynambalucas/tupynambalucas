# GitHub MCP Agent Instructions

## 1. Domain Scope

The GitHub MCP server provides repository, issue, pull request, commit, and Copilot management tools.

---

## 2. Operational Rules

- **Branch Safety**: Always create a dedicated branch (`github_create_branch`) before committing changes or opening pull requests. Never push directly to `main` or `master`.
- **Search Before Create**: Run `github_search_issues` or `github_list_pull_requests` before opening new issues or PRs to prevent duplicate entries.
- **Pull Request Format**: Use Conventional Commits formatting (`feat:`, `fix:`, `docs:`) for PR titles and include comprehensive descriptions.
