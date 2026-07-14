import { loadBucketConfig } from '../../config/env-config.js';
import { GlobAssetDiscoveryService } from '../../services/glob-discovery.service.js';
import { BucketStorageService } from '../../services/bucket-storage.service.js';
import { AssetSyncOrchestrator } from '../../application/sync.orchestrator.js';
import type { BucketManifest } from '../../bucket.interface.js';

export async function executePull(studioDir: string, manifest: BucketManifest): Promise<void> {
  const config = loadBucketConfig();
  const discovery = new GlobAssetDiscoveryService();
  const assetsStorage = new BucketStorageService(config.assets);
  const creativeStorage = new BucketStorageService(config.creative);

  const orchestrator = new AssetSyncOrchestrator(discovery, assetsStorage, creativeStorage);
  await orchestrator.pull(studioDir, manifest);
}
