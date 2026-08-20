# AGENTS.md File Inventory and Action Plan

This document classifies all 40 `AGENTS.md` files in the monorepo with a quality assessment,
compliance score (1-5), proposed action, and target destination for each file.

Legend: Score 5 = fully compliant | Score 1 = major violations | Actions: Keep / Refactor / Merge / Delete

---

## Layer 1: Global Context

| #   | File       | Score | Action   | Issues                                                                             | Notes                                     |
| :-- | :--------- | :---- | :------- | :--------------------------------------------------------------------------------- | :---------------------------------------- |
| 1   | /AGENTS.md | 3/5   | Refactor | External URL present; missing AI Persona section; missing Technology Stack section | Core structure is solid; needs enrichment |

---

## Layer 2: Bounded Context Routers

| #   | File               | Score | Action   | Issues                                                                                                                           | Notes                                                                |
| :-- | :----------------- | :---- | :------- | :------------------------------------------------------------------------------------------------------------------------------- | :------------------------------------------------------------------- |
| 2   | cortex/AGENTS.md   | 4/5   | Refactor | Missing context-hierarchy directive; no Ubiquitous Language section                                                              | Excellent architecture diagram; port table is exemplary              |
| 3   | hub/AGENTS.md      | 3/5   | Refactor | Missing context-hierarchy directive; no Ubiquitous Language section; no Technology Stack section                                 | Navigation and architecture sections are good                        |
| 4   | platform/AGENTS.md | 4/5   | Refactor | Missing context-hierarchy directive; no Ubiquitous Language section; external path in guardrails                                 | Mermaid diagram and port table are exemplary                         |
| 5   | studio/AGENTS.md   | 4/5   | Refactor | Missing context-hierarchy directive; no Ubiquitous Language section                                                              | Architecture and service mapping are solid                           |
| 6   | tools/AGENTS.md    | 3/5   | Refactor | Missing context-hierarchy directive; navigation links point to sub-AGENTS.md (should be removed); no Ubiquitous Language section | Lightweight but functional                                           |
| 7   | renderer/AGENTS.md | 3/5   | Refactor | Missing context-hierarchy directive; no Ubiquitous Language section; missing bounded context classification                      | Good architecture detail but classified incorrectly as Local Context |
| 8   | docs/AGENTS.md     | 3/5   | Refactor | Missing context-hierarchy directive; localhost URL in Scoped Operations (acceptable)                                             | Guardrails section is exemplary                                      |

---

## Layer 3: Technical Sub-Domain Contexts

### Cortex Sub-Domains

| #   | File                            | Score | Action   | Issues                                                                                                          | Notes                                      |
| :-- | :------------------------------ | :---- | :------- | :-------------------------------------------------------------------------------------------------------------- | :----------------------------------------- |
| 9   | cortex/gateway/AGENTS.md        | 4/5   | Refactor | Missing context-hierarchy directive                                                                             | Content is focused and non-redundant       |
| 10  | cortex/infrastructure/AGENTS.md | 4/5   | Refactor | Missing context-hierarchy directive                                                                             | Compose profile documentation is valuable  |
| 11  | cortex/mcp/AGENTS.md            | 4/5   | Refactor | Missing context-hierarchy directive; navigation links to leaf-node files that will be deleted                   | Architecture pipeline section is excellent |
| 12  | cortex/memory/AGENTS.md         | 3/5   | Refactor | Missing context-hierarchy directive; navigation links to leaf-node files that will be deleted; no code snippets | DDD principles section is valuable         |

### Cortex MCP Micro-Services (Consolidate)

| #   | File                                     | Score | Action | Target               | Unique Rules to Migrate                                |
| :-- | :--------------------------------------- | :---- | :----- | :------------------- | :----------------------------------------------------- |
| 13  | cortex/mcp/guardrails/AGENTS.md          | 2/5   | Merge  | cortex/mcp/AGENTS.md | ExtMCP gRPC guardrail-specific implementation patterns |
| 14  | cortex/mcp/inspector/AGENTS.md           | 2/5   | Merge  | cortex/mcp/AGENTS.md | Inspector service port and usage rules                 |
| 15  | cortex/mcp/services/context7/AGENTS.md   | 1/5   | Delete | cortex/mcp/AGENTS.md | No unique rules beyond what parent already contains    |
| 16  | cortex/mcp/services/firecrawl/AGENTS.md  | 1/5   | Delete | cortex/mcp/AGENTS.md | No unique rules beyond what parent already contains    |
| 17  | cortex/mcp/services/github/AGENTS.md     | 1/5   | Delete | cortex/mcp/AGENTS.md | No unique rules beyond what parent already contains    |
| 18  | cortex/mcp/services/grafana/AGENTS.md    | 1/5   | Delete | cortex/mcp/AGENTS.md | No unique rules beyond what parent already contains    |
| 19  | cortex/mcp/services/memory/AGENTS.md     | 1/5   | Delete | cortex/mcp/AGENTS.md | No unique rules beyond what parent already contains    |
| 20  | cortex/mcp/services/playwright/AGENTS.md | 1/5   | Delete | cortex/mcp/AGENTS.md | No unique rules beyond what parent already contains    |

### Cortex Memory Micro-Services (Consolidate)

| #   | File                                     | Score | Action | Target                  | Unique Rules to Migrate                               |
| :-- | :--------------------------------------- | :---- | :----- | :---------------------- | :---------------------------------------------------- |
| 21  | cortex/memory/packages/core/AGENTS.md    | 3/5   | Merge  | cortex/memory/AGENTS.md | Core package schema conventions and import rules      |
| 22  | cortex/memory/services/api/AGENTS.md     | 3/5   | Merge  | cortex/memory/AGENTS.md | Fastify API domain layering and vectorSearch patterns |
| 23  | cortex/memory/services/mongodb/AGENTS.md | 2/5   | Merge  | cortex/memory/AGENTS.md | Replica set initialization guardrails                 |
| 24  | cortex/memory/services/web/AGENTS.md     | 3/5   | Merge  | cortex/memory/AGENTS.md | FSD layer import rules for React dashboard            |

### Hub Sub-Domains

| #   | File                        | Score | Action   | Issues                                                           | Notes                                                               |
| :-- | :-------------------------- | :---- | :------- | :--------------------------------------------------------------- | :------------------------------------------------------------------ |
| 25  | hub/packages/core/AGENTS.md | 4/5   | Refactor | Missing context-hierarchy directive                              | Schema conventions are well-documented                              |
| 26  | hub/services/api/AGENTS.md  | 5/5   | Refactor | Missing context-hierarchy directive only                         | Exemplary: code snippets, layered architecture, security guardrails |
| 27  | hub/services/web/AGENTS.md  | 3/5   | Refactor | Missing context-hierarchy directive; verify content completeness | Needs inspection before final score                                 |

### Platform Sub-Domains (Consolidate)

| #   | File                                   | Score | Action | Target             | Unique Rules to Migrate                                              |
| :-- | :------------------------------------- | :---- | :----- | :----------------- | :------------------------------------------------------------------- |
| 28  | platform/infrastructure/AGENTS.md      | 2/5   | Merge  | platform/AGENTS.md | Kustomize secret generation and Compose profile rules                |
| 29  | platform/services/grafana/AGENTS.md    | 1/5   | Delete | platform/AGENTS.md | Declarative provisioning rule already in platform/AGENTS.md          |
| 30  | platform/services/headlamp/AGENTS.md   | 1/5   | Delete | platform/AGENTS.md | No unique rules; already covered by port table in platform/AGENTS.md |
| 31  | platform/services/loki/AGENTS.md       | 1/5   | Delete | platform/AGENTS.md | No unique rules; already covered by port table in platform/AGENTS.md |
| 32  | platform/services/otelcol/AGENTS.md    | 2/5   | Merge  | platform/AGENTS.md | OTLP pipeline configuration syntax examples                          |
| 33  | platform/services/prometheus/AGENTS.md | 1/5   | Delete | platform/AGENTS.md | No unique rules; already covered by guardrails in platform/AGENTS.md |
| 34  | platform/services/tempo/AGENTS.md      | 1/5   | Delete | platform/AGENTS.md | No unique rules; already covered by port table in platform/AGENTS.md |
| 35  | platform/services/turbocache/AGENTS.md | 2/5   | Merge  | platform/AGENTS.md | Cache token auth and artifact retention rules                        |

### Studio Sub-Domains (Consolidate)

| #   | File                            | Score | Action | Target           | Unique Rules to Migrate                                |
| :-- | :------------------------------ | :---- | :----- | :--------------- | :----------------------------------------------------- |
| 36  | studio/assets/AGENTS.md         | 3/5   | Merge  | studio/AGENTS.md | Token naming conventions and SVG export pipeline rules |
| 37  | studio/bucket/AGENTS.md         | 2/5   | Merge  | studio/AGENTS.md | R2 sync CLI usage and credential rules                 |
| 38  | studio/infrastructure/AGENTS.md | 2/5   | Merge  | studio/AGENTS.md | Penpot + Memos deploy guardrails                       |

### Tools Sub-Domains (Consolidate)

| #   | File                        | Score | Action | Target          | Unique Rules to Migrate                                          |
| :-- | :-------------------------- | :---- | :----- | :-------------- | :--------------------------------------------------------------- |
| 39  | tools/github/AGENTS.md      | 2/5   | Merge  | tools/AGENTS.md | Docker volume mount parity and GitHub CLI containerization rules |
| 40  | tools/provisioner/AGENTS.md | 2/5   | Merge  | tools/AGENTS.md | WSL2 bootstrapping and shell script hardening rules              |

---

## Summary Counts

| Action                               | Count | Files                                                                                       |
| :----------------------------------- | :---- | :------------------------------------------------------------------------------------------ |
| **Refactor** (keep, upgrade content) | 20    | Layer-1, Layer-2, and core Layer-3 files                                                    |
| **Merge** (absorb into parent)       | 11    | Guardrails, inspector, memory sub-services, platform infra, studio sub-dirs, tools sub-dirs |
| **Delete** (no unique rules)         | 9     | 6x cortex/mcp/services/_, 3x platform/services/_                                            |
| **Total**                            | 40    |                                                                                             |

---

## Post-Refactoring Target Count

After consolidation: **20 files** across 3 layers.

| Layer   | Count | Files                                                                                                                                                 |
| :------ | :---- | :---------------------------------------------------------------------------------------------------------------------------------------------------- |
| Layer 1 | 1     | /AGENTS.md                                                                                                                                            |
| Layer 2 | 7     | cortex, hub, platform, studio, tools, renderer, docs                                                                                                  |
| Layer 3 | 12    | cortex/gateway, cortex/infrastructure, cortex/mcp, cortex/memory, hub/packages/core, hub/services/api, hub/services/web, plus any justified additions |
