import type { Model, ClientSession, QueryFilter, UpdateWriteOpResult } from 'mongoose';
import type { ICycleDocument } from '../../models/cycle.model.js';
import type { ICycleRepository } from './cycle.repository.interface.js';

export class CycleRepository implements ICycleRepository {
  constructor(private readonly model: Model<ICycleDocument>) {}

  public async findActive(): Promise<ICycleDocument | null> {
    return this.model.findOne({ isActive: true }).populate('products').exec();
  }

  public async findHistory(
    page: number,
    limit: number,
    startDate?: string,
    endDate?: string,
  ): Promise<{ cycles: ICycleDocument[]; total: number }> {
    const skip = (page - 1) * limit;
    const query: QueryFilter<ICycleDocument> = {};

    if (startDate || endDate) {
      const dateFilter: { $gte?: Date; $lte?: Date } = {};
      if (startDate) dateFilter.$gte = new Date(startDate);
      if (endDate) dateFilter.$lte = new Date(endDate);
      query.openingDate = dateFilter;
    }

    const [cycles, total] = await Promise.all([
      this.model
        .find(query)
        .select('-products')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .exec(),
      this.model.countDocuments(query).exec(),
    ]);

    return { cycles, total };
  }

  public async findById(id: string): Promise<ICycleDocument | null> {
    return this.model.findById(id).populate('products').exec();
  }

  public async findByIdWithSession(
    id: string,
    session: ClientSession,
  ): Promise<ICycleDocument | null> {
    return this.model.findById(id).session(session).exec();
  }

  public async archiveExpired(
    toleranceDate: Date,
    session?: ClientSession,
  ): Promise<UpdateWriteOpResult> {
    return this.model
      .updateMany(
        { isActive: true, closingDate: { $lte: toleranceDate } },
        { $set: { isActive: false } },
      )
      .session(session ?? null)
      .exec();
  }

  public async deactivateAll(session: ClientSession): Promise<UpdateWriteOpResult> {
    return this.model
      .updateMany({ isActive: true }, { $set: { isActive: false } })
      .session(session)
      .exec();
  }

  public async create(
    data: Partial<ICycleDocument>,
    session: ClientSession,
  ): Promise<ICycleDocument> {
    const [doc] = await this.model.create([data], { session });
    return doc;
  }

  public async save(document: ICycleDocument, session: ClientSession): Promise<ICycleDocument> {
    return document.save({ session });
  }
}
