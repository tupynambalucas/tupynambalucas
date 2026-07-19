import { resolve, join, basename, dirname } from 'path';
import { readFileSync, writeFileSync, mkdirSync } from 'fs';
import { brandColors } from '@tupynambalucas-studio/design/tokens';
import { fillTemplate } from '../../utils/template-fill.js';
import { renderStatsCards } from '../../renderers/stats-card.js';
import { uploadFileContents } from '../../clients/github.js';
import type { Pipeline } from '../../schemas/pipeline.schema.js';
import type { GitHubStats } from '../../schemas/githubstats.schema.js';
import type { Config } from '../../schemas/env.schema.js';

export const githubProfilePipeline: Pipeline = {
  id: 'github-profile',
  name: 'GitHub Developer Profile',
  description: 'Compiles the main developer profile README and its respective statistics cards.',
  targets: [
    {
      name: 'Root Profile README',
      templatePath: 'src/pipelines/profile/profile.template.md',
      outputPath: '../README.md', // Writes directly to the monorepo root (D:\projects\tupynambalucas\README.md)
      ciPath: 'README.md',
      ciBranches: ['main'],
    },
  ],
  async run(stats: GitHubStats, config: Config, workspaceRoot: string): Promise<void> {
    const cardsDir = resolve(workspaceRoot, 'generated/cards');
    const localMode = !config.isGitHubAction;

    const statsOutputDir = localMode ? cardsDir : join(cardsDir, 'stats');
    mkdirSync(statsOutputDir, { recursive: true });

    const overviewOutputFile = resolve(statsOutputDir, 'overview.svg');
    const languagesOutputFile = resolve(statsOutputDir, 'languages.svg');

    // 1. Generate Stats Cards
    console.info('Generating SVG stats cards...');
    renderStatsCards({
      stats,
      config,
      defaultOverviewTemplatePath: join(
        workspaceRoot,
        '../studio/design/assets/github/cards/stats/overview.template.svg',
      ),
      defaultLanguagesTemplatePath: join(
        workspaceRoot,
        '../studio/design/assets/github/cards/stats/languages.template.svg',
      ),
      overviewOutputFile,
      languagesOutputFile,
    });

    // 2. Load & Process Static Header SVG
    const staticHeaderSrcPath = join(
      workspaceRoot,
      '../studio/design/assets/github/cards/static/github-header.svg',
    );
    console.info(`Reading static header template from ${staticHeaderSrcPath}...`);
    const headerSvgContent = readFileSync(staticHeaderSrcPath, 'utf8');

    // For local mode, write separate files. For CI mode, we will write/upload the adaptive one.
    if (localMode) {
      console.info(`Writing local light header to ${join(cardsDir, 'github-header-light.svg')}...`);
      writeFileSync(join(cardsDir, 'github-header-light.svg'), headerSvgContent, 'utf8');

      console.info(`Writing local dark header to ${join(cardsDir, 'github-header-dark.svg')}...`);
      const darkHeaderSvg = headerSvgContent.replace(
        /#gh-dark-mode-only:target/g,
        '#gh-dark-mode-only',
      );
      writeFileSync(join(cardsDir, 'github-header-dark.svg'), darkHeaderSvg, 'utf8');
    } else {
      const staticDir = join(cardsDir, 'static');
      mkdirSync(staticDir, { recursive: true });
      const headerOutPath = join(staticDir, 'github-header.svg');
      console.info(`Writing production adaptive header to ${headerOutPath}...`);
      writeFileSync(headerOutPath, headerSvgContent, 'utf8');
    }

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
      ? `https://raw.githubusercontent.com/${config.repositoryOwner}/${config.repositoryName}/generated/cards`
      : './cards';

    const urlSuffix = config.isGitHubAction ? '?raw=true' : '';

    // Header image markdown tag
    const headerImage = config.isGitHubAction
      ? `<picture>
    <source media="(prefers-color-scheme: dark)" srcset="${assetsBaseUrl}/static/github-header.svg${urlSuffix}#gh-dark-mode-only" />
    <source media="(prefers-color-scheme: light)" srcset="${assetsBaseUrl}/static/github-header.svg${urlSuffix}" />
    <img alt="Tupynambá Lucas" src="${assetsBaseUrl}/static/github-header.svg${urlSuffix}" width="100%" />
  </picture>`
      : `<img alt="Tupynambá Lucas" src="${assetsBaseUrl}/github-header.svg" width="100%" />`;

    const overviewImages = config.isGitHubAction
      ? `<picture>
    <source media="(prefers-color-scheme: dark)" srcset="${assetsBaseUrl}/stats/overview.svg${urlSuffix}#gh-dark-mode-only" />
    <source media="(prefers-color-scheme: light)" srcset="${assetsBaseUrl}/stats/overview.svg${urlSuffix}" />
    <img alt="${stats.name}'s GitHub Stats" src="${assetsBaseUrl}/stats/overview.svg${urlSuffix}" height="200px" />
  </picture>`
      : `<img alt="${stats.name}'s GitHub Stats" src="${assetsBaseUrl}/overview.svg" height="200px" />`;

    const languagesImages = config.isGitHubAction
      ? `<picture>
    <source media="(prefers-color-scheme: dark)" srcset="${assetsBaseUrl}/stats/languages.svg${urlSuffix}#gh-dark-mode-only" />
    <source media="(prefers-color-scheme: light)" srcset="${assetsBaseUrl}/stats/languages.svg${urlSuffix}" />
    <img alt="Languages Used" src="${assetsBaseUrl}/stats/languages.svg${urlSuffix}" height="200px" />
  </picture>`
      : `<img alt="Languages Used" src="${assetsBaseUrl}/languages.svg" height="200px" />`;

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
      urlSuffix,
      headerImage,
      overviewImages,
      languagesImages,
      colors: {
        brandPurple: brandColors.identity.brandPurple,
        brandBlue: brandColors.identity.brandBlue,
        brandViolet: brandColors.identity.brandViolet,
        baseLight: brandColors.surface.baseLight,
        baseDark: brandColors.surface.baseDark,
        borderLight: brandColors.neutral.borderLight,
        borderDark: brandColors.neutral.borderDark,
        accent: brandColors.feedback.accent,
        success: brandColors.feedback.success,
        error: brandColors.feedback.error,
        titleLight: brandColors.typography.titles.light,
        titleDark: brandColors.typography.titles.dark,
        subtitleLight: brandColors.typography.subtitles.light,
        subtitleDark: brandColors.typography.subtitles.dark,
        paragraphLight: brandColors.typography.paragraphs.light,
        paragraphDark: brandColors.typography.paragraphs.dark,
      },
    };

    console.info('Executing document rendering pipeline targets...');
    for (const target of this.targets) {
      console.info(`Compiling target: ${target.name}...`);

      const templateFullPath = resolve(workspaceRoot, target.templatePath);
      const templateContent = readFileSync(templateFullPath, 'utf8');

      if (!config.isGitHubAction) {
        const outputFilename = basename(target.outputPath);

        // 1. Generate Light Mode Preview Document
        const lightReadmeData = {
          ...readmeData,
          headerImage: `<img alt="Tupynambá Lucas" src="../../cards/github-header-light.svg" width="100%" />`,
          overviewImages: `<img alt="${stats.name}'s GitHub Stats" src="../../cards/overview-light.svg" height="200px" />`,
          languagesImages: `<img alt="Languages Used" src="../../cards/languages-light.svg" height="200px" />`,
        };
        const lightContent = fillTemplate(templateContent, lightReadmeData);
        const lightFullPath = resolve(workspaceRoot, 'generated/docs/light', outputFilename);
        console.info(`Local dev mode: Writing light preview document to ${lightFullPath}...`);
        mkdirSync(dirname(lightFullPath), { recursive: true });
        writeFileSync(lightFullPath, lightContent, 'utf8');

        // 2. Generate Dark Mode Preview Document
        const darkReadmeData = {
          ...readmeData,
          headerImage: `<img alt="Tupynambá Lucas" src="../../cards/github-header-dark.svg" width="100%" />`,
          overviewImages: `<img alt="${stats.name}'s GitHub Stats" src="../../cards/overview-dark.svg" height="200px" />`,
          languagesImages: `<img alt="Languages Used" src="../../cards/languages-dark.svg" height="200px" />`,
        };
        const darkContent = fillTemplate(templateContent, darkReadmeData);
        const darkFullPath = resolve(workspaceRoot, 'generated/docs/dark', outputFilename);
        console.info(`Local dev mode: Writing dark preview document to ${darkFullPath}...`);
        mkdirSync(dirname(darkFullPath), { recursive: true });
        writeFileSync(darkFullPath, darkContent, 'utf8');
      } else {
        const compiledContent = fillTemplate(templateContent, readmeData);

        for (const branch of target.ciBranches) {
          console.info(
            `Uploading compiled target to branch [${branch}] at path "${target.ciPath}"...`,
          );
          await uploadFileContents(
            config.repositoryOwner,
            config.repositoryName,
            target.ciPath,
            compiledContent,
            branch,
            config.githubToken,
            `docs: dynamically update ${target.name.toLowerCase()}`,
          );
        }
      }
    }

    if (!config.isGitHubAction) {
      console.info('\nLocal compile complete! Checking outputs...');
      console.info('GitHub Profile generated locally for preview!');
    } else {
      console.info('\nRunning in GitHub Actions environment. Uploading assets to GitHub...');

      const overviewContent = readFileSync(overviewOutputFile, 'utf8');
      const languagesContent = readFileSync(languagesOutputFile, 'utf8');
      const headerContent = readFileSync(join(cardsDir, 'static/github-header.svg'), 'utf8');

      console.info('Uploading SVGs to "generated" branch...');
      await uploadFileContents(
        config.repositoryOwner,
        config.repositoryName,
        'cards/stats/overview.svg',
        overviewContent,
        'generated',
        config.githubToken,
        'chore: update overview stats',
      );
      await uploadFileContents(
        config.repositoryOwner,
        config.repositoryName,
        'cards/stats/languages.svg',
        languagesContent,
        'generated',
        config.githubToken,
        'chore: update languages stats',
      );
      await uploadFileContents(
        config.repositoryOwner,
        config.repositoryName,
        'cards/static/github-header.svg',
        headerContent,
        'generated',
        config.githubToken,
        'chore: update static github header',
      );

      console.info('GitHub Profile successfully synced to all branches!');
    }
  },
};

export default githubProfilePipeline;
