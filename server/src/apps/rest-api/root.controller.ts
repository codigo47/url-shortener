import { Controller, Get, Param, Redirect } from '@nestjs/common';
import { ShortUrlSystem } from '../../systems/short-url/short-url.service';

@Controller()
export class RootController {
  constructor(private readonly shortUrlSystem: ShortUrlSystem) {}

  @Get(':slug')
  @Redirect()
  async redirectToTargetUrl(@Param('slug') slug: string) {
    const result = await this.shortUrlSystem.visitShortUrl({ slug });
    console.log('result', result);
    return { url: result.targetUrl };
  }
}
