import { Queue } from 'bullmq';
import { connection } from '../../config/redis.js';

export const CYCLE_QUEUE_NAME = 'cycle-management-queue';

export const cycleQueue = new Queue(CYCLE_QUEUE_NAME, { connection });
