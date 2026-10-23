export interface McpRequestMessage {
  service_names?: string[];
  method?: string;
  mcp_request?: Buffer;
}

interface ToolCallParams {
  name?: string;
  arguments?: Record<string, unknown>;
}

type JsonPrimitive = string | number | boolean | null;

interface JsonObject {
  [key: string]: JsonValue;
}

type JsonValue = JsonPrimitive | JsonValue[] | JsonObject;

/**
 * Recursively scans an object and rewrites any string containing
 * 'localhost' or '127.0.0.1' to 'host.docker.internal'.
 */
function rewriteLocalhost(obj: JsonValue): { updated: boolean; value: JsonValue } {
  if (typeof obj === 'string') {
    if (obj.includes('localhost') || obj.includes('127.0.0.1')) {
      const replaced = obj
        .replace(/localhost/g, 'host.docker.internal')
        .replace(/127\.0\.0\.1/g, 'host.docker.internal');
      return { updated: true, value: replaced };
    }
    return { updated: false, value: obj };
  } else if (Array.isArray(obj)) {
    let hasUpdates = false;
    const newArr = obj.map((item: JsonValue) => {
      const result = rewriteLocalhost(item);
      if (result.updated === true) hasUpdates = true;
      return result.value;
    });
    return { updated: hasUpdates, value: hasUpdates ? newArr : obj };
  } else if (obj !== null && typeof obj === 'object') {
    let hasUpdates = false;
    const newObj: JsonObject = {};
    for (const [k, v] of Object.entries(obj)) {
      const result = rewriteLocalhost(v);
      if (result.updated === true) hasUpdates = true;
      newObj[k] = result.value;
    }
    return { updated: hasUpdates, value: hasUpdates ? newObj : obj };
  }
  return { updated: false, value: obj };
}

export function handleCheckRequest(req: McpRequestMessage): {
  pass?: object;
  mutated?: Buffer;
  error?: object;
} {
  try {
    const { method, mcp_request } = req;

    if (method === 'tools/call' && mcp_request && mcp_request.length > 0) {
      const params = JSON.parse(mcp_request.toString('utf-8')) as ToolCallParams;

      if (params.arguments) {
        const { updated, value } = rewriteLocalhost(params.arguments as unknown as JsonObject);

        if (updated) {
          params.arguments = value as Record<string, unknown>;
          return {
            mutated: Buffer.from(JSON.stringify(params), 'utf-8'),
          };
        }
      }
    }
  } catch (error) {
    console.error('Error in handleCheckRequest:', error);
  }

  return { pass: {} };
}
