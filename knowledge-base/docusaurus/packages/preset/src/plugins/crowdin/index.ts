import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
import type { LoadContext, Plugin } from '@docusaurus/types';

const require = createRequire(import.meta.url);

export type CrowdinOptions = {
  collection: string;
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
      const dest = path.resolve(context.siteDir, 'i18n');

      const collectionsPkg = require.resolve('@monorepo/kb-collections/package.json');
      const collectionsRoot = path.dirname(collectionsPkg);
      const namespacePath = path.join(collectionsRoot, 'namespaces', collection);
      const source = path.join(namespacePath, 'locales');

      if (!fs.existsSync(source)) {
        console.warn(
          `[Crowdin Plugin] Locales directory not found at ${source}. Proceeding with default language only.`,
        );
        return;
      }

      console.info(`[Crowdin Plugin] Synchronizing locales from ${source} to ${dest}...`);
      syncFilesOptimized(source, dest);
    },
  };
}
