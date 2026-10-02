import path from 'node:path';
import fs from 'node:fs/promises';
import { existsSync } from 'node:fs';
import pluginContentBlog from '@docusaurus/plugin-content-blog';
import { aliasedSitePath, docuHash, normalizeUrl } from '@docusaurus/utils';
import { createBlogFiles, toChangelogEntries } from './utils';

export { validateOptions } from '@docusaurus/plugin-content-blog';

function findMonorepoRoot(startDir: string): string {
  let dir = startDir;
  while (dir !== path.dirname(dir)) {
    if (existsSync(path.join(dir, 'pnpm-workspace.yaml'))) {
      return dir;
    }
    dir = path.dirname(dir);
  }
  return path.resolve(startDir, '../../../../../..');
}

const MonorepoRoot = findMonorepoRoot(__dirname);
const ChangelogFilePattern = /^CHANGELOG(-v[0-9]*)?\.md$/i;

async function getChangelogFiles(): Promise<string[]> {
  const rootFiles = await fs.readdir(MonorepoRoot);
  const changelogFiles = rootFiles.filter((file) => ChangelogFilePattern.test(file));
  if (changelogFiles.length === 0) {
    throw new Error(
      "Looks like the changelog plugin didn't detect changelog files in monorepo root",
    );
  }
  return changelogFiles;
}

function readChangelogFile(filename: string): Promise<string> {
  return fs.readFile(path.join(MonorepoRoot, filename), 'utf-8');
}

async function loadChangelogEntries(changelogFiles: string[]) {
  const filesContent = await Promise.all(changelogFiles.map(readChangelogFile));
  return toChangelogEntries(filesContent);
}

const ChangelogPlugin: typeof pluginContentBlog = async function ChangelogPlugin(context, options) {
  const generateDir = path.join(context.siteDir, 'changelog/source');
  const blogPlugin = await pluginContentBlog(context, {
    ...options,
    path: generateDir,
    id: 'changelog',
    blogListComponent: '@theme/ChangelogList',
    blogPostComponent: '@theme/ChangelogPage',
  });
  const changelogFiles = await getChangelogFiles();

  return {
    ...blogPlugin,
    name: 'changelog-plugin',

    async loadContent() {
      const changelogEntries = await loadChangelogEntries(changelogFiles);

      // Create intermediate markdown files
      await createBlogFiles(generateDir, changelogEntries);

      // Read the files we just wrote
      const content = (await blogPlugin.loadContent?.())!;

      content.blogPosts.forEach((post, index) => {
        const pageIndex = Math.floor(index / (options.postsPerPage as number));
        // @ts-expect-error: injected listPageLink
        post.metadata.listPageLink = normalizeUrl([
          context.baseUrl,
          options.routeBasePath,
          pageIndex === 0 ? '/' : `/page/${pageIndex + 1}`,
        ]);
      });
      return content;
    },

    configureWebpack(...args) {
      const config = blogPlugin.configureWebpack?.(...args);
      const pluginDataDirRoot = path.join(context.generatedFilesDir, 'changelog-plugin', 'default');

      interface WebpackLoader {
        options?: {
          metadataPath?: (mdxPath: string) => string;
        };
      }
      interface WebpackRule {
        use?: WebpackLoader[];
      }

      if (config?.module?.rules && Array.isArray(config.module.rules)) {
        // Find mdx-loader and redirect metadata path
        for (const rule of config.module.rules as WebpackRule[]) {
          if (rule.use && Array.isArray(rule.use)) {
            for (const loader of rule.use) {
              if (loader.options && typeof loader.options === 'object') {
                loader.options.metadataPath = (mdxPath: string) => {
                  const aliasedPath = aliasedSitePath(mdxPath, context.siteDir);
                  return path.join(pluginDataDirRoot, `${docuHash(aliasedPath)}.json`);
                };
              }
            }
          }
        }
      }
      return config;
    },

    getPathsToWatch() {
      return [path.join(MonorepoRoot, 'CHANGELOG.md'), path.join(MonorepoRoot, 'CHANGELOG-*.md')];
    },
  };
};

export default ChangelogPlugin;
