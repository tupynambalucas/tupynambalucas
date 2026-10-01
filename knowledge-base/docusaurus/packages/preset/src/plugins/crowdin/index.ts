import fs from 'node:fs';
import path from 'node:path';
import { execSync } from 'node:child_process';
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
        // Compare byte by byte
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
      const source = path.join(namespacePath, 'translations');

      const hasTranslationsLocally = fs.existsSync(source);
      const isDev = process.env.NODE_ENV === 'development';
      const shouldSync = process.env.SYNC_TRANSLATIONS === 'true';

      if (isDev && !shouldSync) {
        console.info(
          `[Crowdin Plugin] Development server detected. Skipping Crowdin translations check.`,
        );
      } else if (shouldSync || !hasTranslationsLocally) {
        console.info(`[Crowdin Plugin] Starting bidirectional sync with Crowdin...`);

        const projectId = process.env.CROWDIN_PROJECT_ID;
        const hasToken = !!process.env.CROWDIN_PERSONAL_TOKEN;

        if (!projectId || !hasToken) {
          throw new Error(
            `[Crowdin Plugin] FATAL: Missing Crowdin credentials! Project ID: ${projectId || 'MISSING'}, Token present: ${hasToken}`,
          );
        }

        try {
          console.info(`[Crowdin Plugin] Uploading english sources...`);
          const authArgs = `--project-id "${projectId}" --token "${process.env.CROWDIN_PERSONAL_TOKEN}"`;

          execSync(`npx crowdin upload sources --config crowdin.yml ${authArgs}`, {
            cwd: namespacePath,
            stdio: 'inherit',
          });

          console.info(`[Crowdin Plugin] Downloading translations package...`);
          try {
            execSync(`npx crowdin download --config crowdin.yml ${authArgs}`, {
              cwd: namespacePath,
              stdio: 'inherit',
            });
          } catch (dlError: any) {
            console.warn(
              `[Crowdin Plugin] Download returned exit code ${dlError.status}. This usually means translations are not ready yet on Crowdin. Proceeding with build...`,
            );
          }
        } catch (error) {
          console.error(`[Crowdin Plugin] Crowdin CLI Error:`, error);
          throw error;
        }
      } else {
        console.info(
          `[Crowdin Plugin] Local translations found for namespace '${collection}'. Skipping download.`,
        );
      }

      // Sync the downloaded translations into the Docusaurus i18n directory optimized
      if (fs.existsSync(source)) {
        console.info(`[Crowdin Plugin] Synchronizing translations from ${source} to ${dest}...`);
        syncFilesOptimized(source, dest);
      }
    },
  };
}
