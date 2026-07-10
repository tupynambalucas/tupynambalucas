# Workspace Context: Studio Bucket Synchronizer

This file establishes the localized rules, stack-specific standards, and engineering guardrails for AI agents working within the `@tupynambalucas-studio/assets` asset synchronization tool (`[studio/bucket/](./)`).

---

## Technical Stack & Dependencies

All files in this workspace MUST be strictly written in TypeScript complying with ESM module execution. The tech stack consists of:

- **Storage Adapter**: `@aws-sdk/client-s3` (defined in [package.json](../package.json)).
- **HTTP Handler**: `@smithy/node-http-handler` (defined in [package.json](../package.json)), configured with customized HTTP/HTTPS agents for connection pooling and lifecycle tuning.
- **Filesystem Scanner**: `glob` (defined in [package.json](../package.json)).
- **Config Loader**: `dotenv` (defined in [package.json](../package.json)), which loads variables from the dynamic environment file `[.env.studio.bucket](./.env.studio.bucket)`.

---

## Core Engineering Guardrails

1. **Free-Tier Optimization (Cloudflare R2)**:
   - Operations MUST minimize Class A and Class B API calls to guarantee usage remains under the free monthly quotas (1M Class A, 10M Class B).
   - **No redundant uploads/downloads**: AI agents MUST ALWAYS compare the local file's size and MD5 hash against the remote object's size and ETag.
   - **Never hardcode paths**: AI agents MUST ALWAYS resolve synchronization targets dynamically from `[assets-manifest.json](../assets-manifest.json)`.

2. **Strict Boolean Logic & Optional Parameters**:
   - Conditionals MUST ALWAYS be explicit. Use `if (value === true)` or `if (value !== undefined)`. AI agents MUST NEVER rely on implicit truthiness.

3. **No Unawaited Promises**:
   - All asynchronous calls MUST ALWAYS be fully awaited. AI agents MUST NEVER leave asynchronous promises floating. Use `void` only for explicit background processes that are intentionally detached.

---

## Scoped Quality Verification

Before completing any code or structure edits, AI agents MUST run validation checks from the monorepo root:

- **Typecheck**: `pnpm studio:typecheck`
- **Linter**: `pnpm studio:lint`
- **Verify Git Status**: `git status` to ensure a clean working tree.
