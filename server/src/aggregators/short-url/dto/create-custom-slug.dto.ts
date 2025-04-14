export interface UpdateShortUrlSlugDto {
  slug: string;
  newSlug: string;
  userId: number;
}

export interface UpdateShortUrlSlugResponseDto {
  slug: string;
  targetUrl: string;
}
