import { z } from 'zod';

export const LanguageSchema = z.object({
  name: z.string(),
  size: z.number(),
  color: z.string().nullable().optional(),
});

export type Language = z.infer<typeof LanguageSchema>;
