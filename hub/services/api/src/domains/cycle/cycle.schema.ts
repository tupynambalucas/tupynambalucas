import { z } from 'zod';
import { CreateCycleDTOSchema, CycleResponseSchema, ProductSchema } from '@tupynambalucas-hub/core';

export const createCycleSchema = {
  body: CreateCycleDTOSchema,
  response: {
    201: CycleResponseSchema,
  },
} as const;

const HistoryQuerySchema = z.object({
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(10),
  startDate: z.string().datetime().optional(),
  endDate: z.string().datetime().optional(),
});

const HistoryResponseSchema = z.object({
  data: z.array(CycleResponseSchema),
  pagination: z.object({
    total: z.number(),
    page: z.number(),
    pages: z.number(),
  }),
});

export const getHistorySchema = {
  querystring: HistoryQuerySchema,
  response: {
    200: HistoryResponseSchema,
  },
} as const;

const CycleIdParamSchema = z.object({
  id: z.string().min(1),
});

export const getCycleByIdSchema = {
  params: CycleIdParamSchema,
  response: {
    200: CycleResponseSchema,
  },
} as const;

export const updateCycleSchema = {
  params: CycleIdParamSchema,
  body: z.object({
    products: z.array(ProductSchema),
  }),
  response: {
    200: CycleResponseSchema,
  },
} as const;

export interface CreateCycleRoute {
  body: typeof CreateCycleDTOSchema;
  response: {
    201: typeof CycleResponseSchema;
  };
}

export interface GetHistoryRoute {
  querystring: typeof HistoryQuerySchema;
  response: {
    200: typeof HistoryResponseSchema;
  };
}

export interface GetByIdRoute {
  params: typeof CycleIdParamSchema;
  response: {
    200: typeof CycleResponseSchema;
  };
}

export interface UpdateCycleRoute {
  params: typeof CycleIdParamSchema;
  body: z.ZodObject<{
    products: z.ZodArray<typeof ProductSchema>;
  }>;
  response: {
    200: typeof CycleResponseSchema;
  };
}
