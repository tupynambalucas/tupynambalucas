import { getGitHubStats, uploadFileContents } from './clients/github.js';
import { renderStatsCards } from './renderers/stats-card.js';
import { ConfigSchema } from './schemas/env.schema.js';
import { config as rawConfig } from './config/env.config.js';
import { fileURLToPath } from 'url';
import { dirname, resolve, join } from 'path';
import { readFileSync, writeFileSync, mkdirSync } from 'fs';
import { fillTemplate } from './utils/template-fill.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const workspaceRoot = resolve(__dirname, '..');

async function main(): Promise<void> {
  try {
    const config = ConfigSchema.parse(rawConfig);

    console.info('Starting Profile Stats Generator...');

    // Resolve output files strictly to profile/generated/stats/ for local tracking
    const statsDir = resolve(workspaceRoot, 'generated/stats');
    mkdirSync(statsDir, { recursive: true });

    const overviewOutputFile = resolve(statsDir, 'overview.svg');
    const languagesOutputFile = resolve(statsDir, 'languages.svg');

    const resolvedConfig = {
      ...config,
      overviewOutputFile,
      languagesOutputFile,
      overviewTemplate: undefined,
      languagesTemplate: undefined,
    };

    const stats = await getGitHubStats({
      token: resolvedConfig.githubToken,
      maxRetries: resolvedConfig.maxRetries,
    });

    console.info('Generating SVG cards...');
    renderStatsCards({
      stats,
      config: resolvedConfig,
      defaultOverviewTemplatePath: join(workspaceRoot, 'src/templates/overview.svg'),
      defaultLanguagesTemplatePath: join(workspaceRoot, 'src/templates/languages.svg'),
    });

    console.info('Compiling root README.md...');
    const readmeTemplatePath = join(workspaceRoot, 'src/templates/README.template.md');
    const readmeTemplate = readFileSync(readmeTemplatePath, 'utf8');

    const totalContributions =
      stats.repo_contributions +
      stats.issue_contributions +
      stats.commit_contributions +
      stats.pr_contributions +
      stats.review_contributions;

    const totalStars = stats.repositories.reduce((acc, r) => acc + r.stars, 0);
    const totalForks = stats.repositories.reduce((acc, r) => acc + r.forks, 0);
    const totalLinesChanged = stats.repositories.reduce((acc, r) => acc + r.lines_changed, 0);
    const totalViews = stats.repositories.reduce((acc, r) => acc + r.views, 0);

    const assetsBaseUrl = config.isGitHubAction
      ? `https://raw.githubusercontent.com/${config.repositoryOwner}/${config.repositoryName}/generated/stats`
      : './stats';

    const readmeData = {
      name: stats.name,
      user: stats.user,
      contributions: totalContributions,
      stars: totalStars,
      forks: totalForks,
      lines_changed: totalLinesChanged,
      views: totalViews,
      repos: stats.repositories.length,
      assetsBaseUrl,
    };

    const compiledReadme = fillTemplate(readmeTemplate, readmeData);

    if (!config.isGitHubAction) {
      // Development mode: Save preview locally
      const previewPath = join(workspaceRoot, 'generated/README.preview.md');
      console.info(`Local dev mode: Writing preview README to ${previewPath}...`);
      writeFileSync(previewPath, compiledReadme, 'utf8');
      console.info('GitHub Profile generated locally for preview!');
    } else {
      // CI/CD mode: Upload to GitHub branches
      console.info('Running in GitHub Actions environment. Uploading assets to GitHub...');

      const overviewContent = readFileSync(overviewOutputFile, 'utf8');
      const languagesContent = readFileSync(languagesOutputFile, 'utf8');

      console.info('Uploading SVGs to "generated" branch...');
      await uploadFileContents(
        config.repositoryOwner,
        config.repositoryName,
        'stats/overview.svg',
        overviewContent,
        'generated',
        config.githubToken,
        'chore: update overview stats',
      );
      await uploadFileContents(
        config.repositoryOwner,
        config.repositoryName,
        'stats/languages.svg',
        languagesContent,
        'generated',
        config.githubToken,
        'chore: update languages stats',
      );

      console.info('Syncing README.md across active branches...');
      const targetBranches = ['main'];
      for (const branch of targetBranches) {
        console.info(`Uploading README.md to ${branch}...`);
        await uploadFileContents(
          config.repositoryOwner,
          config.repositoryName,
          'README.md',
          compiledReadme,
          branch,
          config.githubToken,
          'docs: dynamically update README stats',
        );
      }

      console.info('GitHub Profile successfully synced to all branches!');
    }
  } catch (error) {
    console.error('Fatal error during profile generation:', error);
    process.exit(1);
  }
}

void main();
