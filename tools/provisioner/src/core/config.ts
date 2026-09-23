import { readFileSync, writeFileSync } from 'node:fs';
import * as path from 'node:path';
import { pathToFileURL } from 'node:url';
import type { ProjectConfig } from '../types/index.js';

export function getConfigPath(): string {
  return path.resolve(process.cwd(), '../../shared/config/src/project.config.ts');
}

export async function loadProjectConfig(): Promise<ProjectConfig> {
  const configPath = getConfigPath();

  // Safe dynamic import for loading TS via tsx (which provisioner uses)
  const moduleUrl = pathToFileURL(configPath).toString();
  const { ProjectConfig } = await import(moduleUrl);
  return ProjectConfig as ProjectConfig;
}

export function saveProjectConfig(config: ProjectConfig): void {
  const configPath = getConfigPath();
  const fileContent = `export const ProjectConfig = ${JSON.stringify(config, null, 2)} as const;

export default ProjectConfig;
`;
  writeFileSync(configPath, fileContent, 'utf-8');
}
