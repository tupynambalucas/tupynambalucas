import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import type { DualBucketConfig } from '../bucket.interface.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export function loadBucketConfig(): DualBucketConfig {
  const bucketEnvPath = path.resolve(__dirname, '../.env.studio.bucket');
  if (fs.existsSync(bucketEnvPath) === true) {
    dotenv.config({ path: bucketEnvPath });
  }

  const envPath = path.resolve(__dirname, '../../.env');
  if (fs.existsSync(envPath) === true) {
    dotenv.config({ path: envPath });
  } else {
    const rootEnvPath = path.resolve(__dirname, '../../../../.env.dev');
    if (fs.existsSync(rootEnvPath) === true) {
      dotenv.config({ path: rootEnvPath });
    } else {
      dotenv.config();
    }
  }

  const accountId = process.env.CLOUDFLARE_R2_ACCOUNT_ID;
  if (accountId === undefined || accountId === '') {
    throw new Error('Configuration Error: Missing CLOUDFLARE_R2_ACCOUNT_ID.');
  }

  // Load Assets Bucket Config
  const assetsAccessKeyId = process.env.CLOUDFLARE_R2_ASSETS_ACCESS_KEY_ID;
  const assetsSecretAccessKey = process.env.CLOUDFLARE_R2_ASSETS_SECRET_ACCESS_KEY;
  const assetsBucketName = process.env.CLOUDFLARE_R2_ASSETS_BUCKET_NAME;
  const assetsPublicUrl = process.env.CLOUDFLARE_R2_ASSETS_PUBLIC_URL;

  if (
    assetsAccessKeyId === undefined ||
    assetsAccessKeyId === '' ||
    assetsSecretAccessKey === undefined ||
    assetsSecretAccessKey === '' ||
    assetsBucketName === undefined ||
    assetsBucketName === ''
  ) {
    throw new Error('Configuration Error: Missing CLOUDFLARE_R2_ASSETS_* environment variables.');
  }

  // Load Creative Bucket Config
  const creativeAccessKeyId = process.env.CLOUDFLARE_R2_CREATIVE_ACCESS_KEY_ID;
  const creativeSecretAccessKey = process.env.CLOUDFLARE_R2_CREATIVE_SECRET_ACCESS_KEY;
  const creativeBucketName = process.env.CLOUDFLARE_R2_CREATIVE_BUCKET_NAME;
  const creativePublicUrl = process.env.CLOUDFLARE_R2_CREATIVE_PUBLIC_URL ?? '';

  if (
    creativeAccessKeyId === undefined ||
    creativeAccessKeyId === '' ||
    creativeSecretAccessKey === undefined ||
    creativeSecretAccessKey === '' ||
    creativeBucketName === undefined ||
    creativeBucketName === ''
  ) {
    throw new Error('Configuration Error: Missing CLOUDFLARE_R2_CREATIVE_* environment variables.');
  }

  return {
    assets: {
      accountId,
      accessKeyId: assetsAccessKeyId,
      secretAccessKey: assetsSecretAccessKey,
      bucketName: assetsBucketName,
      publicUrl: assetsPublicUrl ?? '',
    },
    creative: {
      accountId,
      accessKeyId: creativeAccessKeyId,
      secretAccessKey: creativeSecretAccessKey,
      bucketName: creativeBucketName,
      publicUrl: creativePublicUrl,
    },
  };
}
