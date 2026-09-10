import { createRequire } from 'node:module';
import type { Plugin } from 'unified';
import type { Node, Parent } from 'unist';

const require = createRequire(import.meta.url);
const projectConfig = require('@monorepo/shared-config/project.config.json');

interface Literal extends Node {
  value: string;
}

interface Link extends Parent {
  url: string;
}

const plugin: Plugin = () => {
  return (tree: Node) => {
    const visit = (node: any) => {
      if (node.type === 'text' || node.type === 'inlineCode') {
        const literal = node as Literal;
        if (literal.value) {
          let val = literal.value;
          for (const [key, value] of Object.entries(projectConfig)) {
            val = val.replace(new RegExp('%' + key + '%', 'g'), value as string);
          }
          literal.value = val;
        }
      }
      if (node.type === 'link' && (node as Link).url) {
        const link = node as Link;
        let url = link.url;
        for (const [key, value] of Object.entries(projectConfig)) {
          url = url.replace(new RegExp('%' + key + '%', 'g'), value as string);
        }
        link.url = url;
      }
      if ((node as Parent).children) {
        (node as Parent).children.forEach(visit);
      }
    };
    visit(tree);
  };
};

export default plugin;
