import type { Job } from 'bullmq';
import type { FastifyBaseLogger } from 'fastify';
import type { CycleService } from '../../domains/cycle/cycle.service.js';

export const createCycleProcessor = (cycleService: CycleService, logger: FastifyBaseLogger) => {
  return async (job: Job) => {
    if (job.name === 'archive-expired-cycles') {
      logger.info('[Queue: Cycle] Processando arquivamento de ciclos...');
      await cycleService.performScheduledArchival();
    }
  };
};
