export interface McpRequestMessage {
  service_names?: string[];
  method?: string;
  mcp_request?: Buffer;
}

interface ToolCallParams {
  name?: string;
  arguments?: Record<string, unknown>;
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

      if (
        params.name === 'browser_navigate' &&
        params.arguments &&
        typeof params.arguments.url === 'string'
      ) {
        let url = params.arguments.url;
        if (url.includes('localhost') || url.includes('127.0.0.1')) {
          url = url
            .replace(/localhost/g, 'host.docker.internal')
            .replace(/127\.0\.0\.1/g, 'host.docker.internal');
          params.arguments.url = url;

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
