import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
import type { LoadContext, Plugin } from '@docusaurus/types';

const require = createRequire(import.meta.url);

export type CollectionMapping = {
  pluginType: 'docs' | 'blog';
  pluginId: string;
  collectionName: string;
  contentName: string;
};

export type LocalesSyncOptions = {
  mappings: CollectionMapping[];
};

function syncFilesOptimized(src: string, dest: string) {
  if (!fs.existsSync(src)) return;
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true });
  }

  const entries = fs.readdirSync(src, { withFileTypes: true });

  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);

    if (entry.isDirectory()) {
      syncFilesOptimized(srcPath, destPath);
    } else {
      let shouldWrite = true;
      if (fs.existsSync(destPath)) {
        const srcContent = fs.readFileSync(srcPath);
        const destContent = fs.readFileSync(destPath);
        if (srcContent.equals(destContent)) {
          shouldWrite = false;
        }
      }

      if (shouldWrite) {
        fs.copyFileSync(srcPath, destPath);
      }
    }
  }
}

export default function pluginLocalesSync(
  context: LoadContext,
  options: LocalesSyncOptions,
): Plugin {
  return {
    name: 'docusaurus-plugin-locales-sync',
    loadContent() {
      const { mappings } = options;
      const destI18nRoot = path.resolve(context.siteDir, 'i18n');

      const collectionsPkg = require.resolve('@monorepo/kb-collections/package.json');
      const collectionsRoot = path.dirname(collectionsPkg);

      const processedNamespaces = new Set<string>();

      for (const mapping of mappings) {
        const { pluginType, pluginId, collectionName, contentName } = mapping;
        const sourceLocalesRoot = path.join(
          collectionsRoot,
          'namespaces',
          collectionName,
          'locales',
        );

        if (!fs.existsSync(sourceLocalesRoot)) {
          console.warn(
            `[Locales Sync Plugin] Locales directory not found at ${sourceLocalesRoot}. Proceeding with default language only.`,
          );
          continue;
        }

        console.info(
          `[Locales Sync Plugin] Synchronizing collection '${collectionName}/${contentName}' for plugin '${pluginType}' (id: ${pluginId})...`,
        );

        const locales = fs.readdirSync(sourceLocalesRoot, { withFileTypes: true });
        for (const locale of locales) {
          if (!locale.isDirectory()) continue;

          const localeSrcPath = path.join(sourceLocalesRoot, locale.name);
          const localeDestPath = path.join(destI18nRoot, locale.name);

          // 1. Sync messages for this namespace (only once per namespace to avoid redundant copies)
          if (!processedNamespaces.has(collectionName)) {
            const messagesSrc = path.join(localeSrcPath, 'messages');
            if (fs.existsSync(messagesSrc)) {
              syncFilesOptimized(messagesSrc, localeDestPath);
            }
          }

          // 2. Sync content
          const contentSrc = path.join(localeSrcPath, contentName);
          if (fs.existsSync(contentSrc)) {
            // Resolve target directory based on pluginType and pluginId
            let targetFolder = `docusaurus-plugin-content-${pluginType}`;
            if (pluginId !== 'default') {
              targetFolder += `-${pluginId}`;
            }
            if (pluginType === 'docs') {
              targetFolder += '/current';
            }

            const contentDest = path.join(localeDestPath, targetFolder);
            syncFilesOptimized(contentSrc, contentDest);
          }
        }

        processedNamespaces.add(collectionName);
      }
    },
  };
}
