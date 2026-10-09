import { z } from 'zod';
import { AUTH_RULES } from '../constants.js';

export const UserSchema = z.object({
  _id: z.string().optional(),
  email: z.email().max(AUTH_RULES.EMAIL.MAX),
  username: z.string().min(AUTH_RULES.USERNAME.MIN).max(AUTH_RULES.USERNAME.MAX),
  password: z.string().min(AUTH_RULES.PASSWORD.MIN).optional(),
  icon: z.string(),
  role: z.enum(['user', 'admin']).default('user'),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
});

export const UserResponseSchema = UserSchema.omit({
  password: true,
});

export type IUser = z.infer<typeof UserSchema>;
export type UserResponse = z.infer<typeof UserResponseSchema>;
