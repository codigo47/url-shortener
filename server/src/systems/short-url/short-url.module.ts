import { Module } from '@nestjs/common';
import { ShortUrlSystem } from './short-url.service';
import { ShortUrlCacheAggregatorModule } from '../../aggregators/short-url-cache/short-url-cache.module';
import { ShortUrlDbAggregatorModule } from '../../aggregators/short-url/short-url.module';
import { UrlMessagingAggregatorModule } from '../../aggregators/url-messaging/url-messaging.module';

@Module({
  imports: [
    ShortUrlCacheAggregatorModule,
    ShortUrlDbAggregatorModule,
    UrlMessagingAggregatorModule,
  ],
  providers: [ShortUrlSystem],
  exports: [ShortUrlSystem],
})
export class ShortUrlSystemModule {}
