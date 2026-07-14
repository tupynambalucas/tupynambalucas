import { z } from 'zod';
import dotenv from 'dotenv';

dotenv.config();

export const ConfigSchema = z.object({
  githubToken: z.string().min(1, 'PROFILE_GH_PAT is required'),
  repositoryOwner: z.string().min(1, 'REPOSITORY_OWNER is required').default('tupynambalucas'),
  repositoryName: z.string().min(1, 'REPOSITORY_NAME is required').default('tupynambalucas'),
  targetBranch: z.string().min(1, 'TARGET_BRANCH is required').default('develop'),
  excludeRepos: z.array(z.string()).default([]),
  excludeLangs: z.array(z.string()).default([]),
  excludePrivate: z.boolean().default(false),
  silent: z.boolean().default(false),
  debug: z.boolean().default(false),
  isGitHubAction: z.boolean().default(false),
  maxRetries: z.number().int().min(0).max(10).default(3),
  overviewOutputFile: z.string().default('./profile/generated/overview.svg'),
  languagesOutputFile: z.string().default('./profile/generated/languages.svg'),
  overviewTemplate: z.string().optional(),
  languagesTemplate: z.string().optional(),
});

export type Config = z.infer<typeof ConfigSchema>;
