import { Module } from '@nestjs/common';
import { ShortUrlSystem } from '../../systems/short-url/short-url.service';
import { RootController } from './root.controller';
import { ShortUrlCacheAggregatorModule } from '../../aggregators/short-url-cache/short-url-cache.module';
import { ShortUrlDbAggregatorModule } from '../../aggregators/short-url/short-url.module';
import { UrlMessagingAggregatorModule } from '../../aggregators/url-messaging/url-messaging.module';

@Module({
  imports: [
    ShortUrlCacheAggregatorModule,
    ShortUrlDbAggregatorModule,
    UrlMessagingAggregatorModule,
  ],
  controllers: [RootController],
  providers: [ShortUrlSystem],
  exports: [ShortUrlSystem],
})
export class RestApiModule {}
