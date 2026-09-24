import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';

const require = createRequire(import.meta.url);
const currentDir = path.dirname(fileURLToPath(import.meta.url));

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function bucketLoader(this: any, source: string): string {
  const urlParams = new URLSearchParams(this.resourceQuery as string);
  const original = urlParams.get('original');

  if (original === null || original === undefined) {
    return source;
  }

  // Normalize backslashes to forward slashes first
  const normalizedOriginal = original.replace(/\\/g, '/');

  // Load assets manifest
  const manifestPath = require.resolve('@monorepo/studio-assets/assets-manifest.json');
  const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
  const buildFolders = manifest.buckets.assets.docs as string[];
  const folderNames = buildFolders.map((f: string) => f.replace(/^\//, ''));

  let subPath = normalizedOriginal;
  let firstSegment = '';

  for (const folder of folderNames) {
    const searchStr = `/${folder}/`;
    const index = normalizedOriginal.indexOf(searchStr);
    if (index !== -1) {
      subPath = normalizedOriginal.slice(index + 1);
      firstSegment = folder;
      break;
    }
  }

  const folderKey = `/${firstSegment}`;

  let bucketUrl = process.env.CLOUDFLARE_R2_ASSETS_PUBLIC_URL;

  if (buildFolders.includes(folderKey) === true) {
    if (bucketUrl === undefined || bucketUrl === '') {
      const secretsPath = path.join(
        currentDir,
        '..',
        '..',
        '..',
        '..',
        'tools',
        'github',
        'infrastructure',
        'gh',
        'features',
        'security-quality',
        'secrets',
        '.env.actions.secrets',
      );
      if (fs.existsSync(secretsPath) === true) {
        const content = fs.readFileSync(secretsPath, 'utf8');
        const match = /^CLOUDFLARE_R2_ASSETS_PUBLIC_URL=(.*)$/m.exec(content);
        if (match?.[1] !== undefined) {
          bucketUrl = match[1].trim();
        }
      }
    }

    if (bucketUrl === undefined || bucketUrl === '') {
      throw new Error(
        `[Bucket Loader] CLOUDFLARE_R2_ASSETS_PUBLIC_URL environment variable is not defined for production build. Required for asset path: ${original}`,
      );
    }

    const url = `${bucketUrl.replace(/\/$/, '')}/${subPath}`;
    return `export default ${JSON.stringify(url)};`;
  }

  return source;
}
