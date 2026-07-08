import type { ClientSession, QueryFilter, AnyBulkWriteOperation } from 'mongoose';
import type { IProduct } from '@tupynambalucas-hub/core';
import type { IProductRepository } from './product.repository.interface.js';
import type { ListProductsRoute } from './product.schema.js';
import { AppError } from '../../utils/AppError.js';
import type { IProductDocument } from '../../models/product.model.js';
import type { z } from 'zod';

type ListQuery = z.infer<ListProductsRoute['querystring']>;

export class ProductService {
  constructor(private readonly repo: IProductRepository) {}

  public async listProducts(filters: ListQuery): Promise<IProductDocument[]> {
    const query: QueryFilter<IProductDocument> = {};

    if (filters.availableOnly) {
      query.available = true;
    }

    if (filters.category) {
      query.category = filters.category;
    }

    if (filters.type) {
      query['measure.type'] = filters.type;
    }

    if (filters.search) {
      query.name = { $regex: filters.search, $options: 'i' };
    }

    return this.repo.findAll(query);
  }

  public async updateProduct(id: string, data: Partial<IProduct>): Promise<IProductDocument> {
    const updated = await this.repo.update(id, data);
    if (!updated) {
      throw new AppError('PRODUCT_NOT_FOUND', 404);
    }
    return updated;
  }

  public async syncCycleProducts(products: IProduct[], session: ClientSession): Promise<string[]> {
    if (products.length === 0) {
      return [];
    }

    try {
      const bulkOps: Array<AnyBulkWriteOperation<IProductDocument>> = products.map((p) => {
        const filter: QueryFilter<IProductDocument> = {
          name: p.name,
          category: p.category,
          'measure.type': p.measure.type,
        };

        if (p.content) {
          filter['content.value'] = p.content.value;
          filter['content.unit'] = p.content.unit;
        } else {
          filter.content = null;
        }

        return {
          updateOne: {
            filter,
            update: {
              $set: {
                name: p.name,
                category: p.category,
                measure: p.measure,
                content: p.content,
                available: true,
              },
            },
            upsert: true,
          },
        };
      });

      await this.repo.bulkUpsert(bulkOps, session);

      const keys = products.map((p) => ({
        name: p.name,
        category: p.category,
        measureType: p.measure.type,
        contentValue: p.content?.value,
        contentUnit: p.content?.unit,
      }));

      const activeProducts = await this.repo.findByKeys(keys, session);
      const activeIds = activeProducts.map((p) => String(p._id));

      await this.repo.deactivateOthers(activeIds, session);

      return activeIds;
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError('PRODUCT_SYNC_FAILED', 400);
    }
  }
}
