export interface SignupDto {
  email: string;
  password: string;
}

export interface SignupResponseDto {
  token: string;
  email: string;
}
