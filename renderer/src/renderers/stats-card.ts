import { readFileSync, writeFileSync, mkdirSync } from 'fs';
import { dirname } from 'path';
import type { Config } from '../schemas/env.schema.js';
import type { GitHubStats } from '../schemas/githubstats.schema.js';
import { fillTemplate } from '../utils/template-fill.js';
import { matchAnyGlob } from '../utils/glob.js';

interface RenderOptions {
  stats: GitHubStats;
  config: Config;
  defaultOverviewTemplatePath: string;
  defaultLanguagesTemplatePath: string;
}

export function renderStatsCards(options: RenderOptions): void {
  const { stats, config, defaultOverviewTemplatePath, defaultLanguagesTemplatePath } = options;

  let totalStars = 0;
  let totalForks = 0;
  let totalLinesChanged = 0;
  let totalViews = 0;
  let totalReposCount = 0;

  const languagesMap = new Map<string, number>();
  const colorsMap = new Map<string, string>();
  let languagesTotalSize = 0;

  for (const repo of stats.repositories) {
    // Apply repository exclusion filters
    if (matchAnyGlob(config.excludeRepos, repo.name)) {
      console.info(`Excluding repository ${repo.name} based on excludeRepos config`);
      continue;
    }
    if (config.excludePrivate && repo.private) {
      console.info(`Excluding private repository ${repo.name}`);
      continue;
    }

    totalStars += repo.stars;
    totalForks += repo.forks;
    totalLinesChanged += repo.lines_changed;
    totalViews += repo.views;
    totalReposCount++;

    for (const lang of repo.languages ?? []) {
      if (matchAnyGlob(config.excludeLangs, lang.name)) {
        console.info(`Excluding language ${lang.name} in repository ${repo.name}`);
        continue;
      }
      if (lang.color !== undefined && lang.color !== null && lang.color !== '') {
        colorsMap.set(lang.name, lang.color);
      }
      const existingSize = languagesMap.get(lang.name) ?? 0;
      languagesMap.set(lang.name, existingSize + lang.size);
      languagesTotalSize += lang.size;
    }
  }

  const sortedLanguages = Array.from(languagesMap.entries())
    .map(([name, size]) => ({
      name,
      size,
      color: colorsMap.get(name) ?? '#000',
    }))
    .sort((a, b) => b.size - a.size);

  const totalContributions =
    stats.repo_contributions +
    stats.issue_contributions +
    stats.commit_contributions +
    stats.pr_contributions +
    stats.review_contributions;

  // 1. Render Overview Card
  const overviewTemplatePath = config.overviewTemplate ?? defaultOverviewTemplatePath;
  console.info(`Reading overview template from ${overviewTemplatePath}...`);
  const overviewTemplate = readFileSync(overviewTemplatePath, 'utf8');

  const overviewData = {
    name: stats.name,
    stars: totalStars,
    forks: totalForks,
    contributions: totalContributions,
    lines_changed: totalLinesChanged,
    views: totalViews,
    repos: totalReposCount,
  };

  const overviewSvg = fillTemplate(overviewTemplate, overviewData);
  const overviewOutPath = config.overviewOutputFile;
  console.info(`Writing overview card to ${overviewOutPath}...`);
  mkdirSync(dirname(overviewOutPath), { recursive: true });
  writeFileSync(overviewOutPath, overviewSvg, 'utf8');

  // 2. Render Languages Card
  const progressItems = sortedLanguages
    .map((lang) => {
      const percent = languagesTotalSize === 0 ? 0 : (lang.size / languagesTotalSize) * 100;
      const percentStr = percent.toFixed(3);
      return `<span style="
  background-color: ${lang.color}; 
  width: ${percentStr}%;
" class="progress-item"></span>`;
    })
    .join('\n');

  const langListItems = sortedLanguages
    .map((lang, index) => {
      const percent = languagesTotalSize === 0 ? 0 : (lang.size / languagesTotalSize) * 100;
      const percentStr = percent.toFixed(2);
      const delay = (index + 1) * 150;
      return `<li style="animation-delay: ${delay}ms;">
  <svg 
      xmlns="http://www.w3.org/2000/svg" 
      class="octicon"
      style="fill: ${lang.color};" 
      viewBox="0 0 16 16" 
      version="1.1" 
      width="16" 
      height="16"
  ><path 
      fill-rule="evenodd" 
      d="M8 4a4 4 0 100 8 4 4 0 000-8z"
  ></path></svg>
  <span class="lang">${lang.name}</span>
  <span class="percent">${percentStr}%</span>
</li>`;
    })
    .join('\n');

  const languagesTemplatePath = config.languagesTemplate ?? defaultLanguagesTemplatePath;
  console.info(`Reading languages template from ${languagesTemplatePath}...`);
  const languagesTemplate = readFileSync(languagesTemplatePath, 'utf8');

  const languagesSvg = fillTemplate(languagesTemplate, {
    progress: progressItems,
    lang_list: langListItems,
  });

  const languagesOutPath = config.languagesOutputFile;
  console.info(`Writing languages card to ${languagesOutPath}...`);
  mkdirSync(dirname(languagesOutPath), { recursive: true });
  writeFileSync(languagesOutPath, languagesSvg, 'utf8');
}
