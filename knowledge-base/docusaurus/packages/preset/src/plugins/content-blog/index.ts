import type { LoadContext, Plugin } from '@docusaurus/types';
import type { Options } from '@docusaurus/plugin-content-blog';
import coreBlogPlugin, { validateOptions } from '@docusaurus/plugin-content-blog';
import projectVariablesPlugin from '../ast-transformers/remark-project-variables';

export { validateOptions };

export default async function customBlogPlugin(
  context: LoadContext,
  options: Options,
): Promise<Plugin<any>> {
  const mergedOptions = {
    ...options,
    remarkPlugins: [...(options.remarkPlugins! ?? []), projectVariablesPlugin],
  };

  const instance = await (coreBlogPlugin as any)(context, mergedOptions);

  return {
    ...instance,
    name: 'docusaurus-plugin-content-blog',
  };
}
