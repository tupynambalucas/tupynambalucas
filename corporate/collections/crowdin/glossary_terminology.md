# Crowdin Glossary & Terminology

This file serves as the definitive single source of truth for terms that must be standardized or remain untranslated in localized languages. Import these terms into the Crowdin Glossary to protect the technical integrity of the documentation.

## General Engineering Terms

| Term / Phrase           | Part of Speech | Subject               | Definition                                                                                                                   | Translatable |
| :---------------------- | :------------- | :-------------------- | :--------------------------------------------------------------------------------------------------------------------------- | :----------- |
| `Monorepo`              | Noun           | Software Engineering  | A software development strategy where code for many projects is stored in the same repository.                               | ❌ False     |
| `Framework`             | Noun           | Software Engineering  | An abstraction in which software providing generic functionality can be selectively changed by additional user-written code. | ❌ False     |
| `Feature-Sliced Design` | Noun           | Software Architecture | An architectural methodology for frontend projects based on decoupling by features.                                          | ❌ False     |
| `Branch`                | Noun           | Version Control       | An independent line of development in Git.                                                                                   | ❌ False     |
| `Deploy`                | Verb / Noun    | DevOps                | The process of updating the application in a specific environment.                                                           | ❌ False     |
| `Pull Request`          | Noun           | Version Control       | A method of submitting contributions to an open development project.                                                         | ❌ False     |
| `Backend`               | Noun           | Software Engineering  | The data access layer of software or hardware.                                                                               | ❌ False     |
| `Frontend`              | Noun           | Software Engineering  | The presentation layer of an application.                                                                                    | ❌ False     |
| `Pipeline`              | Noun           | DevOps                | A set of automated processes that allow developers to compile, build, and deploy code.                                       | ❌ False     |
| `Workspace`             | Noun           | Software Engineering  | A logical directory within a monorepo containing a specific package or service.                                              | ❌ False     |
| `Commit`                | Noun / Verb    | Version Control       | An operation which sends the latest changes of the source code to the repository.                                            | ❌ False     |
| `GitOps`                | Noun           | DevOps                | A framework that uses Git repositories as a single source of truth to deliver infrastructure as code.                        | ❌ False     |
| `Design Tokens`         | Noun           | UI/UX Design          | The visual design atoms of the design system (colors, typography, spacing).                                                  | ❌ False     |
| `AST`                   | Noun           | Computer Science      | Abstract Syntax Tree - a tree representation of the abstract syntactic structure of source code.                             | ❌ False     |

## Technologies & Brands

| Term / Phrase       | Part of Speech | Subject              | Definition                                                                      | Translatable |
| :------------------ | :------------- | :------------------- | :------------------------------------------------------------------------------ | :----------- |
| `AgentGateway`      | Proper Noun    | Cortex / AI          | The core MCP ingress proxy and observability layer for agentic operations.      | ❌ False     |
| `Firecrawl`         | Proper Noun    | Cortex / AI          | Autonomous web scraping and crawling service.                                   | ❌ False     |
| `Docusaurus`        | Proper Noun    | Knowledge Base       | A static-site generator that builds single-page applications with React.        | ❌ False     |
| `MDX`               | Proper Noun    | Knowledge Base       | Markdown for the component era. Allows writing JSX in markdown documents.       | ❌ False     |
| `Turborepo`         | Proper Noun    | Tooling              | A high-performance build system for JavaScript and TypeScript codebases.        | ❌ False     |
| `React`             | Proper Noun    | Software Engineering | A JavaScript library for building user interfaces.                              | ❌ False     |
| `Cloudflare Pages`  | Proper Noun    | Infrastructure       | A JAMstack platform for frontend developers to collaborate and deploy websites. | ❌ False     |
| `Cloudflare Tunnel` | Proper Noun    | Infrastructure       | A secure connection between your web server and the Cloudflare network.         | ❌ False     |
| `Diátaxis`          | Proper Noun    | Documentation        | A systematic framework for technical documentation authoring.                   | ❌ False     |

## Internal Monorepo Domains

| Term / Phrase | Part of Speech | Subject         | Definition                                                              | Translatable |
| :------------ | :------------- | :-------------- | :---------------------------------------------------------------------- | :----------- |
| `Cortex`      | Proper Noun    | Monorepo Domain | The AI processing hub housing AgentGateway, Memory, and Agent Runtimes. | ❌ False     |
| `Hub`         | Proper Noun    | Monorepo Domain | The developer website client and REST API domain.                       | ❌ False     |
| `Platform`    | Proper Noun    | Monorepo Domain | The cluster infrastructure and observability domain.                    | ❌ False     |
| `Renderer`    | Proper Noun    | Monorepo Domain | The dynamic asset generator domain.                                     | ❌ False     |
| `Studio`      | Proper Noun    | Monorepo Domain | The brand identity and collaborative design domain.                     | ❌ False     |
| `Tools`       | Proper Noun    | Monorepo Domain | The CLI automation and containerized Git environment domain.            | ❌ False     |
