import type { z } from 'zod';
import type { ProductResponseSchema } from '@tupynambalucas-hub/core';
import type { FastifyZodHandler } from '../../types/fastify.js';
import type { ListProductsRoute, UpdateProductRoute } from './product.schema.js';
import type { IProductDocument } from '../../models/product.model.js';
import type { ProductService } from './product.service.js';

interface ProductPlainObject {
  _id: { toString(): string };
  name: string;
  category: string;
  measure: unknown;
  content?: unknown;
  available: boolean;
  createdAt?: Date | string | number;
  updatedAt?: Date | string | number;
}

type ProductReply = z.infer<typeof ProductResponseSchema>;

export class ProductController {
  constructor(private readonly service: ProductService) {}

  private mapToResponse(product: IProductDocument): ProductReply {
    const obj = product.toObject() as ProductPlainObject;

    return {
      ...obj,
      _id: obj._id.toString(),
      createdAt: obj.createdAt ? new Date(obj.createdAt).toISOString() : undefined,
      updatedAt: obj.updatedAt ? new Date(obj.updatedAt).toISOString() : undefined,
    } as ProductReply;
  }

  public listHandler: FastifyZodHandler<ListProductsRoute> = async (
    request,
    reply,
  ): Promise<void> => {
    const products = await this.service.listProducts(request.query);
    const response = products.map((p) => this.mapToResponse(p));
    void reply.send(response);
  };

  public updateHandler: FastifyZodHandler<UpdateProductRoute> = async (
    request,
    reply,
  ): Promise<void> => {
    const product = await this.service.updateProduct(request.params.id, request.body);
    const response = this.mapToResponse(product);
    void reply.send(response);
  };
}
