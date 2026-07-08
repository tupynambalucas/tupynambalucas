import type { Plugin } from 'vite';
import fs from 'fs';
import path from 'path';
import { createRequire } from 'module';

const require = createRequire(import.meta.url);

interface StudioManifest {
  buckets: {
    assets: {
      push: string[];
      pull: string[];
      web: string[];
    };
  };
}

export function studioAssetsPlugin(): Plugin {
  let isDev = false;
  let buildFolders: string[] = [];
  let cloudName = 'tupynambalucas';

  try {
    const manifestPath = require.resolve('@tupynambalucas-studio/assets/assets-manifest.json');
    const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8')) as StudioManifest;
    buildFolders = manifest.buckets.assets.web;
  } catch {
    console.warn(
      'Vite plugin warning: @tupynambalucas-studio/assets/assets-manifest.json not found or could not be loaded.',
    );
  }

  return {
    name: 'vite-plugin-studio-assets',
    enforce: 'pre',
    configResolved(config) {
      isDev = config.command === 'serve';
      const envCloudName = config.env.VITE_CLOUDINARY_CLOUD_NAME as string | undefined;
      if (envCloudName !== undefined && envCloudName !== '') {
        cloudName = envCloudName;
      } else {
        const processEnvCloudName =
          process.env.VITE_CLOUDINARY_CLOUD_NAME ?? process.env.CLOUDINARY_CLOUD_NAME;
        if (processEnvCloudName !== undefined && processEnvCloudName !== '') {
          cloudName = processEnvCloudName;
        }
      }
    },
    resolveId(source) {
      if (isDev === false && source.startsWith('@tupynambalucas-studio/assets/') === true) {
        const subPath = source.replace(/^@tupynambalucas\/studio\//, '');
        const firstSegment = subPath.split('/')[0];
        const folderKey = `/${firstSegment}`;

        if (buildFolders.includes(folderKey) === true) {
          return `\0${source}`;
        }
      }
      return null;
    },
    load(id) {
      if (id.startsWith('\0@tupynambalucas-studio/assets/') === true) {
        const cleanSource = id.replace(/^\0/, '');
        const subPath = cleanSource.replace(/^@tupynambalucas\/studio\//, '');

        let deliveryPath = 'image/upload';

        const ext = path.extname(subPath).toLowerCase();
        const isImage =
          ['.jpg', '.jpeg', '.png', '.webp', '.svg', '.gif', '.tiff', '.bmp', '.ico'].includes(
            ext,
          ) === true;
        const isRaw = isImage === false;

        if (isRaw === true) {
          deliveryPath = 'raw/upload';
        }

        return `export default "https://res.cloudinary.com/${cloudName}/${deliveryPath}/studio/${subPath}";`;
      }
      return null;
    },
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        const url = req.url ?? '';
        if (url.startsWith('/@studio-assets/') === true) {
          const cleanUrl = url.split('?')[0];
          const relativePath = cleanUrl.replace(/^\/@studio-assets\//, '');

          // Resolve the studio package location dynamically
          const studioPackageJson = require.resolve('@tupynambalucas-studio/assets/package.json');
          const studioDir = path.dirname(studioPackageJson);
          const studioSrcDir = path.join(studioDir, 'src');

          const filePath =
            relativePath.startsWith('raw/') === true
              ? path.join(studioSrcDir, relativePath)
              : path.join(studioSrcDir, relativePath);

          if (fs.existsSync(filePath) === true && fs.statSync(filePath).isFile() === true) {
            const ext = path.extname(filePath).toLowerCase();
            let contentType = 'application/octet-stream';

            if (ext === '.glb') contentType = 'model/gltf-binary';
            else if (ext === '.gltf') contentType = 'model/gltf+json';
            else if (ext === '.hdr') contentType = 'image/vnd.radiance';
            else if (ext === '.png') contentType = 'image/png';
            else if (ext === '.jpg' || ext === '.jpeg') contentType = 'image/jpeg';
            else if (ext === '.webp') contentType = 'image/webp';
            else if (ext === '.svg') contentType = 'image/svg+xml';

            res.setHeader('Content-Type', contentType);
            res.setHeader('Access-Control-Allow-Origin', '*');
            fs.createReadStream(filePath).pipe(res);
            return;
          }
        }
        next();
      });
    },
  };
}
