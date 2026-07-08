# Git Environment Variables Reference

Git utilizes several environment variables to control its execution, configuration overrides, authentication, and output diagnostics.

---

## 1. Global Behavior & Configuration Overrides

| Variable              | Description                                                                                                                                            |
| :-------------------- | :----------------------------------------------------------------------------------------------------------------------------------------------------- |
| `GIT_EXEC_PATH`       | Determines where Git searches for its internal subprograms (e.g., `git-commit`, `git-diff`). Verify the current configuration using `git --exec-path`. |
| `HOME`                | Points to the home directory where Git searches for the global configuration file (`~/.gitconfig`).                                                    |
| `PREFIX`              | Points to the location of system-wide configuration files (typically `$PREFIX/etc/gitconfig`).                                                         |
| `GIT_CONFIG_NOSYSTEM` | If set to any value, disables the use of the system-wide configuration file. Useful if system configurations interfere with commands.                  |
| `GIT_PAGER`           | Controls the paging program used to display multi-page terminal outputs. Falls back to `PAGER` if undefined.                                           |
| `GIT_EDITOR`          | Overrides the text editor launched when editing text (e.g., commit messages). Falls back to `EDITOR` if undefined.                                     |

---

## 2. Repository & Workspace Locations

These variables override the automatic repository detection of Git.

| Variable                           | Description                                                                                                           |
| :--------------------------------- | :-------------------------------------------------------------------------------------------------------------------- |
| `GIT_DIR`                          | Explicit path to the `.git` directory. If unspecified, Git traverses up the directory tree to search for `.git`.      |
| `GIT_CEILING_DIRECTORIES`          | Controls how far up the directory tree Git will search for a `.git` folder. Useful on slow network-mounted drives.    |
| `GIT_WORK_TREE`                    | Specifies the path to the root of the working tree for non-bare repositories.                                         |
| `GIT_INDEX_FILE`                   | Path to the Git index file (non-bare repositories only).                                                              |
| `GIT_OBJECT_DIRECTORY`             | Specifies the path of the database directory (normally `.git/objects`).                                               |
| `GIT_ALTERNATE_OBJECT_DIRECTORIES` | Colon-separated list of alternate object directories to query for Git objects if not found in `GIT_OBJECT_DIRECTORY`. |

---

## 3. Pathspec & Wildcard Behaviors

| Variable                | Description                                                                                                          |
| :---------------------- | :------------------------------------------------------------------------------------------------------------------- |
| `GIT_GLOB_PATHSPEC`     | If set to `1` (default), pathspec wildcards act as standard glob patterns (e.g., `git add *.c` matches C files).     |
| `GIT_NOGLOB_PATHSPECS`  | If set to `1`, wildcard characters match themselves literally (e.g., `*.c` only matches a file named exactly `*.c`). |
| `GIT_LITERAL_PATHSPECS` | Disables both globs and escape sequences; all characters match literally only.                                       |
| `GIT_ICASE_PATHSPECS`   | Makes all pathspec matches case-insensitive.                                                                         |

---

## 4. Commit Author & Identity

These variables override configurations like `user.name` and `user.email`.

| Variable              | Description                                                          |
| :-------------------- | :------------------------------------------------------------------- |
| `GIT_AUTHOR_NAME`     | The human-readable name placed in the "author" field of a commit.    |
| `GIT_AUTHOR_EMAIL`    | The email address placed in the "author" field of a commit.          |
| `GIT_AUTHOR_DATE`     | Timestamp override used for the author field.                        |
| `GIT_COMMITTER_NAME`  | The human-readable name placed in the "committer" field of a commit. |
| `GIT_COMMITTER_EMAIL` | The email address placed in the "committer" field of a commit.       |
| `GIT_COMMITTER_DATE`  | Timestamp override used for the committer field.                     |
| `EMAIL`               | Fallback email address if `user.email` is not configured.            |

---

## 5. Network & Security Settings

| Variable              | Description                                                                                                      |
| :-------------------- | :--------------------------------------------------------------------------------------------------------------- |
| `GIT_CURL_VERBOSE`    | Instructs Git to print full curl debug logs. Identical to running `curl -v` under HTTPS protocol.                |
| `GIT_SSL_NO_VERIFY`   | Setting this to `true` disables SSL certificate validation.                                                      |
| `GIT_HTTP_USER_AGENT` | Sets the User-Agent string sent during HTTP operations. Defaults to `git/<version>`.                             |
| `GIT_ASKPASS`         | Overrides the `core.askpass` setting. Defines a program to execute when prompting for passwords.                 |
| `GIT_TERMINAL_PROMPT` | If set to `0`, disables terminal prompts (e.g., password requests), causing commands to fail instead of hanging. |

---

## 6. Diff & Merge Operations

| Variable              | Description                                                                                                                                                |
| :-------------------- | :--------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `GIT_DIFF_OPTS`       | Options passed to the diff tool. Supported parameters are `-u<n>` or `--unified=<n>` to control context lines.                                             |
| `GIT_EXTERNAL_DIFF`   | Overrides the `diff.external` configuration to launch a custom external tool for displaying diffs.                                                         |
| `GIT_MERGE_VERBOSITY` | Controls the strategical output volume during merges (0 = Silent except errors, 1 = Conflicts only, 2 = Default changes details, 5+ = Verbose debug info). |

---

## 7. Traces & Diagnostics

Setting any of these variables to `true`, `1`, or `2` outputs diagnostics to `stderr`. Alternatively, specify an absolute path starting with `/` to write trace logs to a file.

### GIT_TRACE

Controls general trace logs (e.g., aliases expansion, subprogram executions).

```bash
$ GIT_TRACE=true git lga
20:12:49.877982 git.c:554 trace: exec: 'git-lga'
20:12:49.878369 run-command.c:341 trace: run_command: 'git-lga'
20:12:49.879529 git.c:282 trace: alias expansion: lga => 'log' '--graph' '--pretty=oneline'
```

### GIT_TRACE_PACK_ACCESS

Logs access history inside pack files.

```bash
$ GIT_TRACE_PACK_ACCESS=true git status
20:10:12.081397 sha1_file.c:2088 .git/objects/pack/pack-c3fa...291e.pack 12
20:10:12.081886 sha1_file.c:2088 .git/objects/pack/pack-c3fa...291e.pack 34662
```

### GIT_TRACE_PACKET

Enables packet-level logging for network fetch and push operations.

```bash
$ GIT_TRACE_PACKET=true git ls-remote origin
20:15:14.867043 pkt-line.c:46 packet: git< # service=git-upload-pack
20:15:14.867071 pkt-line.c:46 packet: git< 0000
```

### GIT_TRACE_PERFORMANCE

Logs performance data and timing for individual internal subprograms.

```bash
$ GIT_TRACE_PERFORMANCE=true git gc
20:18:19.499676 trace.c:414 performance: 0.374835000 s: git command: 'git' 'pack-refs'
```

### GIT_TRACE_SETUP

Outputs details about repository configuration, paths, and environment initialization.

```bash
$ GIT_TRACE_SETUP=true git status
20:19:47.086765 trace.c:315 setup: git_dir: .git
20:19:47.087184 trace.c:316 setup: worktree: /workspace
```

---

## 8. Miscellaneous

| Variable            | Description                                                                                                       |
| :------------------ | :---------------------------------------------------------------------------------------------------------------- |
| `GIT_SSH`           | Overrides the SSH executable program invoked when connecting over SSH protocol.                                   |
| `GIT_NAMESPACE`     | Restricts access to references inside a specific namespace (equivalent to the `--namespace` command line option). |
| `GIT_REFLOG_ACTION` | Custom descriptive text recorded directly into the Git reflog of target actions.                                  |
