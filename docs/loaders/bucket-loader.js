const fs = require('fs');
const path = require('path');

module.exports = function (source) {
  const urlParams = new URLSearchParams(this.resourceQuery);
  const original = urlParams.get('original');

  if (original === null || original === undefined) {
    return source;
  }

  // Normalize backslashes to forward slashes first
  const normalizedOriginal = original.replace(/\\/g, '/');

  // Load assets manifest
  const manifestPath = require.resolve('@tupynambalucas-studio/design/assets-manifest.json');
  const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
  const buildFolders = manifest.buckets.assets.docs;
  const folderNames = buildFolders.map((f) => f.replace(/^\//, ''));

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
        __dirname,
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
        const match = content.match(/^CLOUDFLARE_R2_ASSETS_PUBLIC_URL=(.*)$/m);
        if (match !== null && match[1] !== undefined) {
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
    return `module.exports = ${JSON.stringify(url)};`;
  }

  return source;
};
