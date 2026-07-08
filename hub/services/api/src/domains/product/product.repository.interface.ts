import type {
  ClientSession,
  AnyBulkWriteOperation,
  UpdateWriteOpResult,
  UpdateQuery,
  QueryFilter,
  mongo,
} from 'mongoose';
import type { IProductDocument } from '../../models/product.model.js';
import type { IProduct } from '@tupynambalucas-hub/core';

export interface ProductKey {
  name: string;
  category: string;
  measureType: string;
  contentValue?: number;
  contentUnit?: 'g' | 'kg' | 'ml' | 'L';
}

export interface IProductRepository {
  findAll(queryFilters: QueryFilter<IProductDocument>): Promise<IProductDocument[]>;
  findById(id: string): Promise<IProductDocument | null>;
  update(id: string, data: Partial<IProduct>): Promise<IProductDocument | null>;
  bulkUpsert(
    ops: Array<AnyBulkWriteOperation<IProductDocument>>,
    session: ClientSession,
  ): Promise<mongo.BulkWriteResult>;
  findByKeys(keys: ProductKey[], session: ClientSession): Promise<IProductDocument[]>;
  deactivateOthers(activeIds: string[], session: ClientSession): Promise<UpdateWriteOpResult>;
  updateMany(
    filter: QueryFilter<IProductDocument>,
    update: UpdateQuery<IProductDocument>,
    session: ClientSession,
  ): Promise<UpdateWriteOpResult>;
}
