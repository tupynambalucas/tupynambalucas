import type { FastifyReply, FastifyRequest } from 'fastify';
import type { z } from 'zod';
import type { Types } from 'mongoose';
import type { CycleResponseSchema, IProduct } from '@tupynambalucas-hub/core';
import type { CycleService } from './cycle.service.js';
import type { FastifyZodHandler } from '../../types/fastify.js';
import type { ICycleDocument } from '../../models/cycle.model.js';
import { AppError } from '../../utils/AppError.js';
import type {
  CreateCycleRoute,
  GetHistoryRoute,
  GetByIdRoute,
  UpdateCycleRoute,
} from './cycle.schema.js';

type CycleResponse = z.infer<typeof CycleResponseSchema>;

interface CyclePlainObject {
  _id: Types.ObjectId;
  description: string;
  openingDate: Date;
  closingDate: Date;
  isActive: boolean;
  products?: unknown[];
  createdAt?: Date;
  updatedAt?: Date;
}

export class CycleController {
  constructor(private readonly service: CycleService) {}

  private mapToResponse(cycle: ICycleDocument | null): CycleResponse {
    if (!cycle) {
      throw new AppError('CYCLE_MAPPING_FAILED', 500);
    }

    const obj = cycle.toObject() as CyclePlainObject;

    return {
      ...obj,
      _id: obj._id.toString(),
      openingDate: obj.openingDate.toISOString(),
      closingDate: obj.closingDate.toISOString(),
      createdAt: obj.createdAt?.toISOString(),
      updatedAt: obj.updatedAt?.toISOString(),
      products: Array.isArray(obj.products)
        ? obj.products.map((p: unknown) => {
            if (!p) return null;

            // Type narrowing seguro para evitar avisos de overlap
            if (typeof p === 'object') {
              if ('_id' in p) {
                if ('name' in p) {
                  const product = p as IProduct & {
                    _id: Types.ObjectId | string;
                    createdAt?: Date | string;
                    updatedAt?: Date | string;
                  };

                  return {
                    _id: product._id.toString(),
                    name: product.name,
                    category: product.category,
                    measure: product.measure,
                    content: product.content,
                    available: product.available,
                    createdAt: product.createdAt
                      ? new Date(product.createdAt).toISOString()
                      : undefined,
                    updatedAt: product.updatedAt
                      ? new Date(product.updatedAt).toISOString()
                      : undefined,
                  };
                }
                return (p as { _id: Types.ObjectId | string })._id.toString();
              }
            }

            // Fallback seguro para strings e primitivos
            if (typeof p === 'string' || typeof p === 'number' || typeof p === 'boolean') {
              return String(p);
            }

            return null;
          })
        : [],
    } as unknown as CycleResponse;
  }

  public getActiveCycleHandler: FastifyZodHandler<Record<string, never>> = async (
    _req: FastifyRequest,
    reply: FastifyReply,
  ): Promise<void> => {
    const activeCycle = await this.service.getActive();
    if (!activeCycle) {
      void reply.status(204).send();
      return;
    }
    void reply.send(this.mapToResponse(activeCycle));
  };

  public getCycleHistoryHandler: FastifyZodHandler<GetHistoryRoute> = async (
    req,
    reply,
  ): Promise<void> => {
    const { page, limit, startDate, endDate } = req.query;
    const result = await this.service.getHistory(page, limit, startDate, endDate);

    void reply.send({
      data: result.cycles.map((c) => this.mapToResponse(c)),
      pagination: {
        total: result.total,
        page,
        pages: Math.ceil(result.total / limit),
      },
    });
  };

  public getCycleByIdHandler: FastifyZodHandler<GetByIdRoute> = async (
    req,
    reply,
  ): Promise<void> => {
    const cycle = await this.service.getById(req.params.id);
    void reply.send(this.mapToResponse(cycle));
  };

  public createCycleHandler: FastifyZodHandler<CreateCycleRoute> = async (
    req,
    reply,
  ): Promise<void> => {
    const result = await this.service.createCycle(req.body);
    void reply.status(201).send(this.mapToResponse(result));
  };

  public updateCycleHandler: FastifyZodHandler<UpdateCycleRoute> = async (
    req,
    reply,
  ): Promise<void> => {
    const result = await this.service.updateCycle(req.params.id, req.body.products);
    void reply.send(this.mapToResponse(result));
  };
}
