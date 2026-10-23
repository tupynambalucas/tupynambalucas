import type { ParseFrontMatter } from '@docusaurus/types';

export function replaceProjectVariables(
  content: string,
  variables: Record<string, string>,
): string {
  if (!content || typeof content !== 'string' || !variables) {
    return content;
  }
  let result = content;
  for (const [key, value] of Object.entries(variables)) {
    result = result.replace(new RegExp('%' + key + '%', 'g'), String(value));
  }
  return result;
}

export function createProjectVariablesParseFrontMatter(
  variables: Record<string, string>,
): ParseFrontMatter {
  return async (params) => {
    const fileContent = replaceProjectVariables(params.fileContent, variables);
    const result = await params.defaultParseFrontMatter({
      ...params,
      fileContent,
    });

    for (const [key, val] of Object.entries(result.frontMatter)) {
      if (typeof val === 'string') {
        result.frontMatter[key] = replaceProjectVariables(val, variables);
      } else if (Array.isArray(val)) {
        result.frontMatter[key] = val.map((item: unknown) =>
          typeof item === 'string' ? replaceProjectVariables(item, variables) : item,
        );
      }
    }

    return result;
  };
}

interface AstNode {
  type: string;
  value?: unknown;
  url?: unknown;
  title?: unknown;
  alt?: unknown;
  children?: AstNode[];
}

export interface RemarkProjectVariablesOptions {
  variables: Record<string, string>;
}

export function remarkProjectVariables(options?: RemarkProjectVariablesOptions) {
  const variables = options?.variables || {};
  return (tree: AstNode): void => {
    const visit = (node: AstNode): void => {
      if (node.type === 'yaml' && typeof node.value === 'string') {
        node.value = replaceProjectVariables(node.value, variables);
      }
      if (
        (node.type === 'text' ||
          node.type === 'inlineCode' ||
          node.type === 'code' ||
          node.type === 'html') &&
        typeof node.value === 'string'
      ) {
        node.value = replaceProjectVariables(node.value, variables);
      }
      if (node.type === 'link' && typeof node.url === 'string') {
        node.url = replaceProjectVariables(node.url, variables);
        if (typeof node.title === 'string') {
          node.title = replaceProjectVariables(node.title, variables);
        }
      }
      if (node.type === 'image' && typeof node.url === 'string') {
        node.url = replaceProjectVariables(node.url, variables);
        if (typeof node.alt === 'string') {
          node.alt = replaceProjectVariables(node.alt, variables);
        }
        if (typeof node.title === 'string') {
          node.title = replaceProjectVariables(node.title, variables);
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
