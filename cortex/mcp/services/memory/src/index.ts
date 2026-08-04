import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/streamableHttp.js';
import Fastify from 'fastify';
import { config } from './config.js';
import { registerToolHandlers } from './tools/index.js';

const fastify = Fastify({ logger: true });

const mcpServer = new Server(
  {
    name: 'cortex-memory-mcp',
    version: '1.0.0',
  },
  {
    capabilities: {
      tools: {},
    },
  },
);

registerToolHandlers(mcpServer);

const transport = new StreamableHTTPServerTransport({
  sessionIdGenerator: undefined,
});

await mcpServer.connect(transport);

fastify.all('/mcp', async (req, reply) => {
  reply.hijack();
  await transport.handleRequest(req.raw, reply.raw, req.body);
});

fastify.listen({ port: config.PORT, host: '0.0.0.0' }, (err) => {
  if (err) {
    fastify.log.error(err);
    process.exit(1);
  }
  fastify.log.info(`Cortex Memory MCP Server listening on port ${config.PORT}`);
});
