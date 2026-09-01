import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectConfig = JSON.parse(
  fs.readFileSync(path.join(__dirname, '../../project.config.json'), 'utf-8'),
);

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
