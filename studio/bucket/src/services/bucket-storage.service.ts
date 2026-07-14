import {
  S3Client,
  PutObjectCommand,
  ListObjectsV2Command,
  GetObjectCommand,
} from '@aws-sdk/client-s3';
import { NodeHttpHandler } from '@smithy/node-http-handler';
import https from 'https';
import fs from 'fs';
import path from 'path';
import mime from 'mime-types';
import type { Readable } from 'stream';
import type {
  IAssetUploaderService,
  IAssetSearchService,
  IAssetDownloaderService,
  SingleBucketConfig,
  RemoteAsset,
} from '../bucket.interface.js';

export class BucketStorageService
  implements IAssetUploaderService, IAssetSearchService, IAssetDownloaderService
{
  private s3Client: S3Client;
  private bucketName: string;

  constructor(config: SingleBucketConfig) {
    this.s3Client = new S3Client({
      region: 'auto',
      endpoint: `https://${config.accountId}.r2.cloudflarestorage.com`,
      credentials: {
        accessKeyId: config.accessKeyId,
        secretAccessKey: config.secretAccessKey,
      },
      requestHandler: new NodeHttpHandler({
        httpsAgent: new https.Agent({
          keepAlive: true,
          maxSockets: 50,
        }),
        connectionTimeout: 10000,
        requestTimeout: 15000,
      }),
    });
    this.bucketName = config.bucketName;
  }

  async uploadAsset(filePath: string, key: string): Promise<void> {
    const fileBuffer = fs.readFileSync(filePath);
    const lookupResult = mime.lookup(filePath);
    const contentType = lookupResult !== false ? lookupResult : 'application/octet-stream';

    await this.s3Client.send(
      new PutObjectCommand({
        Bucket: this.bucketName,
        Key: key,
        Body: fileBuffer,
        ContentType: contentType,
        CacheControl: 'public, max-age=31536000, immutable',
      }),
    );
  }

  async listAssets(prefix: string): Promise<string[]> {
    const command = new ListObjectsV2Command({
      Bucket: this.bucketName,
      Prefix: prefix,
    });

    const response = await this.s3Client.send(command);
    return (
      response.Contents?.map((item) => item.Key).filter(
        (key): key is string => key !== undefined,
      ) ?? []
    );
  }

  async listAssetsMetadata(prefix: string): Promise<RemoteAsset[]> {
    const command = new ListObjectsV2Command({
      Bucket: this.bucketName,
      Prefix: prefix,
    });

    const response = await this.s3Client.send(command);
    return (
      response.Contents?.map((item) => ({
        key: item.Key ?? '',
        size: item.Size ?? 0,
        etag: item.ETag !== undefined ? item.ETag.replace(/"/g, '') : '',
      })).filter((item) => item.key !== '') ?? []
    );
  }

  async downloadAsset(key: string, destinationPath: string): Promise<void> {
    fs.mkdirSync(path.dirname(destinationPath), { recursive: true });

    const command = new GetObjectCommand({
      Bucket: this.bucketName,
      Key: key,
    });

    const response = await this.s3Client.send(command);
    const stream = response.Body as Readable;
    const writer = fs.createWriteStream(destinationPath);

    stream.pipe(writer);

    return new Promise<void>((resolve, reject) => {
      writer.on('finish', () => {
        resolve();
      });
      writer.on('error', (err: Error) => {
        stream.destroy();
        reject(err);
      });
      stream.on('error', (err: Error) => {
        stream.destroy();
        writer.destroy();
        reject(err);
      });
    });
  }
}
