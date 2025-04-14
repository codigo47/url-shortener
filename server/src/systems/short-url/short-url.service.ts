import { Injectable } from '@nestjs/common';
import { UrlMessagingAggregator } from '../../aggregators/url-messaging/url-messaging.service';
import { ShortUrlCacheAggregator } from '../../aggregators/short-url-cache/short-url-cache.service';
import { ShortUrlDbAggregator } from '../../aggregators/short-url/short-url.service';
import { UrlCreatedMessageDto } from '../../apps/messaging/dto/url-created-message.dto';
import { UrlVisitedMessageDto } from '../../apps/messaging/dto/url-visited-message.dto';
import { SlugTakenException } from '../../aggregators/short-url/exceptions/slug-taken-exception';

import {
  CreateShortUrlDto,
  CreateShortUrlResponseDto,
} from './dto/create-short-url.dto';
import { ModifySlugDto, ModifySlugResponseDto } from './dto/modify-slug.dto';
import {
  VisitShortUrlDto,
  VisitShortUrlResponseDto,
} from './dto/get-short-url.dto';
import {
  GetShortUrlsByUserDto,
  GetShortUrlsByUserResponseDto,
} from './dto/get-short-urls-by-user.dto';
import { NotFoundException } from '../../aggregators/short-url/exceptions/not-found-exception';

@Injectable()
export class ShortUrlSystem {
  private readonly HOT_SLUG_EXPIRATION_TIME = 7 * 24 * 60 * 60; // 7 days in seconds
  private readonly HOT_SLUG_VISIT_COUNT = 10;
  private readonly HOT_SLUG_MIN_VISIT_COUNT = 100;
  private readonly DEFAULT_SLUG_EXPIRATION_TIME = 1 * 24 * 60 * 60; // 1 days in seconds
  private readonly SLUG_MAX_IDLE_TIME = 3 * 24 * 60 * 60; // 1 days in seconds

  private normalizeUrl(url: string): string {
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      return `https://${url}`;
    }
    return url;
  }

  constructor(
    private readonly shortUrlCacheAggregator: ShortUrlCacheAggregator,
    private readonly shortUrlDbAggregator: ShortUrlDbAggregator,
    private readonly urlMessagingAggregator: UrlMessagingAggregator,
  ) {}

  async configureMessaging(topics: string[]) {
    await this.urlMessagingAggregator.configureMessaging(
      topics,
      // eslint-disable-next-line
      this.handleMessage.bind(this),
    );
  }

  private async handleMessage(topic: string, payload: any): Promise<void> {
    switch (topic) {
      case 'url.created':
        await this.handleUrlCreated(payload as UrlCreatedMessageDto);
        break;
      case 'url.visited':
        await this.handleUrlVisited(payload as UrlVisitedMessageDto);
        break;
      default:
        console.warn(`No handler found for topic: ${topic}`);
    }
  }

  async createShortUrl(
    dto: CreateShortUrlDto,
  ): Promise<CreateShortUrlResponseDto> {
    console.log('createShortUrl', dto);

    let slug = await this.shortUrlCacheAggregator.getFirstAvailableSlug();

    console.log('slug', slug);

    if (slug) {
      await this.urlMessagingAggregator.sendUrlCreatedMessage({
        slug,
        targetUrl: this.normalizeUrl(dto.targetUrl),
        userId: dto.userId,
      });

      await this.shortUrlCacheAggregator.deleteSlugFromPool({ slug });
    } else {
      ({ slug } = await this.shortUrlDbAggregator.createShortUrl({
        ...dto,
        targetUrl: this.normalizeUrl(dto.targetUrl),
      }));
    }

    await this.shortUrlCacheAggregator.addToRedirectCache({
      slug,
      targetUrl: this.normalizeUrl(dto.targetUrl),
      expiresAt: this.DEFAULT_SLUG_EXPIRATION_TIME,
    });

    return {
      slug,
    };
  }

  async modifySlug(dto: ModifySlugDto): Promise<ModifySlugResponseDto> {
    try {
      console.log('modifySlug', dto);

      const shortUrl = await this.shortUrlDbAggregator.updateShortUrlSlug({
        slug: dto.slug,
        newSlug: dto.newSlug,
        userId: dto.userId,
      });

      console.log('shortUrl', shortUrl);

      await this.shortUrlCacheAggregator.addToRedirectCache({
        slug: shortUrl.slug,
        targetUrl: shortUrl.targetUrl,
        expiresAt: this.DEFAULT_SLUG_EXPIRATION_TIME,
      });

      return {
        slug: shortUrl.slug,
        newSlug: dto.newSlug,
        targetUrl: shortUrl.targetUrl,
      };
    } catch (error) {
      if (error instanceof SlugTakenException) {
        throw new SlugTakenException(error.message);
      }

      console.error('Error modifying slug:', error);
      throw error;
    }
  }

  async visitShortUrl(
    dto: VisitShortUrlDto,
  ): Promise<VisitShortUrlResponseDto> {
    try {
      let targetUrl = await this.shortUrlCacheAggregator.getTargetUrl({
        slug: dto.slug,
      });

      if (!targetUrl) {
        const result = await this.shortUrlDbAggregator.getTargetUrl({
          slug: dto.slug,
        });
        targetUrl = result.targetUrl;
      }

      targetUrl = this.normalizeUrl(targetUrl);

      await this.urlMessagingAggregator.sendUrlVisitedMessage({
        slug: dto.slug,
        targetUrl,
      });

      return {
        slug: dto.slug,
        targetUrl,
      };
    } catch (error) {
      console.error('Error visiting short URL:', error);

      if (error instanceof NotFoundException) {
        return {
          slug: '',
          targetUrl: `${process.env.FRONTEND_URL || 'http://localhost:3001'}/not-found`,
        };
      }

      throw error;
    }
  }

  async getShortUrlsByUser(
    dto: GetShortUrlsByUserDto,
  ): Promise<GetShortUrlsByUserResponseDto[]> {
    const results = await this.shortUrlDbAggregator.getShortUrlsByUser(dto);

    return results;
  }

  async handleUrlCreated(payload: UrlCreatedMessageDto): Promise<void> {
    try {
      console.log('handleUrlCreated', payload);

      await this.shortUrlDbAggregator.updateShortUrl({
        slug: payload.slug,
        targetUrl: payload.targetUrl,
        userId: payload.userId,
      });
    } catch (error) {
      console.error('Error processing url.created event:', error);
      throw error;
    }
  }

  isHotSlug(
    visits: number,
    updatedAt: Date,
    minVisits: number,
    maxIdleSeconds: number,
  ): boolean {
    if (visits < minVisits) return false;

    const lastUpdatedSec = Math.floor(new Date(updatedAt).getTime() / 1000);
    const nowSec = Math.floor(Date.now() / 1000);
    const ageInSeconds = nowSec - lastUpdatedSec;

    return ageInSeconds <= maxIdleSeconds;
  }

  async handleUrlVisited(payload: UrlVisitedMessageDto): Promise<void> {
    try {
      const shortUrl = await this.shortUrlDbAggregator.incrementVisits({
        slug: payload.slug,
      });

      const isHot = this.isHotSlug(
        shortUrl.visits,
        shortUrl.updatedAt,
        Number(this.HOT_SLUG_MIN_VISIT_COUNT),
        Number(this.SLUG_MAX_IDLE_TIME),
      );

      let expiresAt = Number(this.DEFAULT_SLUG_EXPIRATION_TIME);
      if (isHot) {
        expiresAt = Number(this.HOT_SLUG_EXPIRATION_TIME);
      }

      await this.shortUrlCacheAggregator.addToRedirectCache({
        slug: payload.slug,
        targetUrl: payload.targetUrl,
        expiresAt,
      });
    } catch (error) {
      console.error('Error processing url.visited event:', error);
      throw error;
    }
  }
}
