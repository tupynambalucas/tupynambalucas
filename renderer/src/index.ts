import { getGitHubStats, uploadFileContents } from './clients/github.js';
import { renderStatsCards } from './renderers/stats-card.js';
import { renderHeaderCards } from './renderers/header-card.js';
import { ConfigSchema } from './schemas/env.schema.js';
import { config as rawConfig } from './config/env.config.js';
import { brandColors } from '@tupynambalucas-studio/design/tokens';
import { fileURLToPath } from 'url';
import { dirname, resolve, join, basename } from 'path';
import { readFileSync, writeFileSync, mkdirSync } from 'fs';
import { fillTemplate } from './utils/template-fill.js';
import { activePipelines } from './pipelines/index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const workspaceRoot = resolve(__dirname, '..');

async function main(): Promise<void> {
  try {
    const config = ConfigSchema.parse(rawConfig);

    console.info('Starting Profile Stats Generator...');

    // Resolve output folder based on environment: local development uses 'generated/cards/' flat, CI/CD uses subdirectories 'generated/cards/stats/' and 'generated/cards/static/'
    const cardsDir = resolve(workspaceRoot, 'generated/cards');
    const localMode = !config.isGitHubAction;

    const statsOutputDir = localMode ? cardsDir : join(cardsDir, 'stats');
    const staticOutputDir = localMode ? cardsDir : join(cardsDir, 'static');

    mkdirSync(statsOutputDir, { recursive: true });
    mkdirSync(staticOutputDir, { recursive: true });

    const overviewOutputFile = resolve(statsOutputDir, 'overview.svg');
    const languagesOutputFile = resolve(statsOutputDir, 'languages.svg');
    const headerLightOutputFile = resolve(staticOutputDir, 'header-light.svg');
    const headerDarkOutputFile = resolve(staticOutputDir, 'header-dark.svg');

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

    console.info('Generating SVG stats cards...');
    renderStatsCards({
      stats,
      config: resolvedConfig,
      defaultOverviewTemplatePath: join(
        workspaceRoot,
        'src/templates/cards/stats/overview.template.svg',
      ),
      defaultLanguagesTemplatePath: join(
        workspaceRoot,
        'src/templates/cards/stats/languages.template.svg',
      ),
    });

    console.info('Generating brand header cards...');
    renderHeaderCards({
      outputDir: staticOutputDir,
      defaultHeaderTemplatePath: join(
        workspaceRoot,
        'src/templates/cards/static/header.template.svg',
      ),
    });

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

    const headerImage = config.isGitHubAction
      ? `<picture>
    <source media="(prefers-color-scheme: dark)" srcset="${assetsBaseUrl}/static/header-dark.svg${urlSuffix}#gh-dark-mode-only" />
    <source media="(prefers-color-scheme: light)" srcset="${assetsBaseUrl}/static/header-light.svg${urlSuffix}" />
    <img alt="Olá! Eu sou Tupynambá Lucas" src="${assetsBaseUrl}/static/header-light.svg${urlSuffix}" width="750" />
  </picture>`
      : `<img alt="Olá! Eu sou Tupynambá Lucas" src="${assetsBaseUrl}/header-light.svg" width="750" />`;

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
      overviewImages,
      languagesImages,
      headerImage,
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

    console.info('Executing document rendering pipeline...');
    for (const pipeline of activePipelines) {
      console.info(`\n--- Running Pipeline: ${pipeline.name} ---`);

      for (const target of pipeline.targets) {
        console.info(`Compiling target: ${target.name}...`);

        const templateFullPath = resolve(workspaceRoot, target.templatePath);
        const templateContent = readFileSync(templateFullPath, 'utf8');

        if (!config.isGitHubAction) {
          // Local / Development mode: Generate both light and dark document previews inside docs/light/ and docs/dark/
          const outputFilename = basename(target.outputPath);

          // 1. Generate Light Mode Preview Document
          const lightReadmeData = {
            ...readmeData,
            headerImage: `<img alt="Olá! Eu sou Tupynambá Lucas" src="../../cards/header-light.svg" width="750" />`,
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
            headerImage: `<img alt="Olá! Eu sou Tupynambá Lucas" src="../../cards/header-dark.svg" width="750" />`,
            overviewImages: `<img alt="${stats.name}'s GitHub Stats" src="../../cards/overview-dark.svg" height="200px" />`,
            languagesImages: `<img alt="Languages Used" src="../../cards/languages-dark.svg" height="200px" />`,
          };
          const darkContent = fillTemplate(templateContent, darkReadmeData);
          const darkFullPath = resolve(workspaceRoot, 'generated/docs/dark', outputFilename);
          console.info(`Local dev mode: Writing dark preview document to ${darkFullPath}...`);
          mkdirSync(dirname(darkFullPath), { recursive: true });
          writeFileSync(darkFullPath, darkContent, 'utf8');
        } else {
          // CI/CD mode: Interpolate standard responsive data and upload to all specified branches
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
    }

    if (!config.isGitHubAction) {
      console.info('\nLocal compile complete! Checking outputs...');
      console.info('GitHub Profile generated locally for preview!');
    } else {
      console.info('\nRunning in GitHub Actions environment. Uploading assets to GitHub...');

      const overviewContent = readFileSync(overviewOutputFile, 'utf8');
      const languagesContent = readFileSync(languagesOutputFile, 'utf8');
      const headerLightContent = readFileSync(headerLightOutputFile, 'utf8');
      const headerDarkContent = readFileSync(headerDarkOutputFile, 'utf8');

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
        'cards/static/header-light.svg',
        headerLightContent,
        'generated',
        config.githubToken,
        'chore: update header-light card',
      );
      await uploadFileContents(
        config.repositoryOwner,
        config.repositoryName,
        'cards/static/header-dark.svg',
        headerDarkContent,
        'generated',
        config.githubToken,
        'chore: update header-dark card',
      );

      console.info('GitHub Profile successfully synced to all branches!');
    }
  } catch (error) {
    console.error('Fatal error during profile generation:', error);
    process.exit(1);
  }
}

void main();
