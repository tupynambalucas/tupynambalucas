const fs = require('fs');
const path = require('path');

module.exports = function (source) {
  const urlParams = new URLSearchParams(this.resourceQuery);
  const original = urlParams.get('original');

  if (original === null || original === undefined) {
    return source;
  }

  // Example: "@tupynambalucas-studio/assets/images/farmer.jpg" -> "images/farmer.jpg"
  const subPath = original.replace(/^@tupynambalucas-studio\/assets\//, '');
  const firstSegment = subPath.split('/')[0];
  const folderKey = `/${firstSegment}`;

  // Load assets manifest
  const manifestPath = require.resolve('@tupynambalucas-studio/assets/assets-manifest.json');
  const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
  const buildFolders = manifest.buckets.assets.docs;

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
