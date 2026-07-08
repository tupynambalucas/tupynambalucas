import { select, intro, outro, spinner, cancel } from '@clack/prompts';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { executePush } from './infrastructure/cli/push.command.js';
import { executePull } from './infrastructure/cli/pull.command.js';
import type { BucketManifest } from './bucket.interface.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const studioDir = path.resolve(__dirname, '..');
const manifestPath = path.resolve(studioDir, 'assets-manifest.json');

async function main(): Promise<void> {
  intro('Cloudflare R2 Bucket Synchronizer');

  try {
    if (fs.existsSync(manifestPath) === false) {
      throw new Error(`Manifest not found at ${manifestPath}`);
    }
    const manifestContent = fs.readFileSync(manifestPath, 'utf8');
    const manifest = JSON.parse(manifestContent) as BucketManifest;

    const action = await select({
      message: 'Select bucket operation:',
      options: [
        { value: 'push', label: 'Push (Local -> R2) - Upload modified assets' },
        { value: 'pull', label: 'Pull (R2 -> Local) - Download remote assets' },
        { value: 'exit', label: 'Exit' },
      ],
    });

    if (action === 'exit' || typeof action === 'symbol') {
      cancel('Operation cancelled.');
      process.exit(0);
    }

    const s = spinner();
    s.start(`Executing ${action} sync operation...`);

    if (action === 'push') {
      await executePush(studioDir, manifest);
    } else {
      await executePull(studioDir, manifest);
    }

    s.stop(`Operation ${action} finished.`);
    outro('Asset synchronization completed.');
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    cancel(`Fatal error: ${message}`);
    process.exit(1);
  }
}

void main();
