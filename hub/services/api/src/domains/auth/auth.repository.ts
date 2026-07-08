import type { Model } from 'mongoose';
import type { RegisterDTO } from '@tupynambalucas-hub/core';
import type { IUserDocument } from '../../models/user.model.js';
import type { IAuthRepository } from './auth.repository.interface.js';

export class AuthRepository implements IAuthRepository {
  constructor(private readonly userModel: Model<IUserDocument>) {}

  public async findById(id: string): Promise<IUserDocument | null> {
    return this.userModel.findById(id).exec();
  }

  public async findByEmailOrUsername(
    email: string,
    username: string,
  ): Promise<IUserDocument | null> {
    return this.userModel.findOne({ $or: [{ email }, { username }] }).exec();
  }

  public async findByIdentifier(identifier: string): Promise<IUserDocument | null> {
    return this.userModel
      .findOne({
        $or: [{ email: identifier }, { username: identifier }],
      })
      .select('+password')
      .exec();
  }

  public async create(data: RegisterDTO): Promise<IUserDocument> {
    const newUser = new this.userModel({ ...data, role: 'user' });
    return newUser.save();
  }
}
