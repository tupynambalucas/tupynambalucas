import type { RegisterDTO } from '@tupynambalucas-hub/core';
import type { IUserDocument } from '../../models/user.model.js';

export interface IAuthRepository {
  findById(id: string): Promise<IUserDocument | null>;
  findByEmailOrUsername(email: string, username: string): Promise<IUserDocument | null>;
  findByIdentifier(identifier: string): Promise<IUserDocument | null>;
  create(data: RegisterDTO): Promise<IUserDocument>;
}
