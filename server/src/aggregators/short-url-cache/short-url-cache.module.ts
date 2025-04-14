import { Module } from '@nestjs/common';
import { ShortUrlCacheAggregator } from './short-url-cache.service';
import { RedisModule } from '../../infrastructure/caching/redis.module';

@Module({
  imports: [RedisModule],
  providers: [ShortUrlCacheAggregator],
  exports: [ShortUrlCacheAggregator],
})
export class ShortUrlCacheAggregatorModule {}
