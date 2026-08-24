import { z } from 'zod';
import { memoryApiClient } from '../client/memory-api.client.js';

export const searchToolDefinition = {
  name: 'search_knowledge',
  description:
    'Executes RAG vector search over indexed documents and memory planes in Cortex Memory.',
  inputSchema: {
    type: 'object',
    properties: {
      query: { type: 'string', description: 'Semantic search prompt or user question' },
      limit: { type: 'number', description: 'Maximum number of results to retrieve (default: 5)' },
      minScore: {
        type: 'number',
        description: 'Minimum similarity score threshold (default: 0.7)',
      },
    },
    required: ['query'],
  },
};

export const searchToolSchema = z.object({
  query: z.string(),
  limit: z.number().optional().default(5),
  minScore: z.number().optional().default(0.7),
});

export async function handleSearchTool(args: unknown) {
  const parsed = searchToolSchema.parse(args);
  const results = await memoryApiClient.searchKnowledge(
    parsed.query,
    parsed.limit,
    parsed.minScore,
  );
  return {
    content: [{ type: 'text', text: JSON.stringify(results, null, 2) }],
  };
}
