import { createRequire } from 'node:module';
import type { PluginConfig } from '@docusaurus/types';
import type { MonorepoPresetOptions } from '../../options';

const require = createRequire(import.meta.url);

export function createBlogInstance(opts: Pick<MonorepoPresetOptions, 'blog'>): PluginConfig[] {
  const plugins: PluginConfig[] = [];
  const { blog } = opts;

  if (Array.isArray(blog)) {
    blog.forEach(blogOpt => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      plugins.push([require.resolve('./index.js'), blogOpt as any]);
    });
  } else if (blog !== false && blog !== undefined) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    plugins.push([require.resolve('./index.js'), blog as any]);
  }

  return plugins;
}
