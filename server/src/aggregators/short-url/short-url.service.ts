import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../infrastructure/persistence/prisma/prisma.service';
import {
  CreateShortUrlDto,
  CreateShortUrlResponseDto,
} from './dto/create-short-url.dto';
import {
  UpdateShortUrlSlugDto,
  UpdateShortUrlSlugResponseDto,
} from './dto/create-custom-slug.dto';
import {
  IncrementVisitsDto,
  IncrementVisitsResponseDto,
} from './dto/increment-visits.dto';
import {
  GetShortUrlsDto,
  GetShortUrlsResponseDto,
} from './dto/get-short-urls.dto';
import {
  GetShortUrlDto,
  GetShortUrlResponseDto,
} from './dto/get-short-url.dto';
import { UpdateShortUrlDto } from './dto/update-short-url.dto';
import { NotFoundException } from './exceptions/not-found-exception';
import { SlugTakenException } from './exceptions/slug-taken-exception';

@Injectable()
export class ShortUrlDbAggregator {
  constructor(private readonly prisma: PrismaService) {}

  async createShortUrl({
    targetUrl,
    userId,
  }: CreateShortUrlDto): Promise<CreateShortUrlResponseDto> {
    const url = await this.prisma.url.create({
      data: {
        targetUrl,
        userId,
      },
      select: {
        slug: true,
      },
    });

    return { slug: url.slug };
  }

  async updateShortUrlSlug({
    slug,
    newSlug,
    userId,
  }: UpdateShortUrlSlugDto): Promise<UpdateShortUrlSlugResponseDto> {
    const url = await this.prisma.url.findUnique({
      where: { slug: newSlug },
    });

    if (url) {
      throw new SlugTakenException(`Slug '${slug}' is already taken`);
    }

    const updatedUrl = await this.prisma.url.update({
      where: { slug },
      data: {
        slug: newSlug,
        userId,
      },
      select: {
        slug: true,
        targetUrl: true,
      },
    });

    return { slug: updatedUrl.slug, targetUrl: updatedUrl.targetUrl || '' };
  }

  async incrementVisits({
    slug,
  }: IncrementVisitsDto): Promise<IncrementVisitsResponseDto> {
    const url = await this.prisma.url.update({
      where: { slug },
      data: {
        visits: {
          increment: 1,
        },
      },
    });

    console.log('url ->', url);

    return {
      slug: url.slug,
      visits: url.visits,
      updatedAt: url.updatedAt,
    };
  }

  async getShortUrlsByUser({
    userId,
  }: GetShortUrlsDto): Promise<GetShortUrlsResponseDto[]> {
    const shortUrls = await this.prisma.url.findMany({
      where: {
        userId,
      },
    });

    if (!shortUrls) {
      return [];
    }

    return shortUrls.map((url) => ({
      slug: url.slug,
      targetUrl: url.targetUrl || '',
      visits: url.visits,
      createdAt: url.createdAt,
    }));
  }

  async getTargetUrl({
    slug,
  }: GetShortUrlDto): Promise<GetShortUrlResponseDto> {
    const url = await this.prisma.url.findUnique({
      where: { slug },
    });

    if (!url?.targetUrl) {
      throw new NotFoundException(`Short URL with slug '${slug}' not found`);
    }

    return {
      targetUrl: url.targetUrl,
    };
  }

  async updateShortUrl({
    slug,
    targetUrl,
    userId,
  }: UpdateShortUrlDto): Promise<void> {
    await this.prisma.url.update({
      where: { slug },
      data: { targetUrl, userId },
    });
  }
}
