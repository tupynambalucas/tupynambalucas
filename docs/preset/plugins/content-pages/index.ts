import type { LoadContext, Plugin } from '@docusaurus/types';
import type { Options } from '@docusaurus/plugin-content-pages';
import corePagesPlugin, { validateOptions } from '@docusaurus/plugin-content-pages';
import projectVariablesPlugin from '../ast-transformers/remark-project-variables';

export { validateOptions };

export default async function customPagesPlugin(
  context: LoadContext,
  options: Options,
): Promise<Plugin<any>> {
  const mergedOptions = {
    ...options,
    remarkPlugins: [...(options.remarkPlugins! ?? []), projectVariablesPlugin],
  };

  const instance = await (corePagesPlugin as any)(context, mergedOptions);

  return {
    ...instance,
    name: 'docusaurus-plugin-content-pages',
  };
}
