import { createRequire } from 'node:module';
import type { Preset, LoadContext, PluginConfig, PluginOptions } from '@docusaurus/types';
import type { MonorepoPresetOptions, ThemeConfig } from './options';
import projectConfig from '@monorepo/shared-config/project.config';

import { createDocsInstances } from './plugins/content-docs/instances';
import { createBlogInstance } from './plugins/content-blog/instances';
import { createPagesInstance } from './plugins/content-pages/instances';
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
    docs,
    blog,
    pages,
    roadmap,
    workspaces,
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

  // Inject Domain Wrapper Instances
  plugins.push(...createDocsInstances(opts));
  plugins.push(...createBlogInstance(opts));
  plugins.push(...createPagesInstance(opts));

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
