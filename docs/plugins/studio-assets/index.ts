import path from 'node:path';
import fs from 'node:fs';
import { createRequire } from 'node:module';
import type { Plugin, LoadContext, PluginOptions } from '@docusaurus/types';

const require = createRequire(import.meta.url);

export default function pluginStudioAssets(context: LoadContext, _options: PluginOptions): Plugin {
  return {
    name: 'docusaurus-plugin-studio-assets',
    configureWebpack(_config, _isServer, _utils) {
      const isProd = process.env.NODE_ENV === 'production';
      const rootDir = context.siteDir;

      let bucketUrl = process.env.CLOUDFLARE_R2_ASSETS_PUBLIC_URL;
      if (bucketUrl === undefined || bucketUrl === '') {
        const secretsPath = path.join(
          rootDir,
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
        if (fs.existsSync(secretsPath)) {
          const content = fs.readFileSync(secretsPath, 'utf8');
          const match = /^CLOUDFLARE_R2_ASSETS_PUBLIC_URL=(.*)$/m.exec(content);
          if (match?.[1] !== undefined) {
            bucketUrl = match[1].trim();
          }
        }
      }

      const hasBucketUrl = bucketUrl !== undefined && bucketUrl !== '';

      const manifestPath = require.resolve('@tupynambalucas-studio/assets/assets-manifest.json');
      const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
      const buildFolders = manifest.buckets.assets.docs;
      const folderPattern = buildFolders.map((f: string) => f.replace(/^\//, '')).join('|');
      const matchRegex = new RegExp(
        `(@tupynambalucas-studio[/\\x5C](assets|design)|studio[/\\x5C](assets|design))[/\\x5C](src[/\\x5C])?(${folderPattern})[/\\x5C].*`,
      );

      const assetRules = [
        {
          test: /\.(exr|glb|gltf)$/,
          type: 'asset/resource',
        },
      ];

      if (!isProd || !hasBucketUrl) {
        return {
          module: {
            rules: assetRules,
          },
        };
      }

      const webpack = require('webpack');
      return {
        plugins: [
          new webpack.NormalModuleReplacementPlugin(matchRegex, (resource: { request: string }) => {
            const originalRequest = resource.request;
            const mockAssetPath = path.resolve(rootDir, 'src/mock-asset.js');
            resource.request = `${mockAssetPath}?original=${encodeURIComponent(originalRequest)}`;
          }),
        ],
        module: {
          rules: [
            {
              resourceQuery: /original=/,
              use: [
                {
                  loader: path.resolve(rootDir, 'loaders/bucket-loader.js'),
                },
              ],
            },
            ...assetRules,
          ],
        },
      };
    },
  };
}
