import ProjectConfig from '@monorepo/shared-config/project.config';

interface Literal {
  type: string;
  value: string;
}

interface Link {
  type: string;
  url: string;
  children?: any[];
}

const plugin: any = () => {
  return (tree: any) => {
    const visit = (node: any) => {
      if (node.type === 'text' || node.type === 'inlineCode') {
        const literal = node as Literal;
        if (literal.value) {
          let val = literal.value;
          for (const [key, value] of Object.entries(ProjectConfig)) {
            val = val.replace(new RegExp('%' + key + '%', 'g'), value as string);
          }
          literal.value = val;
        }
      }
      if (node.type === 'link' && (node as Link).url) {
        const link = node as Link;
        let url = link.url;
        for (const [key, value] of Object.entries(ProjectConfig)) {
          url = url.replace(new RegExp('%' + key + '%', 'g'), value as string);
        }
        link.url = url;
      }
      if (node.children) {
        node.children.forEach(visit);
      }
    };
    visit(tree);
  };
};

export default plugin;
