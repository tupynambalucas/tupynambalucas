export interface ProjectConfig {
  PROJECT_NAME: string;
  PROJECT_DISPLAY_NAME: string;
  PROJECT_DOMAIN: string;
  PROJECT_INTERNAL_HOST: string;
  GITHUB_ORG: string;
  GITHUB_REPO: string;
  AUTHOR_NAME: string;
  AUTHOR_EMAIL: string;
}

export interface InitCommandOptions {
  dryRun?: boolean;
}
