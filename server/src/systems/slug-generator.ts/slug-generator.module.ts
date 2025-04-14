import { Global, Module } from '@nestjs/common';
import { SlugGeneratorSystem } from './slug-generator.service';
import { ShortUrlDbAggregatorModule } from '../../aggregators/short-url/short-url.module';
import { ShortUrlCacheAggregatorModule } from '../../aggregators/short-url-cache/short-url-cache.module';

@Global()
@Module({
  imports: [ShortUrlDbAggregatorModule, ShortUrlCacheAggregatorModule],
  providers: [SlugGeneratorSystem],
  exports: [SlugGeneratorSystem],
})
export class SlugGeneratorModule {}
