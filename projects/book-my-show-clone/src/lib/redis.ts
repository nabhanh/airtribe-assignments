import redis from 'redis';
import { logger } from './logger';

const client = redis.createClient({
  url: process.env.REDIS_URL
});

client.on('error', err => {
  logger.error(err);
});

export default client;
