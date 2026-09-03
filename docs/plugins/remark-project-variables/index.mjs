import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const projectConfig = require('@monorepo/shared-config/project.config.json');

export default function plugin() {
  return (tree) => {
    const visit = (node) => {
      if (node.type === 'text' || node.type === 'inlineCode') {
        if (node.value) {
          let val = node.value;
          for (const [key, value] of Object.entries(projectConfig)) {
            val = val.replace(new RegExp('%' + key + '%', 'g'), value);
          }
          node.value = val;
        }
      }
      if (node.type === 'link' && node.url) {
        let url = node.url;
        for (const [key, value] of Object.entries(projectConfig)) {
          url = url.replace(new RegExp('%' + key + '%', 'g'), value);
        }
        node.url = url;
      }
      if (node.children) {
        node.children.forEach(visit);
      }
    };
    visit(tree);
  };
}
