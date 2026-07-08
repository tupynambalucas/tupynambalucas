# GitHub CLI Variables Command Reference

The `gh variable` command group manages configuration variables for GitHub Actions and Dependabot.

---

## 1. Commands Reference

### gh variable delete

Deletes a variable on a specified level.

```bash
gh variable delete <variable-name> [flags]
```

#### Variable Levels

- **`repository` (default)**: Available to GitHub Actions runs or Dependabot in a repository.
- **`environment`**: Available to GitHub Actions runs for a deployment environment in a repository.
- **`organization`**: Available to GitHub Actions runs or Dependabot within an organization.

#### Options

| Flag        | Type     | Description                                  |
| :---------- | :------- | :------------------------------------------- |
| `-e, --env` | `string` | Delete a variable for a specific environment |
| `-o, --org` | `string` | Delete a variable for an organization        |

#### Global Options

| Flag         | Type                | Description                                                    |
| :----------- | :------------------ | :------------------------------------------------------------- |
| `-R, --repo` | `[HOST/]OWNER/REPO` | Select another repository using the `[HOST/]OWNER/REPO` format |

- **Aliases**: `gh variable remove`

---

### gh variable get

Retrieves the value of a variable on a specified level.

```bash
gh variable get <variable-name> [flags]
```

#### Variable Levels

- **`repository` (default)**: Available to GitHub Actions runs or Dependabot in a repository.
- **`environment`**: Available to GitHub Actions runs for a deployment environment in a repository.
- **`organization`**: Available to GitHub Actions runs or Dependabot within an organization.

#### Options

| Flag             | Type         | Description                                                       |
| :--------------- | :----------- | :---------------------------------------------------------------- |
| `-e, --env`      | `string`     | Get a variable for a specific environment                         |
| `-q, --jq`       | `expression` | Filter JSON output using a `jq` expression                        |
| `--json`         | `fields`     | Output JSON with the specified fields                             |
| `-o, --org`      | `string`     | Get a variable for an organization                                |
| `-t, --template` | `string`     | Format JSON output using a Go template (see `gh help formatting`) |

#### Global Options

| Flag         | Type                | Description                                                    |
| :----------- | :------------------ | :------------------------------------------------------------- |
| `-R, --repo` | `[HOST/]OWNER/REPO` | Select another repository using the `[HOST/]OWNER/REPO` format |

#### JSON Fields

`createdAt`, `name`, `numSelectedRepos`, `selectedReposURL`, `updatedAt`, `value`, `visibility`

---

### gh variable list

Lists variables on a specified level.

```bash
gh variable list [flags]
```

#### Variable Levels

- **`repository` (default)**: Available to GitHub Actions runs or Dependabot in a repository.
- **`environment`**: Available to GitHub Actions runs for a deployment environment in a repository.
- **`organization`**: Available to GitHub Actions runs or Dependabot within an organization.

#### Options

| Flag             | Type         | Description                                                       |
| :--------------- | :----------- | :---------------------------------------------------------------- |
| `-e, --env`      | `string`     | List variables for a specific environment                         |
| `-q, --jq`       | `expression` | Filter JSON output using a `jq` expression                        |
| `--json`         | `fields`     | Output JSON with the specified fields                             |
| `-o, --org`      | `string`     | List variables for an organization                                |
| `-t, --template` | `string`     | Format JSON output using a Go template (see `gh help formatting`) |

#### Global Options

| Flag         | Type                | Description                                                    |
| :----------- | :------------------ | :------------------------------------------------------------- |
| `-R, --repo` | `[HOST/]OWNER/REPO` | Select another repository using the `[HOST/]OWNER/REPO` format |

- **Aliases**: `gh variable ls`

#### JSON Fields

`createdAt`, `name`, `numSelectedRepos`, `selectedReposURL`, `updatedAt`, `value`, `visibility`

---

### gh variable set

Creates or updates a variable value on a specified level.

```bash
gh variable set <variable-name> [flags]
```

#### Variable Levels

- **`repository` (default)**: Available to GitHub Actions runs or Dependabot in a repository.
- **`environment`**: Available to GitHub Actions runs for a deployment environment in a repository.
- **`organization`**: Available to GitHub Actions runs or Dependabot within an organization. Organization-level variables can optionally be restricted to specific repositories.

#### Options

| Flag               | Type           | Description                                                                                   |
| :----------------- | :------------- | :-------------------------------------------------------------------------------------------- |
| `-b, --body`       | `string`       | The value for the variable (reads from standard input if not specified)                       |
| `-e, --env`        | `environment`  | Set deployment environment variable                                                           |
| `-f, --env-file`   | `file`         | Load variable names and values from a dotenv-formatted file                                   |
| `-o, --org`        | `organization` | Set organization variable                                                                     |
| `-r, --repos`      | `repositories` | Comma-separated list of repositories that can access an organization variable                 |
| `-v, --visibility` | `string`       | Set visibility for an organization variable: `{all\|private\|selected}` (default `"private"`) |

#### Global Options

| Flag         | Type                | Description                                                    |
| :----------- | :------------------ | :------------------------------------------------------------- |
| `-R, --repo` | `[HOST/]OWNER/REPO` | Select another repository using the `[HOST/]OWNER/REPO` format |

---

## 2. Examples

### Managing Individual Variables

- **Set a variable interactively (reads value securely from keyboard prompt)**:

  ```bash
  gh variable set MYVARIABLE
  ```

- **Set a variable using an environment variable**:

  ```bash
  gh variable set MYVARIABLE --body "$ENV_VALUE"
  ```

- **Set a variable by reading value from a text file**:

  ```bash
  gh variable set MYVARIABLE < myfile.txt
  ```

- **Set a variable for a deployment environment**:
  ```bash
  gh variable set MYVARIABLE --env myenvironment
  ```

### Managing Organization Variables

- **Set organization variable accessible by public and private repositories**:

  ```bash
  gh variable set MYVARIABLE --org myOrg --visibility all
  ```

- **Set organization variable restricted to specific repositories**:
  ```bash
  gh variable set MYVARIABLE --org myOrg --repos repo1,repo2,repo3
  ```

### Bulk Import

- **Set multiple variables from a `.env` file**:
  ```bash
  gh variable set -f .env
  ```
