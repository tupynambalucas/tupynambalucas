# Collections Architecture Refactoring Plan

## 1. Problem Statement

Currently, the `docusaurus.config.ts` requires manual assembly of absolute paths using `path.join(collectionsRoot, ...)` for every content plugin instance. Furthermore, the `plugin-crowdin` uses a hardcoded `I18N_MAPPING` dictionary to copy localized content into the Docusaurus engine folder. As we scale to support multiple collections across multiple plugin instances (`docs` and `blog`), this manual architecture becomes unmaintainable.

## 2. Solution: The Locales Sync Plugin and Preset Orchestration

We will introduce a universal `collection` string identifier for document-based content plugins (`docs`, `blog`) in the format `[collectionName]/[contentName]`.

Example: `portal/docs` or `portal/community`.

_(Note: The `pages` plugin handles React components inside the engine's `src/pages` directory and is excluded from this `.mdx` collection logic)._

### A. Preset Configuration Simplification

In `docusaurus.config.ts`, developers will simply declare the `collection` identifier. To support multiple collections for ANY markdown plugin, we will ensure that `docs` and `blog` options accept arrays of configurations.

```typescript
docs: [
  {
    id: 'default',
    collection: 'portal/docs',
    routeBasePath: 'docs',
  },
  {
    id: 'community',
    collection: 'portal/community',
    routeBasePath: 'community',
  },
];
```

### B. Preset Interception (The Orchestrator)

Inside `preset/src/index.ts`, before instantiating the domain wrappers, the Preset will intercept the `docs` and `blog` configurations:

1. It splits the `collection` string into `collectionName` (`portal`) and `contentName` (`community`).
2. It calculates the native `path` automatically:
   `path.join(collectionsRoot, 'namespaces', collectionName, 'content', contentName)`
3. It extracts these settings into an array of `CollectionMapping` objects to pass to the localization engine.

### C. The Locales Sync Plugin (Replaces Crowdin Plugin)

The `crowdin` plugin will be renamed to `locales-sync` plugin. It is completely platform-agnostic and relies only on the GitOps file structure (meaning it works perfectly for manual translations as well). It receives the `CollectionMapping` array from the preset.

In its `loadContent()` lifecycle method, it dynamically resolves all localization paths without any hardcoded dictionaries:

1. **Iterate over mappings:** For every plugin instance registered (`docs`, `blog`)...
2. **Resolve Source Translation Path:**
   `collections/namespaces/{collectionName}/locales/{locale}/{contentName}`
3. **Resolve Docusaurus Target Path:**
   `i18n/{locale}/docusaurus-plugin-content-{pluginType}-{pluginId}`
   _(Note: if `pluginId` is `default`, the suffix `-[id]` is omitted. For `docs` instances, `/current` is appended)._
4. **Synchronize Content:** Copy the localized markdown files from the source path to the target path.
5. **Synchronize Messages (UI Strings):** For every unique `collectionName` encountered, synchronize its `locales/{locale}/messages/` folder directly into the root of `i18n/{locale}/` to unpack the UI JSON translations (which covers navbar, footer, and React page strings).

## 3. Implementation Steps

1. **Refactor Types**: Update `MonorepoPresetOptions` in `options.ts` so that `docs` and `blog` accept `false | PluginOptions | PluginOptions[]`, and extend them with the custom `collection?: string` field.
2. **Rename Plugin**: Rename `preset/src/plugins/crowdin` to `preset/src/plugins/locales-sync`.
3. **Update Preset Logic**: Rewrite `monorepoPreset` in `preset/src/index.ts` to implement the string splitting (`portal/docs`), path injection, and mapping extraction for `docs` and `blog`.
4. **Update Locales Sync Plugin**: Rewrite `preset/src/plugins/locales-sync/index.ts` to use dynamic Docusaurus i18n resolution.
5. **Update Config**: Refactor `docusaurus.config.ts` to use the new streamlined `collection: 'portal/docs'` syntax, removing manual `path` definitions.
6. **Update Docs**: Update `plugins-architecture.mdx` (and its pt-BR counterpart) to document this dynamic resolution logic.

## 4. Why This Works (Docusaurus API Alignment)

- Docusaurus naturally supports multiple instances for `docs` and `blog` as long as their `id` and `routeBasePath` are unique.
- Passing dynamic arrays of plugins through a custom Preset is a first-class Docusaurus feature.
- File synchronization during the `loadContent` hook of a plugin executes before the Docusaurus Webpack compilation, ensuring the `i18n` engine perfectly consumes the copied locales.
