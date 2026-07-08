import type {
  Model,
  ClientSession,
  AnyBulkWriteOperation,
  UpdateQuery,
  UpdateWriteOpResult,
  QueryFilter,
  mongo,
} from 'mongoose';
import type { IProductDocument } from '../../models/product.model.js';
import type { IProductRepository, ProductKey } from './product.repository.interface.js';
import type { IProduct } from '@tupynambalucas-hub/core';

export class ProductRepository implements IProductRepository {
  constructor(private readonly model: Model<IProductDocument>) {}

  public async findAll(queryFilters: QueryFilter<IProductDocument>): Promise<IProductDocument[]> {
    return this.model.find(queryFilters).sort({ category: 1, name: 1 }).exec();
  }

  public async findById(id: string): Promise<IProductDocument | null> {
    return this.model.findById(id).exec();
  }

  public async update(id: string, data: Partial<IProduct>): Promise<IProductDocument | null> {
    return this.model.findByIdAndUpdate(id, { $set: data }, { new: true }).exec();
  }

  public async bulkUpsert(
    ops: Array<AnyBulkWriteOperation<IProductDocument>>,
    session: ClientSession,
  ): Promise<mongo.BulkWriteResult> {
    return this.model.bulkWrite(ops, { session });
  }

  public async findByKeys(keys: ProductKey[], session: ClientSession): Promise<IProductDocument[]> {
    if (keys.length === 0) {
      return [];
    }

    const criteria = keys.map((k) => {
      const filter: QueryFilter<IProductDocument> = {
        name: k.name,
        category: k.category,
        'measure.type': k.measureType,
      };

      if (k.contentValue !== undefined && k.contentUnit !== undefined) {
        filter['content.value'] = k.contentValue;
        filter['content.unit'] = k.contentUnit;
      } else {
        filter.content = null;
      }
      return filter;
    });

    return this.model.find({ $or: criteria }).select('_id').session(session).exec();
  }

  public async deactivateOthers(
    activeIds: string[],
    session: ClientSession,
  ): Promise<UpdateWriteOpResult> {
    return this.model
      .updateMany({ _id: { $nin: activeIds }, available: true }, { $set: { available: false } })
      .session(session)
      .exec();
  }

  public async updateMany(
    filter: QueryFilter<IProductDocument>,
    update: UpdateQuery<IProductDocument>,
    session: ClientSession,
  ): Promise<UpdateWriteOpResult> {
    return this.model.updateMany(filter, update).session(session).exec();
  }
}
