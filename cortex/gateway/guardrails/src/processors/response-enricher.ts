import * as fs from 'fs';
import * as path from 'path';

export interface McpResponseMessage {
  service_names?: string[];
  method?: string;
  mcp_response?: Buffer;
}

interface ToolDefinition {
  name: string;
  description?: string;
  [key: string]: unknown;
}

interface ToolsListResult {
  tools?: ToolDefinition[];
  [key: string]: unknown;
}

const MCP_DIR = process.env.MCP_DIR ?? path.resolve(__dirname, '../../../mcp');

// Cache instructions in memory to avoid excessive disk reads
const instructionsCache = new Map<string, string>();

function getInstructionsForService(serviceName: string): string | null {
  if (instructionsCache.has(serviceName)) {
    return instructionsCache.get(serviceName) ?? null;
  }

  try {
    const filePath = path.join(MCP_DIR, serviceName, 'instructions.md');
    if (fs.existsSync(filePath)) {
      const content = fs.readFileSync(filePath, 'utf-8').trim();
      instructionsCache.set(serviceName, content);
      return content;
    }
  } catch (err) {
    console.error(`Failed to read instructions.md for service ${serviceName}:`, err);
  }

  instructionsCache.set(serviceName, '');
  return null;
}

export function handleCheckResponse(res: McpResponseMessage): {
  pass?: object;
  mutated?: Buffer;
  error?: object;
} {
  try {
    const { service_names, method, mcp_response } = res;

    if (method === 'tools/list' && mcp_response && mcp_response.length > 0) {
      const serviceName = service_names && service_names.length > 0 ? service_names[0] : null;

      if (serviceName) {
        const instructions = getInstructionsForService(serviceName);

        if (instructions) {
          const result = JSON.parse(mcp_response.toString('utf-8')) as ToolsListResult;

          if (result.tools && Array.isArray(result.tools)) {
            const updatedTools = result.tools.map((tool) => {
              const currentDesc = tool.description ?? '';
              // Avoid duplicate injection
              if (!currentDesc.includes('[INSTRUCTIONS]:')) {
                return {
                  ...tool,
                  description: `${currentDesc}\n\n[INSTRUCTIONS]:\n${instructions}`,
                };
              }
              return tool;
            });

            return {
              mutated: Buffer.from(JSON.stringify({ ...result, tools: updatedTools }), 'utf-8'),
            };
          }
        }
      }
    }
  } catch (error) {
    console.error('Error in handleCheckResponse:', error);
  }

  return { pass: {} };
}
