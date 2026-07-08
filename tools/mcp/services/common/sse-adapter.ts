import Fastify from 'fastify';
import fastifySSE from '@fastify/sse';
import { spawn } from 'child_process';
import type { ChildProcessWithoutNullStreams } from 'child_process';
import { readFileSync, existsSync } from 'fs';

const PORT = Number(process.env.PORT) || 3000;
const COMMAND = process.env.MCP_COMMAND;
const ARGS: string[] =
  typeof process.env.MCP_ARGS === 'string' && process.env.MCP_ARGS !== ''
    ? (JSON.parse(process.env.MCP_ARGS) as string[])
    : [];

if (COMMAND === undefined) {
  console.error('Error: MCP_COMMAND environment variable is required.');
  process.exit(1);
}

// Load instructions from local folder context injected via volume mount
const INSTRUCTIONS_PATH =
  process.env.MCP_INSTRUCTIONS_FILE !== undefined && process.env.MCP_INSTRUCTIONS_FILE !== ''
    ? process.env.MCP_INSTRUCTIONS_FILE
    : '/app/instructions.md';
let instructionsContent = '';
if (existsSync(INSTRUCTIONS_PATH) === true) {
  try {
    instructionsContent = readFileSync(INSTRUCTIONS_PATH, 'utf-8');
    console.info(
      `[Adapter] Successfully loaded instructions from ${INSTRUCTIONS_PATH} (len=${instructionsContent.length})`,
    );
  } catch (err) {
    console.error(`[Adapter] Failed to read instructions from ${INSTRUCTIONS_PATH}:`, err);
  }
} else {
  console.info(`[Adapter] No instructions file found at ${INSTRUCTIONS_PATH}`);
}

const fastify = Fastify({
  logger: false,
});

// Active sessions mapping: clientId -> childProcess
const sessions = new Map<string, ChildProcessWithoutNullStreams>();
// Active line buffers per session
const sessionBuffers = new Map<string, string>();

// Helper to query child subprocess
function queryChild(
  sessionId: string,
  child: ChildProcessWithoutNullStreams,
  requestBody: string,
): Promise<string> {
  return new Promise((resolve, reject) => {
    let requestId: string | number | null = null;
    let requestMethod = '';
    try {
      const payload = JSON.parse(requestBody) as {
        id?: string | number;
        method?: string;
      };
      if (payload.id !== undefined) {
        requestId = payload.id;
      }
      requestMethod = payload.method ?? '';
    } catch (e: unknown) {
      const err = e as Error;
      console.error(`[Session ${sessionId}] Failed to parse request body:`, err.message);
    }

    console.info(
      `[Session ${sessionId}] Querying child: method="${requestMethod}", requestId=${requestId}`,
    );

    if (sessionBuffers.has(sessionId) === false) {
      sessionBuffers.set(sessionId, '');
    }

    const cleanup = (): void => {
      child.stdout.off('data', onData);
      child.off('close', onClose);
      child.off('error', onError);
    };

    const onData = (data: Buffer): void => {
      const chunk = data.toString();
      console.info(`[Session ${sessionId}] Received stdout chunk (len=${data.length})`);
      const buffer = (sessionBuffers.get(sessionId) ?? '') + chunk;
      sessionBuffers.set(sessionId, buffer);

      let newlineIndex: number;
      let currentBuffer = buffer;
      while ((newlineIndex = currentBuffer.indexOf('\n')) !== -1) {
        const line = currentBuffer.substring(0, newlineIndex);
        currentBuffer = currentBuffer.substring(newlineIndex + 1);
        sessionBuffers.set(sessionId, currentBuffer);

        const trimmedLine = line.trim();
        if (trimmedLine.length > 0) {
          console.info(
            `[Session ${sessionId}] Extracted line from stdout (len=${trimmedLine.length}), preview: ${trimmedLine.substring(0, 100)}...`,
          );

          if (requestId === null) {
            console.info(
              `[Session ${sessionId}] Stateless query or null requestId. Resolving immediately with line.`,
            );
            cleanup();
            resolve(line);
            return;
          }

          try {
            const responsePayload = JSON.parse(trimmedLine) as {
              id?: string | number;
              result?: { protocolVersion?: string; instructions?: string };
            };
            if (responsePayload.id === requestId) {
              console.info(
                `[Session ${sessionId}] Found matching JSON-RPC response for id=${requestId}. Resolving.`,
              );
              cleanup();
              if (
                responsePayload.result !== undefined &&
                typeof responsePayload.result.protocolVersion === 'string'
              ) {
                console.info(
                  `[Session ${sessionId}] Intercepted initialize response in queryChild. Injecting instructions.`,
                );
                if (instructionsContent !== '') {
                  responsePayload.result.instructions = instructionsContent;
                }
                resolve(JSON.stringify(responsePayload));
              } else {
                resolve(line);
              }
              return;
            } else {
              console.info(
                `[Session ${sessionId}] Mismatched JSON-RPC response id=${responsePayload.id} (expected ${requestId}). Continuing to buffer.`,
              );
            }
          } catch (err: unknown) {
            const error = err as Error;
            console.info(
              `[Session ${sessionId}] Line is not valid JSON (${error.message}). Continuing to buffer.`,
            );
          }
        }
      }
    };

    const onClose = (code: number | null): void => {
      cleanup();
      reject(new Error(`Subprocess exited with code ${code} before responding`));
    };

    const onError = (err: Error): void => {
      cleanup();
      reject(err);
    };

    child.stdout.on('data', onData);
    child.once('close', onClose);
    child.once('error', onError);

    try {
      console.info(`[Session ${sessionId}] Writing to child stdin: ${requestBody.trim()}`);
      child.stdin.write(requestBody + '\n');
    } catch (err: unknown) {
      cleanup();
      reject(err instanceof Error ? err : new Error(String(err)));
    }
  });
}

// Custom parser to read JSON body as raw string for optimal throughput and exact formatting preservation
fastify.addContentTypeParser('application/json', { parseAs: 'string' }, (_req, body, done) => {
  done(null, body);
});

// Register plugins
void fastify.register(fastifySSE);

// Options handler for CORS
fastify.options('/*', async (_request, reply) => {
  void reply.header('Access-Control-Allow-Origin', '*');
  void reply.header('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS');
  void reply.header('Access-Control-Allow-Headers', 'Content-Type, Mcp-Session-Id, X-Session-Id');
  return reply.status(200).send();
});

// CORS decoration hook
fastify.addHook('onSend', async (_request, reply, payload) => {
  void reply.header('Access-Control-Allow-Origin', '*');
  void reply.header('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS');
  void reply.header('Access-Control-Allow-Headers', 'Content-Type, Mcp-Session-Id, X-Session-Id');
  return payload;
});

interface QueryParams {
  clientId?: string;
}

// DELETE route to close session
fastify.delete<{ Querystring: QueryParams }>('/sse', async (request, reply) => {
  const sessionIdHeader =
    request.headers['mcp-session-id'] ?? request.headers['x-session-id'] ?? request.query.clientId;
  const sessionId = Array.isArray(sessionIdHeader) ? sessionIdHeader[0] : sessionIdHeader;
  if (sessionId !== undefined && sessionId !== '') {
    const child = sessions.get(sessionId);
    if (child !== undefined) {
      console.info(`[HTTP] DELETE request received. Terminating session ${sessionId}`);
      child.kill();
      sessions.delete(sessionId);
      sessionBuffers.delete(sessionId);
      return reply.type('text/plain').send('Session terminated');
    }
  }
  return reply.status(404).type('text/plain').send('Session not found');
});

// GET /sse - Traditional SSE channel
fastify.get<{ Querystring: QueryParams }>('/sse', { sse: true }, async (request, reply) => {
  const clientId = request.query.clientId ?? Math.random().toString(36).substring(2, 15);

  console.info(`[SSE] Client connected: ${clientId}. Spawning: ${COMMAND} ${ARGS.join(' ')}`);

  const child = spawn(COMMAND, ARGS);
  sessions.set(clientId, child);
  sessionBuffers.set(clientId, '');

  void reply.sse.send({
    event: 'endpoint',
    data: `messages?clientId=${clientId}`,
  });

  child.stdout.on('data', (data: Buffer) => {
    const lines = data.toString().split('\n');
    for (const line of lines) {
      if (line.trim() !== '') {
        let outputLine = line;
        try {
          const payload = JSON.parse(line) as {
            result?: { protocolVersion?: string; instructions?: string };
          };
          if (payload.result !== undefined && typeof payload.result.protocolVersion === 'string') {
            console.info(
              `[SSE ${clientId}] Intercepted initialize response. Injecting instructions.`,
            );
            if (instructionsContent !== '') {
              payload.result.instructions = instructionsContent;
            }
            outputLine = JSON.stringify(payload);
          }
        } catch {
          // Ignore, line is raw text or partial JSON chunk
        }
        void reply.sse.send({ event: 'message', data: outputLine });
      }
    }
  });

  child.stderr.on('data', (data: Buffer) => {
    console.error(`[Subprocess Stderr ${clientId}] ${data.toString().trim()}`);
  });

  child.on('close', (code) => {
    console.info(`[Subprocess ${clientId}] Terminated with exit code ${code}`);
    reply.raw.end();
  });

  request.raw.on('close', () => {
    console.info(`[SSE] Client disconnected: ${clientId}. Killing subprocess.`);
    child.kill();
    sessions.delete(clientId);
    sessionBuffers.delete(clientId);
  });
});

// POST /messages - Traditional SSE client messages
fastify.post<{ Querystring: QueryParams; Body: string }>('/messages', async (request, reply) => {
  const clientId = request.query.clientId;
  if (clientId === undefined || clientId === '') {
    return reply.status(400).type('text/plain').send('clientId is required');
  }
  const child = sessions.get(clientId);

  if (child === undefined) {
    return reply.status(404).type('text/plain').send('Session not found');
  }

  let body = request.body;
  if (process.env.MCP_REWRITE_LOCALHOST === 'true') {
    body = body.replace(/localhost|127\.0\.0\.1/g, 'host.docker.internal');
  }

  try {
    child.stdin.write(body + '\n');
    return reply.type('text/plain').send('Accepted');
  } catch (err: unknown) {
    console.error(`[SSE] Error writing to stdin:`, err);
    return reply.status(500).send('Internal Server Error');
  }
});

// POST /sse - Streamable HTTP (Stateless / Unified POST Endpoint)
fastify.post<{ Querystring: QueryParams; Body: string }>('/sse', async (request, reply) => {
  const sessionIdHeader =
    request.headers['mcp-session-id'] ?? request.headers['x-session-id'] ?? request.query.clientId;
  let sessionId = Array.isArray(sessionIdHeader) ? sessionIdHeader[0] : sessionIdHeader;
  let child: ChildProcessWithoutNullStreams | undefined;

  if (sessionId === undefined || sessionId === '') {
    sessionId = Math.random().toString(36).substring(2, 15);
    console.info(`[HTTP] New Streamable session: ${sessionId}. Spawning: ${COMMAND}`);
    child = spawn(COMMAND, ARGS);
    sessions.set(sessionId, child);
    sessionBuffers.set(sessionId, '');

    child.stderr.on('data', (data: Buffer) => {
      console.error(`[Subprocess Stderr ${sessionId}] ${data.toString().trim()}`);
    });

    child.on('close', (code) => {
      console.info(`[Subprocess ${sessionId}] Closed with code ${code}`);
      if (sessionId !== undefined && sessionId !== '') {
        sessions.delete(sessionId);
        sessionBuffers.delete(sessionId);
      }
    });
  } else {
    child = sessions.get(sessionId);
  }

  if (child === undefined) {
    return reply.status(404).type('text/plain').send('Session not found');
  }

  let body = request.body;
  if (process.env.MCP_REWRITE_LOCALHOST === 'true') {
    body = body.replace(/localhost|127\.0\.0\.1/g, 'host.docker.internal');
  }

  // Check if it's a notification
  let isNotification = false;
  try {
    const payload = JSON.parse(body) as { id?: unknown };
    if (payload.id === undefined) {
      isNotification = true;
    }
  } catch {
    // ignore
  }

  if (isNotification === true) {
    console.info(
      `[HTTP] Received JSON-RPC Notification: ${body.trim()}. Responding 204 immediately.`,
    );
    try {
      child.stdin.write(body + '\n');
      void reply.header('Mcp-Session-Id', sessionId);
      return reply.status(204).send();
    } catch (err: unknown) {
      console.error(`[HTTP] Failed to write notification to stdin:`, err);
      return reply.status(500).send('Internal Server Error');
    }
  }

  // Request-Response
  try {
    const responseData = await queryChild(sessionId, child, body);
    void reply.header('Mcp-Session-Id', sessionId);
    return reply.status(200).type('application/json').send(responseData);
  } catch (err: unknown) {
    console.error(`[HTTP] Error processing Streamable request:`, err);
    return reply.status(500).send('Internal Server Error');
  }
});

const start = async (): Promise<void> => {
  try {
    await fastify.listen({ port: PORT, host: '0.0.0.0' });
    console.info(`Fastify v5 SSE Server running on 0.0.0.0:${PORT}`);
  } catch (err: unknown) {
    fastify.log.error(err as Error);
    process.exit(1);
  }
};

void start();
