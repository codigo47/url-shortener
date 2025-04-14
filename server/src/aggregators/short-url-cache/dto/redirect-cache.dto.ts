export interface AddToRedirectCacheDto {
  slug: string;
  targetUrl: string;
  expiresAt: number;
}

export interface RemoveFromRedirectCacheDto {
  slug: string;
}
