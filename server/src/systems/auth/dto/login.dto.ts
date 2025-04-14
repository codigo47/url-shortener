export interface LoginDto {
  email: string;
  password: string;
}

export interface LoginResponseDto {
  token: string;
  email: string;
}
