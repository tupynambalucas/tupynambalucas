import { readFileSync, writeFileSync } from 'node:fs';
import { globSync } from 'glob';
import * as path from 'node:path';

export interface ReplacementRule {
  oldValue: string;
  newValue: string;
}

export function applyReplacements(rootDir: string, rules: ReplacementRule[]): number {
  const targetFiles = globSync(
    '**/{package.json,*.env,*.env.*,compose.yaml,deploy-docs.yaml,*.yaml}',
    {
      cwd: rootDir,
      ignore: ['**/node_modules/**', '**/.git/**', '**/dist/**', '**/pnpm-lock.yaml'],
    },
  );

  let modifiedCount = 0;

  for (const file of targetFiles) {
    const fullPath = path.resolve(rootDir, file);
    try {
      let content = readFileSync(fullPath, 'utf-8');
      let changed = false;

      for (const rule of rules) {
        if (content.includes(rule.oldValue)) {
          content = content.replaceAll(rule.oldValue, rule.newValue);
          changed = true;
        }
      }

      if (changed === true) {
        writeFileSync(fullPath, content, 'utf-8');
        modifiedCount++;
      }
    } catch (err) {
      // Ignore read errors for locked files/directories
      console.warn(`Could not process file: ${fullPath}`, err);
    }
  }

  return modifiedCount;
}
