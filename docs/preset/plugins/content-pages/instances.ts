import { createRequire } from 'node:module';
import type { PluginConfig } from '@docusaurus/types';
import type { MonorepoPresetOptions } from '../../options';

const require = createRequire(import.meta.url);

export function createPagesInstance(opts: Pick<MonorepoPresetOptions, 'pages'>): PluginConfig[] {
  const plugins: PluginConfig[] = [];

  const pages = opts.pages ?? {
    exclude: [
      '**/_*/**',
      '**/*.test.{js,jsx,ts,tsx}',
      '**/__tests__/**',
      '**/components/**',
      '**/data.ts',
      '**/*.material.ts',
    ],
  };

  if (pages !== false) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    plugins.push([require.resolve('./index.ts'), pages as any]);
  }

  return plugins;
}
