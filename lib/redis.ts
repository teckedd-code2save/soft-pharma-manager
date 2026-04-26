import Redis from 'ioredis';

const globalForRedis = globalThis as unknown as {
  redis: Redis | undefined;
};

export function getRedis() {
  if (!process.env.REDIS_URL) {
    return null;
  }

  if (!globalForRedis.redis) {
    const redis = new Redis(process.env.REDIS_URL, {
      lazyConnect: true,
      maxRetriesPerRequest: 1,
    });

    redis.on('error', (error) => {
      console.error('Redis connection error:', error);
    });

    globalForRedis.redis = redis;
  }

  return globalForRedis.redis;
}
