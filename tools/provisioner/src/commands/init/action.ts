import { intro, outro, spinner } from '@clack/prompts';
import { loadProjectConfig, saveProjectConfig } from '../../core/config.js';
import { applyReplacements, type ReplacementRule } from '../../core/replacer.js';
import { promptForConfig } from './prompts.js';
import * as path from 'node:path';
import type { InitCommandOptions } from '../../types/index.js';

export async function runInitAction(_options: InitCommandOptions): Promise<void> {
  console.clear();

  const currentConfig = loadProjectConfig();
  intro(`Bootstrap Monorepo - Current Domain: ${currentConfig.PROJECT_DOMAIN}`);

  const newConfig = await promptForConfig(currentConfig);

  const s = spinner();
  s.start('Applying new configuration globally...');

  const rules: ReplacementRule[] = [
    { oldValue: currentConfig.PROJECT_DOMAIN, newValue: newConfig.PROJECT_DOMAIN },
    { oldValue: currentConfig.PROJECT_NAME, newValue: newConfig.PROJECT_NAME },
    {
      oldValue: currentConfig.PROJECT_INTERNAL_HOST || 'tupynambalucas.internal',
      newValue: newConfig.PROJECT_INTERNAL_HOST,
    },
  ];

  saveProjectConfig(newConfig);

  const rootDir = path.resolve(process.cwd(), '../../');
  const modifiedCount = applyReplacements(rootDir, rules);

  s.stop(`Configuration applied successfully! Modified ${modifiedCount} files.`);
  outro(`Monorepo initialized as ${newConfig.PROJECT_DOMAIN}`);
}
