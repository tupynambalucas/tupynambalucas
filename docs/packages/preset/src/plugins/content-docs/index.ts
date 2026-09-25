import type { LoadContext, Plugin } from '@docusaurus/types';
import type { Options } from '@docusaurus/plugin-content-docs';
import coreDocsPlugin, { validateOptions } from '@docusaurus/plugin-content-docs';
import projectVariablesPlugin from '../ast-transformers/remark-project-variables';

export { validateOptions };

export default async function customDocsPlugin(
  context: LoadContext,
  options: Options,
): Promise<Plugin<any>> {
  const mergedOptions = {
    ...options,
    remarkPlugins: [...(options.remarkPlugins! ?? []), projectVariablesPlugin],
  };

  const instance = await (coreDocsPlugin as any)(context, mergedOptions);

  return {
    ...instance,
    name: 'docusaurus-plugin-content-docs',
  };
}
