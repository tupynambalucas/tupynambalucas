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
    sidebarPath: './sidebars.ts',
  };

  const roadmap = opts.roadmap ?? {
    sidebarPath: './sidebars.ts',
  };

  const workspaces = opts.workspaces ?? {
    sidebarPath: './sidebars.ts',
  };

  if (docs !== false) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    plugins.push([require.resolve('./index.ts'), docs as any]);
  }

  if (roadmap !== false) {
    plugins.push([
      require.resolve('./index.ts'),
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
      require.resolve('./index.ts'),
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
