import IORedis from "ioredis";

export function getRedisConnection() {
  if (!process.env.UPSTASH_REDIS_REST_URL) {
    console.warn("UPSTASH_REDIS_REST_URL not set, queue system unavailable");
    return null;
  }

  return new IORedis(process.env.UPSTASH_REDIS_REST_URL, {
    maxRetriesPerRequest: null,
  });
}
