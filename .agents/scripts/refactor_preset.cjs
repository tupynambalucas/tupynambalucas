const fs = require('fs');
let code = fs.readFileSync(
  'D:/projects/tupynambalucas/knowledge-base/docusaurus/packages/preset/src/index.ts',
  'utf8',
);

// replace crowdin import
code = code.replace(
  /import pluginCrowdin from '\.\/plugins\/crowdin\/index';/,
  "import path from 'node:path';\nimport pluginLocalesSync, { type LocalesSyncOptions } from './plugins/locales-sync/index';",
);

// remove crowdin from opts
code = code.replace(/\s+crowdin,/, '');

// replace crowdin injection block
const injectCrowdinRegex =
  /if \(crowdin\) \{\s+\/\/ eslint-disable-next-line @typescript-eslint\/no-explicit-any\s+plugins\.push\(\[pluginCrowdin as any, crowdin\]\);\s+\}/;

const dynamicInjection = `
  const collectionsPkg = require.resolve('@monorepo/kb-collections/package.json');
  const collectionsRoot = path.dirname(collectionsPkg);

  const mappings: any[] = [];

  const processCollection = (opt: any, pluginType: 'docs' | 'blog') => {
    if (opt && opt.collection) {
      const [collectionName, contentName] = opt.collection.split('/');
      if (collectionName && contentName) {
        opt.path = path.join(collectionsRoot, 'namespaces', collectionName, 'content', contentName);
        mappings.push({
          pluginType,
          pluginId: opt.id || 'default',
          collectionName,
          contentName,
        });
      }
    }
  };

  if (Array.isArray(docs)) {
    docs.forEach(d => processCollection(d, 'docs'));
  } else if (docs !== false && docs !== undefined) {
    processCollection(docs, 'docs');
  }

  if (Array.isArray(blog)) {
    blog.forEach(b => processCollection(b, 'blog'));
  } else if (blog !== false && blog !== undefined) {
    processCollection(blog, 'blog');
  }

  if (mappings.length > 0) {
    const localesSyncOpts: LocalesSyncOptions = { mappings };
    plugins.push([pluginLocalesSync as any, localesSyncOpts]);
  }
`;

code = code.replace(injectCrowdinRegex, dynamicInjection);

fs.writeFileSync(
  'D:/projects/tupynambalucas/knowledge-base/docusaurus/packages/preset/src/index.ts',
  code,
);
