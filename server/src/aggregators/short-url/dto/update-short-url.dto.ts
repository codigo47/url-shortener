export interface UpdateShortUrlDto {
  slug: string;
  targetUrl: string;
  userId?: number;
}
