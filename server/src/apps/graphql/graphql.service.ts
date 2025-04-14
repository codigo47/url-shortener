import { Injectable } from '@nestjs/common';
import { ShortUrlSystem } from '../../systems/short-url/short-url.service';
import { AuthSystem } from '../../systems/auth/auth.service';
import {
  ShortUrlResponse,
  CreateShortUrlResponse,
  ModifySlugResponse,
} from '../../infrastructure/types/short-url.type';
import { AuthResponse } from '../../infrastructure/types/auth.type';
import { ModifySlugDto } from '../../systems/short-url/dto/modify-slug.dto';
import { CreateShortUrlDto } from '../../systems/short-url/dto/create-short-url.dto';
import { GetShortUrlsByUserDto } from '../../systems/short-url/dto/get-short-urls-by-user.dto';

@Injectable()
export class ShortUrlGraphqlApp {
  constructor(
    private readonly shortUrlSystem: ShortUrlSystem,
    private readonly authSystem: AuthSystem,
  ) {}

  async getShortUrlsByUser({
    userId,
  }: GetShortUrlsByUserDto): Promise<ShortUrlResponse[]> {
    return await this.shortUrlSystem.getShortUrlsByUser({ userId });
  }

  async createShortUrl({
    targetUrl,
    userId,
  }: CreateShortUrlDto): Promise<CreateShortUrlResponse> {
    console.log('createShortUrl', targetUrl, userId);
    return await this.shortUrlSystem.createShortUrl({ targetUrl, userId });
  }

  async modifySlug({
    slug,
    newSlug,
    userId,
  }: ModifySlugDto): Promise<ModifySlugResponse> {
    return await this.shortUrlSystem.modifySlug({
      slug,
      newSlug,
      userId,
    });
  }

  async signup(email: string, password: string): Promise<AuthResponse> {
    try {
      return await this.authSystem.signup({ email, password });
    } catch (error) {
      console.error('Failed to sign up', error);
      throw new Error('Failed to sign up');
    }
  }

  async login(email: string, password: string): Promise<AuthResponse> {
    return await this.authSystem.login({ email, password });
  }
}
