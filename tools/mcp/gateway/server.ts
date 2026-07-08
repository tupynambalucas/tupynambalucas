import Fastify from 'fastify';
import proxy from '@fastify/http-proxy';

const PORT = Number(process.env.PORT) || 3005;

const server = Fastify({
  logger: {
    level: 'info',
  },
});

// Configure CORS headers for all proxied requests via replyOptions
const replyOptions = {
  // Disable default timeout to prevent SSE streams from being cut off
  timeout: 0,
  // Ensure headers are modified safely
  rewriteHeaders: (
    headers: Record<string, string | string[] | undefined>,
  ): Record<string, string | string[] | undefined> => {
    return {
      ...headers,
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Mcp-Session-Id, X-Session-Id',
    };
  },
};

// Global OPTIONS handler for CORS preflight requests
server.options('/*', async (_request, reply) => {
  void reply.header('Access-Control-Allow-Origin', '*');
  void reply.header('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS');
  void reply.header('Access-Control-Allow-Headers', 'Content-Type, Mcp-Session-Id, X-Session-Id');
  return reply.status(200).send();
});

// Health check endpoint
server.get('/health', async (_request, reply) => {
  return reply.status(200).send({
    status: 'healthy',
    gateway: 'elo.internal.tools.mcp',
  });
});

// Register upstream proxy targets
void server.register(proxy, {
  upstream: 'http://github:3001',
  prefix: '/github',
  replyOptions,
});

void server.register(proxy, {
  upstream: 'http://context7:3002',
  prefix: '/context7',
  replyOptions,
});

void server.register(proxy, {
  upstream: 'http://browser:3003',
  prefix: '/browser',
  replyOptions,
});

void server.register(proxy, {
  upstream: 'http://dockerhub:3004',
  prefix: '/dockerhub',
  replyOptions,
});

void server.register(proxy, {
  upstream: 'http://firecrawl:3006',
  prefix: '/firecrawl',
  replyOptions,
});

const start = async (): Promise<void> => {
  try {
    await server.listen({ port: PORT, host: '0.0.0.0' });
    console.info(`[Gateway] Fastify v5 Gateway running on 0.0.0.0:${PORT}`);
  } catch (err: unknown) {
    server.log.error(err as Error);
    process.exit(1);
  }
};

void start();
