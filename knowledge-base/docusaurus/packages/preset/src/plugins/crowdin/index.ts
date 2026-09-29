import fs from 'node:fs';
import path from 'node:path';
import type { LoadContext, Plugin } from '@docusaurus/types';
import { downloadDomainTranslations, getDomainTranslationsPath } from '@monorepo/kb-collections';

export type CrowdinOptions = {
  collection: string;
};

export default function pluginCrowdin(context: LoadContext, options: CrowdinOptions): Plugin {
  return {
    name: 'docusaurus-plugin-crowdin-unified',
    async loadContent() {
      const { collection } = options;
      const dest = path.resolve(context.siteDir, 'i18n');
      const source = getDomainTranslationsPath(collection);

      const hasTranslationsLocally = fs.existsSync(source);
      const isDev = process.env.NODE_ENV === 'development';
      const shouldSync = process.env.SYNC_TRANSLATIONS === 'true';

      if (isDev) {
        console.log(`[Crowdin Plugin] Servidor de desenvolvimento detectado. Pulando checagem de traduções do Crowdin.`);
      } else if (shouldSync || !hasTranslationsLocally) {
        if (!hasTranslationsLocally) {
          console.log(`[Crowdin Plugin] Traduções locais não encontradas para '${collection}'. Iniciando download automático...`);
        }
        await downloadDomainTranslations(collection);
      } else {
        console.log(`[Crowdin Plugin] Traduções locais encontradas para '${collection}'. Pulando download.`);
      }

      // Sync the downloaded translations into the Docusaurus i18n directory
      if (fs.existsSync(source)) {
        console.log(`[Crowdin Plugin] Copiando traduções de ${source} para ${dest}...`);
        fs.cpSync(source, dest, { recursive: true });
      }
    }
  };
}
