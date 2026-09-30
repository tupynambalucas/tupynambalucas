import { createRequire } from 'node:module';
import type { PluginConfig } from '@docusaurus/types';
import type { MonorepoPresetOptions } from '../../options';

const require = createRequire(import.meta.url);

export function createDocsInstances(opts: Pick<MonorepoPresetOptions, 'docs'>): PluginConfig[] {
  const plugins: PluginConfig[] = [];
  const { docs } = opts;

  if (Array.isArray(docs)) {
    docs.forEach((docOpt) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      plugins.push([require.resolve('./index.js'), docOpt as any]);
    });
  } else if (docs !== false && docs !== undefined) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    plugins.push([require.resolve('./index.js'), docs as any]);
  }

  return plugins;
}
