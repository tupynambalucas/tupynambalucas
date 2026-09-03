import { themes as prismThemes } from 'prism-react-renderer';
import type { Config } from '@docusaurus/types';
import type { TupynambalucasPresetOptions, ThemeConfig } from './preset';
import path from 'node:path';
import fs from 'node:fs';
import { createRequire } from 'node:module';
import projectVariablesPlugin from './plugins/remark-project-variables/index.mjs';

const require = createRequire(import.meta.url);
const projectConfig = require('@monorepo/shared-config/project.config.json');

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
  // For GitHub pages deployment, it is often '/<projectName>/'
  baseUrl: '/',

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: projectConfig.GITHUB_ORG, // Usually your GitHub org/user name.
  projectName: projectConfig.GITHUB_REPO, // Usually your repo name.

  onBrokenLinks: 'warn',
  onBrokenMarkdownLinks: 'warn',

  markdown: {
    mermaid: true,
    hooks: {
      onBrokenMarkdownImages: 'warn',
    },
  },

  // Future flags, see https://docusaurus.io/docs/api/docusaurus-config#future
  future: {
    v4: true, // Improve compatibility with the upcoming Docusaurus v4
  },

  staticDirectories: ['static'],

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
        remarkPlugins: [projectVariablesPlugin],
      },
    ],
    [
      '@docusaurus/plugin-content-docs',
      {
        id: 'workspaces',
        path: 'workspaces',
        routeBasePath: 'workspaces',
        sidebarPath: './sidebarsWorkspaces.ts',
        remarkPlugins: [projectVariablesPlugin],
      },
    ],
    './plugins/studio-assets/index.ts',
  ],

  themes: ['@docusaurus/theme-live-codeblock', '@docusaurus/theme-mermaid'],

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
      './preset/index.ts',
      {
        docs: {
          path: 'handbook',
          sidebarPath: './sidebars.ts',
          remarkPlugins: [projectVariablesPlugin],
        },
        blog: {
          path: 'releases',
          routeBasePath: 'changelog',
          blogTitle: 'Changelog',
          blogDescription:
            'Acompanhe as últimas atualizações, melhorias e correções do ${projectConfig.PROJECT_DOMAIN}.',
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
          remarkPlugins: [projectVariablesPlugin],
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
      title: `${projectConfig.PROJECT_NAME} Docs`,
      logo: {
        alt: `${projectConfig.PROJECT_NAME} Logo`,
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
          href: `https://github.com/${projectConfig.GITHUB_ORG}/${projectConfig.GITHUB_REPO}`,
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
              to: '/docs/explanation/architecture-overview',
            },
            {
              label: 'Style Guide',
              to: '/docs/reference/styleguide',
            },
            {
              label: 'Command Reference',
              to: '/docs/reference/commands',
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
              label: 'Renderer Workspace',
              to: '/workspaces/renderer',
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
          <img src="/brand/logos/logo-horizontal-positive.svg" alt="${projectConfig.PROJECT_DOMAIN}" class="footer__banner" />
        </div>
        <p>Copyright © ${new Date().getFullYear()} ${projectConfig.PROJECT_DOMAIN}. High-end, production-grade software engineering. Built with Docusaurus.</p>
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
