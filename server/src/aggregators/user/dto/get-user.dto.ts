export interface GetUserByEmailDto {
  email: string;
}

export interface GetUserByEmailResponseDto {
  id: number;
  email: string;
  password: string;
}
