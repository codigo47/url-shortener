export interface IncrementVisitsDto {
  slug: string;
}

export interface IncrementVisitsResponseDto {
  slug: string;
  visits: number;
  updatedAt: Date;
}
