import { text, isCancel, cancel } from '@clack/prompts';
import type { ProjectConfig } from '../../types/index.js';

export async function promptForConfig(currentConfig: ProjectConfig): Promise<ProjectConfig> {
  const newDomain = await text({
    message: 'What is the new Project Domain?',
    initialValue: currentConfig.PROJECT_DOMAIN,
  });

  if (isCancel(newDomain) === true) {
    cancel('Operation cancelled.');
    process.exit(0);
  }

  const newProjectName = await text({
    message: 'What is the new Project Name (CamelCase)?',
    initialValue: currentConfig.PROJECT_NAME,
  });

  if (isCancel(newProjectName) === true) {
    cancel('Operation cancelled.');
    process.exit(0);
  }

  const newOrg = await text({
    message: 'What is the new GitHub Organization?',
    initialValue: currentConfig.GITHUB_ORG,
  });

  if (isCancel(newOrg) === true) {
    cancel('Operation cancelled.');
    process.exit(0);
  }

  const domainStr = newDomain;
  const newHost = `${domainStr.split('.')[0]}.internal`;

  return {
    ...currentConfig,
    PROJECT_DOMAIN: domainStr,
    PROJECT_NAME: newProjectName,
    GITHUB_ORG: newOrg,
    GITHUB_REPO: newOrg,
    PROJECT_INTERNAL_HOST: newHost,
  };
}
