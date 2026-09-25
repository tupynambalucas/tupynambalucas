import { createRequire } from 'node:module';
import type { PluginConfig } from '@docusaurus/types';
import type { MonorepoPresetOptions } from '../../options';
import projectConfig from '@monorepo/shared-config/project.config';

const require = createRequire(import.meta.url);

export function createBlogInstance(opts: Pick<MonorepoPresetOptions, 'blog'>): PluginConfig[] {
  const plugins: PluginConfig[] = [];

  const blog = opts.blog ?? {
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
  };

  if (blog !== false) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    plugins.push([require.resolve('./index.js'), blog as any]);
  }

  return plugins;
}
