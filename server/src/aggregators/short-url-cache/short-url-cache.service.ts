import { Injectable } from '@nestjs/common';
import { RedisService } from '../../infrastructure/caching/redis.service';
import {
  AddToSlugPoolDto,
  DeleteSlugFromPoolDto,
  GetTargetUrlDto,
  IsInSlugPoolDto,
  RemoveFromSlugPoolDto,
} from './dto/slug-pool.dto';
import {
  AddToRedirectCacheDto,
  RemoveFromRedirectCacheDto,
} from './dto/redirect-cache.dto';

@Injectable()
export class ShortUrlCacheAggregator {
  private readonly SLUG_POOL_PREFIX = 'slug_pool';
  private readonly SLUG_REDIRECT_PREFIX = 'slug_redirect';

  constructor(private readonly redisService: RedisService) {}

  async addToSlugPool({ slug }: AddToSlugPoolDto): Promise<void> {
    const key = `${this.SLUG_POOL_PREFIX}:${slug}`;
    await this.redisService.set(key, 'available');
  }

  async addToRedirectCache({
    slug,
    targetUrl,
    expiresAt,
  }: AddToRedirectCacheDto): Promise<void> {
    try {
      const key = `${this.SLUG_REDIRECT_PREFIX}:${slug}`;
      console.log('adding to redirect cache', { key, targetUrl, expiresAt });
      await this.redisService.set(key, targetUrl, expiresAt);
    } catch (error) {
      console.error('Error adding to redirect cache:', error);
    }
  }

  async isInSlugPool({ slug }: IsInSlugPoolDto): Promise<boolean> {
    const key = `${this.SLUG_POOL_PREFIX}:${slug}`;
    return await this.redisService.exists(key);
  }

  async getTargetUrl({ slug }: GetTargetUrlDto): Promise<string | null> {
    const key = `${this.SLUG_REDIRECT_PREFIX}:${slug}`;
    return await this.redisService.get(key);
  }

  async removeFromSlugPool({ slug }: RemoveFromSlugPoolDto): Promise<void> {
    const key = `${this.SLUG_POOL_PREFIX}:${slug}`;
    await this.redisService.del(key);
  }

  async removeFromRedirectCache({
    slug,
  }: RemoveFromRedirectCacheDto): Promise<void> {
    const key = `${this.SLUG_REDIRECT_PREFIX}:${slug}`;
    await this.redisService.del(key);
  }

  async countAvailableSlugs(): Promise<number> {
    const pattern = `${this.SLUG_POOL_PREFIX}:*`;
    return await this.redisService.countKeys(pattern);
  }

  async getFirstAvailableSlug(): Promise<string | null> {
    const pattern = `${this.SLUG_POOL_PREFIX}:*`;
    const keys = await this.redisService.getKeys(pattern, 1);
    if (keys.length === 0) {
      return null;
    }
    // Extract the slug from the key by removing the prefix
    return keys[0].substring(this.SLUG_POOL_PREFIX.length + 1);
  }

  async deleteSlugFromPool({ slug }: DeleteSlugFromPoolDto): Promise<void> {
    const key = `${this.SLUG_POOL_PREFIX}:${slug}`;
    await this.redisService.del(key);
  }
}
