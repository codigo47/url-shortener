import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { createClient } from 'redis';
import { RedisClientType } from '@redis/client';

@Injectable()
export class RedisService implements OnModuleInit, OnModuleDestroy {
  private client: RedisClientType;

  constructor() {
    this.client = createClient({
      url: process.env.REDIS_URL || 'redis://redis_deep:6379',
    });

    this.client.on('error', (err) => console.error('Redis Client Error', err));
  }

  async onModuleInit() {
    await this.client.connect();
  }

  async onModuleDestroy() {
    await this.client.quit();
  }

  async get(key: string): Promise<string | null> {
    return await this.client.get(key);
  }

  async set(key: string, value: string, ttlSeconds?: number): Promise<void> {
    if (ttlSeconds) {
      await this.client.setEx(key, ttlSeconds, value);
    } else {
      await this.client.set(key, value);
    }
  }

  async del(key: string): Promise<void> {
    await this.client.del(key);
  }

  async exists(key: string): Promise<boolean> {
    const result = await this.client.exists(key);
    return result === 1;
  }

  async countKeys(pattern: string): Promise<number> {
    let count = 0;
    let cursor = 0;
    do {
      const reply = await this.client.scan(cursor, {
        MATCH: pattern,
        COUNT: 100,
      });
      cursor = reply.cursor;
      count += reply.keys.length;
    } while (cursor !== 0);
    return count;
  }

  async getKeys(pattern: string, limit: number): Promise<string[]> {
    const keys: string[] = [];
    let cursor = 0;

    do {
      const reply = await this.client.scan(cursor, {
        MATCH: pattern,
        COUNT: Math.min(limit - keys.length, 100),
      });
      cursor = reply.cursor;
      keys.push(...reply.keys);

      if (keys.length >= limit) {
        return keys.slice(0, limit);
      }
    } while (cursor !== 0);

    return keys;
  }
}
