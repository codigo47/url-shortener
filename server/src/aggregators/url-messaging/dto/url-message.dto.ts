export interface UrlVisitedMessageDto {
  slug: string;
  targetUrl: string;
}

export interface UrlCreatedMessageDto {
  slug: string;
  targetUrl: string;
  userId?: number;
}
