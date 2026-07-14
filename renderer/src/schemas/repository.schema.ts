import { z } from 'zod';
import { LanguageSchema } from './language.schema';

export const RepositorySchema = z.object({
  name: z.string(),
  stars: z.number(),
  forks: z.number(),
  languages: z.array(LanguageSchema).nullable().optional(),
  lines_changed: z.number().default(0),
  views: z.number().default(0),
  private: z.boolean(),
});

export type Repository = z.infer<typeof RepositorySchema>;
