import { Schema, model, type Document } from 'mongoose';
import bcrypt from 'bcrypt';
import type { IUser } from '@tupynambalucas-hub/core';

export interface IUserDocument extends Omit<IUser, '_id'>, Document {
  password?: string;
  loginAttempts: number;
  lockUntil?: number;
  isLocked: boolean;
}

export const userSchema = new Schema<IUserDocument>(
  {
    email: { type: String, required: true, unique: true, trim: true, lowercase: true },
    username: { type: String, required: true, unique: true, trim: true },
    icon: { type: String, required: true, trim: true, lowercase: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['user', 'admin'], default: 'user' },
    loginAttempts: { type: Number, required: true, default: 0 },
    lockUntil: { type: Number },
  },
  { timestamps: true },
);

userSchema.virtual('isLocked').get(function () {
  return !!(this.lockUntil && this.lockUntil > Date.now());
});

userSchema.pre<IUserDocument>('save', async function () {
  if (!this.isModified('password') || !this.password) {
    return;
  }
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  } catch (err) {
    throw err instanceof Error ? err : new Error(String(err));
  }
});

export const User = model<IUserDocument>('User', userSchema);
