import { z } from 'zod';

export const PRODUCT_MEASURE_TYPES = ['unidade', 'kg'] as const;

export type ProductMeasureType = (typeof PRODUCT_MEASURE_TYPES)[number];

export const PRODUCT_CATEGORIES = [
  'Hortifruti',
  'Mercearia',
  'Geleias e Doces',
  'Bebidas e Vinhos',
  'Laticínios',
  'Proteínas',
  'Outros',
] as const;

export type ProductCategory = (typeof PRODUCT_CATEGORIES)[number];

export const MeasureSchema = z.object({
  value: z.union([z.string(), z.number()]),
  type: z.string(),
  label: z.string().optional(), // Descriptive tag (ex: 'garrafão', 'pacote')
  minimumOrder: z
    .object({
      type: z.string(),
      value: z.union([z.string(), z.number()]),
    })
    .nullish(), // Alterado para .nullish() para aceitar null vindo do banco
});

export const ContentSchema = z.object({
  value: z.number(),
  unit: z.enum(['g', 'kg', 'ml', 'L']),
});

export const ProductSchema = z.object({
  _id: z.string().optional(),
  name: z.string().min(1),
  category: z.string().min(1),
  measure: MeasureSchema,
  content: ContentSchema.nullish(), // CORREÇÃO: Aceita null ou undefined
  available: z.boolean().default(false),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
});

export const ProductResponseSchema = ProductSchema;

export type IMeasure = z.infer<typeof MeasureSchema>;
export type IContent = z.infer<typeof ContentSchema>;
export type IProduct = z.infer<typeof ProductSchema>;
export type ProductResponse = z.infer<typeof ProductResponseSchema>;
