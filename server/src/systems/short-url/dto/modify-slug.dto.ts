export interface ModifySlugDto {
  slug: string;
  newSlug: string;
  userId: number;
}

export interface ModifySlugResponseDto {
  slug: string;
  newSlug: string;
  targetUrl: string;
}
