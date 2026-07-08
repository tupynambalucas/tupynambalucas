import { z } from 'zod';
import { ProductResponseSchema } from '@tupynambalucas-hub/core';

const ListProductsQuerySchema = z.object({
  search: z.string().optional(),
  category: z.string().optional(),
  type: z.string().optional(),
  availableOnly: z.coerce.boolean().optional(),
});

export const listProductsSchema = {
  querystring: ListProductsQuerySchema,
  response: {
    200: z.array(ProductResponseSchema),
  },
} as const;

export interface ListProductsRoute {
  querystring: typeof ListProductsQuerySchema;
  response: {
    200: z.ZodArray<typeof ProductResponseSchema>;
  };
}

const UpdateProductParamsSchema = z.object({
  id: z.string(),
});

const UpdateProductBodySchema = ProductResponseSchema.partial();

export const updateProductSchema = {
  params: UpdateProductParamsSchema,
  body: UpdateProductBodySchema,
  response: {
    200: ProductResponseSchema,
  },
} as const;

export interface UpdateProductRoute {
  params: typeof UpdateProductParamsSchema;
  body: typeof UpdateProductBodySchema;
  response: {
    200: typeof ProductResponseSchema;
  };
}
