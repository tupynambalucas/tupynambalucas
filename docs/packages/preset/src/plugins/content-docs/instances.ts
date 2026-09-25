import { createRequire } from 'node:module';
import type { PluginConfig } from '@docusaurus/types';
import type { MonorepoPresetOptions } from '../../options';

const require = createRequire(import.meta.url);

export function createDocsInstances(
  opts: Pick<MonorepoPresetOptions, 'docs' | 'roadmap' | 'workspaces'>,
): PluginConfig[] {
  const plugins: PluginConfig[] = [];

  const docs = opts.docs ?? {
    path: 'handbook',
    sidebarPath: require.resolve('../../sidebars/index.js'),
  };

  const roadmap = opts.roadmap ?? {
    sidebarPath: require.resolve('../../sidebars/index.js'),
  };

  const workspaces = opts.workspaces ?? {
    sidebarPath: require.resolve('../../sidebars/index.js'),
  };

  if (docs !== false) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    plugins.push([require.resolve('./index.js'), docs as any]);
  }

  if (roadmap !== false) {
    plugins.push([
      require.resolve('./index.js'),
      {
        id: 'roadmap',
        path: 'roadmap',
        routeBasePath: 'roadmap',
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        ...(roadmap as any),
      },
    ]);
  }

  if (workspaces !== false) {
    plugins.push([
      require.resolve('./index.js'),
      {
        id: 'workspaces',
        path: 'workspaces',
        routeBasePath: 'workspaces',
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        ...(workspaces as any),
      },
    ]);
  }

  return plugins;
}
