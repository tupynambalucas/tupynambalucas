import { z } from 'zod';

export const EntityMetadataSchema = z.object({
  filePath: z.string().optional(),
  workspace: z.string().optional(),
  section: z.string().optional(),
  contentHash: z.string().optional(),
  updatedAt: z.string(),
});

export const MemoryEntitySchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1),
  type: z.enum(['doc_chunk', 'chat_message', 'workspace_spec', 'code_snippet']),
  content: z.string(),
  embedding: z.array(z.number()),
  metadata: EntityMetadataSchema,
});

export const SearchQueryDTOSchema = z.object({
  query: z.string().min(1),
  type: z.enum(['doc_chunk', 'chat_message', 'workspace_spec', 'code_snippet']).optional(),
  workspace: z.string().optional(),
  limit: z.number().int().min(1).max(100).optional().default(10),
});
