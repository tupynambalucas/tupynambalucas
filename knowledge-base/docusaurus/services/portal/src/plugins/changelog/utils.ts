import fs from 'node:fs/promises';
import path from 'node:path';
import projectConfig from '@monorepo/shared-config/project.config';

const publishTimes = new Set<string>();

export type Author = {
  name: string;
  url: string;
  alias: string;
  imageURL: string;
};

export type AuthorsMap = Record<string, Author>;

export type ChangelogEntry = {
  title: string;
  slug: string;
  content: string;
  authors: Author[];
};

const defaultAuthor: Author = {
  name: projectConfig.AUTHOR_NAME,
  alias: projectConfig.GITHUB_ORG,
  url: `https://github.com/${projectConfig.GITHUB_ORG}`,
  imageURL: `https://github.com/${projectConfig.GITHUB_ORG}.png`,
};

function parseAuthor(committerLine: string): Author | null {
  const match = /- (?:(?<name>.*?) \()?\[@(?<alias>.*)\]\((?<url>.*?)\)\)?/.exec(committerLine);
  if (!match?.groups) {
    return null;
  }
  const groups = match.groups as { name: string; alias: string; url: string };
  return {
    ...groups,
    name: groups.name || groups.alias,
    imageURL: `https://github.com/${groups.alias}.png`,
  };
}

function parseAuthors(content: string): Author[] {
  const committersContent = /## Committers: \d.*/s.exec(content)?.[0];
  if (!committersContent) {
    return [defaultAuthor];
  }
  const committersLines = committersContent.match(/- .*/g) ?? [];

  const authors = committersLines
    .map(parseAuthor)
    .filter((a): a is Author => a !== null)
    .sort((a, b) => a.url.localeCompare(b.url));

  if (authors.length === 0) {
    return [defaultAuthor];
  }

  return authors;
}

function createAuthorsMap(changelogEntries: ChangelogEntry[]): AuthorsMap {
  const allAuthors = changelogEntries.flatMap((entry) => entry.authors);
  const authorsMap: AuthorsMap = {};
  allAuthors.forEach((author) => {
    authorsMap[author.alias] = author;
  });
  return authorsMap;
}

function toChangelogEntry(sectionContent: string): ChangelogEntry | null {
  const headingMatch = /\n## .*/.exec(sectionContent);
  if (!headingMatch) {
    return null;
  }
  const rawTitle = headingMatch[0].trim().replace('## ', '');
  if (!rawTitle) {
    return null;
  }

  const rawContent = sectionContent
    .replace(/\n## .*/, '')
    .trim()
    .replace('running_woman', 'running');

  const authors = parseAuthors(rawContent);

  let hour = 20;
  const dateMatch = /\((?<date>\d{4}-\d{2}-\d{2})\)/.exec(rawTitle);
  const date = dateMatch?.groups?.date ?? '2026-01-01';
  while (publishTimes.has(`${date}T${hour}:00`)) {
    hour -= 1;
  }
  publishTimes.add(`${date}T${hour}:00`);

  const title = rawTitle.replace(/\s*\(\d{4}-\d{2}-\d{2}\)/, '').trim();

  const versionMatch = /(v?\d+\.\d+(?:\.\d+)?(?:-[a-zA-Z0-9.]+)?)/.exec(rawTitle);
  const slug = versionMatch
    ? versionMatch[1]
    : title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');

  let body = rawContent
    .replace(/####/g, '##')
    .replace(/\{\/\*\s*truncate\s*\*\/\}/g, '<!-- truncate -->');

  if (!body.includes('<!-- truncate -->')) {
    body = `<!-- truncate -->\n\n${body}`;
  }

  const replacedTitle = title
    .replace(/%PROJECT_DOMAIN%/g, projectConfig.PROJECT_DOMAIN)
    .replace(/%PROJECT_NAME%/g, projectConfig.PROJECT_NAME);

  const replacedBody = body
    .replace(/%PROJECT_DOMAIN%/g, projectConfig.PROJECT_DOMAIN)
    .replace(/%PROJECT_NAME%/g, projectConfig.PROJECT_NAME);

  return {
    authors,
    title: replacedTitle,
    slug,
    content: `---
mdx:
  format: md
title: "${replacedTitle}"
slug: /${slug}
date: ${`${date}T${hour}:00`}
${
  authors.length > 0
    ? `authors:
${authors.map((author) => `  - '${author.alias}'`).join('\n')}`
    : ''
}
---

# ${replacedTitle}

${replacedBody}
`,
  };
}

export function toChangelogEntries(filesContent: string[]): ChangelogEntry[] {
  publishTimes.clear();
  return filesContent
    .flatMap((content) => {
      const normalized = content.startsWith('## ') ? '\n' + content : content;
      return normalized.split(/(?=\n## )/);
    })
    .map(toChangelogEntry)
    .filter((s): s is ChangelogEntry => s !== null);
}

export async function createBlogFiles(
  generateDir: string,
  changelogEntries: ChangelogEntry[],
): Promise<void> {
  await fs.mkdir(generateDir, { recursive: true });
  await Promise.all(
    changelogEntries.map(async (changelogEntry) => {
      const filePath = path.join(generateDir, `${changelogEntry.slug}.md`);
      await fs.writeFile(filePath, changelogEntry.content, 'utf-8');
    }),
  );

  await fs.writeFile(
    path.join(generateDir, 'authors.json'),
    JSON.stringify(createAuthorsMap(changelogEntries), null, 2),
    'utf-8',
  );
}
