// server/src/infrastructure/resolvers/short-url.resolver.ts
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import {
  ShortUrlResponse,
  CreateShortUrlResponse,
  ModifySlugResponse,
} from '../types/short-url.type';
import { ShortUrlGraphqlApp } from '../../apps/graphql/graphql.service';
import { AuthGuard } from '../guards/auth.guard';
import { GqlThrottlerGuard } from '../guards/graphql-throttler.guard';
import { CurrentUser } from '../decorators/current-user.decorator';

interface JwtUser {
  userId: number;
  // other user properties
}

@Resolver(() => ShortUrlResponse)
export class ShortUrlResolver {
  constructor(private readonly shortUrlGraphqlApp: ShortUrlGraphqlApp) {}

  @Query(() => [ShortUrlResponse])
  @UseGuards(AuthGuard)
  async getShortUrlsByUser(
    @CurrentUser() user: JwtUser,
  ): Promise<ShortUrlResponse[]> {
    return await this.shortUrlGraphqlApp.getShortUrlsByUser({
      userId: user.userId,
    });
  }

  @Mutation(() => CreateShortUrlResponse)
  @UseGuards(AuthGuard, GqlThrottlerGuard)
  @Throttle({ default: { limit: 5, ttl: 60 } }) // 5 requests per minute
  async createShortUrl(
    @Args('targetUrl') targetUrl: string,
    @CurrentUser() user: JwtUser,
  ): Promise<CreateShortUrlResponse> {
    return await this.shortUrlGraphqlApp.createShortUrl({
      targetUrl,
      userId: user.userId,
    });
  }

  @Mutation(() => ModifySlugResponse)
  @UseGuards(AuthGuard)
  async modifySlug(
    @Args('slug') slug: string,
    @Args('newSlug') newSlug: string,
    @CurrentUser() user: JwtUser,
  ): Promise<ModifySlugResponse> {
    return await this.shortUrlGraphqlApp.modifySlug({
      slug,
      newSlug,
      userId: user.userId,
    });
  }
}
