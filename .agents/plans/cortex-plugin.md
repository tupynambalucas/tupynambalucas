# Plan: Cortex MCP Plugin for Antigravity

## Context

The Antigravity agent currently loads the `agentgateway` MCP only with GitHub and Context7 tools
visible. The `mcp_config.json` file at `.agents/mcp_config.json` is **not a supported discovery
path** for MCP configurations — Antigravity only loads `mcp_config.json` from:

- `~/.gemini/config/mcp_config.json` (global, machine-local)
- `.agents/plugins/<plugin_name>/mcp_config.json` (plugin-scoped)

The Cortex AgentGateway already exposes all MCP tools (firecrawl, grafana, playwright, memory,
github, context7) correctly. The fix is to wrap the gateway config in a proper Antigravity Plugin so
it is discovered automatically from `.agents/`.

---

## Goal

Create `.agents/plugins/cortex/` — a fully compliant Antigravity Plugin that:

1. Registers the `agentgateway` MCP server (the one URL, one token).
2. Bundles the per-service `instructions.md` files already authored in `cortex/mcp/services/` as a
   single consolidated `rules/AGENTS.md`.
3. Exposes no skills of its own (routing skills live in `.agents/skills/` already).
4. Ships **enabled by default** so every new conversation auto-connects to the gateway.

---

## Target Structure

```text
.agents/
└── plugins/
    └── cortex/
        ├── plugin.json        # Manifest — declares plugin name
        ├── mcp_config.json    # AgentGateway connection (moved/promoted from .agents/mcp_config.json)
        └── rules/
            └── AGENTS.md      # Consolidated instructions for all MCP services exposed by the gateway
```

---

## Step-by-Step Plan

### Step 1 — Create `plugin.json`

File: `.agents/plugins/cortex/plugin.json`

```json
{
  "name": "cortex"
}
```

No `"disabled": true` field — ships enabled by default.

### Step 2 — Promote `mcp_config.json` into the Plugin

Move the contents of `.agents/mcp_config.json` to `.agents/plugins/cortex/mcp_config.json`.

The existing `mcp_config.json` at `.agents/` root becomes stale and should be either deleted or
kept as a plain reference artifact (it will not be loaded by Antigravity from that location).

Contents (unchanged from current):

```json
{
  "mcpServers": {
    "agentgateway": {
      "url": "https://agentgateway-mcp-dev.tupynambalucas.dev/mcp",
      "headers": {
        "x-mcp-token": "<token-from-.agents/.env>"
      },
      "lifecycle": "eager"
    }
  }
}
```

> Note: The token is currently hardcoded in `.agents/mcp_config.json`. Evaluate whether to keep it
> inline (acceptable for a personal monorepo checked in privately) or reference an env var. The
> `.agents/.gitignore` should confirm the token is not accidentally published if the repo is public.

### Step 3 — Create `rules/AGENTS.md`

File: `.agents/plugins/cortex/rules/AGENTS.md`

This file consolidates the routing and usage instructions for every MCP service exposed by the
gateway. It is the single source of truth the agent reads when deciding which tool to use. Source
content from:

| Source file                                     | Service                                      |
| :---------------------------------------------- | :------------------------------------------- |
| `cortex/mcp/services/firecrawl/instructions.md` | Firecrawl (scrape, crawl, extract, research) |
| `cortex/mcp/services/github/` (if present)      | GitHub MCP                                   |
| `cortex/mcp/services/grafana/` (if present)     | Grafana MCP                                  |
| `cortex/mcp/services/playwright/` (if present)  | Playwright MCP                               |
| `cortex/mcp/services/memory/` (if present)      | Memory RAG MCP                               |
| `cortex/mcp/services/context7/` (if present)    | Context7 docs MCP                            |

The `AGENTS.md` must follow the global constraint: written in English (en-US), no emojis, no
placeholders, Prettier-formatted at 100-char line width.

Recommended structure for `rules/AGENTS.md`:

```markdown
# Cortex Plugin — MCP Service Instructions

## AgentGateway

Single ingress at `agentgateway-mcp-dev.tupynambalucas.dev`. All services below are
accessed through it.

---

## Firecrawl

<contents of cortex/mcp/services/firecrawl/instructions.md>

---

## GitHub / Grafana / Playwright / Memory / Context7

...
```

### Step 4 — Update `.agents/.gitignore`

Ensure the MCP token is not committed if the repo is public. If the token is inline in
`mcp_config.json`, add an entry:

```gitignore
# Cortex plugin secrets
plugins/cortex/mcp_config.json
```

Alternatively, if the repo is private and the token is acceptable in VCS, skip this step.

### Step 5 — Retire the Stale Root `mcp_config.json`

The file `.agents/mcp_config.json` was never loaded by Antigravity (wrong path). Options:

- **Delete it** — cleaner; the plugin is now the authoritative source.
- **Keep as reference** — rename or add a comment noting it is superseded by the plugin.

Recommended: delete it; `mcp_config_example.json` already serves as documentation.

### Step 6 — Restart the Antigravity Session

Plugin discovery happens at session startup. After creating the plugin:

1. Close and reopen the Antigravity conversation (or run `agy` fresh).
2. Verify via **Additional Options (...) > MCP Servers** that `agentgateway` appears with all
   firecrawl, grafana, playwright, memory tools listed.
3. Test with a `firecrawl_scrape` call to confirm end-to-end connectivity.

---

## Validation Checklist

- [ ] `.agents/plugins/cortex/plugin.json` exists and is valid JSON.
- [ ] `.agents/plugins/cortex/mcp_config.json` contains `agentgateway` with correct URL and token.
- [ ] `.agents/plugins/cortex/rules/AGENTS.md` documents all gateway-exposed services.
- [ ] Stale `.agents/mcp_config.json` is deleted or renamed.
- [ ] `.agents/.gitignore` protects the token if needed.
- [ ] New Antigravity session lists `firecrawl_scrape` and other cortex tools as available MCP tools.
- [ ] `firecrawl_scrape` executes successfully against a test URL.

---

## Risk Notes

- **Token exposure**: The MCP token in `mcp_config.json` grants access to all Cortex MCP services.
  Confirm whether this repository is public before committing it.
- **`lifecycle: eager`**: Keeps the current behavior — gateway is connected at session start, so all
  tool schemas are pre-loaded. Correct for an always-on cluster gateway.
- **`failureMode: failOpen`** on the gateway side means if any upstream (e.g., `mcp-grafana`) is
  temporarily down, the gateway continues serving the others. No change needed here.
