export interface SingleBucketConfig {
  accountId: string;
  accessKeyId: string;
  secretAccessKey: string;
  bucketName: string;
  publicUrl: string;
}

export interface DualBucketConfig {
  assets: SingleBucketConfig;
  creative: SingleBucketConfig;
}

export interface BucketManifest {
  buckets: {
    assets: {
      name: string;
      push: string[];
      pull: string[];
      docs: string[];
      web: string[];
    };
    creative: {
      name: string;
      push: string[];
      pull: string[];
    };
  };
}

export interface IAssetDiscoveryService {
  discoverAssets(studioDir: string, folder: string, isCreative: boolean): Promise<string[]>;
}

export interface IAssetUploaderService {
  uploadAsset(filePath: string, key: string): Promise<void>;
}

export interface RemoteAsset {
  key: string;
  size: number;
  etag: string;
}

export interface IAssetSearchService {
  listAssets(prefix: string): Promise<string[]>;
  listAssetsMetadata(prefix: string): Promise<RemoteAsset[]>;
}

export interface IAssetDownloaderService {
  downloadAsset(key: string, destinationPath: string): Promise<void>;
}
