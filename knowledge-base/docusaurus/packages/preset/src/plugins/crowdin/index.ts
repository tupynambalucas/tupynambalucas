import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
import type { LoadContext, Plugin } from '@docusaurus/types';

const require = createRequire(import.meta.url);

export type CrowdinOptions = {
  collection: string;
};

// Map Crowdin source folders to Docusaurus i18n expected folders
const I18N_MAPPING: Record<string, string> = {
  docs: 'docusaurus-plugin-content-docs/current',
  community: 'docusaurus-plugin-content-docs-community/current',
  blog: 'docusaurus-plugin-content-blog',
  pages: 'docusaurus-plugin-content-pages',
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

export default function pluginCrowdin(context: LoadContext, options: CrowdinOptions): Plugin {
  return {
    name: 'docusaurus-plugin-crowdin-unified',
    async loadContent() {
      const { collection } = options;
      const destI18nRoot = path.resolve(context.siteDir, 'i18n');

      const collectionsPkg = require.resolve('@monorepo/kb-collections/package.json');
      const collectionsRoot = path.dirname(collectionsPkg);
      const namespacePath = path.join(collectionsRoot, 'namespaces', collection);
      const sourceLocalesRoot = path.join(namespacePath, 'locales');

      if (!fs.existsSync(sourceLocalesRoot)) {
        console.warn(
          `[Crowdin Plugin] Locales directory not found at ${sourceLocalesRoot}. Proceeding with default language only.`,
        );
        return;
      }

      console.info(
        `[Crowdin Plugin] Synchronizing locales from ${sourceLocalesRoot} to ${destI18nRoot}...`,
      );

      const locales = fs.readdirSync(sourceLocalesRoot, { withFileTypes: true });
      for (const locale of locales) {
        if (!locale.isDirectory()) continue;
        const localeSrcPath = path.join(sourceLocalesRoot, locale.name);
        const localeDestPath = path.join(destI18nRoot, locale.name);

        const contentTypes = fs.readdirSync(localeSrcPath, { withFileTypes: true });
        for (const contentType of contentTypes) {
          if (!contentType.isDirectory()) continue;

          if (contentType.name === 'i18n-json') {
            syncFilesOptimized(path.join(localeSrcPath, 'i18n-json'), localeDestPath);
            continue;
          }

          const mappedFolder = I18N_MAPPING[contentType.name];
          if (mappedFolder) {
            const mappedSrc = path.join(localeSrcPath, contentType.name);
            const mappedDest = path.join(localeDestPath, mappedFolder);
            syncFilesOptimized(mappedSrc, mappedDest);
          } else {
            // Fallback for custom or unmapped folders
            syncFilesOptimized(
              path.join(localeSrcPath, contentType.name),
              path.join(localeDestPath, contentType.name),
            );
          }
        }
      }
    },
  };
}
