import { createRequire } from 'node:module';
import type { Preset, LoadContext, PluginConfig, PluginOptions } from '@docusaurus/types';
import type { MonorepoPresetOptions, ThemeConfig } from './options';
import projectVariablesPlugin from './plugins/remark-project-variables';
import pluginStudioAssets from './plugins/studio-assets';

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

function withProjectVariables(options: any) {
  if (!options) return options;
  return {
    ...options,
    remarkPlugins: [...(options.remarkPlugins || []), projectVariablesPlugin],
  };
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
    theme,
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

  if (docs !== false) {
    plugins.push(makePluginConfig('@docusaurus/plugin-content-docs', withProjectVariables(docs)));
  }
  if (roadmap !== false && roadmap !== undefined) {
    plugins.push(
      makePluginConfig(
        '@docusaurus/plugin-content-docs',
        withProjectVariables({
          id: 'roadmap',
          path: 'roadmap',
          routeBasePath: 'roadmap',
          ...roadmap,
        }),
      ),
    );
  }
  if (workspaces !== false && workspaces !== undefined) {
    plugins.push(
      makePluginConfig(
        '@docusaurus/plugin-content-docs',
        withProjectVariables({
          id: 'workspaces',
          path: 'workspaces',
          routeBasePath: 'workspaces',
          ...workspaces,
        }),
      ),
    );
  }

  if (blog !== false) {
    plugins.push(makePluginConfig('@docusaurus/plugin-content-blog', withProjectVariables(blog)));
  }
  if (pages !== false) {
    plugins.push(makePluginConfig('@docusaurus/plugin-content-pages', withProjectVariables(pages)));
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
  plugins.push(pluginStudioAssets);

  if (Object.keys(rest).length > 0) {
    throw new Error(
      `Unrecognized keys ${Object.keys(rest).join(', ')} found in preset configuration.`,
    );
  }

  return { themes, plugins };
}

export type { MonorepoPresetOptions, ThemeConfig };
