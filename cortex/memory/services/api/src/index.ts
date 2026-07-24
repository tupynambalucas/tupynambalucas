import Fastify from 'fastify';
import registryPlugin from './plugins/registryPlugin.js';

const fastify = Fastify({
  logger: true,
});

async function main(): Promise<void> {
  await fastify.register(registryPlugin);

  const port = Number(process.env.PORT ?? 3006);
  const host = process.env.HOST ?? '0.0.0.0';

  try {
    await fastify.listen({ port, host });
    fastify.log.info(`Memory API Service running at http://${host}:${port}`);

    // Automatically synchronize docs on startup
    fastify.ingestionService
      .syncDocs()
      .then((res) => {
        fastify.log.info(
          `Startup docs auto-sync complete: ${res.processedFiles} files, ${res.chunksCreated} chunks.`,
        );
      })
      .catch((err: unknown) => {
        fastify.log.error(err, 'Startup docs auto-sync failed:');
      });
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
}

void main();
