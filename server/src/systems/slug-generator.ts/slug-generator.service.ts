import { Injectable } from '@nestjs/common';
import { ShortUrlDbAggregator } from '../../aggregators/short-url/short-url.service';
import { ShortUrlCacheAggregator } from '../../aggregators/short-url-cache/short-url-cache.service';

@Injectable()
export class SlugGeneratorSystem {
  private readonly MAX_SLUGS_TO_GENERATE = 10;

  constructor(
    private readonly slugAggregator: ShortUrlDbAggregator,
    private readonly slugCacheAggregator: ShortUrlCacheAggregator,
  ) {}

  async generateSlugsAndAddToPool(): Promise<void> {
    console.log('Generating slugs and adding to pool...');
    const availableSlugs = await this.slugCacheAggregator.countAvailableSlugs();

    if (availableSlugs > this.MAX_SLUGS_TO_GENERATE) {
      console.log(
        `Sufficient slugs available in pool (${availableSlugs}). Skipping generation.`,
      );
      return;
    }

    let successfulSlugs = 0;

    while (successfulSlugs < this.MAX_SLUGS_TO_GENERATE - availableSlugs) {
      try {
        const { slug } = await this.slugAggregator.createShortUrl({});

        console.log('Slug generated:', slug);

        await this.slugCacheAggregator.addToSlugPool({ slug });

        console.log('Slug added to pool:', slug);

        successfulSlugs++;
      } catch (error) {
        console.error('Failed to generate or cache slug:', error);
      }
    }
  }
}
