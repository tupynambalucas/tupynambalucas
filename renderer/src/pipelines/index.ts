import { githubProfilePipeline } from './github-profile.pipeline.js';
import type { Pipeline } from './types.js';

/**
 * Registry of all active document generation pipelines in the monorepo.
 */
export const activePipelines: Pipeline[] = [
  githubProfilePipeline,
  // Additional pipelines (e.g., handbook-docs, workspace summaries) can be registered here in the future
];
