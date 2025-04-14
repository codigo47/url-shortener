export interface CreateShortUrlDto {
  targetUrl: string;
  userId?: number;
}

export interface CreateShortUrlResponseDto {
  slug: string;
}
