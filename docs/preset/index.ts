import { createRequire } from 'node:module';
import type { Preset, LoadContext, PluginConfig, PluginOptions } from '@docusaurus/types';
import type { MonorepoPresetOptions, ThemeConfig } from './options';
import projectConfig from '@monorepo/shared-config/project.config';

import pluginStudioAssets from './plugins/webpack-loaders/studio-assets';

const require = createRequire(import.meta.url);

function makePluginConfig(
  source: string,
  options?: PluginOptions,
): string | [string, PluginOptions] {
  if (options !== undefined) {
    return [require.resolve(source), options];
  }
  return require.resolve(source);
}

export default function monorepoPreset(
  context: LoadContext,
  opts: MonorepoPresetOptions = {},
): Preset {
  const { siteConfig } = context;
  const { themeConfig } = siteConfig;
  const { algolia } = themeConfig as Partial<ThemeConfig>;
  const isProd = process.env.NODE_ENV === 'production';
  const {
    debug,
    docs = {
      path: 'handbook',
      sidebarPath: './sidebars.ts',
    },
    blog = {
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
    pages = {
      exclude: [
        '**/_*/**',
        '**/*.test.{js,jsx,ts,tsx}',
        '**/__tests__/**',
        '**/components/**',
        '**/data.ts',
        '**/*.material.ts',
      ],
    },
    roadmap = {
      sidebarPath: './sidebars.ts',
    },
    workspaces = {
      sidebarPath: './sidebars.ts',
    },
    sitemap,
    svgr,
    theme = {
      customCss: ['./src/css/custom.css'],
    },
    gtag,
    googleTagManager,
    ...rest
  } = opts;

  const themes: PluginConfig[] = [];
  themes.push(makePluginConfig('@docusaurus/theme-classic', theme));
  if (algolia !== undefined) {
    themes.push(require.resolve('@docusaurus/theme-search-algolia'));
  }
  if ('gtag' in themeConfig) {
    throw new Error(
      'The "gtag" field in themeConfig should now be specified as option for plugin-google-gtag.',
    );
  }

  const plugins: PluginConfig[] = [];

  // Enable CSS cascade layers if opt-in flag is enabled in siteConfig
  if (siteConfig.future.v4.useCssCascadeLayers === true) {
    plugins.push(makePluginConfig('@docusaurus/plugin-css-cascade-layers'));
  }

  // Push Domain wrappers as module paths so Docusaurus can run validateOptions
  if (docs !== false) {
    plugins.push([require.resolve('./plugins/content-docs/index.ts'), docs as any]);
  }
  if (roadmap !== false && roadmap !== undefined) {
    plugins.push([
      require.resolve('./plugins/content-docs/index.ts'),
      {
        id: 'roadmap',
        path: 'roadmap',
        routeBasePath: 'roadmap',
        ...(roadmap as any),
      },
    ]);
  }
  if (workspaces !== false && workspaces !== undefined) {
    plugins.push([
      require.resolve('./plugins/content-docs/index.ts'),
      {
        id: 'workspaces',
        path: 'workspaces',
        routeBasePath: 'workspaces',
        ...(workspaces as any),
      },
    ]);
  }

  if (blog !== false) {
    plugins.push([require.resolve('./plugins/content-blog/index.ts'), blog as any]);
  }
  if (pages !== false) {
    plugins.push([require.resolve('./plugins/content-pages/index.ts'), pages as any]);
  }

  if (debug === true || (debug === undefined && isProd === false)) {
    plugins.push(require.resolve('@docusaurus/plugin-debug'));
  }
  if (gtag !== undefined) {
    plugins.push(makePluginConfig('@docusaurus/plugin-google-gtag', gtag));
  }
  if (googleTagManager !== undefined) {
    plugins.push(makePluginConfig('@docusaurus/plugin-google-tag-manager', googleTagManager));
  }
  if (sitemap !== false && (isProd === true || debug === true)) {
    plugins.push(makePluginConfig('@docusaurus/plugin-sitemap', sitemap));
  }
  if (svgr !== false) {
    plugins.push(makePluginConfig('@docusaurus/plugin-svgr', svgr));
  }

  // Push local plugins directly instead of relying on docusaurus.config.ts
  // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-explicit-any
  plugins.push(pluginStudioAssets as any);

  if (Object.keys(rest).length > 0) {
    throw new Error(
      `Unrecognized keys ${Object.keys(rest).join(', ')} found in preset configuration.`,
    );
  }

  return { themes, plugins };
}

export type { MonorepoPresetOptions, ThemeConfig };
