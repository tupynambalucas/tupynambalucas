import { glob } from 'glob';
import path from 'path';
import fs from 'fs';
import type { IAssetDiscoveryService } from '../bucket.interface.js';

export class GlobAssetDiscoveryService implements IAssetDiscoveryService {
  async discoverAssets(studioDir: string, folder: string, isCreative: boolean): Promise<string[]> {
    const discovered: string[] = [];

    // Trim leading slash, e.g., '/images' -> 'images'
    const cleanFolder = folder.replace(/^\//, '');
    const localRoot = isCreative ? 'creative' : 'src';
    const targetDir = path.join(studioDir, localRoot, cleanFolder);

    if (fs.existsSync(targetDir) === true) {
      const files = await glob('**/*', {
        cwd: targetDir,
        nodir: true,
      });
      // Return relative paths from the studio package root
      discovered.push(
        ...files.map((file) => `${localRoot}/${cleanFolder}/${file.replace(/\\/g, '/')}`),
      );
    }

    return discovered;
  }
}
