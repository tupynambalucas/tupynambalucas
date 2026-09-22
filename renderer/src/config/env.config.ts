import dotenv from 'dotenv';
import ProjectConfig from '@monorepo/shared-config/project.config';

dotenv.config();

const fallbackOwner = ProjectConfig.REPOSITORY_OWNER;
const fallbackRepo = ProjectConfig.REPOSITORY_NAME;

const githubRepo = process.env.GITHUB_REPOSITORY ?? `${fallbackOwner}/${fallbackRepo}`;
const [owner, name] = githubRepo.split('/');

export const config = {
  // Only the token MUST come from the environment (secrets)
  githubToken: process.env.RENDERER_GH_PAT ?? '',

  // Resolve dynamically in CI or fallback to the local default from shared-config
  repositoryOwner: owner || fallbackOwner,
  repositoryName: name || fallbackRepo,
  targetBranch: process.env.TARGET_BRANCH ?? 'develop',

  excludeRepos: [],
  excludeLangs: [],
  excludePrivate: false,

  isGitHubAction: process.env.GITHUB_ACTIONS === 'true',
  maxRetries: 3,
};
