import { Firecrawl } from 'firecrawl';
import { config } from './config.js';

export const firecrawlClient = new Firecrawl({
  apiKey: config.FIRECRAWL_API_KEY || undefined,
  apiUrl: config.FIRECRAWL_API_URL || undefined,
});
