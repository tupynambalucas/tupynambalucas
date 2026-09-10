import type { Config } from '@docusaurus/types';
import type { MonorepoPresetOptions } from './preset/options';
import { getBaseThemeConfig } from './preset/themeConfig';
import path from 'node:path';
import fs from 'node:fs';
import { createRequire } from 'node:module';

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
  baseUrl: '/',
  trailingSlash: false,

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

  future: {
    v4: true, // Improve compatibility with the upcoming Docusaurus v4
  },

  staticDirectories: ['static'],

  customFields: {
    studioPath,
  },

  themes: ['@docusaurus/theme-live-codeblock', '@docusaurus/theme-mermaid'],

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
        },
        roadmap: {
          sidebarPath: './sidebarsRoadmap.ts',
        },
        workspaces: {
          sidebarPath: './sidebarsWorkspaces.ts',
        },
        blog: {
          path: 'releases',
          routeBasePath: 'changelog',
          blogTitle: 'Changelog',
          blogDescription: `Acompanhe as últimas atualizações, melhorias e correções do ${projectConfig.PROJECT_DOMAIN}.`,
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
      } satisfies MonorepoPresetOptions,
    ],
  ],

  themeConfig: getBaseThemeConfig(projectConfig),
};

export default config;
