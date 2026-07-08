import { execSync } from 'node:child_process';
import path from 'node:path';

// 1. Get list of staged files
let stagedFiles: string[] = [];
try {
  const output = execSync('git diff --cached --name-only', {
    encoding: 'utf8',
  });
  stagedFiles = output
    .split('\n')
    .map((f: string) => f.trim())
    .filter(Boolean);
} catch (err) {
  console.error('Error getting staged files:', err);
  process.exit(1);
}

if (stagedFiles.length === 0) {
  console.info('No staged files found.');
  process.exit(0);
}

// 2. Check if any TypeScript/JavaScript files are modified
const codeFileExtensions = ['.ts', '.tsx', '.js', '.jsx', '.cts', '.mts', '.cjs', '.mjs'];
const hasCodeChanges = stagedFiles.some((file) => {
  const ext = path.extname(file).toLowerCase();
  return codeFileExtensions.includes(ext);
});

if (hasCodeChanges === false) {
  console.info('No TypeScript or JavaScript file changes detected. Skipping typecheck.');
  process.exit(0);
}

// 3. Map changed files to workspaces/filters
const filters = new Set<string>();
let runAll = false;

for (const file of stagedFiles) {
  const normalizedFile = file.replace(/\\/g, '/');

  if (normalizedFile.includes('/') === false) {
    runAll = true;
    break;
  }

  const parts = normalizedFile.split('/');
  const rootDir = parts[0];

  if (rootDir === 'hub') {
    filters.add('--filter=@tupynambalucas-hub/*');
  } else if (rootDir === 'studio') {
    filters.add('--filter=@tupynambalucas-studio/assets');
  } else if (rootDir === 'tools') {
    filters.add('--filter=@tupynambalucas-tools/*');
  } else if (rootDir === 'docs') {
    filters.add('--filter=@tupynambalucas/docs');
  } else {
    runAll = true;
    break;
  }
}

let command = '';
if (runAll === true) {
  console.info('Global configuration or root changes detected. Running full typecheck...');
  command = 'pnpm typecheck';
} else if (filters.size > 0) {
  const filterList = Array.from(filters).join(' ');
  console.info(`Changes detected in specific workspaces. Running typecheck for: ${filterList}...`);
  command = `pnpm typecheck ${filterList}`;
} else {
  console.info('No typecheck required for changed files.');
  process.exit(0);
}

try {
  execSync(command, { stdio: 'inherit' });
} catch {
  console.error(`Typecheck failed. Command exited with error.`);
  process.exit(1);
}
