import { readFileSync, writeFileSync } from 'node:fs';
import * as path from 'node:path';
import type { ProjectConfig } from '../types/index.js';

export function getConfigPath(): string {
  return path.resolve(process.cwd(), '../../shared/config/project.config.json');
}

export function loadProjectConfig(): ProjectConfig {
  const configPath = getConfigPath();
  const raw = readFileSync(configPath, 'utf-8');
  return JSON.parse(raw) as ProjectConfig;
}

export function saveProjectConfig(config: ProjectConfig): void {
  const configPath = getConfigPath();
  writeFileSync(configPath, JSON.stringify(config, null, 2), 'utf-8');
}
