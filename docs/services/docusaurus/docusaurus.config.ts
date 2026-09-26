import type { Config } from '@docusaurus/types';
import type { MonorepoPresetOptions } from '@monorepo/docs-preset/options';
import { getBaseThemeConfig } from '@monorepo/docs-preset/themeConfig';
import path from 'node:path';
import fs from 'node:fs';
import { createRequire } from 'node:module';
import projectConfig from '@monorepo/shared-config/project.config';

const require = createRequire(import.meta.url);

interface WebpackMock {
  NormalModuleReplacementPlugin: new (
    resourceRegExp: RegExp,
    newResourceCallback: (resource: { request: string }) => void,
  ) => { apply: (...args: unknown[]) => void };
}

const webpack = require('webpack') as unknown as WebpackMock;
const studioPath = path.dirname(require.resolve('@monorepo/studio-assets/package.json'));
const studioSrcPath = path.join(studioPath, 'src');
const staticPath = path.join(__dirname, 'static');

const itemsToSync = [
  'brand',
  'fonts',
  'icons',
  'images',
  'three',
  'tokens',
  'assets-manifest.json',
];
if (fs.existsSync(staticPath) === false) {
  fs.mkdirSync(staticPath, { recursive: true });
}
for (const item of itemsToSync) {
  const src = path.join(studioSrcPath, item);
  const dest = path.join(staticPath, item);
  if (fs.existsSync(src) === true) {
    fs.cpSync(src, dest, { recursive: true, force: true });
  }
}

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

const config: Config = {
  title: projectConfig.PROJECT_NAME,
  tagline: `Documentation for ${projectConfig.PROJECT_DOMAIN} monorepo`,
  favicon: 'brand/logos/logo-mark-blue.svg',

  // Set the production url of your site here
  url: `https://${projectConfig.PROJECT_DOMAIN}`,
  // Set the /<baseUrl>/ pathname under which your site is served
  baseUrl: '/',
  trailingSlash: false,

  organizationName: projectConfig.GITHUB_ORG, // Usually your GitHub org/user name.
  projectName: projectConfig.REPOSITORY_NAME, // Usually your repo name.

  onBrokenLinks: 'ignore',
  onBrokenAnchors: 'ignore',
  onBrokenMarkdownLinks: 'ignore',

  markdown: {
    mermaid: true,
    hooks: {
      onBrokenMarkdownImages: 'ignore',
    },
  },

  future: {
    v4: true, // Improve compatibility with the upcoming Docusaurus v4
  },

  staticDirectories: ['static'],

  customFields: {
    studioPath,
  },

  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'pt-BR'],
    localeConfigs: {
      en: {
        label: 'English',
        htmlLang: 'en-US',
      },
      'pt-BR': {
        label: 'Português (Brasil)',
        htmlLang: 'pt-BR',
      },
    },
  },

  presets: [
    [
      require.resolve('@monorepo/docs-preset'),
      {
        liveCodeblock: {
          playgroundPosition: 'bottom',
        },
        docs: {
          path: 'handbook',
          sidebarPath: require.resolve('@monorepo/docs-preset/sidebars'),
        },
        roadmap: {
          sidebarPath: require.resolve('@monorepo/docs-preset/sidebars'),
        },
        workspaces: {
          sidebarPath: require.resolve('@monorepo/docs-preset/sidebars'),
        },
      } satisfies MonorepoPresetOptions,
    ],
  ],

  plugins: [
    () => ({
      name: 'monorepo-webpack-alias-plugin',
      configureWebpack() {
        const docusaurusNodeModules = path.join(__dirname, 'node_modules', '@docusaurus');
        const alias: Record<string, string> = {};

        if (fs.existsSync(docusaurusNodeModules)) {
          const packages = fs.readdirSync(docusaurusNodeModules);
          for (const pkg of packages) {
            alias[`@docusaurus/${pkg}$`] = path.join(docusaurusNodeModules, pkg);
            alias[`@docusaurus/${pkg}/internal`] = path.join(
              docusaurusNodeModules,
              pkg,
              'lib/internal.js',
            );
            alias[`@docusaurus/${pkg}/Details`] = path.join(
              docusaurusNodeModules,
              pkg,
              'lib/components/Details/index.js',
            );
            // generic fallback for subpaths that don't need exact matching
            alias[`@docusaurus/${pkg}/client`] = path.join(
              docusaurusNodeModules,
              pkg,
              'lib/client',
            );
          }
        }

        return {
          resolve: {
            alias,
          },
        };
      },
    }),
  ],

  themeConfig: getBaseThemeConfig(projectConfig),
};

export default config;
