# Docusaurus Ecosystem

This directory houses the Docusaurus instances, presets, and themes responsible for rendering our static documentation sites.

## Packages

- **services/monorepo/**: The primary application. It dynamically references the agnostic markdown from `../../docs/monorepo`.
- **packages/preset/**: Custom preset handling domains and plugin resolution.
- **packages/theme/**: Custom React components and styling.
