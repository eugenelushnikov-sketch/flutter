import { Injectable, Logger } from '@nestjs/common';
import Redis from 'ioredis';

@Injectable()
export class CacheService {
  private readonly logger = new Logger(CacheService.name);
  private readonly client: Redis;

  constructor() {
    const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379';
    this.client = new Redis(redisUrl, { lazyConnect: false });
  }

  async get<T = any>(key: string): Promise<T | null> {
    const raw = await this.client.get(key);
    return raw ? (JSON.parse(raw) as T) : null;
  }

  async set(key: string, value: any, ttlSeconds: number): Promise<void> {
    const payload = JSON.stringify(value);
    await this.client.set(key, payload, 'EX', ttlSeconds);
  }

  async del(key: string): Promise<void> {
    await this.client.del(key);
  }

  async delByPattern(pattern: string): Promise<void> {
    const stream = this.client.scanStream({ match: pattern, count: 100 });
    const keys: string[] = [];
    for await (const resultKeys of stream) {
      for (const key of resultKeys as string[]) keys.push(key);
    }
    if (keys.length) await this.client.del(...keys);
    this.logger.debug(`Invalidated ${keys.length} keys by pattern ${pattern}`);
  }
}