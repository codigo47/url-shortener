export interface GetShortUrlsDto {
  userId: number;
}

export interface GetShortUrlsResponseDto {
  slug: string;
  targetUrl: string;
  visits: number;
  createdAt: Date;
}
