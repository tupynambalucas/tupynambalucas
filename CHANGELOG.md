# Changelog

All updates, improvements, and new features of tupynambalucas.dev documented in the Knowledge Base.

## Release - v1.0.0 (2026-10-03)

Welcome to the first official major release of %PROJECT_DOMAIN% (`v1.0.0`)! This update establishes our core architecture, localization infrastructure, and unifies our content strategy.

{/* truncate */}

### Highlights

- **Unified Content Architecture**: We have officially merged the Changelog and the Blog into a single chronological timeline. All releases, updates, and regular posts are now accessed in one unified view.
- **Enterprise Localization Pipeline**:
  - Restructured our translation strategy, extracting Docusaurus React UI strings into a dedicated, enterprise-standard `messages/` folder.
  - Deployed a unified plugin to automatically unpack Crowdin translations directly into the Docusaurus native locale structure.
  - Successfully mapped Crowdin properties for Docusaurus JSON (`type: chrome`), preventing translators from modifying system keys.
  - Completed the first full wave of Portuguese (pt-BR) localization covering Brand Principles, Design Tokens, Cloudflare Storage, and the entire Knowledge Base Overview.
- **GitOps and Automation**: Hardened our `.github/` workflows for synchronized translation deployment and architecture-as-code principles.

We are ready to scale!
