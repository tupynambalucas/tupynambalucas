import { z } from 'zod';
import { RegisterDTOSchema, LoginDTOSchema, LoginResponseSchema } from '@tupynambalucas-hub/core';

export const registerSchema = {
  body: RegisterDTOSchema,
  response: {
    201: z.object({ message: z.string() }),
  },
} as const;

export const loginSchema = {
  body: LoginDTOSchema,
  response: {
    200: LoginResponseSchema,
  },
} as const;

export interface RegisterRoute {
  body: typeof RegisterDTOSchema;
  response: {
    201: z.ZodObject<{ message: z.ZodString }>;
  };
}

export interface LoginRoute {
  body: typeof LoginDTOSchema;
  response: {
    200: typeof LoginResponseSchema;
  };
}
