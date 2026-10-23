import server from './config/fastifyInstanceConfig.js';
import RegistryPlugin from './plugins/registryPlugin.js';

async function startServer(): Promise<void> {
  const app = server;

  await server.register(RegistryPlugin);

  try {
    await app.listen({
      port: server.config.SERVER_PORT,
      host: server.config.SERVER_HOST,
    });

    app.log.info(
      `🚀 Servidor rodando em http://${server.config.SERVER_HOST}:${server.config.SERVER_PORT}`,
    );
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
}

void startServer();
