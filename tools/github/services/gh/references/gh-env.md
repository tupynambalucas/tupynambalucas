# GitHub CLI Environment Variables Reference

GitHub CLI (`gh`) respects several environment variables that customize its execution, authentication, formatting, and defaults. Run `gh environment` in your terminal to view the current status of these variables.

---

## 1. Authentication & Host Configuration

| Variable                                          | Precedence / Fallbacks     | Description                                                                                                                                                                                               |
| :------------------------------------------------ | :------------------------- | :-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `GH_TOKEN` / `GITHUB_TOKEN`                       | `GH_TOKEN` wins            | An authentication token used when a command targets either `github.com` or a subdomain of `ghe.com`. Setting this avoids interactive authentication prompts and takes precedence over stored credentials. |
| `GH_ENTERPRISE_TOKEN` / `GITHUB_ENTERPRISE_TOKEN` | `GH_ENTERPRISE_TOKEN` wins | An authentication token used when a command targets a GitHub Enterprise Server host.                                                                                                                      |
| `GH_HOST`                                         | None                       | Specifies the target GitHub hostname for commands where a hostname has not been explicitly provided or cannot be inferred from a local Git repository.                                                    |

---

## 2. Text Editing & Web Browsing

| Variable                                         | Precedence / Fallbacks                              | Description                                                                                          |
| :----------------------------------------------- | :-------------------------------------------------- | :--------------------------------------------------------------------------------------------------- |
| `GH_EDITOR` / `GIT_EDITOR` / `VISUAL` / `EDITOR` | `GH_EDITOR` -> `GIT_EDITOR` -> `VISUAL` -> `EDITOR` | The default text editor used for authoring text (such as pull request descriptions or issue bodies). |
| `GH_BROWSER` / `BROWSER`                         | `GH_BROWSER` -> `BROWSER`                           | The default web browser used for opening remote web links.                                           |

---

## 3. Output Customization & Styling

| Variable               | Precedence / Fallbacks | Description                                                                                                                |
| :--------------------- | :--------------------- | :------------------------------------------------------------------------------------------------------------------------- |
| `GH_PAGER` / `PAGER`   | `GH_PAGER` -> `PAGER`  | The terminal paging program used to paginate standard output (e.g., `less`).                                               |
| `GLAMOUR_STYLE`        | None                   | Controls the style used for rendering Markdown in the terminal. See Charmbracelet Glamour styles for options.              |
| `NO_COLOR`             | None                   | If set to any value, disables ANSI escape sequences for color output entirely.                                             |
| `CLICOLOR`             | None                   | If set to `0`, disables ANSI colors in terminal output.                                                                    |
| `CLICOLOR_FORCE`       | None                   | If set to any value other than `0`, forces ANSI color codes to remain in output even when piped.                           |
| `GH_COLOR_LABELS`      | None                   | If set to any value, displays labels using their RGB hex color codes in terminals that support truecolor.                  |
| `GH_ACCESSIBLE_COLORS` | Preview feature        | If set to a truthy value, instructs `gh` to use customizable, 4-bit accessible colors.                                     |
| `GH_MDWIDTH`           | None                   | Default maximum width for terminal Markdown wrapping. Takes the lesser of terminal width, this value, or `120` by default. |

---

## 4. Behavior, Diagnostics & Telemetry

| Variable                          | Precedence / Fallbacks           | Description                                                                                                                                                |
| :-------------------------------- | :------------------------------- | :--------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `GH_DEBUG`                        | None                             | Set to a truthy value to enable verbose stderr logs. Set to `api` to additionally log complete HTTP request/response details.                              |
| `GH_FORCE_TTY`                    | None                             | Forces terminal-style output even when redirected. If set to a number, it sets the viewport width. If set to a percentage, it scales against the viewport. |
| `GH_NO_UPDATE_NOTIFIER`           | None                             | Disables checking for and notifying about new GitHub CLI versions (normally runs once every 24 hours).                                                     |
| `GH_NO_EXTENSION_UPDATE_NOTIFIER` | None                             | Disables update check notifications for installed GitHub CLI extensions.                                                                                   |
| `GH_PROMPT_DISABLED`              | None                             | Set to any value to completely disable interactive terminal prompts. Highly recommended for automated scripts.                                             |
| `GH_PATH`                         | None                             | Explicitly sets the path to the `gh` executable. Useful when path discovery fails (e.g., inside Cygwin).                                                   |
| `GH_ACCESSIBLE_PROMPTER`          | Preview feature                  | Enables terminal prompts that are more compatible with speech synthesis and braille screen readers.                                                        |
| `GH_TELEMETRY`                    | Wins over `DO_NOT_TRACK`         | Set to `log` to print telemetry to standard error instead of transmitting. Set to `false` or `0` to disable telemetry entirely.                            |
| `DO_NOT_TRACK`                    | Ignored if `GH_TELEMETRY` is set | Set to `true` or `1` to opt out of telemetry collection.                                                                                                   |
| `GH_SPINNER_DISABLED`             | None                             | Replaces spinner animations with a static textual progress indicator.                                                                                      |

> [!TIP]
> When executing commands inside Docker or non-interactive environments, it is recommended to set `GH_PROMPT_DISABLED=true` and `GH_NO_UPDATE_NOTIFIER=true` to ensure scripts run seamlessly without blocking.
