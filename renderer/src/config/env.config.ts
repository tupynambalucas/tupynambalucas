import dotenv from 'dotenv';

dotenv.config();

export const config = {
  // Only the token MUST come from the environment (secrets)
  githubToken: process.env.PROFILE_GH_PAT ?? '',

  // All other variables can be explicitly defined here for the project
  repositoryOwner: 'tupynambalucas',
  repositoryName: 'tupynambalucas',
  targetBranch: process.env.TARGET_BRANCH ?? 'develop',

  excludeRepos: [],
  excludeLangs: [],
  excludePrivate: false,

  silent: false,
  debug: false,
  isGitHubAction: process.env.GITHUB_ACTIONS === 'true',
  maxRetries: 3,

  overviewOutputFile: './profile/generated/overview.svg',
  languagesOutputFile: './profile/generated/languages.svg',
  overviewTemplate: undefined,
  languagesTemplate: undefined,
};
