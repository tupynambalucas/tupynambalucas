import { z } from 'zod';
import { ProductSchema, ProductResponseSchema } from './product.schema.js';

export const CycleStatusEnum = z.enum(['PENDING', 'OPEN', 'CLOSED']);

export const CycleSchema = z.object({
  _id: z.string().optional(),
  description: z.string(),
  openingDate: z.string().datetime(),
  closingDate: z.string().datetime(),
  isActive: z.boolean().default(true),
  products: z.array(z.union([z.string(), ProductSchema])),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
});

export const CreateCycleDTOSchema = z.object({
  description: z.string(),
  openingDate: z.string().datetime(),
  closingDate: z.string().datetime(),
  products: z.array(ProductSchema),
});

export const CycleResponseSchema = CycleSchema.extend({
  products: z.array(z.union([z.string(), ProductResponseSchema])),
  status: CycleStatusEnum.optional(),
});

export type ICycle = z.infer<typeof CycleSchema>;
export type CreateCycleDTO = z.infer<typeof CreateCycleDTOSchema>;
export type CycleResponse = z.infer<typeof CycleResponseSchema>;
export type CycleStatus = z.infer<typeof CycleStatusEnum>;
