---
name: skill-expert
description: Skill Creator for the tupynambalucas project. Use when requested to create, refine, analyze, or update custom Agent Skills (.agents/skills/*) within this workspace.
---

# Skill Creator Guidelines

This skill establishes the authoritative, senior-grade engineering guidelines, workflows, and automated verification protocols for creating, updating, and maintaining custom Agent Skills in the **tupynambalucas** monorepo.

---

## 1. Directory Structure Standards

Every custom Agent Skill MUST reside in the `.agents/skills/<skill-name>/` directory and strictly adhere to this standard layout:

```plaintext
.agents/skills/<skill-name>/
├── SKILL.md                 # Required: frontmatter metadata + core guidelines (strictly < 500 lines)
├── scripts/                 # Optional: self-contained, non-interactive automation/validation scripts
├── references/              # Optional: in-depth references, APIs, or templates (Plain GFM Markdown ONLY)
└── assets/                  # Optional: static templates, lookup tables, schemas, or visual mockups
```

All files in a skill's directory MUST be written strictly in **English (en-US)** and contain **zero emojis** and **no absolute paths or file:// links** of any kind.

---

## 2. Frontmatter Specifications

The `SKILL.md` file MUST begin with a valid YAML frontmatter block enclosed by `---` lines. The following fields are defined:

| Field           | Required | Constraints & Best Practices                                                                                                                                                                                       |
| :-------------- | :------- | :----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `name`          | Yes      | 1-64 characters. Unicode lowercase alphanumeric characters and hyphens (`[a-z0-9-]`) only. Must not start or end with a hyphen, nor contain consecutive hyphens. **Must match the parent directory name exactly**. |
| `description`   | Yes      | 1-1024 characters. Imperative phrasing detailing when the skill triggers (e.g., "Use this skill when..."). Focus on user intent, not internal mechanics. List specific contexts or files.                          |
| `compatibility` | No       | 1-500 characters. Explains any specific environmental requirements (e.g., "Requires Python 3.11+, uv, and Docker").                                                                                                |
| `license`       | No       | Short license identifier or reference to a bundled file.                                                                                                                                                           |
| `metadata`      | No       | Optional key-value map for extra parameters.                                                                                                                                                                       |

### Frontmatter Example

```yaml
---
name: database-helper
description: Use this skill when the user wants to execute database migrations, seed data, or query schema structures for MongoDB.
compatibility: Requires Node.js 18+ and Docker.
---
```

---

## 3. Core Execution Playbooks

Always execute these step-by-step procedures when managing Agent Skills:

### A. Skill Creation Playbook

1. **Context Elicitation**: Analyze the target domain's requirements, style guides, and workspace folders. Ground the skill in real-world engineering patterns rather than general LLM assumptions.
2. **Determine Boundaries**: Group tasks into a cohesive operational unit. Avoid scoping too narrowly (causes tool-activation overhead) or too broadly (makes the skill hard to trigger accurately).
3. **Scaffold Directory**:
   - Create the folder `.agents/skills/<skill-name>/`
   - Draft `SKILL.md` with appropriate YAML frontmatter and key guidelines.
   - Limit `SKILL.md` to under 500 lines. If more instructions or details are needed, use Progressive Disclosure: move them into relative reference files (e.g., `references/api-reference.md`).
4. **Enforce Progressive Disclosure**: Tell the agent _exactly when_ to read specific reference files:
   > Read [api-errors.md](references/api-errors.md) if the REST API returns a non-200 status code.
5. **Develop Companion Scripts**: If the skill involves repetitive or fragile terminal commands, write an automated script in `scripts/` using clean Node.js, TypeScript, Python (PEP 723), or Bash.
6. **Execute Automated Validation**: Verify the skill directory using the local validation command before finalizing.

### B. Skill Update Playbook

1. **Analysis**: Read the existing `SKILL.md` and related documents in `references/` to comprehend the skill's current state and constraints.
2. **Surgical Refactoring**: Apply precise edits to the target files. Preserve existing design aesthetics, global styles, and guidelines.
3. **Verify Compliance**: Ensure that any new code blocks, commands, or text adhere to the monorepo's global guardrails (English-first, zero emojis, strict booleans).
4. **Execute Automated Validation**: Run the validation script on the skill directory.

---

## 4. Script Design Guidelines

If a skill contains automated scripts under `scripts/`:

1. **Strictly Non-Interactive**: Scripts MUST run in non-interactive shells. Interactive prompts, confirmation inputs, or visual TTY dialogs are completely forbidden.
2. **Usage with `--help`**: Provide a concise `--help` description documenting available command-line flags, options, exit codes, and typical usage examples.
3. **Structured Outputs**: Output parseable formats (JSON, CSV, TSV) to `stdout` for tool chaining. Print debugging details, progress bars, and diagnostics to `stderr`.
4. **Robust Error Messages**: Write explanatory, actionable error messages. Tell the agent exactly what failed, what was expected, and how to fix it.
5. **Inline Dependencies**: Use self-contained scripts with declared inline dependencies (e.g., PEP 723 for Python using `uv run`, or `tsx` for TypeScript execution in Node).
6. **Safety Gates**: Support a `--dry-run` flag for any destructive, stateful, or batch modifications.

---

## 5. Non-Negotiable Guardrails

All code, templates, and procedures within custom skills MUST conform to the project's core engineering rules:

- **Strict Boolean Logic**: Expressions and conditions must be explicit. Use `if (value === true)` or `if (value !== undefined)`, never `if (value)`. In React JSX, always use explicit comparisons: `{isValid === true && <Component />}` to prevent rendering unwanted `0` or `NaN`.
- **No Floating Promises**: Never leave asynchronous calls unawaited. Use the `void` operator for intentional unawaited background processes: `void asyncFn()`.
- **Zero Emojis**: Emojis are strictly forbidden to maintain a professional, corporate appearance.
- **Strict English-First**: Technical documentation, READMEs, architectural briefs, commit messages, code comments, and variable names/logic MUST be written in English (en-US).

---

## 6. Automated Skill Validation

Before concluding any skill creation or update, you MUST execute the automated validator from the workspace root:

```bash
pnpm exec tsx .agents/skills/skill-expert/scripts/validate-skill.ts --path .agents/skills/<skill-name>
```

Verify that the command exits with a code of `0` and reports no errors. Fix any flagged issues before declaring the task completed.
