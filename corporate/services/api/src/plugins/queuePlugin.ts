import fp from 'fastify-plugin';
import type { FastifyPluginAsync } from 'fastify';
import { cycleQueue } from '../queues/cycle/cycle.queue.js';
import { createCycleWorker } from '../queues/cycle/cycle.worker.js';
import type { CycleService } from '../domains/cycle/cycle.service.js';

interface QueuePluginOptions {
  cycleService: CycleService;
}

const queuePlugin: FastifyPluginAsync<QueuePluginOptions> = async (server, opts) => {
  const { cycleService } = opts;

  // Initialize workers
  const cycleWorker = createCycleWorker(server, cycleService);

  // Schedule recurring jobs
  const scheduleJobs = async () => {
    await cycleQueue.upsertJobScheduler(
      'archive-expired-cycles-cron',
      {
        pattern: '0 * * * *', // Every hour
      },
      {
        name: 'archive-expired-cycles',
      },
    );
    server.log.info('[Queue] Job de arquivamento agendado.');
  };

  await scheduleJobs();

  server.addHook('onClose', async () => {
    await cycleWorker.close();
    await cycleQueue.close();
  });
};

export default fp(queuePlugin);
