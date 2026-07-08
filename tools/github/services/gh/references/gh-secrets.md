# GitHub CLI Secrets Command Reference

The `gh secret` command group manages secrets for GitHub Actions, Dependabot, Codespaces, and custom integrations.

---

## 1. Commands Reference

### gh secret delete

Deletes a secret on a specified level.

```bash
gh secret delete <secret-name> [flags]
```

#### Secret Levels

- **`repository` (default)**: Available to GitHub Actions runs or Dependabot in a repository.
- **`environment`**: Available to GitHub Actions runs for a deployment environment in a repository.
- **`organization`**: Available to GitHub Actions runs, Dependabot, or Codespaces within an organization.
- **`user`**: Available to Codespaces for your user.

#### Options

| Flag         | Type     | Description                                                                     |
| :----------- | :------- | :------------------------------------------------------------------------------ |
| `-a, --app`  | `string` | Delete a secret for a specific application: `{actions\|codespaces\|dependabot}` |
| `-e, --env`  | `string` | Delete a secret for a specific deployment environment                           |
| `-o, --org`  | `string` | Delete a secret for an organization                                             |
| `-u, --user` | `none`   | Delete a secret for your user                                                   |

#### Global Options

| Flag         | Type                | Description                                                    |
| :----------- | :------------------ | :------------------------------------------------------------- |
| `-R, --repo` | `[HOST/]OWNER/REPO` | Select another repository using the `[HOST/]OWNER/REPO` format |

- **Aliases**: `gh secret remove`

---

### gh secret list

Lists secrets on a specified level.

```bash
gh secret list [flags]
```

#### Options

| Flag             | Type         | Description                                                                  |
| :--------------- | :----------- | :--------------------------------------------------------------------------- |
| `-a, --app`      | `string`     | List secrets for a specific application: `{actions\|codespaces\|dependabot}` |
| `-e, --env`      | `string`     | List secrets for a specific environment                                      |
| `-q, --jq`       | `expression` | Filter JSON output using a `jq` expression                                   |
| `--json`         | `fields`     | Output JSON with the specified fields                                        |
| `-o, --org`      | `string`     | List secrets for an organization                                             |
| `-t, --template` | `string`     | Format JSON output using a Go template                                       |
| `-u, --user`     | `none`       | List a secret for your user                                                  |

- **JSON Fields**: `name`, `numSelectedRepos`, `selectedReposURL`, `updatedAt`, `visibility`
- **Aliases**: `gh secret ls`

---

### gh secret set

Creates or updates a secret value on a specified level.

```bash
gh secret set <secret-name> [flags]
```

> [!NOTE]
> Secret values are locally encrypted on your machine before being sent over HTTPS to GitHub.

#### Options

| Flag                  | Type           | Description                                                                                 |
| :-------------------- | :------------- | :------------------------------------------------------------------------------------------ |
| `-a, --app`           | `string`       | Set the application for a secret: `{actions\|codespaces\|dependabot}`                       |
| `-b, --body`          | `string`       | The value for the secret (reads from standard input if not specified)                       |
| `-e, --env`           | `environment`  | Set deployment environment secret                                                           |
| `-f, --env-file`      | `file`         | Load secret names and values from a dotenv-formatted file (use `-` for stdin)               |
| `--no-repos-selected` | `none`         | Prevent any repository from accessing this organization secret                              |
| `--no-store`          | `none`         | Print the encrypted, base64-encoded value instead of storing it on GitHub                   |
| `-o, --org`           | `organization` | Set organization-level secret                                                               |
| `-r, --repos`         | `repositories` | Comma-separated list of repositories that can access an organization or user secret         |
| `-u, --user`          | `none`         | Set a secret for your user                                                                  |
| `-v, --visibility`    | `string`       | Set visibility for an organization secret: `{all\|private\|selected}` (default `"private"`) |

---

## 2. Examples

### Managing Individual Secrets

- **Set a secret interactively (reads value securely from keyboard prompt)**:

  ```bash
  gh secret set MYSECRET
  ```

- **Set a secret using an environment variable**:

  ```bash
  gh secret set MYSECRET --body "$ENV_VALUE"
  ```

- **Set a secret on a specific remote repository**:

  ```bash
  gh secret set MYSECRET --repo origin/repo --body "$ENV_VALUE"
  ```

- **Set a secret by reading value from a text file**:

  ```bash
  gh secret set MYSECRET < myfile.txt
  ```

- **Set a secret for a deployment environment**:
  ```bash
  gh secret set MYSECRET --env myenvironment
  ```

### Managing Organization & User Secrets

- **Set organization secret accessible by public and private repositories**:

  ```bash
  gh secret set MYSECRET --org myOrg --visibility all
  ```

- **Set organization secret restricted to specific repositories**:

  ```bash
  gh secret set MYSECRET --org myOrg --repos repo1,repo2,repo3
  ```

- **Set organization secret accessible by no repositories**:

  ```bash
  gh secret set MYSECRET --org myOrg --no-repos-selected
  ```

- **Set user-level secret for Codespaces**:
  ```bash
  gh secret set MYSECRET --user
  ```

### Bulk Import

- **Set multiple secrets from a `.env` file**:

  ```bash
  gh secret set -f .env
  ```

- **Set multiple secrets from standard input**:
  ```bash
  gh secret set -f - < secrets.env
  ```
