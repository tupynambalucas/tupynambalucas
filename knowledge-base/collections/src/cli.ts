import { downloadDomainTranslations } from './crowdin.js';

const args = process.argv.slice(2);
const collectionArgIndex = args.indexOf('--collection');

if (collectionArgIndex === -1 || !args[collectionArgIndex + 1]) {
  console.error('Usage: tsx cli.ts --collection <collection-name>');
  process.exit(1);
}

const collectionName = args[collectionArgIndex + 1];

downloadDomainTranslations(collectionName)
  .then(() => {
    console.log('[Crowdin CLI] Success!');
  })
  .catch((err) => {
    console.error('[Crowdin CLI] Failed:', err);
    process.exit(1);
  });
