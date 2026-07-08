import { themes as prismThemes } from 'prism-react-renderer';
import type { Config } from '@docusaurus/types';
import type { TupynambalucasPresetOptions, ThemeConfig } from './tupynambalucas-preset';
import path from 'node:path';
import fs from 'node:fs';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);

interface WebpackMock {
  NormalModuleReplacementPlugin: new (
    resourceRegExp: RegExp,
    newResourceCallback: (resource: { request: string }) => void,
  ) => { apply: (...args: unknown[]) => void };
}

const webpack = require('webpack') as unknown as WebpackMock;
const studioPath = path.dirname(require.resolve('@tupynambalucas-studio/assets/package.json'));

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

const config: Config = {
  title: 'Tupynambá Lucas',
  tagline: 'Documentation for tupynambalucas.dev monorepo',
  favicon: 'brand/favicons/favicon.ico',

  // Set the production url of your site here
  url: 'https://tupynambalucas-docs.pages.dev',
  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages deployment, it is often '/<projectName>/'
  baseUrl: '/',

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: 'tupynambalucas.dev', // Usually your GitHub org/user name.
  projectName: 'tupynambalucas.dev', // Usually your repo name.

  onBrokenLinks: 'throw',

  // Future flags, see https://docusaurus.io/docs/api/docusaurus-config#future
  future: {
    v4: true, // Improve compatibility with the upcoming Docusaurus v4
  },

  staticDirectories: [path.join(studioPath, 'src')],

  customFields: {
    studioPath,
  },

  plugins: [
    [
      '@docusaurus/plugin-content-docs',
      {
        id: 'roadmap',
        path: 'roadmap',
        routeBasePath: 'roadmap',
        sidebarPath: './sidebarsRoadmap.ts',
      },
    ],
    [
      '@docusaurus/plugin-content-docs',
      {
        id: 'workspaces',
        path: 'workspaces',
        routeBasePath: 'workspaces',
        sidebarPath: './sidebarsWorkspaces.ts',
      },
    ],
    () => ({
      name: 'docusaurus-plugin-studio-assets',
      configureWebpack(_config, _isServer, _utils) {
        const isProd = process.env.NODE_ENV === 'production';

        let bucketUrl = process.env.CLOUDFLARE_R2_ASSETS_PUBLIC_URL;
        if (bucketUrl === undefined || bucketUrl === '') {
          const secretsPath = path.join(
            __dirname,
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

        const hasBucketUrl = bucketUrl !== undefined && bucketUrl !== '';

        const manifestPath = require.resolve('@tupynambalucas-studio/assets/assets-manifest.json');
        const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8')) as {
          buckets: { assets: { docs: string[] } };
        };
        const buildFolders = manifest.buckets.assets.docs;
        const folderPattern = buildFolders.map((f: string) => f.replace(/^\//, '')).join('|');
        const matchRegex = new RegExp(`^@tupynambalucas-studio\\/assets\\/(${folderPattern})\\/.*`);

        // Heavy/3D assets rule so Webpack can resolve direct imports of .exr/.glb files
        const assetRules = [
          {
            test: /\.(exr|glb|gltf)$/,
            type: 'asset/resource',
          },
        ];

        if (isProd === false || hasBucketUrl === false) {
          return {
            module: {
              rules: assetRules,
            },
          };
        }

        return {
          plugins: [
            new webpack.NormalModuleReplacementPlugin(
              matchRegex,
              (resource: { request: string }) => {
                const originalRequest = resource.request;
                const mockAssetPath = path.resolve(__dirname, 'src/mock-asset.js');
                resource.request = `${mockAssetPath}?original=${encodeURIComponent(originalRequest)}`;
              },
            ),
          ],
          module: {
            rules: [
              {
                resourceQuery: /original=/,
                use: [
                  {
                    loader: path.resolve(__dirname, 'loaders/bucket-loader.js'),
                  },
                ],
              },
              ...assetRules,
            ],
          },
        };
      },
    }),
  ],

  themes: ['@docusaurus/theme-live-codeblock', '@docusaurus/theme-mermaid'],

  markdown: {
    mermaid: true,
  },

  // Even if you don't use internationalization, you can use this field to set
  // useful metadata like html lang. For example, if your site is Chinese, you
  // may want to replace "en" with "zh-Hans".
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
      './tupynambalucas-preset/index.ts',
      {
        docs: {
          path: 'handbook',
          sidebarPath: './sidebars.ts',
        },
        blog: {
          path: 'releases',
          routeBasePath: 'changelog',
          blogTitle: 'Changelog',
          blogDescription:
            'Acompanhe as últimas atualizações, melhorias e correções do tupynambalucas.dev.',
          blogSidebarTitle: 'Todas as versões',
          blogSidebarCount: 'ALL',
          showReadingTime: true,
          feedOptions: {
            type: ['rss', 'atom'],
            xslt: true,
          },
          onInlineTags: 'warn',
          onInlineAuthors: 'warn',
          onUntruncatedBlogPosts: 'warn',
        },
        pages: {
          exclude: [
            '**/_*/**',
            '**/*.test.{js,jsx,ts,tsx}',
            '**/__tests__/**',
            '**/components/**',
            '**/data.ts',
            '**/*.material.ts',
          ],
        },
        theme: {
          customCss: ['./src/css/custom.css'],
        },
      } satisfies TupynambalucasPresetOptions,
    ],
  ],

  themeConfig: {
    // Replace with your project's social card
    image: 'brand/logos/logo-mark-negative.svg',
    colorMode: {
      defaultMode: 'light',
      disableSwitch: true,
      respectPrefersColorScheme: false,
    },
    navbar: {
      title: 'TupynambalucasDocs',
      logo: {
        alt: 'Tupynambalucas Logo',
        src: 'brand/logos/logo-mark-positive.svg',
      },
      items: [
        {
          type: 'docSidebar',
          sidebarId: 'tutorialSidebar',
          position: 'left',
          label: 'Documentation',
        },
        { to: '/workspaces', label: 'Workspaces', position: 'left' },
        { to: '/roadmap', label: 'Roadmap', position: 'right' },
        { to: '/changelog', label: 'Changelog', position: 'right' },
        {
          type: 'localeDropdown',
          position: 'right',
        },
        {
          href: 'https://github.com/tupynambalucas/tupynambalucas',
          position: 'right',
          className: 'header-github-link',
          'aria-label': 'GitHub repository',
        },
      ],
    },
    footer: {
      links: [
        {
          title: 'Documentation',
          items: [
            {
              label: 'Introduction',
              to: '/docs/intro',
            },
            {
              label: 'Architecture',
              to: '/docs/architecture/overview',
            },
            {
              label: 'Style Guide',
              to: '/docs/contributing/styleguide',
            },
            {
              label: 'Command Reference',
              to: '/docs/commands-reference',
            },
          ],
        },
        {
          title: 'Ecosystem',
          items: [
            {
              label: 'Hub Workspace',
              to: '/workspaces/hub',
            },
            {
              label: 'Profile Workspace',
              to: '/workspaces/profile',
            },
            {
              label: 'Studio Workspace',
              to: '/workspaces/studio',
            },
            {
              label: 'Tools Workspace',
              to: '/workspaces/tools',
            },
          ],
        },
        {
          title: 'Product',
          items: [
            {
              label: 'Master Plan & Vision',
              to: '/docs/intro',
            },
            {
              label: 'Roadmap',
              to: '/roadmap',
            },
          ],
        },
      ],
      copyright: `
        <div class="footer__banner-container">
          <img src="/brand/logos/logo-horizontal-positive.svg" alt="tupynambalucas.dev" class="footer__banner" />
        </div>
        <p>Copyright © ${new Date().getFullYear()} tupynambalucas.dev. High-end, production-grade software engineering. Built with Docusaurus.</p>
      `,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
    },
    mermaid: {
      theme: { light: 'neutral', dark: 'forest' },
    },
  } satisfies ThemeConfig,
};

export default config;
