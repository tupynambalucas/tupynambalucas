import { z } from 'zod';
import { RepositorySchema } from './repository.schema';

export const GitHubStatsSchema = z.object({
  user: z.string(),
  name: z.string(),
  emails: z.array(z.string()),
  repo_contributions: z.number().default(0),
  issue_contributions: z.number().default(0),
  commit_contributions: z.number().default(0),
  pr_contributions: z.number().default(0),
  review_contributions: z.number().default(0),
  repositories: z.array(RepositorySchema),
});

export type GitHubStats = z.infer<typeof GitHubStatsSchema>;
