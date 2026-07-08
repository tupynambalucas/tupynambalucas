import { execFileSync } from 'child_process';
import { rmSync, mkdtempSync } from 'fs';
import { join } from 'path';
import { tmpdir } from 'os';

let isGitChecked = false;
let isGitAvailable = false;

export function checkGitInstalled(): boolean {
  if (isGitChecked) return isGitAvailable;
  try {
    execFileSync('git', ['--version'], { stdio: 'ignore' });
    isGitAvailable = true;
  } catch {
    isGitAvailable = false;
  }
  isGitChecked = true;
  return isGitAvailable;
}

interface GitFallbackOptions {
  login: string;
  token: string;
  repo: string;
  emails: string[];
}

export function getLocalLinesChanged(options: GitFallbackOptions): number {
  if (!checkGitInstalled()) {
    console.warn('Git is not installed or available on this system. Skipping local fallback.');
    return 0;
  }

  const { login, token, repo, emails } = options;
  const repoNameSafe = repo.replace(/\//g, '_') + '_' + Date.now();
  const tempDirRoot = mkdtempSync(join(tmpdir(), 'git-fallback-'));
  const repoPath = join(tempDirRoot, repoNameSafe);
  const repoUrl = `https://${login}:${token}@github.com/${repo}.git`;

  try {
    // Perform bare clone optimized for statistics calculation
    execFileSync(
      'git',
      [
        'clone',
        '--bare',
        '--filter=blob:limit=1m',
        '--no-tags',
        '--single-branch',
        repoUrl,
        repoPath,
      ],
      { stdio: 'ignore' },
    );

    // Construct log arguments containing every author email address
    const logArgs = ['-C', repoPath, 'log', '--numstat', '--pretty=tformat:'];
    for (const email of emails) {
      logArgs.push('--author', email);
    }

    const logOutput = execFileSync('git', logArgs, { encoding: 'utf8' });
    let totalLinesChanged = 0;

    const lines = logOutput.split('\n');
    for (const line of lines) {
      if (!line) continue;
      const parts = line.trim().split(/\s+/);
      if (parts.length >= 2) {
        const additions = parseInt(parts[0], 10) || 0;
        const deletions = parseInt(parts[1], 10) || 0;
        totalLinesChanged += additions + deletions;
      }
    }

    return totalLinesChanged;
  } catch (error) {
    console.error(`Local git fallback failed for repository ${repo}:`, error);
    return 0;
  } finally {
    // Safely remove the bare repository directory and temp root
    try {
      rmSync(tempDirRoot, { recursive: true, force: true });
    } catch (cleanupError) {
      console.error(`Failed to clean up repository directory at ${tempDirRoot}:`, cleanupError);
    }
  }
}
