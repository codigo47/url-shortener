export interface GetShortUrlsByUserDto {
  userId: number;
}

export interface GetShortUrlsByUserResponseDto {
  slug: string;
  targetUrl: string;
  visits: number;
}
