import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const source = path.resolve(__dirname, '../../../../docs/monorepo/i18n');
const dest = path.resolve(__dirname, '../i18n');

if (fs.existsSync(source)) {
  fs.cpSync(source, dest, { recursive: true });
  console.log('[sync-i18n] Translations synced successfully to Docusaurus workspace.');
} else {
  console.log('[sync-i18n] No translations found to sync.');
}
