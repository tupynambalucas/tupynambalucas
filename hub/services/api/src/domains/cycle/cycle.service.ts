import { Types, type Mongoose } from 'mongoose';
import type { IProduct, CreateCycleDTO } from '@tupynambalucas-hub/core';
import type { ICycleRepository } from './cycle.repository.interface.js';
import type { ProductService } from '../product/product.service.js';
import type { ICycleDocument } from '../../models/cycle.model.js';
import { AppError } from '../../utils/AppError.js';

export class CycleService {
  constructor(
    private readonly cycleRepo: ICycleRepository,
    private readonly productService: ProductService,
    private readonly mongoose: Mongoose,
  ) {}

  public async getActive(): Promise<ICycleDocument | null> {
    return this.cycleRepo.findActive();
  }

  public async getById(id: string): Promise<ICycleDocument | null> {
    const cycle = await this.cycleRepo.findById(id);
    if (!cycle) throw new AppError('CYCLE_NOT_FOUND', 404);
    return cycle;
  }

  public async getHistory(
    page: number,
    limit: number,
    startDate?: string,
    endDate?: string,
  ): Promise<{ cycles: ICycleDocument[]; total: number }> {
    return this.cycleRepo.findHistory(page, limit, startDate, endDate);
  }

  public async createCycle(data: CreateCycleDTO): Promise<ICycleDocument> {
    const session = await this.mongoose.startSession();
    session.startTransaction();

    try {
      await this.cycleRepo.deactivateAll(session);

      const productIds = await this.productService.syncCycleProducts(data.products, session);

      // CORREÇÃO: Verificação de segurança para productIds
      if (!Array.isArray(productIds)) {
        throw new AppError('PRODUCT_SYNC_FAILED', 500);
      }

      const newCycleData = {
        description: data.description,
        openingDate: new Date(data.openingDate),
        closingDate: new Date(data.closingDate),
        products: productIds.map((id) => new Types.ObjectId(id)),
        isActive: true,
      };

      const createdCycle = await this.cycleRepo.create(newCycleData, session);
      await session.commitTransaction();
      return createdCycle;
    } catch (error) {
      await session.abortTransaction();
      if (error instanceof AppError) throw error;
      throw new AppError('CYCLE_CREATION_FAILED', 400);
    } finally {
      await session.endSession();
    }
  }

  public async updateCycle(id: string, products: IProduct[]): Promise<ICycleDocument | null> {
    const session = await this.mongoose.startSession();
    session.startTransaction();

    try {
      const cycle = await this.cycleRepo.findByIdWithSession(id, session);
      if (!cycle) throw new AppError('CYCLE_NOT_FOUND_FOR_UPDATE', 404);

      const productIds = await this.productService.syncCycleProducts(products, session);

      // CORREÇÃO: Verificação de segurança para productIds
      if (!Array.isArray(productIds)) {
        throw new AppError('PRODUCT_SYNC_FAILED', 500);
      }

      cycle.products = productIds.map((pid) => new Types.ObjectId(pid));

      await this.cycleRepo.save(cycle, session);
      await session.commitTransaction();
      return this.cycleRepo.findById(id);
    } catch (error) {
      await session.abortTransaction();
      if (error instanceof AppError) throw error;
      throw new AppError('CYCLE_UPDATE_FAILED', 400);
    } finally {
      await session.endSession();
    }
  }

  public async performScheduledArchival(): Promise<void> {
    const session = await this.mongoose.startSession();
    session.startTransaction();
    try {
      const toleranceDate = new Date();
      await this.cycleRepo.archiveExpired(toleranceDate, session);
      await session.commitTransaction();
    } catch (error) {
      await session.abortTransaction();
      if (error instanceof AppError) throw error;
      throw new AppError('CYCLE_ARCHIVAL_FAILED', 500);
    } finally {
      await session.endSession();
    }
  }
}
