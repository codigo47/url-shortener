export interface CreateUserDto {
  email: string;
  password: string;
}

export interface CreateUserResponseDto {
  id: number;
  email: string;
}
