import { Worker } from 'bullmq';
import { connection } from '../../config/redis.js';
import { CYCLE_QUEUE_NAME } from './cycle.queue.js';
import { createCycleProcessor } from './cycle.processor.js';
import type { FastifyInstance } from 'fastify';
import type { CycleService } from '../../domains/cycle/cycle.service.js';

export const createCycleWorker = (server: FastifyInstance, cycleService: CycleService) => {
  const processor = createCycleProcessor(cycleService, server.log);

  const worker = new Worker(CYCLE_QUEUE_NAME, processor, {
    connection,
    concurrency: 1,
    removeOnComplete: { count: 100 },
    removeOnFail: { count: 500 },
  });

  worker.on('completed', (job) => {
    server.log.info(`[Queue: Cycle] Job ${job.id} completado.`);
  });

  worker.on('failed', (job, err) => {
    server.log.error(err, `[Queue: Cycle] Job ${job?.id} falhou.`);
  });

  return worker;
};
