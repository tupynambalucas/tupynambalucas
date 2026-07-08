# GitHub Token Migration Guide: Classic to Fine-Grained PATs

This guide details the security analysis and step-by-step migration path to replace the deprecated Classic Personal Access Token (PAT) with Fine-Grained PATs across the monorepo workspaces.

---

## 1. Security Strategy & Least Privilege

Classic PATs (`ghp_*`) act as root-level credentials with wide-ranging scopes (e.g., `repo`, `workflow`) that apply to all repositories the user has access to. Fine-Grained PATs (`github_pat_*`) enforce the security principle of least privilege through two main vectors:

1.  **Repository Scoping**: Access can be restricted to only select repositories (e.g., this monorepo only), preventing a token compromise from exposing other repositories.
2.  **Granular Scopes**: Permissions are defined at the individual resource level (e.g., reading metadata vs. writing secrets) rather than broad category scopes.

---

## 2. Component Scopes & Required Permissions

Different components in this monorepo interact with the GitHub API in distinct ways. To maintain security, we segment token permissions based on their specific functional requirements:

### A. Environment Sync CLI (`tools/github`)

- **Functionality**: Executed by `ext_sync_secrets.sh` to update, list, and delete Actions secrets, Codespaces secrets, Dependabot secrets, and Actions variables.
- **Target Repositories**: This monorepo only.
- **Required Repository Permissions**:
  - **Secrets**: Read & Write (required to read/write repository actions secrets).
  - **Codespaces secrets**: Read & Write (required to read/write Codespaces secrets).
  - **Dependabot secrets**: Read & Write (required to read/write Dependabot secrets).
  - **Variables**: Read & Write (required to read/write Actions configuration variables).
  - **Metadata**: Read-only (default, required to view repository context).

### B. Profile Stats Generator (`profile/`)

- **Functionality**: Queries user contribution metrics via the GraphQL API, fetches views, and fallback user emails.
- **Target Repositories**: This monorepo only.
- **Required Repository Permissions**:
  - **Administration**: Read-only (required to query traffic analytics: `GET /repos/{owner}/{repo}/traffic/views`).
  - **Metadata**: Read-only (required to query repository contribution timelines, commit lists, and languages).
- **Required User Permissions**:
  - **Email addresses**: Read-only (required to query `GET /user/emails` to match commits to local author emails).

### C. Model Context Protocol GitHub Server (`tools/mcp/services/github`)

- **Functionality**: Integrates external agents to manage issues, pull requests, content modifications, and workflows.
- **Target Repositories**: Select development repositories.
- **Required Repository Permissions**:
  - **Contents**: Read & Write (required to push commits, create branches, and delete files).
  - **Pull Requests**: Read & Write (required to list, open, review, and merge PRs).
  - **Issues**: Read & Write (required to list, create, and update issues or comments).
  - **Workflows**: Read & Write (required to modify CI/CD pipelines under `.github/workflows/`).
  - **Metadata**: Read-only (automatic).

---

## 3. Senior Token Management & Organization

Rather than sharing a single token across all services, a senior-level setup organizes credentials using separated tokens stored in localized environments:

```
[Developer Environment]
       │
       ├──► Profile Token (github_pat_1...) ──► Scoped to Profile Repos (Metadata:Read, Administration:Read, Email:Read)
       │
       ├──► Sync Token (github_pat_2...)    ──► Scoped to Monorepo (Secrets:Write, Variables:Write)
       │
       └──► MCP Token (github_pat_3...)     ──► Scoped to Dev Repos (Contents:Write, PullRequests:Write, Issues:Write)
```

### Credentials Storage Standard

1.  **Local Secrets**: Never commit tokens to the repository. All tokens must reside in `.env` or `.env.secrets` files that are matched in `.gitignore`.
2.  **CLI Integration**: Load the specific token dynamically into the execution environment as `GH_TOKEN`. The GitHub CLI (`gh`) and custom Node scripts will inherit the token from the environment variable.
3.  **Rotation Policies**: Fine-grained PATs expire after a maximum of 1 year. Set up reminders to regenerate tokens before expiration, or transition automated background workflows (like GitHub Actions) to use short-lived installation access tokens generated via a custom GitHub App.
