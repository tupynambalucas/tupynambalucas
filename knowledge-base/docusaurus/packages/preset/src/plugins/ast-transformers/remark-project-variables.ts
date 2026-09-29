import ProjectConfig from '@monorepo/shared-config/project.config';
import type { ParseFrontMatter } from '@docusaurus/types';

export function replaceProjectVariables(content: string): string {
  if (!content || typeof content !== 'string') {
    return content;
  }
  let result = content;
  for (const [key, value] of Object.entries(ProjectConfig)) {
    result = result.replace(new RegExp('%' + key + '%', 'g'), String(value));
  }
  return result;
}

export const projectVariablesParseFrontMatter: ParseFrontMatter = async (params) => {
  const fileContent = replaceProjectVariables(params.fileContent);
  const result = await params.defaultParseFrontMatter({
    ...params,
    fileContent,
  });

  for (const [key, val] of Object.entries(result.frontMatter)) {
    if (typeof val === 'string') {
      result.frontMatter[key] = replaceProjectVariables(val);
    } else if (Array.isArray(val)) {
      result.frontMatter[key] = val.map((item: unknown) =>
        typeof item === 'string' ? replaceProjectVariables(item) : item,
      );
    }
  }

  return result;
};

interface AstNode {
  type: string;
  value?: unknown;
  url?: unknown;
  title?: unknown;
  alt?: unknown;
  children?: AstNode[];
}

export function remarkProjectVariables() {
  return (tree: AstNode): void => {
    const visit = (node: AstNode): void => {
      if (node.type === 'yaml' && typeof node.value === 'string') {
        node.value = replaceProjectVariables(node.value);
      }
      if (
        (node.type === 'text' ||
          node.type === 'inlineCode' ||
          node.type === 'code' ||
          node.type === 'html') &&
        typeof node.value === 'string'
      ) {
        node.value = replaceProjectVariables(node.value);
      }
      if (node.type === 'link' && typeof node.url === 'string') {
        node.url = replaceProjectVariables(node.url);
        if (typeof node.title === 'string') {
          node.title = replaceProjectVariables(node.title);
        }
      }
      if (node.type === 'image' && typeof node.url === 'string') {
        node.url = replaceProjectVariables(node.url);
        if (typeof node.alt === 'string') {
          node.alt = replaceProjectVariables(node.alt);
        }
        if (typeof node.title === 'string') {
          node.title = replaceProjectVariables(node.title);
        }
      }
      if (Array.isArray(node.children)) {
        node.children.forEach(visit);
      }
    };
    visit(tree);
  };
}

export default remarkProjectVariables;
