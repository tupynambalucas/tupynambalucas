# Local Context: GitHub MCP Integration

This directory contains the containerized GitHub Model Context Protocol (MCP) server integration for the AI Cortex subsystem.

---

## 1. Overview

The GitHub MCP service provides integrations with the GitHub REST and GraphQL APIs. It enables AI agents connected through the API gateway to interact with repositories, pull requests, issues, commits, branches, and Copilot features.

- Docker Container Configuration: [Dockerfile](./Dockerfile)

---

## 2. Operational & Security Guardrails

- **Authentication**: A valid `GITHUB_PERSONAL_ACCESS_TOKEN` MUST be mapped into container environment variables.
- **Branch Strategy**: Agents MUST create dedicated feature or fix branches before performing commit operations. Direct pushes to `main` or `master` branches are forbidden unless explicitly instructed.
- **Pull Request Creation**: PR titles MUST follow Conventional Commits (e.g. `feat:`, `fix:`, `docs:`) and include detailed body summaries.
- **Idempotency**: Avoid duplicate issue or PR creation by performing lookup searches (`github_search_issues`, `github_list_pull_requests`) prior to creation.

---

## 3. Environment Variables

The GitHub MCP server supports configuration via the following environment variables:

| Environment Variable           | Description                                                     |
| :----------------------------- | :-------------------------------------------------------------- |
| `GITHUB_PERSONAL_ACCESS_TOKEN` | Personal Access Token (PAT) used for GitHub API authentication. |
| `GITHUB_TOKEN`                 | Alternative environment variable for GitHub API token.          |
| `GITHUB_HOST`                  | Target GitHub Enterprise Server host (default: `github.com`).   |
| `GITHUB_API_URL`               | Base API URL override for self-hosted Enterprise instances.     |
| `OAUTH_CLIENT_ID`              | OAuth Client Identifier for OAuth-based authorization.          |
| `OAUTH_CLIENT_SECRET`          | OAuth Client Secret for OAuth-based authorization.              |

---

## 4. Available Tools

The GitHub MCP server exposes 45 API automation tools:

- `github_add_comment_to_pending_review`: Adds a comment to a pending pull request review.
- `github_add_issue_comment`: Adds a comment to a specific issue.
- `github_add_reply_to_pull_request_comment`: Replies to an existing pull request comment.
- `github_assign_copilot_to_issue`: Assigns GitHub Copilot agent to work on an issue.
- `github_assign_copilot_to_issue_with_intent`: Assigns Copilot with intent metadata.
- `github_create_branch`: Creates a new git branch in the repository.
- `github_create_or_update_file`: Creates or updates a file directly in a repository.
- `github_create_pull_request`: Opens a new pull request.
- `github_create_repository`: Creates a new GitHub repository.
- `github_delete_file`: Deletes a file from a repository branch.
- `github_fork_repository`: Forks a target repository.
- `github_get_commit`: Retrieves commit details by SHA.
- `github_get_file_contents`: Fetches raw file contents or directory structure.
- `github_get_label`: Retrieves details of a specific issue label.
- `github_get_latest_release`: Gets the latest published release of a repository.
- `github_get_me`: Retrieves current authenticated user information.
- `github_get_release_by_tag`: Retrieves release details by tag name.
- `github_get_tag`: Gets git tag reference details.
- `github_get_team_members`: Lists members of a target organization team.
- `github_get_teams`: Lists organization teams.
- `github_issue_read`: Reads complete issue details including state and comments.
- `github_issue_write`: Creates or modifies issue properties.
- `github_list_branches`: Lists branches available in a repository.
- `github_list_commits`: Lists commit history for a branch or file path.
- `github_list_issue_fields`: Lists issue metadata fields and custom attributes.
- `github_list_issue_types`: Lists defined issue types in an organization.
- `github_list_issues`: Lists issues matching repository or filter criteria.
- `github_list_pull_requests`: Lists pull requests in a repository.
- `github_list_releases`: Lists published releases for a repository.
- `github_list_repository_collaborators`: Lists repository collaborators and permissions.
- `github_list_tags`: Lists git tags in a repository.
- `github_merge_pull_request`: Merges a pull request into its base branch.
- `github_pull_request_read`: Reads pull request details, diffs, and reviews.
- `github_pull_request_review_write`: Submits or updates pull request reviews.
- `github_push_files`: Commits and pushes multiple file updates in a single commit.
- `github_request_copilot_review`: Requests an automated Copilot review on a pull request.
- `github_search_code`: Searches code across repositories.
- `github_search_commits`: Searches commit messages and SHAs across repositories.
- `github_search_issues`: Searches issues and pull requests by query.
- `github_search_pull_requests`: Searches pull requests specifically.
- `github_search_repositories`: Searches public and private repositories.
- `github_search_users`: Searches GitHub users and organization profiles.
- `github_sub_issue_write`: Creates or manages sub-issues in task hierarchies.
- `github_update_pull_request`: Updates pull request title, body, or base branch.
- `github_update_pull_request_branch`: Updates a pull request branch with base branch changes.
